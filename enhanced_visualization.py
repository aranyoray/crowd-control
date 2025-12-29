"""
Enhanced Interactive Visualization of CrowdLeaf Algorithm
Shows side-by-side comparison with rich visual information:
- Green agents (CrowdLeaf) vs Red agents (Standard)
- Door states: Green (open), Yellow (redirect), Red (closed)
- Chokepoints highlighted
- Real-time metrics and crowdedness
- Interactive controls
"""

import pygame
import pygame_gui
import sys
import math
from airport_simulator import AirportGraph, CrowdSimulator
import networkx as nx
from typing import Dict, Tuple


# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 50, 50)
GREEN = (50, 255, 50)
DARK_GREEN = (0, 150, 0)
BLUE = (50, 150, 255)
YELLOW = (255, 255, 0)
ORANGE = (255, 165, 0)
GRAY = (180, 180, 180)
DARK_GRAY = (100, 100, 100)
LIGHT_GRAY = (220, 220, 220)
PURPLE = (200, 50, 200)
CYAN = (0, 255, 255)


class EnhancedVisualization:
    """Enhanced interactive visualization with rich information display"""

    def __init__(self, airport_name, graph, initial_agents=300):
        pygame.init()

        self.width = 1920
        self.height = 1080
        self.screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption(f'CrowdLeaf Enhanced Simulation - {airport_name}')

        # Initialize pygame_gui manager for UI controls
        self.ui_manager = pygame_gui.UIManager((self.width, self.height))

        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 24)
        self.title_font = pygame.font.Font(None, 42)
        self.small_font = pygame.font.Font(None, 20)
        self.tiny_font = pygame.font.Font(None, 16)

        self.airport_name = airport_name
        self.graph = graph
        self.num_agents = initial_agents

        # Create simulators
        self._create_simulators()

        # Get and normalize node positions
        self.node_positions = {}
        for node, data in graph.nodes(data=True):
            self.node_positions[node] = data.get('pos', (0, 0))
        self._normalize_positions()

        # Previous positions for flow calculation
        self.prev_positions_without = []
        self.prev_positions_with = []

        # Simulation state
        self.running = True
        self.paused = False
        self.speed = 1.0
        self.show_chokepoints = True
        self.show_door_states = True
        self.show_flow_arrows = False

        # UI Elements
        self._create_ui_elements()

    def _create_simulators(self):
        """Create both simulators"""
        self.sim_without = CrowdSimulator(
            self.graph, self.num_agents,
            use_crowdleaf=False, simulation_duration=30.0
        )
        self.sim_with = CrowdSimulator(
            self.graph, self.num_agents,
            use_crowdleaf=True, simulation_duration=30.0
        )

    def _create_ui_elements(self):
        """Create UI control elements"""
        # Agent count slider
        self.agent_slider = pygame_gui.elements.UIHorizontalSlider(
            relative_rect=pygame.Rect((50, self.height - 180), (300, 30)),
            start_value=self.num_agents,
            value_range=(50, 1000),
            manager=self.ui_manager
        )

        # Speed slider
        self.speed_slider = pygame_gui.elements.UIHorizontalSlider(
            relative_rect=pygame.Rect((50, self.height - 130), (300, 30)),
            start_value=1.0,
            value_range=(0.1, 5.0),
            manager=self.ui_manager
        )

        # Restart button
        self.restart_button = pygame_gui.elements.UIButton(
            relative_rect=pygame.Rect((50, self.height - 80), (140, 40)),
            text='Restart',
            manager=self.ui_manager
        )

        # Pause button
        self.pause_button = pygame_gui.elements.UIButton(
            relative_rect=pygame.Rect((210, self.height - 80), (140, 40)),
            text='Pause',
            manager=self.ui_manager
        )

    def _normalize_positions(self):
        """Normalize node positions for display"""
        if not self.node_positions:
            return

        x_coords = [pos[0] for pos in self.node_positions.values()]
        y_coords = [pos[1] for pos in self.node_positions.values()]

        min_x, max_x = min(x_coords), max(x_coords)
        min_y, max_y = min(y_coords), max(y_coords)

        # Each side gets half width minus margins
        margin = 60
        header_space = 120
        ui_space = 220
        display_width = (self.width // 2) - 2 * margin
        display_height = self.height - header_space - ui_space

        for node in self.node_positions:
            x, y = self.node_positions[node]
            norm_x = ((x - min_x) / (max_x - min_x) if max_x > min_x else 0.5) * display_width + margin
            norm_y = ((y - min_y) / (max_y - min_y) if max_y > min_y else 0.5) * display_height + header_space
            self.node_positions[node] = (norm_x, norm_y)

    def _get_door_color(self, state: str) -> Tuple[int, int, int]:
        """Get color for door state"""
        if state == 'open':
            return DARK_GREEN
        elif state == 'redirect':
            return YELLOW
        elif state == 'closed':
            return RED
        return GRAY

    def _draw_graph_with_states(self, graph, offset_x=0, densities=None,
                                door_states=None, chokepoints=None, is_crowdleaf=False):
        """Draw airport graph with rich state information"""
        # Draw edges first
        for edge in graph.edges():
            node1, node2 = edge
            if node1 in self.node_positions and node2 in self.node_positions:
                pos1 = (self.node_positions[node1][0] + offset_x, self.node_positions[node1][1])
                pos2 = (self.node_positions[node2][0] + offset_x, self.node_positions[node2][1])
                pygame.draw.line(self.screen, DARK_GRAY, pos1, pos2, 2)

        # Draw nodes with states
        for node, data in graph.nodes(data=True):
            if node not in self.node_positions:
                continue

            pos = (self.node_positions[node][0] + offset_x, self.node_positions[node][1])
            node_type = data.get('type', 'default')

            # Determine node color based on density
            density = densities.get(node, 0) if densities else 0
            if density > 8.0:
                base_color = (139, 0, 0)  # Dark red
            elif density > 6.0:
                base_color = (255, 0, 0)  # Red
            elif density > 4.0:
                base_color = ORANGE
            else:
                base_color = (144, 238, 144)  # Light green

            # Draw chokepoint indicator (pulsing ring)
            if chokepoints and node in chokepoints:
                severity = chokepoints[node]
                pulse = int(abs(math.sin(pygame.time.get_ticks() / 200)) * 30)
                ring_radius = 15 + pulse
                pygame.draw.circle(self.screen, RED, pos, ring_radius, 3)

                # Chokepoint severity text
                severity_text = self.tiny_font.render(f'{severity:.1f}', True, RED)
                self.screen.blit(severity_text, (pos[0] - 10, pos[1] - 25))

            # Draw door state indicator if CrowdLeaf
            if is_crowdleaf and door_states and self.show_door_states:
                door_state = door_states.get(node, 'open')
                door_color = self._get_door_color(door_state)

                # Draw door as colored ring
                pygame.draw.circle(self.screen, door_color, pos, 12, 3)

            # Draw node
            if node_type == 'entrance':
                pygame.draw.rect(self.screen, BLUE, (pos[0]-10, pos[1]-10, 20, 20))
                pygame.draw.rect(self.screen, WHITE, (pos[0]-10, pos[1]-10, 20, 20), 2)
            elif node_type == 'exit':
                # Exit with arrow
                pygame.draw.polygon(self.screen, GREEN,
                                  [(pos[0]-10, pos[1]-8), (pos[0]+10, pos[1]),
                                   (pos[0]-10, pos[1]+8)])
                pygame.draw.polygon(self.screen, WHITE,
                                  [(pos[0]-10, pos[1]-8), (pos[0]+10, pos[1]),
                                   (pos[0]-10, pos[1]+8)], 2)
            else:
                pygame.draw.circle(self.screen, base_color, pos, 8)
                pygame.draw.circle(self.screen, WHITE, pos, 8, 1)

    def _draw_agents_enhanced(self, agents, offset_x=0, is_crowdleaf=False):
        """Draw agents with enhanced visuals"""
        agent_color = GREEN if is_crowdleaf else RED

        for agent in agents:
            if agent.dead:
                continue

            node = agent.position
            if node not in self.node_positions:
                continue

            # Random jitter for visual separation
            base_pos = self.node_positions[node]
            jitter_x = (hash(agent.id * 7) % 16) - 8
            jitter_y = (hash(agent.id * 13) % 16) - 8

            pos = (base_pos[0] + offset_x + jitter_x, base_pos[1] + jitter_y)

            # Color modifications based on state
            if agent.dead:
                color = BLACK
            elif agent.injured:
                color = ORANGE
            else:
                # Fade based on stress level
                stress_factor = agent.stress_level
                if is_crowdleaf:
                    color = (int(50 + stress_factor * 100),
                            int(255 - stress_factor * 100),
                            int(50 + stress_factor * 100))
                else:
                    color = (int(255 - stress_factor * 50),
                            int(50 + stress_factor * 100),
                            int(50 + stress_factor * 100))

            # Draw agent as circle
            pygame.draw.circle(self.screen, color, pos, 4)

            # Draw tiny arrow showing direction
            if hasattr(agent, 'destination') and agent.destination in self.node_positions:
                dest_pos = (self.node_positions[agent.destination][0] + offset_x,
                          self.node_positions[agent.destination][1])
                dx = dest_pos[0] - pos[0]
                dy = dest_pos[1] - pos[1]
                dist = math.sqrt(dx*dx + dy*dy)
                if dist > 5:
                    dx, dy = dx/dist, dy/dist
                    arrow_end = (pos[0] + dx*8, pos[1] + dy*8)
                    pygame.draw.line(self.screen, color, pos, arrow_end, 1)

    def _draw_metrics_panel(self, metrics, x, y, title, color):
        """Draw comprehensive metrics panel"""
        panel_width = 420
        panel_height = 260

        # Background panel
        pygame.draw.rect(self.screen, (240, 240, 240), (x, y, panel_width, panel_height))
        pygame.draw.rect(self.screen, color, (x, y, panel_width, panel_height), 3)

        # Title
        title_surface = self.font.render(title, True, color)
        self.screen.blit(title_surface, (x + 10, y + 10))

        if not metrics.time_series:
            return

        # Metrics
        y_offset = y + 45
        metrics_data = [
            ('Time', f'{metrics.time_series[-1]:.1f}s / 30s', WHITE),
            ('Injuries', str(metrics.injuries[-1]), ORANGE if metrics.injuries[-1] > 0 else BLACK),
            ('Deaths', str(metrics.deaths[-1]), RED if metrics.deaths[-1] > 0 else BLACK),
            ('Overcrowd Events', str(metrics.overcrowding_events[-1]), PURPLE),
            ('Avg Density', f'{metrics.avg_density[-1]:.2f} p/m²',
             RED if metrics.avg_density[-1] > 6.0 else ORANGE if metrics.avg_density[-1] > 4.0 else DARK_GREEN),
            ('Peak Density', f'{max(metrics.avg_density):.2f} p/m²', BLACK),
            ('Evacuated', f'{metrics.agents_evacuated[-1]}', DARK_GREEN),
            ('Evacuation %', f'{metrics.agents_evacuated[-1]/len(self.sim_without.agents)*100:.1f}%', BLACK),
        ]

        for label, value, text_color in metrics_data:
            label_surface = self.small_font.render(f'{label}:', True, BLACK)
            value_surface = self.font.render(str(value), True, text_color)
            self.screen.blit(label_surface, (x + 15, y_offset))
            self.screen.blit(value_surface, (x + 200, y_offset))
            y_offset += 25

    def _draw_legend(self):
        """Draw comprehensive legend"""
        legend_x = self.width - 380
        legend_y = 120

        pygame.draw.rect(self.screen, (240, 240, 240), (legend_x, legend_y, 360, 280))
        pygame.draw.rect(self.screen, BLACK, (legend_x, legend_y, 360, 280), 2)

        title = self.font.render('Legend', True, BLACK)
        self.screen.blit(title, (legend_x + 10, legend_y + 10))

        y = legend_y + 45
        legend_items = [
            ('Agent Colors:', None),
            ('  CrowdLeaf (Right)', GREEN),
            ('  Standard (Left)', RED),
            ('  Injured', ORANGE),
            ('Door States (CrowdLeaf):', None),
            ('  Open', DARK_GREEN),
            ('  Redirect', YELLOW),
            ('  Closed', RED),
            ('Node Density:', None),
            ('  Safe (<4 p/m²)', (144, 238, 144)),
            ('  Caution (4-6)', ORANGE),
            ('  Critical (6-8)', RED),
            ('  Extreme (>8)', (139, 0, 0)),
        ]

        for label, color in legend_items:
            if color:
                if 'Door' in label or 'Agent' in label:
                    pygame.draw.circle(self.screen, color, (legend_x + 20, y + 8), 6, 2)
                else:
                    pygame.draw.circle(self.screen, color, (legend_x + 20, y + 8), 6)
            text = self.small_font.render(label, True, BLACK)
            self.screen.blit(text, (legend_x + 35, y))
            y += 20

    def _draw_info_panel(self):
        """Draw simulation info and controls"""
        info_y = self.height - 210
        pygame.draw.rect(self.screen, LIGHT_GRAY, (40, info_y, 370, 200))
        pygame.draw.rect(self.screen, BLACK, (40, info_y, 370, 200), 2)

        # Agent count label
        agent_text = self.small_font.render(f'Agent Count: {int(self.num_agents)}', True, BLACK)
        self.screen.blit(agent_text, (50, info_y + 10))

        # Speed label
        speed_text = self.small_font.render(f'Speed: {self.speed:.1f}x', True, BLACK)
        self.screen.blit(speed_text, (50, info_y + 60))

        # Status
        status = 'PAUSED' if self.paused else 'RUNNING'
        status_color = ORANGE if self.paused else DARK_GREEN
        status_text = self.font.render(status, True, status_color)
        self.screen.blit(status_text, (50, info_y + 110))

    def run(self):
        """Main simulation loop"""
        while self.running and self.sim_without.current_time < 30.0:
            time_delta = self.clock.tick(30) / 1000.0

            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False

                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        self.paused = not self.paused
                        self.pause_button.set_text('Resume' if self.paused else 'Pause')
                    elif event.key == pygame.K_c:
                        self.show_chokepoints = not self.show_chokepoints
                    elif event.key == pygame.K_d:
                        self.show_door_states = not self.show_door_states
                    elif event.key in (pygame.K_q, pygame.K_ESCAPE):
                        self.running = False

                if event.type == pygame_gui.UI_BUTTON_PRESSED:
                    if event.ui_element == self.restart_button:
                        self.num_agents = int(self.agent_slider.get_current_value())
                        self._create_simulators()
                        self.prev_positions_without = []
                        self.prev_positions_with = []
                    elif event.ui_element == self.pause_button:
                        self.paused = not self.paused
                        self.pause_button.set_text('Resume' if self.paused else 'Pause')

                if event.type == pygame_gui.UI_HORIZONTAL_SLIDER_MOVED:
                    if event.ui_element == self.speed_slider:
                        self.speed = self.speed_slider.get_current_value()

                self.ui_manager.process_events(event)

            # Update simulation
            if not self.paused:
                for _ in range(int(self.speed)):
                    if self.sim_without.current_time < 30.0:
                        # Store previous positions
                        self.prev_positions_without = [a.position for a in self.sim_without.agents if not a.dead]
                        self.prev_positions_with = [a.position for a in self.sim_with.agents if not a.dead]

                        self.sim_without.step()
                        self.sim_with.step()

            # Draw
            self.screen.fill(WHITE)

            # Title
            title = self.title_font.render(f'CrowdLeaf Airport Simulation - {self.airport_name}',
                                          True, BLACK)
            self.screen.blit(title, (self.width // 2 - title.get_width() // 2, 20))

            # Subtitle
            subtitle = self.font.render(
                'Biomimetic Adaptive Crowd Dispersal vs Standard Nearest-Exit Routing',
                True, DARK_GRAY)
            self.screen.blit(subtitle, (self.width // 2 - subtitle.get_width() // 2, 70))

            # Divider
            pygame.draw.line(self.screen, BLACK, (self.width // 2, 110),
                           (self.width // 2, self.height - 220), 3)

            # Left side: Standard
            left_title = self.font.render('WITHOUT CrowdLeaf', True, RED)
            self.screen.blit(left_title, (self.width // 4 - left_title.get_width() // 2, 95))

            state_without = self.sim_without.get_current_state()
            self._draw_graph_with_states(
                self.sim_without.graph, 0,
                state_without['densities'],
                is_crowdleaf=False
            )
            self._draw_agents_enhanced(self.sim_without.agents, 0, is_crowdleaf=False)

            # Right side: CrowdLeaf
            right_title = self.font.render('WITH CrowdLeaf', True, DARK_GREEN)
            self.screen.blit(right_title, (3 * self.width // 4 - right_title.get_width() // 2, 95))

            state_with = self.sim_with.get_current_state()

            # Get door states and chokepoints for CrowdLeaf side
            door_states = None
            chokepoints = None
            if self.sim_with.crowdleaf:
                agent_pos_with = [a.position for a in self.sim_with.agents if not a.dead]
                door_states = self.sim_with.crowdleaf.update_door_states(
                    self.sim_with.current_time,
                    agent_pos_with,
                    self.prev_positions_with if self.prev_positions_with else None
                )
                if self.show_chokepoints:
                    chokepoints = self.sim_with.crowdleaf.get_chokepoints(
                        agent_pos_with,
                        self.prev_positions_with if self.prev_positions_with else None
                    )

            self._draw_graph_with_states(
                self.sim_with.graph, self.width // 2,
                state_with['densities'],
                door_states,
                chokepoints,
                is_crowdleaf=True
            )
            self._draw_agents_enhanced(self.sim_with.agents, self.width // 2, is_crowdleaf=True)

            # Draw metrics panels
            self._draw_metrics_panel(self.sim_without.metrics, 50, self.height - 500,
                                   'Standard Metrics', RED)
            self._draw_metrics_panel(self.sim_with.metrics, self.width // 2 + 50,
                                   self.height - 500, 'CrowdLeaf Metrics', DARK_GREEN)

            # Draw legend
            self._draw_legend()

            # Draw info panel
            self._draw_info_panel()

            # Update UI
            self.ui_manager.update(time_delta)
            self.ui_manager.draw_ui(self.screen)

            pygame.display.flip()

        # Show final results
        if self.running:
            self._show_final_results()

        pygame.quit()

    def _show_final_results(self):
        """Display final comparison"""
        waiting = True
        while waiting:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    waiting = False
                elif event.type == pygame.KEYDOWN:
                    waiting = False

            self.screen.fill(WHITE)
            title = self.title_font.render('Simulation Complete', True, BLACK)
            self.screen.blit(title, (self.width // 2 - title.get_width() // 2, 100))

            # Display comparison stats
            y = 200
            comparisons = [
                ('Injuries', self.sim_without.metrics.injuries[-1],
                 self.sim_with.metrics.injuries[-1]),
                ('Deaths', self.sim_without.metrics.deaths[-1],
                 self.sim_with.metrics.deaths[-1]),
                ('Peak Density', f'{max(self.sim_without.metrics.avg_density):.2f}',
                 f'{max(self.sim_with.metrics.avg_density):.2f}'),
                ('Evacuated', self.sim_without.metrics.agents_evacuated[-1],
                 self.sim_with.metrics.agents_evacuated[-1]),
            ]

            for metric, without, with_cl in comparisons:
                text = self.font.render(
                    f'{metric}: {without} (Standard) vs {with_cl} (CrowdLeaf)',
                    True, BLACK
                )
                self.screen.blit(text, (self.width // 2 - text.get_width() // 2, y))
                y += 50

            exit_text = self.small_font.render('Press any key to exit', True, GRAY)
            self.screen.blit(exit_text, (self.width // 2 - exit_text.get_width() // 2,
                                        self.height - 100))

            pygame.display.flip()
            self.clock.tick(30)


def main():
    """Main entry point"""
    print("Select airport:")
    print("1. DFW - Dallas/Fort Worth Terminal D")
    print("2. ATL - Atlanta Hartsfield-Jackson")
    print("3. DXB - Dubai International Terminal 3")
    print("4. DEL - Delhi Terminal 3")
    print("5. IAD - Washington Dulles")

    choice = input("\nEnter choice (1-5) [default: 1]: ").strip() or "1"

    airports = {
        "1": ("DFW", AirportGraph.create_dfw_terminal_d(), 300),
        "2": ("ATL", AirportGraph.create_atl_terminal(), 400),
        "3": ("DXB", AirportGraph.create_dubai_terminal_3(), 500),
        "4": ("DEL", AirportGraph.create_delhi_terminal_3(), 350),
        "5": ("IAD", AirportGraph.create_dulles_iad(), 300),
    }

    if choice in airports:
        name, graph, agents = airports[choice]
        print(f"\nLaunching enhanced visualization for {name}...")
        print("Controls:")
        print("  SPACE: Pause/Resume")
        print("  C: Toggle chokepoint display")
        print("  D: Toggle door state display")
        print("  Q/ESC: Quit")
        print("  Use sliders to adjust agent count and speed")
        print("  Click Restart to apply new agent count\n")

        viz = EnhancedVisualization(name, graph, agents)
        viz.run()
    else:
        print("Invalid choice!")


if __name__ == "__main__":
    main()
