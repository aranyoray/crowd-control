"""
CrowdLeaf: Biomimetic, Thigmonasty-Inspired Algorithm for Adaptive Crowd Dispersal
Inspired by Mimosa pudica (touch-me-not plant) response dynamics
"""

import numpy as np
from typing import Dict, List, Tuple, Set
import networkx as nx


class CrowdLeafController:
    """
    Implements the biomimetic threshold-based crowd control algorithm
    inspired by Mimosa pudica thigmonastic response.
    """

    def __init__(self, graph: nx.Graph, safe_density: float = 4.0,
                 critical_density: float = 6.0, recovery_time: float = 15.0):
        """
        Initialize CrowdLeaf controller.

        Args:
            graph: NetworkX graph representing the spatial layout
            safe_density: Safe density threshold (persons/m²)
            critical_density: Critical density threshold (persons/m²)
            recovery_time: Time for a node to recover after activation (seconds)
        """
        self.graph = graph
        self.safe_density = safe_density
        self.critical_density = critical_density
        self.recovery_time = recovery_time

        # Track activation state and timing
        self.activated_nodes = {}  # node_id -> activation_time
        self.propagation_history = []  # Track signal propagation

    def compute_density(self, node_id: str, agents_positions: List[str]) -> float:
        """
        Compute current density at a node.

        Args:
            node_id: Node identifier
            agents_positions: List of current agent positions

        Returns:
            Density in persons/m²
        """
        node_data = self.graph.nodes[node_id]
        area = node_data.get('area', 100.0)  # Default 100 m²

        # Count agents at this node
        agent_count = agents_positions.count(node_id)

        return agent_count / area if area > 0 else 0

    def check_activation_threshold(self, node_id: str, density: float,
                                   current_time: float) -> bool:
        """
        Check if node should activate based on density threshold.
        Uses sigmoid-like activation similar to Mimosa pudica response.

        Args:
            node_id: Node identifier
            density: Current density at node
            current_time: Current simulation time

        Returns:
            True if node should activate
        """
        # Check if node is still in recovery period
        if node_id in self.activated_nodes:
            activation_time = self.activated_nodes[node_id]
            if current_time - activation_time < self.recovery_time:
                return False  # Still recovering
            else:
                # Recovered, remove from activated list
                del self.activated_nodes[node_id]

        # Sigmoidal activation function
        # Mimics the threshold-based response of Mimosa pudica
        if density >= self.critical_density:
            # Immediate activation at critical density
            self.activated_nodes[node_id] = current_time
            self.propagation_history.append({
                'time': current_time,
                'node': node_id,
                'density': density,
                'type': 'critical'
            })
            return True
        elif density >= self.safe_density:
            # Probabilistic activation between safe and critical
            activation_prob = (density - self.safe_density) / (self.critical_density - self.safe_density)
            if np.random.random() < activation_prob:
                self.activated_nodes[node_id] = current_time
                self.propagation_history.append({
                    'time': current_time,
                    'node': node_id,
                    'density': density,
                    'type': 'threshold'
                })
                return True

        return False

    def propagate_signal(self, activated_node: str, current_time: float) -> Set[str]:
        """
        Propagate activation signal to neighboring nodes.
        Mimics spatial propagation in Mimosa pudica leaves.

        Args:
            activated_node: Node that was activated
            current_time: Current simulation time

        Returns:
            Set of neighboring nodes to close/redirect
        """
        neighbors = set(self.graph.neighbors(activated_node))

        # Mark neighbors for redirection (short-range excitation)
        affected_nodes = set()
        for neighbor in neighbors:
            if neighbor not in self.activated_nodes:
                # Propagate signal to immediate neighbors
                affected_nodes.add(neighbor)

                # Add to propagation history
                self.propagation_history.append({
                    'time': current_time,
                    'node': neighbor,
                    'source': activated_node,
                    'type': 'propagation'
                })

        return affected_nodes

    def get_alternative_paths(self, current_node: str, destination: str,
                              blocked_nodes: Set[str]) -> List[str]:
        """
        Find alternative paths avoiding congested areas.

        Args:
            current_node: Current position
            destination: Target destination
            blocked_nodes: Nodes to avoid

        Returns:
            List of nodes forming alternative path
        """
        # Create a temporary graph without blocked nodes
        temp_graph = self.graph.copy()
        temp_graph.remove_nodes_from(blocked_nodes)

        try:
            # Find shortest path in modified graph
            path = nx.shortest_path(temp_graph, current_node, destination)
            return path
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            # No alternative path available
            return []

    def update_door_states(self, current_time: float,
                          agents_positions: List[str]) -> Dict[str, str]:
        """
        Update door/gate states based on current densities.
        Returns dictionary of node -> state ('open', 'redirect', 'closed')

        Args:
            current_time: Current simulation time
            agents_positions: Current positions of all agents

        Returns:
            Dictionary mapping node_id to door state
        """
        door_states = {}

        for node_id in self.graph.nodes():
            density = self.compute_density(node_id, agents_positions)

            # Check if node should activate
            if self.check_activation_threshold(node_id, density, current_time):
                door_states[node_id] = 'redirect'

                # Propagate to neighbors
                affected = self.propagate_signal(node_id, current_time)
                for affected_node in affected:
                    if affected_node not in door_states:
                        door_states[affected_node] = 'redirect'
            else:
                # Check if node is in recovery
                if node_id in self.activated_nodes:
                    door_states[node_id] = 'closed'
                else:
                    door_states[node_id] = 'open'

        return door_states

    def get_redirection(self, agent_position: str, agent_destination: str,
                       door_states: Dict[str, str]) -> str:
        """
        Get redirection for an agent based on current door states.

        Args:
            agent_position: Current agent position
            agent_destination: Agent's intended destination
            door_states: Current door states from update_door_states

        Returns:
            Next node to move to
        """
        # Find nodes to avoid
        blocked_nodes = {node for node, state in door_states.items()
                        if state in ['closed', 'redirect']}

        # Get alternative path
        alt_path = self.get_alternative_paths(agent_position, agent_destination,
                                             blocked_nodes)

        if len(alt_path) > 1:
            return alt_path[1]  # Next node in path
        elif len(alt_path) == 1:
            return alt_path[0]  # Already at destination
        else:
            # No path available, try direct neighbors that are open
            neighbors = list(self.graph.neighbors(agent_position))
            open_neighbors = [n for n in neighbors if door_states.get(n, 'open') == 'open']

            if open_neighbors:
                # Move to random open neighbor
                return np.random.choice(open_neighbors)
            else:
                # Stay in place
                return agent_position
