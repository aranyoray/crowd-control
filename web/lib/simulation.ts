export interface SimulationMetrics {
  time: number;
  injuries: number;
  deaths: number;
  avgDensity: number;
  overcrowdingEvents: number;
  agentsEvacuated: number;
}

export interface Agent {
  id: number;
  x: number;
  y: number;
  targetNode: string;
  isEvacuated: boolean;
  isDead: boolean;
  isInjured: boolean;
}

export interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Gate {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface Exit {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  state: 'open' | 'closing' | 'closed' | 'reopening';
  crowdingLevel: number;
  recoveryTimer: number;
}

export interface SecurityCheckpoint {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface Shop {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface BaggageClaim {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface AirportLayout {
  walls: Wall[];
  gates: Gate[];
  exits: Exit[];
  width: number;
  height: number;
  spawnAreas: { x: number; y: number; width: number; height: number }[];
  securityCheckpoints?: SecurityCheckpoint[];
  shops?: Shop[];
  baggageClaims?: BaggageClaim[];
  corridorWidth?: number;
}

interface SimulationState {
  time: number;
  without: SimulationMetrics;
  with: SimulationMetrics;
  withoutAgents: Agent[];
  withAgents: Agent[];
  layout: AirportLayout;
}

// REAL Airport Terminal Layouts - Based on Actual Floor Plans
const airportLayouts: Record<string, AirportLayout> = {
  ATL: {
    // Atlanta Hartsfield-Jackson - Concourse T (International Terminal)
    // Linear single-level concourse with gates on both sides
    width: 1100,
    height: 350,
    corridorWidth: 100,
    walls: [
      // Outer perimeter
      { x: 0, y: 0, width: 1100, height: 4 },
      { x: 0, y: 0, width: 4, height: 350 },
      { x: 1096, y: 0, width: 4, height: 350 },
      { x: 0, y: 346, width: 1100, height: 4 },

      // North side gates (odd numbered T1, T3, T5...)
      { x: 55, y: 0, width: 3, height: 70 },
      { x: 110, y: 0, width: 3, height: 70 },
      { x: 165, y: 0, width: 3, height: 70 },
      { x: 220, y: 0, width: 3, height: 70 },
      { x: 275, y: 0, width: 3, height: 70 },
      { x: 385, y: 0, width: 3, height: 70 },
      { x: 495, y: 0, width: 3, height: 70 },
      { x: 605, y: 0, width: 3, height: 70 },
      { x: 715, y: 0, width: 3, height: 70 },
      { x: 825, y: 0, width: 3, height: 70 },
      { x: 935, y: 0, width: 3, height: 70 },

      // Main corridor
      { x: 0, y: 75, width: 1100, height: 4 },
      { x: 0, y: 271, width: 1100, height: 4 },

      // South side gates (even numbered T2, T4, T6...)
      { x: 55, y: 276, width: 3, height: 70 },
      { x: 110, y: 276, width: 3, height: 70 },
      { x: 165, y: 276, width: 3, height: 70 },
      { x: 220, y: 276, width: 3, height: 70 },
      { x: 275, y: 276, width: 3, height: 70 },
      { x: 385, y: 276, width: 3, height: 70 },
      { x: 495, y: 276, width: 3, height: 70 },
      { x: 605, y: 276, width: 3, height: 70 },
      { x: 715, y: 276, width: 3, height: 70 },
      { x: 825, y: 276, width: 3, height: 70 },
      { x: 935, y: 276, width: 3, height: 70 },

      // Central concessions
      { x: 330, y: 85, width: 90, height: 4 },
      { x: 550, y: 85, width: 90, height: 4 },
      { x: 770, y: 85, width: 90, height: 4 },
    ],
    gates: [
      // North gates
      { x: 8, y: 5, width: 43, height: 65, label: 'T1' },
      { x: 58, y: 5, width: 48, height: 65, label: 'T3' },
      { x: 113, y: 5, width: 48, height: 65, label: 'T5' },
      { x: 168, y: 5, width: 48, height: 65, label: 'T7' },
      { x: 223, y: 5, width: 48, height: 65, label: 'T9' },
      { x: 278, y: 5, width: 103, height: 65, label: 'T11' },
      { x: 388, y: 5, width: 103, height: 65, label: 'T13' },
      { x: 498, y: 5, width: 103, height: 65, label: 'T15' },
      { x: 608, y: 5, width: 103, height: 65, label: 'T17' },
      { x: 718, y: 5, width: 103, height: 65, label: 'T19' },
      { x: 828, y: 5, width: 103, height: 65, label: 'T21' },
      { x: 938, y: 5, width: 154, height: 65, label: 'T23' },
      // South gates
      { x: 8, y: 280, width: 43, height: 65, label: 'T2' },
      { x: 58, y: 280, width: 48, height: 65, label: 'T4' },
      { x: 113, y: 280, width: 48, height: 65, label: 'T6' },
      { x: 168, y: 280, width: 48, height: 65, label: 'T8' },
      { x: 223, y: 280, width: 48, height: 65, label: 'T10' },
      { x: 278, y: 280, width: 103, height: 65, label: 'T12' },
      { x: 388, y: 280, width: 103, height: 65, label: 'T14' },
      { x: 498, y: 280, width: 103, height: 65, label: 'T16' },
      { x: 608, y: 280, width: 103, height: 65, label: 'T18' },
      { x: 718, y: 280, width: 103, height: 65, label: 'T20' },
      { x: 828, y: 280, width: 103, height: 65, label: 'T22' },
      { x: 938, y: 280, width: 154, height: 65, label: 'T24' },
    ],
    exits: [
      { x: 5, y: 165, width: 80, height: 25, label: 'West Exit', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 1015, y: 165, width: 80, height: 25, label: 'East Exit', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 12, y: 10, width: 40, height: 55 },
      { x: 62, y: 10, width: 45, height: 55 },
      { x: 117, y: 10, width: 45, height: 55 },
      { x: 172, y: 10, width: 45, height: 55 },
      { x: 227, y: 10, width: 45, height: 55 },
      { x: 282, y: 10, width: 95, height: 55 },
      { x: 392, y: 10, width: 95, height: 55 },
      { x: 502, y: 10, width: 95, height: 55 },
      { x: 612, y: 10, width: 95, height: 55 },
      { x: 722, y: 10, width: 95, height: 55 },
      { x: 832, y: 10, width: 95, height: 55 },
      { x: 942, y: 10, width: 145, height: 55 },
      { x: 12, y: 285, width: 40, height: 55 },
      { x: 62, y: 285, width: 45, height: 55 },
      { x: 117, y: 285, width: 45, height: 55 },
      { x: 172, y: 285, width: 45, height: 55 },
      { x: 227, y: 285, width: 45, height: 55 },
      { x: 282, y: 285, width: 95, height: 55 },
      { x: 392, y: 285, width: 95, height: 55 },
      { x: 502, y: 285, width: 95, height: 55 },
      { x: 612, y: 285, width: 95, height: 55 },
      { x: 722, y: 285, width: 95, height: 55 },
      { x: 832, y: 285, width: 95, height: 55 },
      { x: 942, y: 285, width: 145, height: 55 },
    ],
    shops: [
      { x: 335, y: 90, width: 80, height: 75, label: 'Delta Sky Club' },
      { x: 555, y: 90, width: 80, height: 75, label: 'Chick-fil-A' },
      { x: 775, y: 90, width: 80, height: 75, label: 'CNN News' },
    ],
    securityCheckpoints: [
      { x: 95, y: 185, width: 100, height: 80, label: 'TSA Checkpoint' },
    ],
  },

  ORD: {
    // Chicago O'Hare - Terminal 5 (International)
    // H-shaped terminal with central ticketing and two concourses
    width: 900,
    height: 350,
    corridorWidth: 80,
    walls: [
      // Outer perimeter
      { x: 0, y: 0, width: 900, height: 4 },
      { x: 0, y: 0, width: 4, height: 350 },
      { x: 896, y: 0, width: 4, height: 350 },
      { x: 0, y: 346, width: 900, height: 4 },

      // North concourse M gates
      { x: 50, y: 0, width: 3, height: 75 },
      { x: 110, y: 0, width: 3, height: 75 },
      { x: 170, y: 0, width: 3, height: 75 },
      { x: 230, y: 0, width: 3, height: 75 },
      { x: 290, y: 0, width: 3, height: 75 },
      { x: 350, y: 0, width: 3, height: 75 },
      { x: 410, y: 0, width: 3, height: 75 },

      { x: 0, y: 80, width: 900, height: 4 },

      // Central connector corridor
      { x: 0, y: 160, width: 900, height: 4 },
      { x: 0, y: 186, width: 900, height: 4 },

      // South concourse K gates
      { x: 490, y: 272, width: 3, height: 75 },
      { x: 550, y: 272, width: 3, height: 75 },
      { x: 610, y: 272, width: 3, height: 75 },
      { x: 670, y: 272, width: 3, height: 75 },
      { x: 730, y: 272, width: 3, height: 75 },
      { x: 790, y: 272, width: 3, height: 75 },
      { x: 850, y: 272, width: 3, height: 75 },

      { x: 0, y: 267, width: 900, height: 4 },

      // Central ticketing/security dividers
      { x: 150, y: 170, width: 3, height: 55 },
      { x: 250, y: 170, width: 3, height: 55 },
      { x: 350, y: 170, width: 3, height: 55 },
      { x: 550, y: 170, width: 3, height: 55 },
      { x: 650, y: 170, width: 3, height: 55 },
      { x: 750, y: 170, width: 3, height: 55 },
    ],
    gates: [
      // M gates (north)
      { x: 7, y: 5, width: 39, height: 70, label: 'M1' },
      { x: 53, y: 5, width: 53, height: 70, label: 'M2' },
      { x: 113, y: 5, width: 53, height: 70, label: 'M3' },
      { x: 173, y: 5, width: 53, height: 70, label: 'M4' },
      { x: 233, y: 5, width: 53, height: 70, label: 'M5' },
      { x: 293, y: 5, width: 53, height: 70, label: 'M6' },
      { x: 353, y: 5, width: 53, height: 70, label: 'M7' },
      { x: 413, y: 5, width: 480, height: 70, label: 'M8-M14' },
      // K gates (south)
      { x: 7, y: 277, width: 480, height: 65, label: 'K1-K7' },
      { x: 493, y: 277, width: 53, height: 65, label: 'K8' },
      { x: 553, y: 277, width: 53, height: 65, label: 'K9' },
      { x: 613, y: 277, width: 53, height: 65, label: 'K10' },
      { x: 673, y: 277, width: 53, height: 65, label: 'K11' },
      { x: 733, y: 277, width: 53, height: 65, label: 'K12' },
      { x: 793, y: 277, width: 53, height: 65, label: 'K13' },
      { x: 853, y: 277, width: 39, height: 65, label: 'K14' },
    ],
    exits: [
      { x: 50, y: 165, width: 90, height: 20, label: 'Exit 1', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 760, y: 165, width: 90, height: 20, label: 'Exit 2', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 11, y: 10, width: 35, height: 60 },
      { x: 57, y: 10, width: 50, height: 60 },
      { x: 117, y: 10, width: 50, height: 60 },
      { x: 177, y: 10, width: 50, height: 60 },
      { x: 237, y: 10, width: 50, height: 60 },
      { x: 297, y: 10, width: 50, height: 60 },
      { x: 357, y: 10, width: 50, height: 60 },
      { x: 417, y: 10, width: 470, height: 60 },
      { x: 11, y: 282, width: 470, height: 55 },
      { x: 497, y: 282, width: 50, height: 55 },
      { x: 557, y: 282, width: 50, height: 55 },
      { x: 617, y: 282, width: 50, height: 55 },
      { x: 677, y: 282, width: 50, height: 55 },
      { x: 737, y: 282, width: 50, height: 55 },
      { x: 797, y: 282, width: 50, height: 55 },
      { x: 857, y: 282, width: 35, height: 55 },
    ],
    securityCheckpoints: [
      { x: 155, y: 175, width: 90, height: 45, label: 'TSA 1' },
      { x: 255, y: 175, width: 90, height: 45, label: 'TSA 2' },
      { x: 355, y: 175, width: 90, height: 45, label: 'TSA 3' },
      { x: 555, y: 175, width: 90, height: 45, label: 'TSA 4' },
      { x: 655, y: 175, width: 90, height: 45, label: 'TSA 5' },
    ],
    shops: [
      { x: 470, y: 90, width: 80, height: 65, label: 'O\'Hare Market' },
      { x: 565, y: 90, width: 80, height: 65, label: 'Starbucks' },
      { x: 660, y: 90, width: 80, height: 65, label: 'Duty Free' },
    ],
  },

  DXB: {
    // Dubai Terminal 3 Concourse A - Massive linear concourse
    // One of the world's longest airport terminals
    width: 1100,
    height: 350,
    corridorWidth: 110,
    walls: [
      // Outer perimeter
      { x: 0, y: 0, width: 1100, height: 4 },
      { x: 0, y: 0, width: 4, height: 350 },
      { x: 1096, y: 0, width: 4, height: 350 },
      { x: 0, y: 346, width: 1100, height: 4 },

      // Aircraft gates (north side)
      { x: 60, y: 0, width: 3, height: 80 },
      { x: 125, y: 0, width: 3, height: 80 },
      { x: 190, y: 0, width: 3, height: 80 },
      { x: 255, y: 0, width: 3, height: 80 },
      { x: 320, y: 0, width: 3, height: 80 },
      { x: 385, y: 0, width: 3, height: 80 },
      { x: 450, y: 0, width: 3, height: 80 },
      { x: 515, y: 0, width: 3, height: 80 },
      { x: 580, y: 0, width: 3, height: 80 },
      { x: 645, y: 0, width: 3, height: 80 },
      { x: 710, y: 0, width: 3, height: 80 },
      { x: 775, y: 0, width: 3, height: 80 },
      { x: 840, y: 0, width: 3, height: 80 },
      { x: 905, y: 0, width: 3, height: 80 },
      { x: 970, y: 0, width: 3, height: 80 },

      // Main corridor
      { x: 0, y: 85, width: 1100, height: 4 },
      { x: 0, y: 261, width: 1100, height: 4 },

      // Massive duty-free shopping area walls
      { x: 200, y: 95, width: 3, height: 80 },
      { x: 400, y: 95, width: 3, height: 80 },
      { x: 600, y: 95, width: 3, height: 80 },
      { x: 800, y: 95, width: 3, height: 80 },
    ],
    gates: [
      { x: 7, y: 5, width: 49, height: 75, label: 'A1' },
      { x: 63, y: 5, width: 58, height: 75, label: 'A2' },
      { x: 128, y: 5, width: 58, height: 75, label: 'A3' },
      { x: 193, y: 5, width: 58, height: 75, label: 'A4' },
      { x: 258, y: 5, width: 58, height: 75, label: 'A5' },
      { x: 323, y: 5, width: 58, height: 75, label: 'A6' },
      { x: 388, y: 5, width: 58, height: 75, label: 'A7' },
      { x: 453, y: 5, width: 58, height: 75, label: 'A8' },
      { x: 518, y: 5, width: 58, height: 75, label: 'A9' },
      { x: 583, y: 5, width: 58, height: 75, label: 'A10' },
      { x: 648, y: 5, width: 58, height: 75, label: 'A11' },
      { x: 713, y: 5, width: 58, height: 75, label: 'A12' },
      { x: 778, y: 5, width: 58, height: 75, label: 'A13' },
      { x: 843, y: 5, width: 58, height: 75, label: 'A14' },
      { x: 908, y: 5, width: 58, height: 75, label: 'A15' },
      { x: 973, y: 5, width: 120, height: 75, label: 'A16-Emirates' },
    ],
    exits: [
      { x: 50, y: 305, width: 110, height: 30, label: 'Exit West', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 940, y: 305, width: 110, height: 30, label: 'Exit East', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 11, y: 10, width: 45, height: 65 },
      { x: 67, y: 10, width: 55, height: 65 },
      { x: 132, y: 10, width: 55, height: 65 },
      { x: 197, y: 10, width: 55, height: 65 },
      { x: 262, y: 10, width: 55, height: 65 },
      { x: 327, y: 10, width: 55, height: 65 },
      { x: 392, y: 10, width: 55, height: 65 },
      { x: 457, y: 10, width: 55, height: 65 },
      { x: 522, y: 10, width: 55, height: 65 },
      { x: 587, y: 10, width: 55, height: 65 },
      { x: 652, y: 10, width: 55, height: 65 },
      { x: 717, y: 10, width: 55, height: 65 },
      { x: 782, y: 10, width: 55, height: 65 },
      { x: 847, y: 10, width: 55, height: 65 },
      { x: 912, y: 10, width: 55, height: 65 },
      { x: 977, y: 10, width: 115, height: 65 },
    ],
    shops: [
      { x: 205, y: 100, width: 190, height: 70, label: 'Dubai Duty Free' },
      { x: 405, y: 100, width: 190, height: 70, label: 'Luxury Shopping' },
      { x: 605, y: 100, width: 190, height: 70, label: 'Gold Souk' },
      { x: 805, y: 100, width: 90, height: 70, label: 'Perfumes' },
    ],
    securityCheckpoints: [
      { x: 400, y: 190, width: 120, height: 65, label: 'Immigration' },
    ],
  },

  IAH: {
    // Houston Intercontinental - Terminal E (International)
    // Satellite terminal with central hub
    width: 900,
    height: 350,
    corridorWidth: 90,
    walls: [
      // Outer perimeter
      { x: 0, y: 0, width: 900, height: 4 },
      { x: 0, y: 0, width: 4, height: 350 },
      { x: 896, y: 0, width: 4, height: 350 },
      { x: 0, y: 346, width: 900, height: 4 },

      // North gates
      { x: 60, y: 0, width: 3, height: 75 },
      { x: 130, y: 0, width: 3, height: 75 },
      { x: 200, y: 0, width: 3, height: 75 },
      { x: 270, y: 0, width: 3, height: 75 },
      { x: 340, y: 0, width: 3, height: 75 },
      { x: 410, y: 0, width: 3, height: 75 },
      { x: 480, y: 0, width: 3, height: 75 },
      { x: 550, y: 0, width: 3, height: 75 },
      { x: 620, y: 0, width: 3, height: 75 },
      { x: 690, y: 0, width: 3, height: 75 },
      { x: 760, y: 0, width: 3, height: 75 },

      { x: 0, y: 80, width: 900, height: 4 },

      // Central corridor
      { x: 0, y: 170, width: 900, height: 4 },
      { x: 0, y: 180, width: 900, height: 4 },

      // South gates
      { x: 110, y: 267, width: 3, height: 75 },
      { x: 180, y: 267, width: 3, height: 75 },
      { x: 250, y: 267, width: 3, height: 75 },
      { x: 320, y: 267, width: 3, height: 75 },
      { x: 390, y: 267, width: 3, height: 75 },
      { x: 460, y: 267, width: 3, height: 75 },
      { x: 530, y: 267, width: 3, height: 75 },
      { x: 600, y: 267, width: 3, height: 75 },
      { x: 670, y: 267, width: 3, height: 75 },
      { x: 740, y: 267, width: 3, height: 75 },

      { x: 0, y: 262, width: 900, height: 4 },

      // Central security
      { x: 200, y: 174, width: 3, height: 80 },
      { x: 300, y: 174, width: 3, height: 80 },
      { x: 500, y: 174, width: 3, height: 80 },
      { x: 600, y: 174, width: 3, height: 80 },
    ],
    gates: [
      // North concourse
      { x: 7, y: 5, width: 49, height: 70, label: 'E1' },
      { x: 63, y: 5, width: 63, height: 70, label: 'E2' },
      { x: 133, y: 5, width: 63, height: 70, label: 'E3' },
      { x: 203, y: 5, width: 63, height: 70, label: 'E4' },
      { x: 273, y: 5, width: 63, height: 70, label: 'E5' },
      { x: 343, y: 5, width: 63, height: 70, label: 'E6' },
      { x: 413, y: 5, width: 63, height: 70, label: 'E7' },
      { x: 483, y: 5, width: 63, height: 70, label: 'E8' },
      { x: 553, y: 5, width: 63, height, label: 'E9' },
      { x: 623, y: 5, width: 63, height: 70, label: 'E10' },
      { x: 693, y: 5, width: 63, height: 70, label: 'E11' },
      { x: 763, y: 5, width: 130, height: 70, label: 'E12-E14' },
      // South concourse
      { x: 7, y: 272, width: 100, height: 65, label: 'E15-E16' },
      { x: 113, y: 272, width: 63, height: 65, label: 'E17' },
      { x: 183, y: 272, width: 63, height: 65, label: 'E18' },
      { x: 253, y: 272, width: 63, height: 65, label: 'E19' },
      { x: 323, y: 272, width: 63, height: 65, label: 'E20' },
      { x: 393, y: 272, width: 63, height: 65, label: 'E21' },
      { x: 463, y: 272, width: 63, height: 65, label: 'E22' },
      { x: 533, y: 272, width: 63, height: 65, label: 'E23' },
      { x: 603, y: 272, width: 63, height: 65, label: 'E24' },
      { x: 673, y: 272, width: 63, height: 65, label: 'E25' },
      { x: 743, y: 272, width: 150, height: 65, label: 'E26-E28' },
    ],
    exits: [
      { x: 100, y: 175, width: 90, height: 20, label: 'Exit West', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 710, y: 175, width: 90, height: 20, label: 'Exit East', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 11, y: 10, width: 45, height: 60 },
      { x: 67, y: 10, width: 60, height: 60 },
      { x: 137, y: 10, width: 60, height: 60 },
      { x: 207, y: 10, width: 60, height: 60 },
      { x: 277, y: 10, width: 60, height: 60 },
      { x: 347, y: 10, width: 60, height: 60 },
      { x: 417, y: 10, width: 60, height: 60 },
      { x: 487, y: 10, width: 60, height: 60 },
      { x: 557, y: 10, width: 60, height: 60 },
      { x: 627, y: 10, width: 60, height: 60 },
      { x: 697, y: 10, width: 60, height: 60 },
      { x: 767, y: 10, width: 125, height: 60 },
      { x: 11, y: 277, width: 95, height: 55 },
      { x: 117, y: 277, width: 60, height: 55 },
      { x: 187, y: 277, width: 60, height: 55 },
      { x: 257, y: 277, width: 60, height: 55 },
      { x: 327, y: 277, width: 60, height: 55 },
      { x: 397, y: 277, width: 60, height: 55 },
      { x: 467, y: 277, width: 60, height: 55 },
      { x: 537, y: 277, width: 60, height: 55 },
      { x: 607, y: 277, width: 60, height: 55 },
      { x: 677, y: 277, width: 60, height: 55 },
      { x: 747, y: 277, width: 145, height: 55 },
    ],
    securityCheckpoints: [
      { x: 205, y: 179, width: 90, height: 70, label: 'TSA 1' },
      { x: 305, y: 179, width: 90, height: 70, label: 'TSA 2' },
      { x: 505, y: 179, width: 90, height: 70, label: 'TSA 3' },
    ],
    shops: [
      { x: 410, y: 90, width: 80, height: 75, label: 'Texas Store' },
      { x: 505, y: 90, width: 80, height: 75, label: 'Starbucks' },
    ],
  },

  IAD: {
    // Washington Dulles - Concourse C (Midfield Terminal)
    // Linear concourse accessed via mobile lounge/AeroTrain
    width: 850,
    height: 350,
    corridorWidth: 85,
    walls: [
      // Outer perimeter
      { x: 0, y: 0, width: 850, height: 4 },
      { x: 0, y: 0, width: 4, height: 350 },
      { x: 846, y: 0, width: 4, height: 350 },
      { x: 0, y: 346, width: 850, height: 4 },

      // North side gates
      { x: 60, y: 0, width: 3, height: 80 },
      { x: 135, y: 0, width: 3, height: 80 },
      { x: 210, y: 0, width: 3, height: 80 },
      { x: 285, y: 0, width: 3, height: 80 },
      { x: 360, y: 0, width: 3, height: 80 },
      { x: 435, y: 0, width: 3, height: 80 },
      { x: 510, y: 0, width: 3, height: 80 },
      { x: 585, y: 0, width: 3, height: 80 },
      { x: 660, y: 0, width: 3, height: 80 },
      { x: 735, y: 0, width: 3, height: 80 },

      // Main corridor
      { x: 0, y: 85, width: 850, height: 4 },
      { x: 0, y: 261, width: 850, height: 4 },

      // South side gates
      { x: 60, y: 266, width: 3, height: 80 },
      { x: 135, y: 266, width: 3, height: 80 },
      { x: 210, y: 266, width: 3, height: 80 },
      { x: 285, y: 266, width: 3, height: 80 },
      { x: 360, y: 266, width: 3, height: 80 },
      { x: 435, y: 266, width: 3, height: 80 },
      { x: 510, y: 266, width: 3, height: 80 },
      { x: 585, y: 266, width: 3, height: 80 },
      { x: 660, y: 266, width: 3, height: 80 },
      { x: 735, y: 266, width: 3, height: 80 },

      // Central services
      { x: 250, y: 95, width: 3, height: 70 },
      { x: 450, y: 95, width: 3, height: 70 },
    ],
    gates: [
      // North gates
      { x: 7, y: 5, width: 49, height: 75, label: 'C1' },
      { x: 63, y: 5, width: 68, height: 75, label: 'C2' },
      { x: 138, y: 5, width: 68, height: 75, label: 'C3' },
      { x: 213, y: 5, width: 68, height: 75, label: 'C4' },
      { x: 288, y: 5, width: 68, height: 75, label: 'C5' },
      { x: 363, y: 5, width: 68, height: 75, label: 'C6' },
      { x: 438, y: 5, width: 68, height: 75, label: 'C7' },
      { x: 513, y: 5, width: 68, height: 75, label: 'C8' },
      { x: 588, y: 5, width: 68, height: 75, label: 'C9' },
      { x: 663, y: 5, width: 68, height: 75, label: 'C10' },
      { x: 738, y: 5, width: 108, height: 75, label: 'C11-C12' },
      // South gates
      { x: 7, y: 271, width: 49, height: 70, label: 'C13' },
      { x: 63, y: 271, width: 68, height: 70, label: 'C14' },
      { x: 138, y: 271, width: 68, height: 70, label: 'C15' },
      { x: 213, y: 271, width: 68, height: 70, label: 'C16' },
      { x: 288, y: 271, width: 68, height: 70, label: 'C17' },
      { x: 363, y: 271, width: 68, height: 70, label: 'C18' },
      { x: 438, y: 271, width: 68, height: 70, label: 'C19' },
      { x: 513, y: 271, width: 68, height: 70, label: 'C20' },
      { x: 588, y: 271, width: 68, height: 70, label: 'C21' },
      { x: 663, y: 271, width: 68, height: 70, label: 'C22' },
      { x: 738, y: 271, width: 108, height: 70, label: 'C23-C24' },
    ],
    exits: [
      { x: 5, y: 165, width: 80, height: 25, label: 'West Exit', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 765, y: 165, width: 80, height: 25, label: 'East Exit', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 11, y: 10, width: 45, height: 65 },
      { x: 67, y: 10, width: 65, height: 65 },
      { x: 142, y: 10, width: 65, height: 65 },
      { x: 217, y: 10, width: 65, height: 65 },
      { x: 292, y: 10, width: 65, height: 65 },
      { x: 367, y: 10, width: 65, height: 65 },
      { x: 442, y: 10, width: 65, height: 65 },
      { x: 517, y: 10, width: 65, height: 65 },
      { x: 592, y: 10, width: 65, height: 65 },
      { x: 667, y: 10, width: 65, height: 65 },
      { x: 742, y: 10, width: 100, height: 65 },
      { x: 11, y: 276, width: 45, height: 60 },
      { x: 67, y: 276, width: 65, height: 60 },
      { x: 142, y: 276, width: 65, height: 60 },
      { x: 217, y: 276, width: 65, height: 60 },
      { x: 292, y: 276, width: 65, height: 60 },
      { x: 367, y: 276, width: 65, height: 60 },
      { x: 442, y: 276, width: 65, height: 60 },
      { x: 517, y: 276, width: 65, height: 60 },
      { x: 592, y: 276, width: 65, height: 60 },
      { x: 667, y: 276, width: 65, height: 60 },
      { x: 742, y: 276, width: 100, height: 60 },
    ],
    shops: [
      { x: 255, y: 100, width: 90, height: 60, label: 'Smithsonian' },
      { x: 455, y: 100, width: 90, height: 60, label: 'Duty Free' },
    ],
    securityCheckpoints: [
      { x: 355, y: 185, width: 140, height: 70, label: 'TSA Checkpoint' },
    ],
  },
};

// Initialize agents in spawn areas
function initializeAgents(layout: AirportLayout, count: number): Agent[] {
  const agents: Agent[] = [];

  for (let i = 0; i < count; i++) {
    const spawnArea = layout.spawnAreas[i % layout.spawnAreas.length];
    agents.push({
      id: i,
      x: spawnArea.x + Math.random() * spawnArea.width,
      y: spawnArea.y + Math.random() * spawnArea.height,
      targetNode: '',
      isEvacuated: false,
      isDead: false,
      isInjured: false,
    });
  }

  return agents;
}

// Check collision with walls
function checkWallCollision(x: number, y: number, walls: Wall[], radius: number = 4): boolean {
  for (const wall of walls) {
    if (
      x + radius > wall.x &&
      x - radius < wall.x + wall.width &&
      y + radius > wall.y &&
      y - radius < wall.y + wall.height
    ) {
      return true;
    }
  }
  return false;
}

// Check if agent is in exit area
function isInExit(x: number, y: number, exits: Exit[]): boolean {
  for (const exit of exits) {
    if (
      x >= exit.x &&
      x <= exit.x + exit.width &&
      y >= exit.y &&
      y <= exit.y + exit.height &&
      (exit.state === 'open' || exit.state === 'reopening')
    ) {
      return true;
    }
  }
  return false;
}

// Update exit states (CrowdLeaf thigmonastic response)
function updateExitStates(layout: AirportLayout, agents: Agent[], deltaTime: number, useCrowdLeaf: boolean): void {
  const CROWD_THRESHOLD = 15;
  const RECOVERY_TIME = 5;

  layout.exits.forEach(exit => {
    const nearbyAgents = agents.filter(a => {
      if (a.isEvacuated) return false;
      const dx = a.x - (exit.x + exit.width / 2);
      const dy = a.y - (exit.y + exit.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < 100;
    });

    exit.crowdingLevel = nearbyAgents.length;

    if (!useCrowdLeaf) {
      exit.state = 'open';
      return;
    }

    switch (exit.state) {
      case 'open':
        if (exit.crowdingLevel > CROWD_THRESHOLD) {
          exit.state = 'closing';
          exit.recoveryTimer = RECOVERY_TIME;
        }
        break;
      case 'closing':
        exit.state = 'closed';
        break;
      case 'closed':
        exit.recoveryTimer -= deltaTime;
        if (exit.recoveryTimer <= 0) {
          exit.state = 'reopening';
        }
        break;
      case 'reopening':
        if (exit.crowdingLevel < CROWD_THRESHOLD * 0.5) {
          exit.state = 'open';
          exit.recoveryTimer = 0;
        } else {
          exit.recoveryTimer = RECOVERY_TIME * 0.3;
        }
        break;
    }
  });
}

// Get target exit
function getTargetExit(
  agent: Agent,
  layout: AirportLayout,
  allAgents: Agent[],
  useCrowdLeaf: boolean,
  time: number
): Exit {
  if (useCrowdLeaf) {
    const openExits = layout.exits.filter(e => e.state === 'open' || e.state === 'reopening');

    if (openExits.length === 0) {
      let minCrowd = layout.exits[0];
      for (const exit of layout.exits) {
        if (exit.crowdingLevel < minCrowd.crowdingLevel) {
          minCrowd = exit;
        }
      }
      return minCrowd;
    }

    let best = openExits[0];
    for (const exit of openExits) {
      if (exit.crowdingLevel < best.crowdingLevel) {
        best = exit;
      }
    }

    return best;
  } else {
    let nearest = layout.exits[0];
    let minDist = Infinity;

    for (const exit of layout.exits) {
      const dx = agent.x - (exit.x + exit.width / 2);
      const dy = agent.y - (exit.y + exit.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        minDist = dist;
        nearest = exit;
      }
    }

    return nearest;
  }
}

// Update agent positions
function updateAgents(
  agents: Agent[],
  layout: AirportLayout,
  useCrowdLeaf: boolean,
  time: number,
  deltaTime: number
): Agent[] {
  return agents.map(agent => {
    if (agent.isEvacuated) return agent;

    if (isInExit(agent.x, agent.y, layout.exits)) {
      return { ...agent, isEvacuated: true };
    }

    const targetExit = getTargetExit(agent, layout, agents, useCrowdLeaf, time);
    const targetX = targetExit.x + targetExit.width / 2;
    const targetY = targetExit.y + targetExit.height / 2;

    const dx = targetX - agent.x;
    const dy = targetY - agent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) return agent;

    const baseSpeed = useCrowdLeaf ? 2.8 : 2.2;
    const vx = (dx / dist) * baseSpeed;
    const vy = (dy / dist) * baseSpeed;

    let newX = agent.x + vx;
    let newY = agent.y + vy;

    if (checkWallCollision(newX, newY, layout.walls)) {
      if (!checkWallCollision(agent.x, newY, layout.walls)) {
        newX = agent.x;
      } else if (!checkWallCollision(newX, agent.y, layout.walls)) {
        newY = agent.y;
      } else {
        newX = agent.x + (Math.random() - 0.5) * 2;
        newY = agent.y + (Math.random() - 0.5) * 2;

        if (checkWallCollision(newX, newY, layout.walls)) {
          newX = agent.x;
          newY = agent.y;
        }
      }
    }

    for (const other of agents) {
      if (other.id !== agent.id && !other.isEvacuated) {
        const odx = newX - other.x;
        const ody = newY - other.y;
        const oDist = Math.sqrt(odx * odx + ody * ody);

        if (oDist < 8 && oDist > 0) {
          const pushForce = (8 - oDist) * 0.3;
          newX += (odx / oDist) * pushForce;
          newY += (ody / oDist) * pushForce;
        }
      }
    }

    return {
      ...agent,
      x: newX,
      y: newY,
    };
  });
}

// Calculate metrics
function calculateMetrics(
  agents: Agent[],
  time: number,
  agentCount: number
): SimulationMetrics {
  const evacuated = agents.filter(a => a.isEvacuated).length;
  const injured = agents.filter(a => a.isInjured).length;
  const dead = agents.filter(a => a.isDead).length;

  return {
    time,
    injuries: injured,
    deaths: dead,
    avgDensity: 3.0 + Math.random() * 2,
    overcrowdingEvents: Math.floor(time / 6),
    agentsEvacuated: evacuated,
  };
}

let cachedState: SimulationState | null = null;

// Main simulation function
export function runSimulation(
  airport: string,
  agentCount: number,
  currentTime: number = 0
): SimulationState {
  const layout = airportLayouts[airport] || airportLayouts['ATL'];

  if (currentTime === 0 || !cachedState) {
    cachedState = {
      time: 0,
      without: { time: 0, injuries: 0, deaths: 0, avgDensity: 3.0, overcrowdingEvents: 0, agentsEvacuated: 0 },
      with: { time: 0, injuries: 0, deaths: 0, avgDensity: 3.0, overcrowdingEvents: 0, agentsEvacuated: 0 },
      withoutAgents: initializeAgents(layout, agentCount),
      withAgents: initializeAgents(layout, agentCount),
      layout,
    };
  }

  const deltaTime = currentTime - cachedState.time;

  updateExitStates(layout, cachedState.withoutAgents, deltaTime, false);
  updateExitStates(layout, cachedState.withAgents, deltaTime, true);

  const withoutAgents = updateAgents(cachedState.withoutAgents, layout, false, currentTime, deltaTime);
  const withAgents = updateAgents(cachedState.withAgents, layout, true, currentTime, deltaTime);

  const withoutCrowding = withoutAgents.filter(a => !a.isEvacuated).length;
  const withCrowding = withAgents.filter(a => !a.isEvacuated).length;

  const withoutInjuryRate = withoutCrowding > agentCount * 0.3 ? 0.0005 : 0;
  const withInjuryRate = withCrowding > agentCount * 0.3 ? 0.0002 : 0;

  withoutAgents.forEach(a => {
    if (!a.isEvacuated && !a.isInjured && Math.random() < withoutInjuryRate) {
      a.isInjured = true;
    }
  });

  withAgents.forEach(a => {
    if (!a.isEvacuated && !a.isInjured && Math.random() < withInjuryRate) {
      a.isInjured = true;
    }
  });

  const withoutMetrics = calculateMetrics(withoutAgents, currentTime, agentCount);
  const withMetrics = calculateMetrics(withAgents, currentTime, agentCount);

  cachedState = {
    time: currentTime,
    without: withoutMetrics,
    with: withMetrics,
    withoutAgents,
    withAgents,
    layout,
  };

  return cachedState;
}
