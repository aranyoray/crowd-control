"""
Airport Crowd Simulator
Simulates crowd dynamics at major international airports with and without CrowdLeaf
"""

import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.animation import FuncAnimation
from typing import Dict, List, Tuple, Optional
import time
from dataclasses import dataclass, field
from crowdleaf_algorithm import CrowdLeafController


@dataclass
class Agent:
    """Represents a person in the crowd"""
    id: int
    position: str  # Current node ID
    destination: str  # Target exit node ID
    speed: float = 1.0  # meters per second
    stress_level: float = 0.0  # 0-1, affects injury probability
    injured: bool = False
    dead: bool = False


@dataclass
class SimulationMetrics:
    """Tracks simulation metrics over time"""
    time_series: List[float] = field(default_factory=list)
    injuries: List[int] = field(default_factory=list)
    deaths: List[int] = field(default_factory=list)
    overcrowding_events: List[int] = field(default_factory=list)
    avg_density: List[float] = field(default_factory=list)
    evacuation_times: List[float] = field(default_factory=list)
    agents_evacuated: List[int] = field(default_factory=list)


class AirportGraph:
    """Creates graph-based models of major airports"""

    @staticmethod
    def create_dfw_terminal_d() -> nx.Graph:
        """Dallas/Fort Worth Terminal D - 28 gates"""
        G = nx.Graph()

        # Main concourse
        nodes = {
            'entrance': {'area': 200, 'type': 'entrance', 'pos': (0, 5)},
            'security': {'area': 150, 'type': 'checkpoint', 'pos': (2, 5)},
            'main_hall': {'area': 300, 'type': 'hall', 'pos': (4, 5)},
            'concourse_start': {'area': 250, 'type': 'corridor', 'pos': (6, 5)},
        }

        # Gates D1-D28 arranged in two wings
        for i in range(1, 15):
            nodes[f'gate_D{i}'] = {'area': 80, 'type': 'gate', 'pos': (6 + i*0.5, 7)}
        for i in range(15, 29):
            nodes[f'gate_D{i}'] = {'area': 80, 'type': 'gate', 'pos': (6 + (i-14)*0.5, 3)}

        # Exits
        nodes['exit_1'] = {'area': 100, 'type': 'exit', 'pos': (15, 5)}
        nodes['exit_2'] = {'area': 100, 'type': 'exit', 'pos': (15, 7)}
        nodes['exit_3'] = {'area': 100, 'type': 'exit', 'pos': (15, 3)}

        G.add_nodes_from([(k, v) for k, v in nodes.items()])

        # Connect main path
        edges = [
            ('entrance', 'security'),
            ('security', 'main_hall'),
            ('main_hall', 'concourse_start'),
        ]

        # Connect gates to concourse
        for i in range(1, 29):
            edges.append(('concourse_start', f'gate_D{i}'))

        # Connect exits
        edges.extend([
            ('concourse_start', 'exit_1'),
            ('concourse_start', 'exit_2'),
            ('concourse_start', 'exit_3'),
        ])

        G.add_edges_from(edges)
        return G

    @staticmethod
    def create_atl_terminal() -> nx.Graph:
        """Atlanta Hartsfield-Jackson - Domestic Terminal (simplified)"""
        G = nx.Graph()

        nodes = {
            'entrance_north': {'area': 250, 'type': 'entrance', 'pos': (0, 8)},
            'entrance_south': {'area': 250, 'type': 'entrance', 'pos': (0, 2)},
            'security_north': {'area': 200, 'type': 'checkpoint', 'pos': (2, 8)},
            'security_south': {'area': 200, 'type': 'checkpoint', 'pos': (2, 2)},
            'main_atrium': {'area': 400, 'type': 'hall', 'pos': (4, 5)},
            'transport_mall': {'area': 300, 'type': 'corridor', 'pos': (6, 5)},
        }

        # Concourses T, A, B, C, D (simplified)
        concourses = ['T', 'A', 'B', 'C', 'D']
        for i, conc in enumerate(concourses):
            nodes[f'concourse_{conc}'] = {'area': 350, 'type': 'concourse', 'pos': (8 + i*2, 5)}
            # Add gates for each concourse
            for j in range(1, 9):
                nodes[f'gate_{conc}{j}'] = {'area': 70, 'type': 'gate', 'pos': (8 + i*2, 5 + (j-4)*0.5)}

        # Exits
        for i in range(1, 6):
            nodes[f'exit_{i}'] = {'area': 120, 'type': 'exit', 'pos': (18, 2 + i*1.5)}

        G.add_nodes_from([(k, v) for k, v in nodes.items()])

        # Main connections
        edges = [
            ('entrance_north', 'security_north'),
            ('entrance_south', 'security_south'),
            ('security_north', 'main_atrium'),
            ('security_south', 'main_atrium'),
            ('main_atrium', 'transport_mall'),
        ]

        # Connect concourses
        for conc in concourses:
            edges.append(('transport_mall', f'concourse_{conc}'))
            # Connect gates
            for j in range(1, 9):
                edges.append((f'concourse_{conc}', f'gate_{conc}{j}'))
            # Connect to exits
            for i in range(1, 6):
                edges.append((f'concourse_{conc}', f'exit_{i}'))

        G.add_edges_from(edges)
        return G

    @staticmethod
    def create_dubai_terminal_3() -> nx.Graph:
        """Dubai International Terminal 3 - World's largest terminal"""
        G = nx.Graph()

        nodes = {
            'entrance_main': {'area': 500, 'type': 'entrance', 'pos': (0, 10)},
            'check_in_area': {'area': 600, 'type': 'hall', 'pos': (2, 10)},
            'security_central': {'area': 300, 'type': 'checkpoint', 'pos': (4, 10)},
            'duty_free': {'area': 400, 'type': 'hall', 'pos': (6, 10)},
        }

        # Concourse A (A380 gates), B, C
        concourse_data = {
            'A': (20, 8),  # 20 gates, y=8
            'B': (32, 10),  # 32 gates, y=10
            'C': (50, 12),  # 50 gates (simplified to 25), y=12
        }

        for conc, (num_gates, y_pos) in concourse_data.items():
            nodes[f'concourse_{conc}_hub'] = {'area': 400, 'type': 'concourse', 'pos': (8, y_pos)}
            # Simplified gate count
            actual_gates = min(num_gates, 15)
            for i in range(1, actual_gates + 1):
                nodes[f'gate_{conc}{i}'] = {'area': 100 if conc == 'A' else 80, 'type': 'gate',
                                           'pos': (8 + i*0.6, y_pos)}

        # Multiple exits
        for i in range(1, 8):
            nodes[f'exit_{i}'] = {'area': 150, 'type': 'exit', 'pos': (16, 6 + i)}

        G.add_nodes_from([(k, v) for k, v in nodes.items()])

        # Main flow
        edges = [
            ('entrance_main', 'check_in_area'),
            ('check_in_area', 'security_central'),
            ('security_central', 'duty_free'),
        ]

        # Connect concourses
        for conc, (num_gates, _) in concourse_data.items():
            edges.append(('duty_free', f'concourse_{conc}_hub'))
            actual_gates = min(num_gates, 15)
            for i in range(1, actual_gates + 1):
                edges.append((f'concourse_{conc}_hub', f'gate_{conc}{i}'))

        # Connect exits
        for i in range(1, 8):
            edges.append(('duty_free', f'exit_{i}'))
            for conc in ['A', 'B', 'C']:
                edges.append((f'concourse_{conc}_hub', f'exit_{i}'))

        G.add_edges_from(edges)
        return G

    @staticmethod
    def create_delhi_terminal_3() -> nx.Graph:
        """Delhi Indira Gandhi Terminal 3"""
        G = nx.Graph()

        nodes = {
            'entrance_1': {'area': 300, 'type': 'entrance', 'pos': (0, 7)},
            'entrance_2': {'area': 300, 'type': 'entrance', 'pos': (0, 3)},
            'check_in_domestic': {'area': 400, 'type': 'hall', 'pos': (2, 7)},
            'check_in_intl': {'area': 400, 'type': 'hall', 'pos': (2, 3)},
            'security_1': {'area': 250, 'type': 'checkpoint', 'pos': (4, 7)},
            'security_2': {'area': 250, 'type': 'checkpoint', 'pos': (4, 3)},
            'central_plaza': {'area': 500, 'type': 'hall', 'pos': (6, 5)},
        }

        # 48 contact stands (simplified)
        for i in range(1, 25):
            nodes[f'gate_T3_{i}'] = {'area': 90, 'type': 'gate', 'pos': (8 + i*0.4, 5 + (i % 5) - 2)}

        # Exits
        for i in range(1, 7):
            nodes[f'exit_{i}'] = {'area': 130, 'type': 'exit', 'pos': (18, 2 + i)}

        G.add_nodes_from([(k, v) for k, v in nodes.items()])

        edges = [
            ('entrance_1', 'check_in_domestic'),
            ('entrance_2', 'check_in_intl'),
            ('check_in_domestic', 'security_1'),
            ('check_in_intl', 'security_2'),
            ('security_1', 'central_plaza'),
            ('security_2', 'central_plaza'),
        ]

        # Connect gates and exits
        for i in range(1, 25):
            edges.append(('central_plaza', f'gate_T3_{i}'))

        for i in range(1, 7):
            edges.append(('central_plaza', f'exit_{i}'))

        G.add_edges_from(edges)
        return G

    @staticmethod
    def create_dulles_iad() -> nx.Graph:
        """Washington Dulles International"""
        G = nx.Graph()

        nodes = {
            'main_terminal': {'area': 400, 'type': 'entrance', 'pos': (0, 5)},
            'security_checkpoint': {'area': 250, 'type': 'checkpoint', 'pos': (2, 5)},
            'aerotrain_station': {'area': 200, 'type': 'corridor', 'pos': (4, 5)},
        }

        # Concourses A, B, C, D, Z
        concourses = {
            'A': (10, 8),
            'B': (12, 6),
            'C': (12, 4),
            'D': (8, 2),
            'Z': (6, 10)
        }

        for conc, (num_gates, y_pos) in concourses.items():
            nodes[f'concourse_{conc}'] = {'area': 280, 'type': 'concourse', 'pos': (6, y_pos)}
            for i in range(1, num_gates + 1):
                nodes[f'gate_{conc}{i}'] = {'area': 75, 'type': 'gate', 'pos': (6 + i*0.5, y_pos)}

        # Exits
        for i in range(1, 6):
            nodes[f'exit_{i}'] = {'area': 110, 'type': 'exit', 'pos': (14, 2 + i*2)}

        G.add_nodes_from([(k, v) for k, v in nodes.items()])

        edges = [
            ('main_terminal', 'security_checkpoint'),
            ('security_checkpoint', 'aerotrain_station'),
        ]

        # Connect concourses
        for conc, (num_gates, _) in concourses.items():
            edges.append(('aerotrain_station', f'concourse_{conc}'))
            for i in range(1, num_gates + 1):
                edges.append((f'concourse_{conc}', f'gate_{conc}{i}'))

        # Connect exits
        for i in range(1, 6):
            for conc in concourses.keys():
                edges.append((f'concourse_{conc}', f'exit_{i}'))

        G.add_edges_from(edges)
        return G


class CrowdSimulator:
    """Main simulation engine"""

    def __init__(self, airport_graph: nx.Graph, num_agents: int = 200,
                 use_crowdleaf: bool = False, simulation_duration: float = 30.0):
        self.graph = airport_graph
        self.num_agents = num_agents
        self.use_crowdleaf = use_crowdleaf
        self.simulation_duration = simulation_duration
        self.dt = 0.1  # Time step in seconds

        # Initialize agents
        self.agents: List[Agent] = []
        self._initialize_agents()

        # Initialize CrowdLeaf if enabled
        self.crowdleaf = None
        if use_crowdleaf:
            self.crowdleaf = CrowdLeafController(
                self.graph,
                safe_density=4.0,
                critical_density=6.0,
                recovery_time=15.0
            )

        # Metrics
        self.metrics = SimulationMetrics()

        # Current time
        self.current_time = 0.0

    def _initialize_agents(self):
        """Initialize agents at entrance nodes"""
        # Find entrance and exit nodes
        entrances = [n for n, d in self.graph.nodes(data=True) if d.get('type') == 'entrance']
        exits = [n for n, d in self.graph.nodes(data=True) if d.get('type') == 'exit']

        if not entrances:
            entrances = [list(self.graph.nodes())[0]]
        if not exits:
            exits = [list(self.graph.nodes())[-1]]

        for i in range(self.num_agents):
            entrance = np.random.choice(entrances)
            exit_node = np.random.choice(exits)

            agent = Agent(
                id=i,
                position=entrance,
                destination=exit_node,
                speed=np.random.uniform(0.8, 1.5),  # Variable walking speeds
                stress_level=np.random.uniform(0.1, 0.3)
            )
            self.agents.append(agent)

    def _compute_density(self, node_id: str) -> float:
        """Compute current density at a node"""
        node_data = self.graph.nodes[node_id]
        area = node_data.get('area', 100.0)

        # Count agents at this node
        agent_count = sum(1 for agent in self.agents if agent.position == node_id and not agent.dead)

        return agent_count / area if area > 0 else 0

    def _update_injuries_and_deaths(self):
        """Update injury and death counts based on overcrowding"""
        injury_count = 0
        death_count = 0
        overcrowding_events = 0

        for node in self.graph.nodes():
            density = self._compute_density(node)

            # Critical density thresholds
            if density > 6.0:  # Severe overcrowding
                overcrowding_events += 1
                agents_at_node = [a for a in self.agents if a.position == node and not a.dead]

                for agent in agents_at_node:
                    # Increase stress
                    agent.stress_level = min(1.0, agent.stress_level + 0.05)

                    # Injury probability increases with density and stress
                    injury_prob = min(0.1, (density - 6.0) * 0.01 * agent.stress_level)
                    if not agent.injured and np.random.random() < injury_prob:
                        agent.injured = True
                        injury_count += 1

                    # Death probability for extreme overcrowding
                    if density > 8.0:
                        death_prob = min(0.05, (density - 8.0) * 0.005 * agent.stress_level)
                        if not agent.dead and np.random.random() < death_prob:
                            agent.dead = True
                            death_count += 1

        return injury_count, death_count, overcrowding_events

    def _move_agent_standard(self, agent: Agent) -> str:
        """Standard movement (nearest exit heuristic)"""
        if agent.position == agent.destination:
            return agent.destination

        try:
            path = nx.shortest_path(self.graph, agent.position, agent.destination)
            if len(path) > 1:
                return path[1]
            return agent.position
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            # No path available, try random neighbor
            neighbors = list(self.graph.neighbors(agent.position))
            if neighbors:
                return np.random.choice(neighbors)
            return agent.position

    def _move_agent_crowdleaf(self, agent: Agent, door_states: Dict[str, str]) -> str:
        """Movement with CrowdLeaf redirection"""
        if agent.position == agent.destination:
            return agent.destination

        # Get CrowdLeaf redirection
        next_node = self.crowdleaf.get_redirection(
            agent.position,
            agent.destination,
            door_states
        )

        return next_node

    def step(self):
        """Execute one simulation step"""
        self.current_time += self.dt

        # Update door states if using CrowdLeaf
        door_states = {}
        if self.use_crowdleaf:
            agent_positions = [a.position for a in self.agents if not a.dead]
            door_states = self.crowdleaf.update_door_states(self.current_time, agent_positions)

        # Move agents
        for agent in self.agents:
            if agent.dead:
                continue

            if self.use_crowdleaf:
                new_position = self._move_agent_crowdleaf(agent, door_states)
            else:
                new_position = self._move_agent_standard(agent)

            agent.position = new_position

            # Reduce stress slightly when moving
            agent.stress_level = max(0.0, agent.stress_level - 0.01)

        # Update injuries and deaths
        new_injuries, new_deaths, overcrowding = self._update_injuries_and_deaths()

        # Track metrics
        total_injuries = sum(1 for a in self.agents if a.injured)
        total_deaths = sum(1 for a in self.agents if a.dead)
        evacuated = sum(1 for a in self.agents if a.position == a.destination and not a.dead)

        # Compute average density
        densities = [self._compute_density(node) for node in self.graph.nodes()]
        avg_density = np.mean(densities)

        self.metrics.time_series.append(self.current_time)
        self.metrics.injuries.append(total_injuries)
        self.metrics.deaths.append(total_deaths)
        self.metrics.overcrowding_events.append(overcrowding)
        self.metrics.avg_density.append(avg_density)
        self.metrics.agents_evacuated.append(evacuated)

    def run(self) -> SimulationMetrics:
        """Run complete simulation"""
        steps = int(self.simulation_duration / self.dt)

        for _ in range(steps):
            self.step()

        return self.metrics

    def get_current_state(self) -> Dict:
        """Get current simulation state for visualization"""
        return {
            'time': self.current_time,
            'agent_positions': {a.id: a.position for a in self.agents if not a.dead},
            'agent_states': {a.id: {'injured': a.injured, 'dead': a.dead, 'stress': a.stress_level}
                            for a in self.agents},
            'densities': {node: self._compute_density(node) for node in self.graph.nodes()},
        }
