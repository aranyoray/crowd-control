"""
Stress test scenario - creates high-density evacuation conditions
to demonstrate CrowdLeaf effectiveness
"""

from airport_simulator import AirportGraph, CrowdSimulator
import networkx as nx
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


def create_constrained_terminal():
    """Create a smaller, more constrained terminal for stress testing"""
    G = nx.Graph()

    # Smaller areas to force higher densities
    nodes = {
        'entrance': {'area': 80, 'type': 'entrance', 'pos': (0, 5)},
        'security_1': {'area': 40, 'type': 'checkpoint', 'pos': (1, 6)},
        'security_2': {'area': 40, 'type': 'checkpoint', 'pos': (1, 4)},
        'main_hall': {'area': 100, 'type': 'hall', 'pos': (2, 5)},
        'corridor_1': {'area': 30, 'type': 'corridor', 'pos': (3, 6)},
        'corridor_2': {'area': 30, 'type': 'corridor', 'pos': (3, 4)},
        'gate_area_a': {'area': 60, 'type': 'gate', 'pos': (4, 7)},
        'gate_area_b': {'area': 60, 'type': 'gate', 'pos': (4, 5)},
        'gate_area_c': {'area': 60, 'type': 'gate', 'pos': (4, 3)},
        'bottleneck': {'area': 25, 'type': 'corridor', 'pos': (5, 5)},
        'exit_1': {'area': 50, 'type': 'exit', 'pos': (6, 6)},
        'exit_2': {'area': 50, 'type': 'exit', 'pos': (6, 4)},
        'emergency_exit': {'area': 40, 'type': 'exit', 'pos': (4, 1)},
    }

    G.add_nodes_from([(k, v) for k, v in nodes.items()])

    # Create bottleneck structure
    edges = [
        ('entrance', 'security_1'),
        ('entrance', 'security_2'),
        ('security_1', 'main_hall'),
        ('security_2', 'main_hall'),
        ('main_hall', 'corridor_1'),
        ('main_hall', 'corridor_2'),
        ('corridor_1', 'gate_area_a'),
        ('corridor_2', 'gate_area_c'),
        ('main_hall', 'gate_area_b'),
        ('gate_area_a', 'bottleneck'),
        ('gate_area_b', 'bottleneck'),
        ('gate_area_c', 'bottleneck'),
        ('bottleneck', 'exit_1'),
        ('bottleneck', 'exit_2'),
        ('gate_area_c', 'emergency_exit'),
    ]

    G.add_edges_from(edges)
    return G


def run_stress_test():
    """Run stress test with high agent density"""
    print('\n' + '='*80)
    print('CROWDLEAF STRESS TEST - HIGH-DENSITY EVACUATION SCENARIO')
    print('='*80)

    graph = create_constrained_terminal()
    num_agents = 400  # High density for small terminal

    print(f'\nScenario: Emergency evacuation')
    print(f'Terminal: Constrained layout with bottlenecks')
    print(f'Agents: {num_agents}')
    print(f'Duration: 30 seconds\n')

    print('⏳ Simulating WITHOUT CrowdLeaf...')
    sim_without = CrowdSimulator(graph, num_agents, use_crowdleaf=False, simulation_duration=30.0)
    metrics_without = sim_without.run()
    print('   ✓ Complete')

    print('⏳ Simulating WITH CrowdLeaf...')
    sim_with = CrowdSimulator(graph, num_agents, use_crowdleaf=True, simulation_duration=30.0)
    metrics_with = sim_with.run()
    print('   ✓ Complete\n')

    # Results
    print('='*80)
    print('STRESS TEST RESULTS')
    print('='*80)

    print('\n📊 WITHOUT CROWDLEAF (Standard Nearest-Exit Routing):')
    print(f'   Total Injuries:         {metrics_without.injuries[-1]}')
    print(f'   Total Deaths:           {metrics_without.deaths[-1]}')
    print(f'   Peak Density:           {max(metrics_without.avg_density):.2f} persons/m²')
    print(f'   Overcrowding Events:    {sum(metrics_without.overcrowding_events)}')
    print(f'   Agents Evacuated:       {metrics_without.agents_evacuated[-1]}/{num_agents} ({metrics_without.agents_evacuated[-1]/num_agents*100:.1f}%)')

    print('\n✅ WITH CROWDLEAF (Biomimetic Adaptive Routing):')
    print(f'   Total Injuries:         {metrics_with.injuries[-1]}')
    print(f'   Total Deaths:           {metrics_with.deaths[-1]}')
    print(f'   Peak Density:           {max(metrics_with.avg_density):.2f} persons/m²')
    print(f'   Overcrowding Events:    {sum(metrics_with.overcrowding_events)}')
    print(f'   Agents Evacuated:       {metrics_with.agents_evacuated[-1]}/{num_agents} ({metrics_with.agents_evacuated[-1]/num_agents*100:.1f}%)')

    # Calculate improvements
    injury_reduction = metrics_without.injuries[-1] - metrics_with.injuries[-1]
    death_reduction = metrics_without.deaths[-1] - metrics_with.deaths[-1]
    density_reduction = max(metrics_without.avg_density) - max(metrics_with.avg_density)
    overcrowd_reduction = sum(metrics_without.overcrowding_events) - sum(metrics_with.overcrowding_events)
    evac_improvement = metrics_with.agents_evacuated[-1] - metrics_without.agents_evacuated[-1]

    print('\n📈 CROWDLEAF IMPROVEMENTS:')
    if injury_reduction > 0:
        print(f'   ✓ Injury Reduction:     {injury_reduction} ({injury_reduction/max(metrics_without.injuries[-1],1)*100:.1f}% fewer)')
    if death_reduction > 0:
        print(f'   ✓ Death Reduction:      {death_reduction} ({death_reduction/max(metrics_without.deaths[-1],1)*100:.1f}% fewer)')
    if density_reduction > 0:
        print(f'   ✓ Density Reduction:    {density_reduction:.2f} p/m² lower peak')
    if overcrowd_reduction > 0:
        print(f'   ✓ Overcrowding:         {overcrowd_reduction} fewer events')
    if evac_improvement > 0:
        print(f'   ✓ Evacuation:           {evac_improvement} more people evacuated')

    if max(metrics_without.avg_density) < 4.0:
        print('\n⚠️  Note: Density levels were below critical thresholds.')
        print('   This scenario did not trigger severe overcrowding conditions.')

    # Create plots
    create_stress_test_plots(metrics_without, metrics_with)

    print('\n' + '='*80)


def create_stress_test_plots(metrics_without, metrics_with):
    """Create visualization plots"""
    fig, axes = plt.subplots(2, 3, figsize=(18, 10))
    fig.suptitle('CrowdLeaf Stress Test Results', fontsize=16, fontweight='bold')

    # Plot 1: Injuries
    ax = axes[0, 0]
    ax.plot(metrics_without.time_series, metrics_without.injuries, 'r-', linewidth=2.5,
            label='Without CrowdLeaf', marker='o', markersize=3, markevery=30)
    ax.plot(metrics_with.time_series, metrics_with.injuries, 'g-', linewidth=2.5,
            label='With CrowdLeaf', marker='s', markersize=3, markevery=30)
    ax.set_xlabel('Time (seconds)', fontweight='bold')
    ax.set_ylabel('Total Injuries', fontweight='bold')
    ax.set_title('Injuries Over Time', fontweight='bold', fontsize=14)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)

    # Plot 2: Deaths
    ax = axes[0, 1]
    ax.plot(metrics_without.time_series, metrics_without.deaths, 'r-', linewidth=2.5,
            label='Without CrowdLeaf', marker='o', markersize=3, markevery=30)
    ax.plot(metrics_with.time_series, metrics_with.deaths, 'g-', linewidth=2.5,
            label='With CrowdLeaf', marker='s', markersize=3, markevery=30)
    ax.set_xlabel('Time (seconds)', fontweight='bold')
    ax.set_ylabel('Total Deaths', fontweight='bold')
    ax.set_title('Deaths Over Time', fontweight='bold', fontsize=14)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)

    # Plot 3: Density
    ax = axes[0, 2]
    ax.plot(metrics_without.time_series, metrics_without.avg_density, 'r-', linewidth=2.5,
            label='Without CrowdLeaf')
    ax.plot(metrics_with.time_series, metrics_with.avg_density, 'g-', linewidth=2.5,
            label='With CrowdLeaf')
    ax.axhline(y=4.0, color='orange', linestyle='--', linewidth=2, label='Safe Threshold (4.0)', alpha=0.7)
    ax.axhline(y=6.0, color='darkred', linestyle='--', linewidth=2, label='Critical (6.0)', alpha=0.7)
    ax.axhline(y=8.0, color='black', linestyle='--', linewidth=2, label='Extreme (8.0)', alpha=0.7)
    ax.set_xlabel('Time (seconds)', fontweight='bold')
    ax.set_ylabel('Average Density (persons/m²)', fontweight='bold')
    ax.set_title('Crowd Density', fontweight='bold', fontsize=14)
    ax.legend(fontsize=9)
    ax.grid(True, alpha=0.3)

    # Plot 4: Overcrowding
    ax = axes[1, 0]
    ax.plot(metrics_without.time_series, metrics_without.overcrowding_events, 'r-',
            linewidth=2.5, label='Without CrowdLeaf')
    ax.plot(metrics_with.time_series, metrics_with.overcrowding_events, 'g-',
            linewidth=2.5, label='With CrowdLeaf')
    ax.set_xlabel('Time (seconds)', fontweight='bold')
    ax.set_ylabel('Overcrowding Events', fontweight='bold')
    ax.set_title('Overcrowding Events', fontweight='bold', fontsize=14)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)

    # Plot 5: Evacuated
    ax = axes[1, 1]
    ax.plot(metrics_without.time_series, metrics_without.agents_evacuated, 'r-',
            linewidth=2.5, label='Without CrowdLeaf')
    ax.plot(metrics_with.time_series, metrics_with.agents_evacuated, 'g-',
            linewidth=2.5, label='With CrowdLeaf')
    ax.set_xlabel('Time (seconds)', fontweight='bold')
    ax.set_ylabel('Agents Evacuated', fontweight='bold')
    ax.set_title('Evacuation Progress', fontweight='bold', fontsize=14)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)

    # Plot 6: Summary bars
    ax = axes[1, 2]
    categories = ['Injuries', 'Deaths', 'Peak\nDensity', 'Overcrowd\nEvents']
    without_vals = [
        metrics_without.injuries[-1],
        metrics_without.deaths[-1],
        max(metrics_without.avg_density),
        sum(metrics_without.overcrowding_events) / 10  # Scale down for visibility
    ]
    with_vals = [
        metrics_with.injuries[-1],
        metrics_with.deaths[-1],
        max(metrics_with.avg_density),
        sum(metrics_with.overcrowding_events) / 10
    ]

    x = range(len(categories))
    width = 0.35
    ax.bar([i - width/2 for i in x], without_vals, width, label='Without CrowdLeaf',
           color='red', alpha=0.7)
    ax.bar([i + width/2 for i in x], with_vals, width, label='With CrowdLeaf',
           color='green', alpha=0.7)
    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.set_ylabel('Count / Value', fontweight='bold')
    ax.set_title('Final Statistics', fontweight='bold', fontsize=14)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3, axis='y')

    plt.tight_layout()
    filename = 'stress_test_results.png'
    fig.savefig(filename, dpi=150, bbox_inches='tight')
    print(f'\n📊 Visualization saved: {filename}')


if __name__ == '__main__':
    run_stress_test()
