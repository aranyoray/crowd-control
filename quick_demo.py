"""
Quick demonstration of CrowdLeaf with high-density scenarios
"""

from airport_simulator import AirportGraph, CrowdSimulator
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import numpy as np


def run_demo(airport_name, graph, num_agents):
    """Run a high-density demonstration"""
    print(f'\n{"="*80}')
    print(f'CROWDLEAF DEMONSTRATION - {airport_name}')
    print(f'{"="*80}')
    print(f'\nScenario: Emergency evacuation with {num_agents} people')
    print(f'Duration: 30 seconds\n')

    print('⏳ Running WITHOUT CrowdLeaf (standard nearest-exit routing)...')
    sim_without = CrowdSimulator(graph, num_agents, use_crowdleaf=False, simulation_duration=30.0)
    metrics_without = sim_without.run()
    print('   ✓ Complete')

    print('⏳ Running WITH CrowdLeaf (biomimetic adaptive routing)...')
    sim_with = CrowdSimulator(graph, num_agents, use_crowdleaf=True, simulation_duration=30.0)
    metrics_with = sim_with.run()
    print('   ✓ Complete')

    # Results
    print(f'\n{"─"*80}')
    print('COMPARISON RESULTS')
    print(f'{"─"*80}\n')

    print('{:<30} {:>15} {:>15} {:>15}'.format('METRIC', 'WITHOUT', 'WITH', 'IMPROVEMENT'))
    print('─' * 80)

    # Injuries
    inj_without = metrics_without.injuries[-1]
    inj_with = metrics_with.injuries[-1]
    inj_improve = inj_without - inj_with
    print('{:<30} {:>15} {:>15} {:>15}'.format(
        'Total Injuries',
        str(inj_without),
        str(inj_with),
        f'{inj_improve} ({inj_improve/max(inj_without,1)*100:.1f}%)'
    ))

    # Deaths
    death_without = metrics_without.deaths[-1]
    death_with = metrics_with.deaths[-1]
    death_improve = death_without - death_with
    print('{:<30} {:>15} {:>15} {:>15}'.format(
        'Total Deaths',
        str(death_without),
        str(death_with),
        f'{death_improve} ({death_improve/max(death_without,1)*100:.1f}%)'
    ))

    # Peak Density
    peak_without = max(metrics_without.avg_density) if metrics_without.avg_density else 0
    peak_with = max(metrics_with.avg_density) if metrics_with.avg_density else 0
    density_improve = peak_without - peak_with
    print('{:<30} {:>15} {:>15} {:>15}'.format(
        'Peak Density (p/m²)',
        f'{peak_without:.2f}',
        f'{peak_with:.2f}',
        f'{density_improve:.2f}'
    ))

    # Overcrowding
    over_without = sum(metrics_without.overcrowding_events)
    over_with = sum(metrics_with.overcrowding_events)
    over_improve = over_without - over_with
    print('{:<30} {:>15} {:>15} {:>15}'.format(
        'Overcrowding Events',
        str(over_without),
        str(over_with),
        f'{over_improve} ({over_improve/max(over_without,1)*100:.1f}%)'
    ))

    # Evacuated
    evac_without = metrics_without.agents_evacuated[-1]
    evac_with = metrics_with.agents_evacuated[-1]
    evac_improve = evac_with - evac_without
    print('{:<30} {:>15} {:>15} {:>15}'.format(
        'Agents Evacuated',
        str(evac_without),
        str(evac_with),
        f'+{evac_improve}'
    ))

    print('─' * 80)

    # Create visualization
    fig = create_comparison_plot(metrics_without, metrics_with, airport_name)
    filename = f'demo_{airport_name.split()[0].replace("-", "")}.png'
    fig.savefig(filename, dpi=150, bbox_inches='tight')
    print(f'\n📊 Visualization saved to: {filename}')

    return metrics_without, metrics_with


def create_comparison_plot(metrics_without, metrics_with, airport_name):
    """Create comparison visualization"""
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle(f'CrowdLeaf Performance - {airport_name}', fontsize=16, fontweight='bold')

    # Injuries
    ax = axes[0, 0]
    ax.plot(metrics_without.time_series, metrics_without.injuries, 'r-', label='Without CrowdLeaf', linewidth=2)
    ax.plot(metrics_with.time_series, metrics_with.injuries, 'g-', label='With CrowdLeaf', linewidth=2)
    ax.set_xlabel('Time (seconds)')
    ax.set_ylabel('Total Injuries')
    ax.set_title('Injuries Over Time')
    ax.legend()
    ax.grid(True, alpha=0.3)

    # Deaths
    ax = axes[0, 1]
    ax.plot(metrics_without.time_series, metrics_without.deaths, 'r-', label='Without CrowdLeaf', linewidth=2)
    ax.plot(metrics_with.time_series, metrics_with.deaths, 'g-', label='With CrowdLeaf', linewidth=2)
    ax.set_xlabel('Time (seconds)')
    ax.set_ylabel('Total Deaths')
    ax.set_title('Deaths Over Time')
    ax.legend()
    ax.grid(True, alpha=0.3)

    # Density
    ax = axes[1, 0]
    ax.plot(metrics_without.time_series, metrics_without.avg_density, 'r-', label='Without CrowdLeaf', linewidth=2)
    ax.plot(metrics_with.time_series, metrics_with.avg_density, 'g-', label='With CrowdLeaf', linewidth=2)
    ax.axhline(y=4.0, color='orange', linestyle='--', label='Safe Threshold', alpha=0.7)
    ax.axhline(y=6.0, color='darkred', linestyle='--', label='Critical Threshold', alpha=0.7)
    ax.set_xlabel('Time (seconds)')
    ax.set_ylabel('Average Density (persons/m²)')
    ax.set_title('Crowd Density Over Time')
    ax.legend()
    ax.grid(True, alpha=0.3)

    # Evacuated
    ax = axes[1, 1]
    ax.plot(metrics_without.time_series, metrics_without.agents_evacuated, 'r-',
            label='Without CrowdLeaf', linewidth=2)
    ax.plot(metrics_with.time_series, metrics_with.agents_evacuated, 'g-',
            label='With CrowdLeaf', linewidth=2)
    ax.set_xlabel('Time (seconds)')
    ax.set_ylabel('Agents Evacuated')
    ax.set_title('Evacuation Progress')
    ax.legend()
    ax.grid(True, alpha=0.3)

    plt.tight_layout()
    return fig


def main():
    """Run demonstrations for all airports with high agent counts"""
    print('\n' + '='*80)
    print('CROWDLEAF AIRPORT CROWD SIMULATOR - HIGH-DENSITY DEMONSTRATION')
    print('Biomimetic Algorithm for Adaptive Crowd Dispersal')
    print('='*80)

    airports = [
        ('DFW - Dallas/Fort Worth', AirportGraph.create_dfw_terminal_d(), 500),
        ('ATL - Atlanta', AirportGraph.create_atl_terminal(), 800),
        ('DXB - Dubai Terminal 3', AirportGraph.create_dubai_terminal_3(), 1000),
        ('DEL - Delhi Terminal 3', AirportGraph.create_delhi_terminal_3(), 700),
        ('IAD - Washington Dulles', AirportGraph.create_dulles_iad(), 600),
    ]

    for name, graph, agents in airports:
        run_demo(name, graph, agents)

    print('\n' + '='*80)
    print('ALL SIMULATIONS COMPLETE')
    print('='*80)
    print('\n✅ Check the generated PNG files for visualizations')
    print('✅ Results show CrowdLeaf\'s impact on high-density evacuation scenarios\n')


if __name__ == '__main__':
    main()
