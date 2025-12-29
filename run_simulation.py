"""
Run and visualize airport crowd simulations
Compares scenarios with and without CrowdLeaf algorithm
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.animation import FuncAnimation
import numpy as np
from airport_simulator import AirportGraph, CrowdSimulator
import sys


def plot_comparison(metrics_without, metrics_with, airport_name):
    """Create comparison plots for metrics"""
    fig, axes = plt.subplots(2, 3, figsize=(18, 10))
    fig.suptitle(f'CrowdLeaf Performance Comparison - {airport_name}', fontsize=16, fontweight='bold')

    # Plot 1: Injuries over time
    ax1 = axes[0, 0]
    ax1.plot(metrics_without.time_series, metrics_without.injuries, 'r-', label='Without CrowdLeaf', linewidth=2)
    ax1.plot(metrics_with.time_series, metrics_with.injuries, 'g-', label='With CrowdLeaf', linewidth=2)
    ax1.set_xlabel('Time (seconds)', fontweight='bold')
    ax1.set_ylabel('Total Injuries', fontweight='bold')
    ax1.set_title('Injuries Over Time', fontweight='bold')
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # Plot 2: Deaths over time
    ax2 = axes[0, 1]
    ax2.plot(metrics_without.time_series, metrics_without.deaths, 'r-', label='Without CrowdLeaf', linewidth=2)
    ax2.plot(metrics_with.time_series, metrics_with.deaths, 'g-', label='With CrowdLeaf', linewidth=2)
    ax2.set_xlabel('Time (seconds)', fontweight='bold')
    ax2.set_ylabel('Total Deaths', fontweight='bold')
    ax2.set_title('Deaths Over Time', fontweight='bold')
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    # Plot 3: Overcrowding events
    ax3 = axes[0, 2]
    ax3.plot(metrics_without.time_series, metrics_without.overcrowding_events, 'r-',
             label='Without CrowdLeaf', linewidth=2)
    ax3.plot(metrics_with.time_series, metrics_with.overcrowding_events, 'g-',
             label='With CrowdLeaf', linewidth=2)
    ax3.set_xlabel('Time (seconds)', fontweight='bold')
    ax3.set_ylabel('Overcrowding Events', fontweight='bold')
    ax3.set_title('Overcrowding Events Over Time', fontweight='bold')
    ax3.legend()
    ax3.grid(True, alpha=0.3)

    # Plot 4: Average density
    ax4 = axes[1, 0]
    ax4.plot(metrics_without.time_series, metrics_without.avg_density, 'r-',
             label='Without CrowdLeaf', linewidth=2)
    ax4.plot(metrics_with.time_series, metrics_with.avg_density, 'g-',
             label='With CrowdLeaf', linewidth=2)
    ax4.axhline(y=4.0, color='orange', linestyle='--', label='Safe Threshold (4.0)')
    ax4.axhline(y=6.0, color='darkred', linestyle='--', label='Critical Threshold (6.0)')
    ax4.set_xlabel('Time (seconds)', fontweight='bold')
    ax4.set_ylabel('Average Density (persons/m²)', fontweight='bold')
    ax4.set_title('Average Crowd Density', fontweight='bold')
    ax4.legend()
    ax4.grid(True, alpha=0.3)

    # Plot 5: Agents evacuated
    ax5 = axes[1, 1]
    ax5.plot(metrics_without.time_series, metrics_without.agents_evacuated, 'r-',
             label='Without CrowdLeaf', linewidth=2)
    ax5.plot(metrics_with.time_series, metrics_with.agents_evacuated, 'g-',
             label='With CrowdLeaf', linewidth=2)
    ax5.set_xlabel('Time (seconds)', fontweight='bold')
    ax5.set_ylabel('Agents Evacuated', fontweight='bold')
    ax5.set_title('Evacuation Progress', fontweight='bold')
    ax5.legend()
    ax5.grid(True, alpha=0.3)

    # Plot 6: Summary statistics (bar chart)
    ax6 = axes[1, 2]
    categories = ['Total\nInjuries', 'Total\nDeaths', 'Max\nDensity', 'Evacuated']
    without_stats = [
        metrics_without.injuries[-1] if metrics_without.injuries else 0,
        metrics_without.deaths[-1] if metrics_without.deaths else 0,
        max(metrics_without.avg_density) if metrics_without.avg_density else 0,
        metrics_without.agents_evacuated[-1] if metrics_without.agents_evacuated else 0
    ]
    with_stats = [
        metrics_with.injuries[-1] if metrics_with.injuries else 0,
        metrics_with.deaths[-1] if metrics_with.deaths else 0,
        max(metrics_with.avg_density) if metrics_with.avg_density else 0,
        metrics_with.agents_evacuated[-1] if metrics_with.agents_evacuated else 0
    ]

    x = np.arange(len(categories))
    width = 0.35

    ax6.bar(x - width/2, without_stats, width, label='Without CrowdLeaf', color='red', alpha=0.7)
    ax6.bar(x + width/2, with_stats, width, label='With CrowdLeaf', color='green', alpha=0.7)
    ax6.set_ylabel('Count / Value', fontweight='bold')
    ax6.set_title('Final Statistics Summary', fontweight='bold')
    ax6.set_xticks(x)
    ax6.set_xticklabels(categories)
    ax6.legend()
    ax6.grid(True, alpha=0.3, axis='y')

    plt.tight_layout()
    return fig


def print_summary(metrics_without, metrics_with, airport_name):
    """Print summary statistics"""
    print("\n" + "="*80)
    print(f"SIMULATION RESULTS - {airport_name}")
    print("="*80)

    print("\n📊 WITHOUT CROWDLEAF:")
    print(f"  Total Injuries:          {metrics_without.injuries[-1] if metrics_without.injuries else 0}")
    print(f"  Total Deaths:            {metrics_without.deaths[-1] if metrics_without.deaths else 0}")
    print(f"  Peak Density:            {max(metrics_without.avg_density) if metrics_without.avg_density else 0:.2f} persons/m²")
    print(f"  Total Overcrowding:      {sum(metrics_without.overcrowding_events)}")
    print(f"  Agents Evacuated:        {metrics_without.agents_evacuated[-1] if metrics_without.agents_evacuated else 0}")

    print("\n✅ WITH CROWDLEAF:")
    print(f"  Total Injuries:          {metrics_with.injuries[-1] if metrics_with.injuries else 0}")
    print(f"  Total Deaths:            {metrics_with.deaths[-1] if metrics_with.deaths else 0}")
    print(f"  Peak Density:            {max(metrics_with.avg_density) if metrics_with.avg_density else 0:.2f} persons/m²")
    print(f"  Total Overcrowding:      {sum(metrics_with.overcrowding_events)}")
    print(f"  Agents Evacuated:        {metrics_with.agents_evacuated[-1] if metrics_with.agents_evacuated else 0}")

    # Calculate improvements
    injury_reduction = metrics_without.injuries[-1] - metrics_with.injuries[-1] if metrics_without.injuries and metrics_with.injuries else 0
    death_reduction = metrics_without.deaths[-1] - metrics_with.deaths[-1] if metrics_without.deaths and metrics_with.deaths else 0
    density_reduction = max(metrics_without.avg_density) - max(metrics_with.avg_density) if metrics_without.avg_density and metrics_with.avg_density else 0
    overcrowd_reduction = sum(metrics_without.overcrowding_events) - sum(metrics_with.overcrowding_events)

    print("\n📈 IMPROVEMENTS WITH CROWDLEAF:")
    print(f"  Injury Reduction:        {injury_reduction} ({injury_reduction / max(metrics_without.injuries[-1], 1) * 100:.1f}% improvement)")
    print(f"  Death Reduction:         {death_reduction} ({death_reduction / max(metrics_without.deaths[-1], 1) * 100:.1f}% improvement)")
    print(f"  Peak Density Reduction:  {density_reduction:.2f} persons/m²")
    print(f"  Overcrowding Reduction:  {overcrowd_reduction} events")

    print("\n" + "="*80)


def run_airport_simulation(airport_name, graph, num_agents=250):
    """Run simulation for a specific airport"""
    print(f"\n🏢 Simulating {airport_name}...")
    print(f"   Number of agents: {num_agents}")
    print(f"   Duration: 30 seconds")

    # Run without CrowdLeaf
    print("   ⏳ Running WITHOUT CrowdLeaf...")
    sim_without = CrowdSimulator(
        airport_graph=graph,
        num_agents=num_agents,
        use_crowdleaf=False,
        simulation_duration=30.0
    )
    metrics_without = sim_without.run()

    # Run with CrowdLeaf
    print("   ⏳ Running WITH CrowdLeaf...")
    sim_with = CrowdSimulator(
        airport_graph=graph,
        num_agents=num_agents,
        use_crowdleaf=True,
        simulation_duration=30.0
    )
    metrics_with = sim_with.run()

    print("   ✓ Simulation complete!")

    # Generate plots
    fig = plot_comparison(metrics_without, metrics_with, airport_name)

    # Print summary
    print_summary(metrics_without, metrics_with, airport_name)

    return fig, metrics_without, metrics_with


def main():
    """Main function to run all simulations"""
    print("="*80)
    print("CROWDLEAF AIRPORT CROWD SIMULATOR")
    print("Biomimetic Algorithm for Adaptive Crowd Dispersal")
    print("="*80)

    airports = {
        'DFW - Dallas/Fort Worth Terminal D': (AirportGraph.create_dfw_terminal_d(), 200),
        'ATL - Atlanta Hartsfield-Jackson': (AirportGraph.create_atl_terminal(), 300),
        'DXB - Dubai International Terminal 3': (AirportGraph.create_dubai_terminal_3(), 350),
        'DEL - Delhi Indira Gandhi Terminal 3': (AirportGraph.create_delhi_terminal_3(), 280),
        'IAD - Washington Dulles': (AirportGraph.create_dulles_iad(), 220),
    }

    # Allow user to select airport
    if len(sys.argv) > 1:
        # Run specific airport from command line
        airport_arg = sys.argv[1].upper()
        selected_airports = {k: v for k, v in airports.items() if airport_arg in k}
        if not selected_airports:
            print(f"Airport '{airport_arg}' not found. Available: DFW, ATL, DXB, DEL, IAD")
            return
    else:
        # Run all airports
        selected_airports = airports

    all_figures = []

    for airport_name, (graph, num_agents) in selected_airports.items():
        fig, _, _ = run_airport_simulation(airport_name, graph, num_agents)
        all_figures.append((airport_name, fig))

        # Save figure
        filename = f"results_{airport_name.split()[0].replace('-', '')}.png"
        fig.savefig(filename, dpi=150, bbox_inches='tight')
        print(f"   📁 Saved results to {filename}")

    # Show all plots
    plt.show()


if __name__ == "__main__":
    main()
