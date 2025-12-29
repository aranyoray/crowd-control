"""
CrowdLeaf: Biomimetic, Thigmonasty-Inspired Algorithm for Adaptive Crowd Dispersal
Inspired by Mimosa pudica (touch-me-not plant) response dynamics

Based on research:
- Electronic Thygmonasty Model (2022): Action potential propagation with Boolean logic
- Ant Colony Collective Sensing (PNAS 2022): Sigmoidal threshold response
- AI Simulation of Passenger Flows (2024): Crowdedness formula
"""

import numpy as np
from typing import Dict, List, Tuple, Set, Optional
import networkx as nx


class CrowdLeafController:
    """
    Implements the biomimetic threshold-based crowd control algorithm
    inspired by Mimosa pudica thigmonastic response.

    Uses mathematical models from:
    - Sigmoidal activation (ant colony thresholds)
    - Boolean AND/OR logic (action potential propagation)
    - Crowdedness metric F_i = (F_i,r + F_i,w + F_i,in)/F_i,max × T_i
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

        # Track agent flow rates for crowdedness formula
        self.flow_rates = {}  # node_id -> {'incoming': count, 'waiting': count, 'resident': count}

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

    def compute_crowdedness(self, node_id: str, agents_positions: List[str],
                           previous_positions: Optional[List[str]] = None) -> float:
        """
        Compute crowdedness metric based on AI simulation research (2024).
        Formula: F_i = (F_i,r + F_i,w + F_i,in)/F_i,max × T_i

        Args:
            node_id: Node identifier
            agents_positions: Current agent positions
            previous_positions: Previous timestep positions for flow calculation

        Returns:
            Crowdedness value (0-1+, where >0.7 indicates high crowding)
        """
        node_data = self.graph.nodes[node_id]
        max_capacity = node_data.get('area', 100.0) * self.critical_density  # Max people

        # F_i,r: Resident agents (currently at node)
        F_resident = agents_positions.count(node_id)

        # F_i,in: Incoming agents (from neighbors moving toward this node)
        F_incoming = 0
        if previous_positions:
            neighbors = list(self.graph.neighbors(node_id))
            for i, (prev_pos, curr_pos) in enumerate(zip(previous_positions, agents_positions)):
                if prev_pos in neighbors and curr_pos == node_id:
                    F_incoming += 1

        # F_i,w: Waiting agents (stuck/slow moving)
        # Approximated as agents who were here last step and still here
        F_waiting = 0
        if previous_positions:
            for prev_pos, curr_pos in zip(previous_positions, agents_positions):
                if prev_pos == node_id and curr_pos == node_id:
                    F_waiting += 1

        # Time factor T_i (simplified as 1 for now, could be average wait time)
        T_i = 1.0

        # Crowdedness formula
        crowdedness = ((F_resident + F_waiting + F_incoming) / max(max_capacity, 1)) * T_i

        return crowdedness

    def sigmoidal_activation(self, stimulus: float, threshold: float, steepness: float = 4.0) -> float:
        """
        Sigmoidal activation function inspired by ant colony threshold response (PNAS 2022).
        Models size-dependent threshold with noisy curve.

        Args:
            stimulus: Input stimulus (e.g., density or crowdedness)
            threshold: Activation threshold
            steepness: Curve steepness (higher = sharper transition)

        Returns:
            Activation probability (0-1)
        """
        # Sigmoid: 1 / (1 + exp(-steepness * (stimulus - threshold)))
        return 1.0 / (1.0 + np.exp(-steepness * (stimulus - threshold)))

    def boolean_propagation(self, activated_node: str, neighbor_states: Dict[str, bool]) -> bool:
        """
        Boolean AND/OR logic for action potential propagation (2011 model).
        Determines if signal should propagate to neighbors.

        Args:
            activated_node: Currently activated node
            neighbor_states: Dictionary of neighbor -> activation state

        Returns:
            True if signal propagates (Boolean OR of neighbors)
        """
        # OR logic: propagate if ANY neighbor is activated
        # This models the short-range excitation in plant thigmonasty
        return any(neighbor_states.values()) if neighbor_states else True

    def check_activation_threshold(self, node_id: str, density: float,
                                   current_time: float, crowdedness: float = 0.0) -> bool:
        """
        Check if node should activate based on density threshold.
        Uses sigmoidal activation inspired by ant colony collective sensing (PNAS 2022).

        Args:
            node_id: Node identifier
            density: Current density at node
            current_time: Current simulation time
            crowdedness: Crowdedness metric (optional, enhances sensitivity)

        Returns:
            True if node should activate
        """
        # Check if node is still in recovery period (~15 min for Mimosa pudica)
        if node_id in self.activated_nodes:
            activation_time = self.activated_nodes[node_id]
            if current_time - activation_time < self.recovery_time:
                return False  # Still recovering
            else:
                # Recovered, remove from activated list
                del self.activated_nodes[node_id]

        # Use combined stimulus: density + crowdedness factor
        combined_stimulus = density + (crowdedness * 2.0)  # Weight crowdedness higher

        # Sigmoidal activation function (ant colony model)
        # Activation probability increases smoothly with stimulus
        activation_prob = self.sigmoidal_activation(
            combined_stimulus,
            threshold=self.safe_density,
            steepness=2.0  # Moderate slope for gradual response
        )

        # Critical density triggers immediate activation
        if density >= self.critical_density:
            activation_prob = 1.0

        # Stochastic activation based on probability
        if np.random.random() < activation_prob:
            self.activated_nodes[node_id] = current_time
            self.propagation_history.append({
                'time': current_time,
                'node': node_id,
                'density': density,
                'crowdedness': crowdedness,
                'activation_prob': activation_prob,
                'type': 'critical' if density >= self.critical_density else 'threshold'
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
                          agents_positions: List[str],
                          previous_positions: Optional[List[str]] = None) -> Dict[str, str]:
        """
        Update door/gate states based on current densities and crowdedness.
        Returns dictionary of node -> state ('open', 'redirect', 'closed')

        Implements timed gate control inspired by Mimosa pudica leaflet closure patterns.

        Args:
            current_time: Current simulation time
            agents_positions: Current positions of all agents
            previous_positions: Previous positions for flow calculation

        Returns:
            Dictionary mapping node_id to door state
        """
        door_states = {}

        for node_id in self.graph.nodes():
            density = self.compute_density(node_id, agents_positions)
            crowdedness = self.compute_crowdedness(node_id, agents_positions, previous_positions)

            # Check if node should activate using enhanced threshold
            if self.check_activation_threshold(node_id, density, current_time, crowdedness):
                door_states[node_id] = 'redirect'

                # Boolean propagation logic - check neighbor states
                neighbors = list(self.graph.neighbors(node_id))
                neighbor_states = {n: n in self.activated_nodes for n in neighbors}

                # Propagate if boolean condition met
                if self.boolean_propagation(node_id, neighbor_states):
                    affected = self.propagate_signal(node_id, current_time)
                    for affected_node in affected:
                        if affected_node not in door_states:
                            door_states[affected_node] = 'redirect'
            else:
                # Check if node is in recovery (closed during recovery period)
                if node_id in self.activated_nodes:
                    # Timed closure - mimics Mimosa pudica recovery dynamics
                    elapsed = current_time - self.activated_nodes[node_id]
                    if elapsed < self.recovery_time * 0.3:  # First 30% = fully closed
                        door_states[node_id] = 'closed'
                    elif elapsed < self.recovery_time * 0.7:  # Middle 40% = partial (redirect)
                        door_states[node_id] = 'redirect'
                    else:  # Final 30% = reopening
                        door_states[node_id] = 'open'
                else:
                    door_states[node_id] = 'open'

        return door_states

    def get_chokepoints(self, agents_positions: List[str],
                       previous_positions: Optional[List[str]] = None) -> Dict[str, float]:
        """
        Identify chokepoints based on crowdedness metric.

        Args:
            agents_positions: Current agent positions
            previous_positions: Previous positions

        Returns:
            Dictionary of node_id -> chokepoint severity (0-1+)
        """
        chokepoints = {}

        for node_id in self.graph.nodes():
            crowdedness = self.compute_crowdedness(node_id, agents_positions, previous_positions)
            density = self.compute_density(node_id, agents_positions)

            # Chokepoint severity based on both metrics
            severity = (crowdedness * 0.6) + (density / self.critical_density * 0.4)

            if severity > 0.5:  # Threshold for chokepoint identification
                chokepoints[node_id] = severity

        return chokepoints

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
