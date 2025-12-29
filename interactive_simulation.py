"""
Interactive real-time visualization of airport crowd simulation
Shows side-by-side comparison of with/without CrowdLeaf
"""

import pygame
import sys
import math
from airport_simulator import AirportGraph, CrowdSimulator
import networkx as nx


# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 100, 255)
YELLOW = (255, 255, 0)
ORANGE = (255, 165, 0)
GRAY = (200, 200, 200)
DARK_RED = (139, 0, 0)
LIGHT_GREEN = (144, 238, 144)


class InteractiveSimulation:
    """Interactive pygame visualization"""

    def __init__(self, airport_name, graph, num_agents=150):
        pygame.init()

        self.width = 1600
        self.height = 900
        self.screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption(f'CrowdLeaf Simulation - {airport_name}')

        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 24)
        self.title_font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 20)

        self.airport_name = airport_name

        # Create two simulators
        self.sim_without = CrowdSimulator(graph, num_agents, use_crowdleaf=False, simulation_duration=30.0)
        self.sim_with = CrowdSimulator(graph, num_agents, use_crowdleaf=True, simulation_duration=30.0)

        # Get node positions for rendering
        self.node_positions = {}
        for node, data in graph.nodes(data=True):
            self.node_positions[node] = data.get('pos', (0, 0))

        # Normalize positions for rendering
        self._normalize_positions()

        self.running = True
        self.paused = False
        self.speed = 1.0  # Simulation speed multiplier

    def _normalize_positions(self):
        """Normalize node positions to fit in display area"""
        if not self.node_positions:
            return

        # Get min/max
        x_coords = [pos[0] for pos in self.node_positions.values()]
        y_coords = [pos[1] for pos in self.node_positions.values()]

        min_x, max_x = min(x_coords), max(x_coords)
        min_y, max_y = min(y_coords), max(y_coords)

        # Normalize to fit in half screen (for side-by-side)
        margin = 50
        display_width = self.width // 2 - 2 * margin
        display_height = self.height - 250  # Leave space for metrics at bottom

        for node in self.node_positions:
            x, y = self.node_positions[node]
            # Normalize
            norm_x = ((x - min_x) / (max_x - min_x) if max_x > min_x else 0.5) * display_width + margin
            norm_y = ((y - min_y) / (max_y - min_y) if max_y > min_y else 0.5) * display_height + margin + 80
            self.node_positions[node] = (norm_x, norm_y)

    def _draw_graph(self, graph, offset_x=0, densities=None):
        """Draw the airport graph"""
        # Draw edges
        for edge in graph.edges():
            node1, node2 = edge
            if node1 in self.node_positions and node2 in self.node_positions:
                pos1 = (self.node_positions[node1][0] + offset_x, self.node_positions[node1][1])
                pos2 = (self.node_positions[node2][0] + offset_x, self.node_positions[node2][1])
                pygame.draw.line(self.screen, GRAY, pos1, pos2, 1)

        # Draw nodes
        for node, data in graph.nodes(data=True):
            if node not in self.node_positions:
                continue

            pos = (self.node_positions[node][0] + offset_x, self.node_positions[node][1])

            # Color based on density
            density = densities.get(node, 0) if densities else 0
            if density > 8.0:
                color = DARK_RED
            elif density > 6.0:
                color = RED
            elif density > 4.0:
                color = ORANGE
            else:
                color = LIGHT_GREEN

            # Different sizes/shapes based on node type
            node_type = data.get('type', 'default')
            if node_type == 'entrance':
                pygame.draw.rect(self.screen, BLUE, (pos[0]-8, pos[1]-8, 16, 16))
            elif node_type == 'exit':
                pygame.draw.rect(self.screen, GREEN, (pos[0]-8, pos[1]-8, 16, 16))
            else:
                pygame.draw.circle(self.screen, color, pos, 6)

    def _draw_agents(self, agents, offset_x=0):
        """Draw agent positions"""
        for agent in agents:
            if agent.dead:
                continue

            node = agent.position
            if node not in self.node_positions:
                continue

            # Add some random jitter for visualization
            base_pos = self.node_positions[node]
            jitter_x = hash(agent.id) % 10 - 5
            jitter_y = (hash(agent.id * 2) % 10) - 5

            pos = (base_pos[0] + offset_x + jitter_x, base_pos[1] + jitter_y)

            # Color based on state
            if agent.dead:
                color = BLACK
            elif agent.injured:
                color = ORANGE
            else:
                color = BLUE

            pygame.draw.circle(self.screen, color, pos, 3)

    def _draw_metrics(self, metrics, x, y, title):
        """Draw metrics panel"""
        # Title
        text = self.font.render(title, True, BLACK)
        self.screen.blit(text, (x, y))

        y += 30

        if not metrics.time_series:
            return

        # Metrics
        metrics_text = [
            f"Time: {metrics.time_series[-1]:.1f}s / 30s",
            f"Injuries: {metrics.injuries[-1]}",
            f"Deaths: {metrics.deaths[-1]}",
            f"Overcrowding: {metrics.overcrowding_events[-1]}",
            f"Avg Density: {metrics.avg_density[-1]:.2f} p/m²",
            f"Evacuated: {metrics.agents_evacuated[-1]}",
        ]

        for i, line in enumerate(metrics_text):
            # Color code critical metrics
            if "Deaths" in line and metrics.deaths[-1] > 0:
                color = RED
            elif "Injuries" in line and metrics.injuries[-1] > 0:
                color = ORANGE
            else:
                color = BLACK

            text = self.small_font.render(line, True, color)
            self.screen.blit(text, (x, y + i * 25))

    def _draw_instructions(self):
        """Draw control instructions"""
        instructions = [
            "SPACE: Pause/Resume",
            "UP/DOWN: Speed ±",
            "R: Restart",
            "Q/ESC: Quit"
        ]

        y = self.height - 120
        for i, instruction in enumerate(instructions):
            text = self.small_font.render(instruction, True, BLACK)
            self.screen.blit(text, (self.width - 200, y + i * 25))

    def _draw_legend(self):
        """Draw legend"""
        legend_x = 20
        legend_y = self.height - 160

        legend_items = [
            ("Node Density:", None),
            ("  < 4.0 p/m² (Safe)", LIGHT_GREEN),
            ("  4-6 p/m² (Caution)", ORANGE),
            ("  6-8 p/m² (Critical)", RED),
            ("  > 8.0 p/m² (Extreme)", DARK_RED),
        ]

        for i, (text, color) in enumerate(legend_items):
            if color:
                pygame.draw.circle(self.screen, color, (legend_x + 10, legend_y + i * 22 + 10), 5)
            text_surf = self.small_font.render(text, True, BLACK)
            self.screen.blit(text_surf, (legend_x + 25, legend_y + i * 22))

    def run(self):
        """Main simulation loop"""
        while self.running and self.sim_without.current_time < 30.0:
            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        self.paused = not self.paused
                    elif event.key == pygame.K_r:
                        # Restart simulation
                        self.sim_without = CrowdSimulator(
                            self.sim_without.graph,
                            self.sim_without.num_agents,
                            use_crowdleaf=False,
                            simulation_duration=30.0
                        )
                        self.sim_with = CrowdSimulator(
                            self.sim_with.graph,
                            self.sim_with.num_agents,
                            use_crowdleaf=True,
                            simulation_duration=30.0
                        )
                    elif event.key == pygame.K_UP:
                        self.speed = min(5.0, self.speed + 0.5)
                    elif event.key == pygame.K_DOWN:
                        self.speed = max(0.5, self.speed - 0.5)
                    elif event.key in (pygame.K_q, pygame.K_ESCAPE):
                        self.running = False

            # Update simulation
            if not self.paused:
                for _ in range(int(self.speed)):
                    if self.sim_without.current_time < 30.0:
                        self.sim_without.step()
                        self.sim_with.step()

            # Draw
            self.screen.fill(WHITE)

            # Title
            title = self.title_font.render(f'CrowdLeaf Airport Simulation - {self.airport_name}',
                                          True, BLACK)
            self.screen.blit(title, (self.width // 2 - title.get_width() // 2, 20))

            # Divider line
            pygame.draw.line(self.screen, BLACK, (self.width // 2, 0), (self.width // 2, self.height), 2)

            # Left side: Without CrowdLeaf
            subtitle1 = self.font.render('WITHOUT CrowdLeaf', True, RED)
            self.screen.blit(subtitle1, (self.width // 4 - subtitle1.get_width() // 2, 60))

            state_without = self.sim_without.get_current_state()
            self._draw_graph(self.sim_without.graph, 0, state_without['densities'])
            self._draw_agents(self.sim_without.agents, 0)
            self._draw_metrics(self.sim_without.metrics, 20, self.height - 220, "Metrics (Without CrowdLeaf)")

            # Right side: With CrowdLeaf
            subtitle2 = self.font.render('WITH CrowdLeaf', True, GREEN)
            self.screen.blit(subtitle2, (3 * self.width // 4 - subtitle2.get_width() // 2, 60))

            state_with = self.sim_with.get_current_state()
            self._draw_graph(self.sim_with.graph, self.width // 2, state_with['densities'])
            self._draw_agents(self.sim_with.agents, self.width // 2)
            self._draw_metrics(self.sim_with.metrics, self.width // 2 + 20, self.height - 220,
                             "Metrics (With CrowdLeaf)")

            # Draw legend and instructions
            self._draw_legend()
            self._draw_instructions()

            # Speed indicator
            speed_text = self.small_font.render(f'Speed: {self.speed}x', True, BLACK)
            self.screen.blit(speed_text, (self.width - 200, self.height - 150))

            # Paused indicator
            if self.paused:
                pause_text = self.title_font.render('PAUSED', True, RED)
                self.screen.blit(pause_text, (self.width // 2 - pause_text.get_width() // 2,
                                             self.height // 2))

            pygame.display.flip()
            self.clock.tick(30)  # 30 FPS

        # Show final results
        self._show_final_results()

    def _show_final_results(self):
        """Show final comparison results"""
        while self.running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key in (pygame.K_q, pygame.K_ESCAPE, pygame.K_RETURN):
                        self.running = False

            self.screen.fill(WHITE)

            # Title
            title = self.title_font.render('Simulation Complete - Final Results', True, BLACK)
            self.screen.blit(title, (self.width // 2 - title.get_width() // 2, 50))

            # Results comparison
            y = 150
            results = [
                ("Metric", "Without CrowdLeaf", "With CrowdLeaf", "Improvement"),
                ("─" * 80, "", "", ""),
                ("Injuries",
                 str(self.sim_without.metrics.injuries[-1]),
                 str(self.sim_with.metrics.injuries[-1]),
                 f"{self.sim_without.metrics.injuries[-1] - self.sim_with.metrics.injuries[-1]}"),
                ("Deaths",
                 str(self.sim_without.metrics.deaths[-1]),
                 str(self.sim_with.metrics.deaths[-1]),
                 f"{self.sim_without.metrics.deaths[-1] - self.sim_with.metrics.deaths[-1]}"),
                ("Peak Density",
                 f"{max(self.sim_without.metrics.avg_density):.2f}",
                 f"{max(self.sim_with.metrics.avg_density):.2f}",
                 f"{max(self.sim_without.metrics.avg_density) - max(self.sim_with.metrics.avg_density):.2f}"),
                ("Evacuated",
                 str(self.sim_without.metrics.agents_evacuated[-1]),
                 str(self.sim_with.metrics.agents_evacuated[-1]),
                 f"+{self.sim_with.metrics.agents_evacuated[-1] - self.sim_without.metrics.agents_evacuated[-1]}"),
            ]

            for i, row in enumerate(results):
                if i == 0:  # Header
                    font = self.font
                    color = BLACK
                elif i == 1:  # Separator
                    continue
                else:
                    font = self.small_font
                    color = BLACK

                x_offset = 100
                for j, item in enumerate(row):
                    text = font.render(str(item), True, color)
                    self.screen.blit(text, (x_offset + j * 300, y + i * 40))

            # Press any key message
            msg = self.small_font.render('Press ENTER or Q to exit', True, GRAY)
            self.screen.blit(msg, (self.width // 2 - msg.get_width() // 2, self.height - 100))

            pygame.display.flip()
            self.clock.tick(30)

        pygame.quit()


def main():
    """Main function"""
    print("Select an airport to simulate:")
    print("1. DFW - Dallas/Fort Worth Terminal D")
    print("2. ATL - Atlanta Hartsfield-Jackson")
    print("3. DXB - Dubai International Terminal 3")
    print("4. DEL - Delhi Indira Gandhi Terminal 3")
    print("5. IAD - Washington Dulles")

    choice = input("\nEnter choice (1-5) [default: 1]: ").strip() or "1"

    airports = {
        "1": ("DFW - Dallas/Fort Worth Terminal D", AirportGraph.create_dfw_terminal_d(), 150),
        "2": ("ATL - Atlanta Hartsfield-Jackson", AirportGraph.create_atl_terminal(), 200),
        "3": ("DXB - Dubai International Terminal 3", AirportGraph.create_dubai_terminal_3(), 250),
        "4": ("DEL - Delhi Indira Gandhi Terminal 3", AirportGraph.create_delhi_terminal_3(), 180),
        "5": ("IAD - Washington Dulles", AirportGraph.create_dulles_iad(), 160),
    }

    if choice in airports:
        name, graph, num_agents = airports[choice]
        print(f"\nStarting simulation for {name}...")
        print(f"Number of agents: {num_agents}")
        print("\nControls:")
        print("  SPACE: Pause/Resume")
        print("  UP/DOWN: Adjust speed")
        print("  R: Restart")
        print("  Q/ESC: Quit")

        sim = InteractiveSimulation(name, graph, num_agents)
        sim.run()
    else:
        print("Invalid choice!")


if __name__ == "__main__":
    main()
