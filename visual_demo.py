"""
Visual Demo - Enhanced visualization without pygame-gui dependency
Shows CrowdLeaf features with matplotlib in an animated fashion
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.animation import FuncAnimation
import numpy as np
from airport_simulator import AirportGraph, CrowdSimulator
import networkx as nx


class VisualDemo:
    """Animated visualization using matplotlib"""

    def __init__(self, airport_name, graph, num_agents=400):
        self.airport_name = airport_name
        self.graph = graph
        self.num_agents = num_agents

        # Create simulators
        self.sim_without = CrowdSimulator(graph, num_agents, use_crowdleaf=False, simulation_duration=30.0)
        self.sim_with = CrowdSimulator(graph, num_agents, use_crowdleaf=True, simulation_duration=30.0)

        # Get node positions
        self.node_positions = {node: data.get('pos', (0, 0))
                              for node, data in graph.nodes(data=True)}

        # Track previous positions
        self.prev_positions_with = []

        # Setup figure
        self.fig, self.axes = plt.subplots(1, 2, figsize=(20, 10))
        self.fig.suptitle(f'CrowdLeaf Simulation - {airport_name}', fontsize=18, fontweight='bold')

        # Animation frame counter
        self.frame = 0

    def draw_graph_with_states(self, ax, graph, densities, door_states=None,
                              chokepoints=None, is_crowdleaf=False):
        """Draw graph with rich state information"""
        ax.clear()

        # Draw edges
        for edge in graph.edges():
            node1, node2 = edge
            if node1 in self.node_positions and node2 in self.node_positions:
                pos1 = self.node_positions[node1]
                pos2 = self.node_positions[node2]
                ax.plot([pos1[0], pos2[0]], [pos1[1], pos2[1]],
                       'gray', alpha=0.5, linewidth=2, zorder=1)

        # Draw nodes
        for node, data in graph.nodes(data=True):
            if node not in self.node_positions:
                continue

            pos = self.node_positions[node]
            node_type = data.get('type', 'default')
            density = densities.get(node, 0)

            # Color based on density
            if density > 8.0:
                color = 'darkred'
                size = 400
            elif density > 6.0:
                color = 'red'
                size = 350
            elif density > 4.0:
                color = 'orange'
                size = 300
            else:
                color = 'lightgreen'
                size = 250

            # Draw chokepoints with pulsing effect
            if chokepoints and node in chokepoints:
                severity = chokepoints[node]
                pulse_size = 600 + 200 * np.sin(self.frame * 0.3)
                ax.scatter(pos[0], pos[1], s=pulse_size, c='red',
                          alpha=0.3, marker='o', zorder=2)
                ax.text(pos[0], pos[1] - 0.5, f'{severity:.1f}',
                       fontsize=8, ha='center', color='red', fontweight='bold')

            # Draw door state ring for CrowdLeaf
            if is_crowdleaf and door_states:
                door_state = door_states.get(node, 'open')
                if door_state == 'closed':
                    ring_color = 'red'
                elif door_state == 'redirect':
                    ring_color = 'yellow'
                else:
                    ring_color = 'green'

                ax.scatter(pos[0], pos[1], s=350, c='none',
                          edgecolors=ring_color, linewidths=3, zorder=3)

            # Draw node
            if node_type == 'entrance':
                ax.scatter(pos[0], pos[1], s=size, c='blue', marker='s',
                          edgecolors='white', linewidths=2, zorder=4)
            elif node_type == 'exit':
                ax.scatter(pos[0], pos[1], s=size, c='green', marker='>',
                          edgecolors='white', linewidths=2, zorder=4)
            else:
                ax.scatter(pos[0], pos[1], s=size, c=color,
                          edgecolors='white', linewidths=1, zorder=4)

    def draw_agents(self, ax, agents, is_crowdleaf=False):
        """Draw agents as colored dots"""
        base_color = 'lime' if is_crowdleaf else 'red'

        positions = []
        colors = []
        sizes = []

        for agent in agents:
            if agent.dead:
                continue

            node = agent.position
            if node not in self.node_positions:
                continue

            # Add jitter
            pos = self.node_positions[node]
            jitter_x = (hash(agent.id * 7) % 100) / 500 - 0.1
            jitter_y = (hash(agent.id * 13) % 100) / 500 - 0.1

            positions.append((pos[0] + jitter_x, pos[1] + jitter_y))

            # Color based on state
            if agent.injured:
                colors.append('orange')
                sizes.append(25)
            else:
                colors.append(base_color)
                sizes.append(15)

        if positions:
            x_coords, y_coords = zip(*positions)
            ax.scatter(x_coords, y_coords, s=sizes, c=colors,
                      alpha=0.7, zorder=5)

    def draw_metrics_text(self, ax, metrics, title, color):
        """Draw metrics as text on the plot"""
        if not metrics.time_series:
            return

        text_y = ax.get_ylim()[1] * 0.95
        text_x = ax.get_xlim()[0] * 1.05

        metrics_text = (
            f'{title}\n'
            f'Time: {metrics.time_series[-1]:.1f}s\n'
            f'Injuries: {metrics.injuries[-1]}\n'
            f'Deaths: {metrics.deaths[-1]}\n'
            f'Density: {metrics.avg_density[-1]:.2f} p/m²\n'
            f'Evacuated: {metrics.agents_evacuated[-1]}'
        )

        ax.text(text_x, text_y, metrics_text,
               fontsize=12, verticalalignment='top',
               bbox=dict(boxstyle='round', facecolor=color, alpha=0.7),
               fontweight='bold')

    def animate(self, frame):
        """Animation update function"""
        self.frame = frame

        # Run simulation steps
        if self.sim_without.current_time < 30.0:
            # Store previous for flow calculation
            self.prev_positions_with = [a.position for a in self.sim_with.agents if not a.dead]

            self.sim_without.step()
            self.sim_with.step()

        # Left: Without CrowdLeaf
        ax_left = self.axes[0]
        state_without = self.sim_without.get_current_state()
        self.draw_graph_with_states(ax_left, self.sim_without.graph,
                                   state_without['densities'],
                                   is_crowdleaf=False)
        self.draw_agents(ax_left, self.sim_without.agents, is_crowdleaf=False)
        self.draw_metrics_text(ax_left, self.sim_without.metrics,
                             'WITHOUT CrowdLeaf', 'lightcoral')
        ax_left.set_title('Standard Nearest-Exit Routing', fontsize=14, color='red', fontweight='bold')
        ax_left.set_aspect('equal')
        ax_left.axis('off')

        # Right: With CrowdLeaf
        ax_right = self.axes[1]
        state_with = self.sim_with.get_current_state()

        # Get door states and chokepoints
        door_states = None
        chokepoints = None
        if self.sim_with.crowdleaf:
            agent_pos_with = [a.position for a in self.sim_with.agents if not a.dead]
            door_states = self.sim_with.crowdleaf.update_door_states(
                self.sim_with.current_time,
                agent_pos_with,
                self.prev_positions_with if self.prev_positions_with else None
            )
            chokepoints = self.sim_with.crowdleaf.get_chokepoints(
                agent_pos_with,
                self.prev_positions_with if self.prev_positions_with else None
            )

        self.draw_graph_with_states(ax_right, self.sim_with.graph,
                                   state_with['densities'],
                                   door_states, chokepoints,
                                   is_crowdleaf=True)
        self.draw_agents(ax_right, self.sim_with.agents, is_crowdleaf=True)
        self.draw_metrics_text(ax_right, self.sim_with.metrics,
                             'WITH CrowdLeaf', 'lightgreen')
        ax_right.set_title('Biomimetic Adaptive Routing', fontsize=14, color='green', fontweight='bold')
        ax_right.set_aspect('equal')
        ax_right.axis('off')

        # Add legend
        if frame == 0:
            legend_elements = [
                mpatches.Patch(color='red', label='Agents (Standard)'),
                mpatches.Patch(color='lime', label='Agents (CrowdLeaf)'),
                mpatches.Patch(color='orange', label='Injured'),
                mpatches.Patch(color='lightgreen', label='Low Density'),
                mpatches.Patch(color='orange', label='Medium Density'),
                mpatches.Patch(color='red', label='High Density'),
            ]
            self.fig.legend(handles=legend_elements, loc='lower center',
                          ncol=6, fontsize=10, framealpha=0.9)

    def run(self):
        """Run the animation"""
        print(f'Starting visualization for {self.airport_name}...')
        print(f'Simulating {self.num_agents} agents for 30 seconds')
        print('Close the window to see final results.')

        # Create animation
        anim = FuncAnimation(self.fig, self.animate,
                           frames=300, interval=100, repeat=False)

        plt.tight_layout(rect=[0, 0.05, 1, 0.96])
        plt.show()

        # Print final results
        self._print_final_results()

    def _print_final_results(self):
        """Print comparison results"""
        print('\n' + '='*80)
        print(f'FINAL RESULTS - {self.airport_name}')
        print('='*80)

        print('\n📊 WITHOUT CROWDLEAF:')
        print(f'  Injuries: {self.sim_without.metrics.injuries[-1]}')
        print(f'  Deaths: {self.sim_without.metrics.deaths[-1]}')
        print(f'  Peak Density: {max(self.sim_without.metrics.avg_density):.2f} p/m²')
        print(f'  Evacuated: {self.sim_without.metrics.agents_evacuated[-1]}')

        print('\n✅ WITH CROWDLEAF:')
        print(f'  Injuries: {self.sim_with.metrics.injuries[-1]}')
        print(f'  Deaths: {self.sim_with.metrics.deaths[-1]}')
        print(f'  Peak Density: {max(self.sim_with.metrics.avg_density):.2f} p/m²')
        print(f'  Evacuated: {self.sim_with.metrics.agents_evacuated[-1]}')

        # Calculate improvements
        inj_reduce = self.sim_without.metrics.injuries[-1] - self.sim_with.metrics.injuries[-1]
        death_reduce = self.sim_without.metrics.deaths[-1] - self.sim_with.metrics.deaths[-1]

        print('\n📈 IMPROVEMENTS:')
        print(f'  Injury Reduction: {inj_reduce}')
        print(f'  Death Reduction: {death_reduce}')
        print('='*80)


def main():
    """Main entry point"""
    print("CrowdLeaf Visual Demonstration")
    print("="*60)
    print("\nSelect airport:")
    print("1. DFW - Dallas/Fort Worth")
    print("2. ATL - Atlanta")
    print("3. DXB - Dubai Terminal 3")
    print("4. DEL - Delhi Terminal 3")
    print("5. IAD - Washington Dulles")

    choice = input("\nEnter choice (1-5) [default: 1]: ").strip() or "1"

    airports = {
        "1": ("DFW", AirportGraph.create_dfw_terminal_d(), 400),
        "2": ("ATL", AirportGraph.create_atl_terminal(), 600),
        "3": ("DXB", AirportGraph.create_dubai_terminal_3(), 800),
        "4": ("DEL", AirportGraph.create_delhi_terminal_3(), 500),
        "5": ("IAD", AirportGraph.create_dulles_iad(), 450),
    }

    if choice in airports:
        name, graph, agents = airports[choice]
        demo = VisualDemo(name, graph, agents)
        demo.run()
    else:
        print("Invalid choice!")


if __name__ == "__main__":
    main()
