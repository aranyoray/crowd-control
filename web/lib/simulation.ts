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
  state: 'open' | 'closing' | 'closed' | 'reopening'; // Mimosa leaf states
  crowdingLevel: number; // Stimulus intensity
  recoveryTimer: number; // Time until can reopen
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

// Airport floor plans with walls, corridors, gates, and exits
// Based on actual terminal layouts from major international airports
const airportLayouts: Record<string, AirportLayout> = {
  DFW: {
    // Dallas/Fort Worth Terminal D - International flights terminal
    width: 900,
    height: 700,
    corridorWidth: 120,
    walls: [
      // Outer perimeter
      { x: 10, y: 10, width: 880, height: 8 },
      { x: 10, y: 10, width: 8, height: 680 },
      { x: 882, y: 10, width: 8, height: 680 },
      { x: 10, y: 682, width: 880, height: 8 },

      // Concourse D gate dividers - upper row (15 gates)
      { x: 80, y: 10, width: 6, height: 95 },
      { x: 140, y: 10, width: 6, height: 95 },
      { x: 200, y: 10, width: 6, height: 95 },
      { x: 260, y: 10, width: 6, height: 95 },
      { x: 320, y: 10, width: 6, height: 95 },
      { x: 380, y: 10, width: 6, height: 95 },
      { x: 440, y: 10, width: 6, height: 95 },
      { x: 500, y: 10, width: 6, height: 95 },
      { x: 560, y: 10, width: 6, height: 95 },
      { x: 620, y: 10, width: 6, height: 95 },
      { x: 680, y: 10, width: 6, height: 95 },
      { x: 740, y: 10, width: 6, height: 95 },
      { x: 800, y: 10, width: 6, height: 95 },

      // Main corridor upper wall
      { x: 10, y: 130, width: 880, height: 8 },

      // Retail and dining area walls
      { x: 100, y: 150, width: 80, height: 6 },
      { x: 220, y: 150, width: 6, height: 50 },
      { x: 300, y: 150, width: 90, height: 6 },
      { x: 430, y: 150, width: 6, height: 50 },
      { x: 500, y: 150, width: 100, height: 6 },
      { x: 650, y: 150, width: 6, height: 50 },

      // Central main corridor
      { x: 10, y: 280, width: 880, height: 10 },
      { x: 10, y: 410, width: 880, height: 10 },

      // Security checkpoint lanes
      { x: 150, y: 450, width: 8, height: 90 },
      { x: 220, y: 450, width: 8, height: 90 },
      { x: 290, y: 450, width: 8, height: 90 },
      { x: 450, y: 450, width: 8, height: 90 },
      { x: 520, y: 450, width: 8, height: 90 },
      { x: 590, y: 450, width: 8, height: 90 },
      { x: 730, y: 450, width: 8, height: 90 },

      // Baggage claim dividers
      { x: 100, y: 580, width: 6, height: 70 },
      { x: 250, y: 580, width: 6, height: 70 },
      { x: 400, y: 580, width: 6, height: 70 },
      { x: 550, y: 580, width: 6, height: 70 },
      { x: 700, y: 580, width: 6, height: 70 },
    ],
    gates: [
      // Upper concourse gates (international flights)
      { x: 20, y: 18, width: 55, height: 85, label: 'D1' },
      { x: 86, y: 18, width: 50, height: 85, label: 'D2' },
      { x: 146, y: 18, width: 50, height: 85, label: 'D3' },
      { x: 206, y: 18, width: 50, height: 85, label: 'D4' },
      { x: 266, y: 18, width: 50, height: 85, label: 'D5' },
      { x: 326, y: 18, width: 50, height: 85, label: 'D6' },
      { x: 386, y: 18, width: 50, height: 85, label: 'D7' },
      { x: 446, y: 18, width: 50, height: 85, label: 'D8' },
      { x: 506, y: 18, width: 50, height: 85, label: 'D9' },
      { x: 566, y: 18, width: 50, height: 85, label: 'D10' },
      { x: 626, y: 18, width: 50, height: 85, label: 'D11' },
      { x: 686, y: 18, width: 50, height: 85, label: 'D12' },
      { x: 746, y: 18, width: 50, height: 85, label: 'D13' },
      { x: 806, y: 18, width: 70, height: 85, label: 'D14' },
    ],
    exits: [
      { x: 50, y: 650, width: 140, height: 30, label: 'Exit 1A', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 220, y: 650, width: 140, height: 30, label: 'Exit 1B', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 390, y: 650, width: 140, height: 30, label: 'Exit 2A', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 560, y: 650, width: 140, height: 30, label: 'Exit 2B', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 730, y: 650, width: 140, height: 30, label: 'Exit 3', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 25, y: 25, width: 50, height: 70 },
      { x: 90, y: 25, width: 45, height: 70 },
      { x: 150, y: 25, width: 45, height: 70 },
      { x: 210, y: 25, width: 45, height: 70 },
      { x: 270, y: 25, width: 45, height: 70 },
      { x: 330, y: 25, width: 45, height: 70 },
      { x: 390, y: 25, width: 45, height: 70 },
      { x: 450, y: 25, width: 45, height: 70 },
      { x: 510, y: 25, width: 45, height: 70 },
      { x: 570, y: 25, width: 45, height: 70 },
      { x: 630, y: 25, width: 45, height: 70 },
      { x: 690, y: 25, width: 45, height: 70 },
      { x: 750, y: 25, width: 45, height: 70 },
      { x: 810, y: 25, width: 60, height: 70 },
    ],
    securityCheckpoints: [
      { x: 160, y: 455, width: 50, height: 80, label: 'TSA 1' },
      { x: 230, y: 455, width: 50, height: 80, label: 'TSA 2' },
      { x: 300, y: 455, width: 50, height: 80, label: 'TSA 3' },
      { x: 460, y: 455, width: 50, height: 80, label: 'TSA 4' },
      { x: 530, y: 455, width: 50, height: 80, label: 'TSA 5' },
      { x: 600, y: 455, width: 50, height: 80, label: 'TSA 6' },
    ],
    shops: [
      { x: 110, y: 160, width: 100, height: 40, label: 'Duty Free' },
      { x: 310, y: 160, width: 110, height: 40, label: 'Starbucks' },
      { x: 510, y: 160, width: 130, height: 40, label: 'Hudson News' },
    ],
    baggageClaims: [
      { x: 110, y: 585, width: 130, height: 60, label: 'Baggage 1' },
      { x: 260, y: 585, width: 130, height: 60, label: 'Baggage 2' },
      { x: 410, y: 585, width: 130, height: 60, label: 'Baggage 3' },
      { x: 560, y: 585, width: 130, height: 60, label: 'Baggage 4' },
    ],
  },
  ATL: {
    // Atlanta Hartsfield-Jackson - World's busiest airport, Concourse T (International)
    width: 950,
    height: 750,
    corridorWidth: 140,
    walls: [
      // Outer perimeter
      { x: 10, y: 10, width: 930, height: 8 },
      { x: 10, y: 10, width: 8, height: 730 },
      { x: 932, y: 10, width: 8, height: 730 },
      { x: 10, y: 732, width: 930, height: 8 },

      // Concourse T gates - dual rows (T1-T20)
      // Upper row gates
      { x: 60, y: 10, width: 6, height: 100 },
      { x: 120, y: 10, width: 6, height: 100 },
      { x: 180, y: 10, width: 6, height: 100 },
      { x: 240, y: 10, width: 6, height: 100 },
      { x: 300, y: 10, width: 6, height: 100 },
      { x: 360, y: 10, width: 6, height: 100 },
      { x: 420, y: 10, width: 6, height: 100 },
      { x: 480, y: 10, width: 6, height: 100 },
      { x: 540, y: 10, width: 6, height: 100 },
      { x: 600, y: 10, width: 6, height: 100 },

      // Lower row gates
      { x: 60, y: 140, width: 6, height: 100 },
      { x: 120, y: 140, width: 6, height: 100 },
      { x: 180, y: 140, width: 6, height: 100 },
      { x: 240, y: 140, width: 6, height: 100 },
      { x: 300, y: 140, width: 6, height: 100 },
      { x: 360, y: 140, width: 6, height: 100 },
      { x: 420, y: 140, width: 6, height: 100 },
      { x: 480, y: 140, width: 6, height: 100 },
      { x: 540, y: 140, width: 6, height: 100 },
      { x: 600, y: 140, width: 6, height: 100 },

      // Central corridor boundaries
      { x: 10, y: 260, width: 930, height: 10 },

      // Retail plaza walls
      { x: 100, y: 290, width: 120, height: 8 },
      { x: 280, y: 290, width: 6, height: 70 },
      { x: 350, y: 290, width: 140, height: 8 },
      { x: 550, y: 290, width: 6, height: 70 },
      { x: 620, y: 290, width: 120, height: 8 },
      { x: 800, y: 290, width: 6, height: 70 },

      // Main circulation corridor
      { x: 10, y: 450, width: 930, height: 12 },

      // TSA checkpoint dividers (high capacity)
      { x: 100, y: 490, width: 8, height: 100 },
      { x: 160, y: 490, width: 8, height: 100 },
      { x: 220, y: 490, width: 8, height: 100 },
      { x: 280, y: 490, width: 8, height: 100 },
      { x: 400, y: 490, width: 8, height: 100 },
      { x: 460, y: 490, width: 8, height: 100 },
      { x: 520, y: 490, width: 8, height: 100 },
      { x: 640, y: 490, width: 8, height: 100 },
      { x: 700, y: 490, width: 8, height: 100 },
      { x: 760, y: 490, width: 8, height: 100 },

      // Baggage claim area
      { x: 10, y: 620, width: 930, height: 8 },
      { x: 150, y: 635, width: 6, height: 85 },
      { x: 350, y: 635, width: 6, height: 85 },
      { x: 550, y: 635, width: 6, height: 85 },
      { x: 750, y: 635, width: 6, height: 85 },
    ],
    gates: [
      // Upper concourse
      { x: 18, y: 18, width: 38, height: 85, label: 'T1' },
      { x: 66, y: 18, width: 50, height: 85, label: 'T2' },
      { x: 126, y: 18, width: 50, height: 85, label: 'T3' },
      { x: 186, y: 18, width: 50, height: 85, label: 'T4' },
      { x: 246, y: 18, width: 50, height: 85, label: 'T5' },
      { x: 306, y: 18, width: 50, height: 85, label: 'T6' },
      { x: 366, y: 18, width: 50, height: 85, label: 'T7' },
      { x: 426, y: 18, width: 50, height: 85, label: 'T8' },
      { x: 486, y: 18, width: 50, height: 85, label: 'T9' },
      { x: 546, y: 18, width: 50, height: 85, label: 'T10' },

      // Lower concourse
      { x: 18, y: 148, width: 38, height: 85, label: 'T11' },
      { x: 66, y: 148, width: 50, height: 85, label: 'T12' },
      { x: 126, y: 148, width: 50, height: 85, label: 'T13' },
      { x: 186, y: 148, width: 50, height: 85, label: 'T14' },
      { x: 246, y: 148, width: 50, height: 85, label: 'T15' },
      { x: 306, y: 148, width: 50, height: 85, label: 'T16' },
      { x: 366, y: 148, width: 50, height: 85, label: 'T17' },
      { x: 426, y: 148, width: 50, height: 85, label: 'T18' },
      { x: 486, y: 148, width: 50, height: 85, label: 'T19' },
      { x: 546, y: 148, width: 50, height: 85, label: 'T20' },
    ],
    exits: [
      { x: 70, y: 700, width: 160, height: 30, label: 'Exit North 1', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 270, y: 700, width: 160, height: 30, label: 'Exit North 2', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 470, y: 700, width: 160, height: 30, label: 'Exit Center', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 670, y: 700, width: 160, height: 30, label: 'Exit South 1', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 22, y: 22, width: 32, height: 75 },
      { x: 70, y: 22, width: 45, height: 75 },
      { x: 130, y: 22, width: 45, height: 75 },
      { x: 190, y: 22, width: 45, height: 75 },
      { x: 250, y: 22, width: 45, height: 75 },
      { x: 310, y: 22, width: 45, height: 75 },
      { x: 370, y: 22, width: 45, height: 75 },
      { x: 430, y: 22, width: 45, height: 75 },
      { x: 490, y: 22, width: 45, height: 75 },
      { x: 550, y: 22, width: 45, height: 75 },
      { x: 22, y: 152, width: 32, height: 75 },
      { x: 70, y: 152, width: 45, height: 75 },
      { x: 130, y: 152, width: 45, height: 75 },
      { x: 190, y: 152, width: 45, height: 75 },
      { x: 250, y: 152, width: 45, height: 75 },
      { x: 310, y: 152, width: 45, height: 75 },
      { x: 370, y: 152, width: 45, height: 75 },
      { x: 430, y: 152, width: 45, height: 75 },
      { x: 490, y: 152, width: 45, height: 75 },
      { x: 550, y: 152, width: 45, height: 75 },
    ],
    securityCheckpoints: [
      { x: 110, y: 495, width: 45, height: 90, label: 'TSA 1' },
      { x: 170, y: 495, width: 45, height: 90, label: 'TSA 2' },
      { x: 230, y: 495, width: 45, height: 90, label: 'TSA 3' },
      { x: 290, y: 495, width: 45, height: 90, label: 'TSA 4' },
      { x: 410, y: 495, width: 45, height: 90, label: 'TSA 5' },
      { x: 470, y: 495, width: 45, height: 90, label: 'TSA 6' },
      { x: 530, y: 495, width: 45, height: 90, label: 'TSA 7' },
      { x: 650, y: 495, width: 45, height: 90, label: 'TSA 8' },
      { x: 710, y: 495, width: 45, height: 90, label: 'TSA 9' },
    ],
    shops: [
      { x: 110, y: 300, width: 100, height: 55, label: 'Peach Store' },
      { x: 290, y: 300, width: 55, height: 55, label: 'CNN' },
      { x: 360, y: 300, width: 120, height: 55, label: 'Delta Sky Club' },
      { x: 560, y: 300, width: 55, height: 55, label: 'Chick-fil-A' },
      { x: 630, y: 300, width: 100, height: 55, label: 'Duty Free' },
    ],
    baggageClaims: [
      { x: 160, y: 640, width: 180, height: 75, label: 'Baggage Claim 1' },
      { x: 360, y: 640, width: 180, height: 75, label: 'Baggage Claim 2' },
      { x: 560, y: 640, width: 180, height: 75, label: 'Baggage Claim 3' },
    ],
  },
  DXB: {
    // Dubai International Terminal 3 - One of the world's largest terminals
    width: 1000,
    height: 800,
    corridorWidth: 180,
    walls: [
      // Outer perimeter
      { x: 10, y: 10, width: 980, height: 10 },
      { x: 10, y: 10, width: 10, height: 780 },
      { x: 980, y: 10, width: 10, height: 780 },
      { x: 10, y: 780, width: 980, height: 10 },

      // Concourse A gates - triple row layout
      // Row 1
      { x: 90, y: 10, width: 6, height: 105 },
      { x: 170, y: 10, width: 6, height: 105 },
      { x: 250, y: 10, width: 6, height: 105 },
      { x: 330, y: 10, width: 6, height: 105 },
      { x: 410, y: 10, width: 6, height: 105 },
      { x: 490, y: 10, width: 6, height: 105 },
      { x: 570, y: 10, width: 6, height: 105 },
      { x: 650, y: 10, width: 6, height: 105 },
      { x: 730, y: 10, width: 6, height: 105 },
      { x: 810, y: 10, width: 6, height: 105 },

      // Row 2
      { x: 90, y: 135, width: 6, height: 105 },
      { x: 170, y: 135, width: 6, height: 105 },
      { x: 250, y: 135, width: 6, height: 105 },
      { x: 330, y: 135, width: 6, height: 105 },
      { x: 410, y: 135, width: 6, height: 105 },
      { x: 490, y: 135, width: 6, height: 105 },
      { x: 570, y: 135, width: 6, height: 105 },
      { x: 650, y: 135, width: 6, height: 105 },
      { x: 730, y: 135, width: 6, height: 105 },
      { x: 810, y: 135, width: 6, height: 105 },

      // Main separator
      { x: 10, y: 260, width: 980, height: 12 },

      // Massive duty-free shopping area
      { x: 120, y: 290, width: 160, height: 10 },
      { x: 340, y: 290, width: 10, height: 110 },
      { x: 420, y: 290, width: 200, height: 10 },
      { x: 680, y: 290, width: 10, height: 110 },
      { x: 760, y: 290, width: 150, height: 10 },

      // Ultra-wide main corridor (famous for length)
      { x: 10, y: 520, width: 980, height: 14 },

      // Immigration and security complex
      { x: 120, y: 560, width: 10, height: 110 },
      { x: 200, y: 560, width: 10, height: 110 },
      { x: 280, y: 560, width: 10, height: 110 },
      { x: 360, y: 560, width: 10, height: 110 },
      { x: 440, y: 560, width: 10, height: 110 },
      { x: 520, y: 560, width: 10, height: 110 },
      { x: 600, y: 560, width: 10, height: 110 },
      { x: 680, y: 560, width: 10, height: 110 },
      { x: 760, y: 560, width: 10, height: 110 },
      { x: 840, y: 560, width: 10, height: 110 },

      // Baggage reclaim hall
      { x: 10, y: 690, width: 980, height: 10 },
      { x: 200, y: 705, width: 8, height: 65 },
      { x: 400, y: 705, width: 8, height: 65 },
      { x: 600, y: 705, width: 8, height: 65 },
      { x: 800, y: 705, width: 8, height: 65 },
    ],
    gates: [
      // Row 1
      { x: 20, y: 18, width: 65, height: 90, label: 'A1' },
      { x: 96, y: 18, width: 70, height: 90, label: 'A2' },
      { x: 176, y: 18, width: 70, height: 90, label: 'A3' },
      { x: 256, y: 18, width: 70, height: 90, label: 'A4' },
      { x: 336, y: 18, width: 70, height: 90, label: 'A5' },
      { x: 416, y: 18, width: 70, height: 90, label: 'A6' },
      { x: 496, y: 18, width: 70, height: 90, label: 'A7' },
      { x: 576, y: 18, width: 70, height: 90, label: 'A8' },
      { x: 656, y: 18, width: 70, height: 90, label: 'A9' },
      { x: 736, y: 18, width: 70, height: 90, label: 'A10' },
      { x: 816, y: 18, width: 160, height: 90, label: 'A11-Emirates' },

      // Row 2
      { x: 20, y: 143, width: 65, height: 90, label: 'A12' },
      { x: 96, y: 143, width: 70, height: 90, label: 'A13' },
      { x: 176, y: 143, width: 70, height: 90, label: 'A14' },
      { x: 256, y: 143, width: 70, height: 90, label: 'A15' },
      { x: 336, y: 143, width: 70, height: 90, label: 'A16' },
      { x: 416, y: 143, width: 70, height: 90, label: 'A17' },
      { x: 496, y: 143, width: 70, height: 90, label: 'A18' },
      { x: 576, y: 143, width: 70, height: 90, label: 'A19' },
      { x: 656, y: 143, width: 70, height: 90, label: 'A20' },
      { x: 736, y: 143, width: 70, height: 90, label: 'A21' },
      { x: 816, y: 143, width: 160, height: 90, label: 'A22-Emirates' },
    ],
    exits: [
      { x: 80, y: 750, width: 180, height: 28, label: 'Exit 1 North', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 290, y: 750, width: 180, height: 28, label: 'Exit 2 North', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 500, y: 750, width: 180, height: 28, label: 'Exit 3 Center', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 710, y: 750, width: 180, height: 28, label: 'Exit 4 South', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 24, y: 22, width: 60, height: 80 },
      { x: 100, y: 22, width: 65, height: 80 },
      { x: 180, y: 22, width: 65, height: 80 },
      { x: 260, y: 22, width: 65, height: 80 },
      { x: 340, y: 22, width: 65, height: 80 },
      { x: 420, y: 22, width: 65, height: 80 },
      { x: 500, y: 22, width: 65, height: 80 },
      { x: 580, y: 22, width: 65, height: 80 },
      { x: 660, y: 22, width: 65, height: 80 },
      { x: 740, y: 22, width: 65, height: 80 },
      { x: 820, y: 22, width: 150, height: 80 },
      { x: 24, y: 147, width: 60, height: 80 },
      { x: 100, y: 147, width: 65, height: 80 },
      { x: 180, y: 147, width: 65, height: 80 },
      { x: 260, y: 147, width: 65, height: 80 },
      { x: 340, y: 147, width: 65, height: 80 },
      { x: 420, y: 147, width: 65, height: 80 },
      { x: 500, y: 147, width: 65, height: 80 },
      { x: 580, y: 147, width: 65, height: 80 },
      { x: 660, y: 147, width: 65, height: 80 },
      { x: 740, y: 147, width: 65, height: 80 },
      { x: 820, y: 147, width: 150, height: 80 },
    ],
    securityCheckpoints: [
      { x: 130, y: 565, width: 60, height: 100, label: 'Imm 1' },
      { x: 210, y: 565, width: 60, height: 100, label: 'Imm 2' },
      { x: 290, y: 565, width: 60, height: 100, label: 'Imm 3' },
      { x: 370, y: 565, width: 60, height: 100, label: 'Imm 4' },
      { x: 450, y: 565, width: 60, height: 100, label: 'Imm 5' },
      { x: 530, y: 565, width: 60, height: 100, label: 'Imm 6' },
      { x: 610, y: 565, width: 60, height: 100, label: 'Imm 7' },
      { x: 690, y: 565, width: 60, height: 100, label: 'Imm 8' },
      { x: 770, y: 565, width: 60, height: 100, label: 'Imm 9' },
    ],
    shops: [
      { x: 130, y: 300, width: 200, height: 95, label: 'Dubai Duty Free' },
      { x: 360, y: 300, width: 50, height: 95, label: 'Gold Souk' },
      { x: 430, y: 300, width: 240, height: 95, label: 'Luxury Mall' },
      { x: 700, y: 300, width: 50, height: 95, label: 'Emirates Store' },
      { x: 770, y: 300, width: 130, height: 95, label: 'Perfumes' },
    ],
    baggageClaims: [
      { x: 210, y: 710, width: 180, height: 55, label: 'Baggage 1-5' },
      { x: 410, y: 710, width: 180, height: 55, label: 'Baggage 6-10' },
      { x: 610, y: 710, width: 180, height: 55, label: 'Baggage 11-15' },
    ],
  },
  DEL: {
    // Delhi Indira Gandhi International Terminal 3 - Major hub for South Asia
    width: 920,
    height: 720,
    corridorWidth: 150,
    walls: [
      // Outer perimeter
      { x: 10, y: 10, width: 900, height: 9 },
      { x: 10, y: 10, width: 9, height: 700 },
      { x: 901, y: 10, width: 9, height: 700 },
      { x: 10, y: 701, width: 900, height: 9 },

      // Terminal 3 concourse gates - dual rows
      // Upper row
      { x: 100, y: 10, width: 7, height: 95 },
      { x: 190, y: 10, width: 7, height: 95 },
      { x: 280, y: 10, width: 7, height: 95 },
      { x: 370, y: 10, width: 7, height: 95 },
      { x: 460, y: 10, width: 7, height: 95 },
      { x: 550, y: 10, width: 7, height: 95 },
      { x: 640, y: 10, width: 7, height: 95 },
      { x: 730, y: 10, width: 7, height: 95 },

      // Lower row
      { x: 100, y: 125, width: 7, height: 95 },
      { x: 190, y: 125, width: 7, height: 95 },
      { x: 280, y: 125, width: 7, height: 95 },
      { x: 370, y: 125, width: 7, height: 95 },
      { x: 460, y: 125, width: 7, height: 95 },
      { x: 550, y: 125, width: 7, height: 95 },
      { x: 640, y: 125, width: 7, height: 95 },
      { x: 730, y: 125, width: 7, height: 95 },

      // Main corridor separator
      { x: 10, y: 240, width: 900, height: 11 },

      // Shopping and dining plaza
      { x: 110, y: 270, width: 140, height: 8 },
      { x: 300, y: 270, width: 8, height: 90 },
      { x: 380, y: 270, width: 160, height: 8 },
      { x: 600, y: 270, width: 8, height: 90 },
      { x: 680, y: 270, width: 140, height: 8 },

      // Wide circulation corridor
      { x: 10, y: 460, width: 900, height: 12 },

      // Immigration and customs checkpoints
      { x: 120, y: 495, width: 9, height: 105 },
      { x: 195, y: 495, width: 9, height: 105 },
      { x: 270, y: 495, width: 9, height: 105 },
      { x: 345, y: 495, width: 9, height: 105 },
      { x: 470, y: 495, width: 9, height: 105 },
      { x: 545, y: 495, width: 9, height: 105 },
      { x: 620, y: 495, width: 9, height: 105 },
      { x: 750, y: 495, width: 9, height: 105 },

      // Baggage reclaim area
      { x: 10, y: 625, width: 900, height: 9 },
      { x: 180, y: 640, width: 7, height: 55 },
      { x: 380, y: 640, width: 7, height: 55 },
      { x: 580, y: 640, width: 7, height: 55 },
      { x: 780, y: 640, width: 7, height: 55 },
    ],
    gates: [
      // Upper concourse
      { x: 20, y: 18, width: 75, height: 85, label: 'G1' },
      { x: 107, y: 18, width: 78, height: 85, label: 'G2' },
      { x: 197, y: 18, width: 78, height: 85, label: 'G3' },
      { x: 287, y: 18, width: 78, height: 85, label: 'G4' },
      { x: 377, y: 18, width: 78, height: 85, label: 'G5' },
      { x: 467, y: 18, width: 78, height: 85, label: 'G6' },
      { x: 557, y: 18, width: 78, height: 85, label: 'G7' },
      { x: 647, y: 18, width: 78, height: 85, label: 'G8' },
      { x: 737, y: 18, width: 170, height: 85, label: 'G9-Air India' },

      // Lower concourse
      { x: 20, y: 133, width: 75, height: 85, label: 'G10' },
      { x: 107, y: 133, width: 78, height: 85, label: 'G11' },
      { x: 197, y: 133, width: 78, height: 85, label: 'G12' },
      { x: 287, y: 133, width: 78, height: 85, label: 'G13' },
      { x: 377, y: 133, width: 78, height: 85, label: 'G14' },
      { x: 467, y: 133, width: 78, height: 85, label: 'G15' },
      { x: 557, y: 133, width: 78, height: 85, label: 'G16' },
      { x: 647, y: 133, width: 78, height: 85, label: 'G17' },
      { x: 737, y: 133, width: 170, height: 85, label: 'G18-Air India' },
    ],
    exits: [
      { x: 90, y: 675, width: 170, height: 28, label: 'Exit 1 North', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 290, y: 675, width: 170, height: 28, label: 'Exit 2 North', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 490, y: 675, width: 170, height: 28, label: 'Exit 3 Center', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 690, y: 675, width: 170, height: 28, label: 'Exit 4 South', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 24, y: 22, width: 70, height: 75 },
      { x: 111, y: 22, width: 73, height: 75 },
      { x: 201, y: 22, width: 73, height: 75 },
      { x: 291, y: 22, width: 73, height: 75 },
      { x: 381, y: 22, width: 73, height: 75 },
      { x: 471, y: 22, width: 73, height: 75 },
      { x: 561, y: 22, width: 73, height: 75 },
      { x: 651, y: 22, width: 73, height: 75 },
      { x: 741, y: 22, width: 160, height: 75 },
      { x: 24, y: 137, width: 70, height: 75 },
      { x: 111, y: 137, width: 73, height: 75 },
      { x: 201, y: 137, width: 73, height: 75 },
      { x: 291, y: 137, width: 73, height: 75 },
      { x: 381, y: 137, width: 73, height: 75 },
      { x: 471, y: 137, width: 73, height: 75 },
      { x: 561, y: 137, width: 73, height: 75 },
      { x: 651, y: 137, width: 73, height: 75 },
      { x: 741, y: 137, width: 160, height: 75 },
    ],
    securityCheckpoints: [
      { x: 129, y: 500, width: 55, height: 95, label: 'Imm 1' },
      { x: 204, y: 500, width: 55, height: 95, label: 'Imm 2' },
      { x: 279, y: 500, width: 55, height: 95, label: 'Imm 3' },
      { x: 354, y: 500, width: 55, height: 95, label: 'Imm 4' },
      { x: 479, y: 500, width: 55, height: 95, label: 'Imm 5' },
      { x: 554, y: 500, width: 55, height: 95, label: 'Imm 6' },
      { x: 629, y: 500, width: 55, height: 95, label: 'Imm 7' },
    ],
    shops: [
      { x: 120, y: 280, width: 170, height: 75, label: 'Indian Handicrafts' },
      { x: 315, y: 280, width: 55, height: 75, label: 'Café' },
      { x: 390, y: 280, width: 200, height: 75, label: 'Duty Free India' },
      { x: 615, y: 280, width: 55, height: 75, label: 'Spices' },
      { x: 690, y: 280, width: 120, height: 75, label: 'Fashion' },
    ],
    baggageClaims: [
      { x: 190, y: 645, width: 180, height: 45, label: 'Baggage 1-4' },
      { x: 390, y: 645, width: 180, height: 45, label: 'Baggage 5-8' },
      { x: 590, y: 645, width: 180, height: 45, label: 'Baggage 9-12' },
    ],
  },
  IAD: {
    // Washington Dulles International - Main DC area international hub
    width: 880,
    height: 690,
    corridorWidth: 130,
    walls: [
      // Outer perimeter
      { x: 10, y: 10, width: 860, height: 8 },
      { x: 10, y: 10, width: 8, height: 670 },
      { x: 862, y: 10, width: 8, height: 670 },
      { x: 10, y: 672, width: 860, height: 8 },

      // Concourse C/D gates (international)
      { x: 80, y: 10, width: 6, height: 100 },
      { x: 160, y: 10, width: 6, height: 100 },
      { x: 240, y: 10, width: 6, height: 100 },
      { x: 320, y: 10, width: 6, height: 100 },
      { x: 400, y: 10, width: 6, height: 100 },
      { x: 480, y: 10, width: 6, height: 100 },
      { x: 560, y: 10, width: 6, height: 100 },
      { x: 640, y: 10, width: 6, height: 100 },
      { x: 720, y: 10, width: 6, height: 100 },

      // Main corridor separator
      { x: 10, y: 130, width: 860, height: 10 },

      // Retail and dining areas
      { x: 100, y: 160, width: 110, height: 7 },
      { x: 250, y: 160, width: 7, height: 70 },
      { x: 330, y: 160, width: 140, height: 7 },
      { x: 520, y: 160, width: 7, height: 70 },
      { x: 600, y: 160, width: 110, height: 7 },

      // Wide circulation corridor
      { x: 10, y: 330, width: 860, height: 11 },

      // Federal Inspection Services (FIS) and TSA
      { x: 10, y: 370, width: 860, height: 10 },
      { x: 130, y: 385, width: 8, height: 100 },
      { x: 200, y: 385, width: 8, height: 100 },
      { x: 270, y: 385, width: 8, height: 100 },
      { x: 390, y: 385, width: 8, height: 100 },
      { x: 460, y: 385, width: 8, height: 100 },
      { x: 530, y: 385, width: 8, height: 100 },
      { x: 650, y: 385, width: 8, height: 100 },
      { x: 720, y: 385, width: 8, height: 100 },

      // Mobile Lounge (AeroTrain) station area
      { x: 10, y: 510, width: 860, height: 10 },

      // Baggage claim hall
      { x: 10, y: 570, width: 860, height: 9 },
      { x: 160, y: 585, width: 7, height: 75 },
      { x: 360, y: 585, width: 7, height: 75 },
      { x: 560, y: 585, width: 7, height: 75 },
      { x: 760, y: 585, width: 7, height: 75 },
    ],
    gates: [
      { x: 18, y: 18, width: 58, height: 88, label: 'C1' },
      { x: 86, y: 18, width: 70, height: 88, label: 'C2' },
      { x: 166, y: 18, width: 70, height: 88, label: 'C3' },
      { x: 246, y: 18, width: 70, height: 88, label: 'C4' },
      { x: 326, y: 18, width: 70, height: 88, label: 'C5' },
      { x: 406, y: 18, width: 70, height: 88, label: 'C6' },
      { x: 486, y: 18, width: 70, height: 88, label: 'D1' },
      { x: 566, y: 18, width: 70, height: 88, label: 'D2' },
      { x: 646, y: 18, width: 70, height: 88, label: 'D3' },
      { x: 726, y: 18, width: 140, height: 88, label: 'D4-United' },
    ],
    exits: [
      { x: 70, y: 645, width: 160, height: 26, label: 'Exit North', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 270, y: 645, width: 160, height: 26, label: 'Exit Center N', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 470, y: 645, width: 160, height: 26, label: 'Exit Center S', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
      { x: 670, y: 645, width: 160, height: 26, label: 'Exit South', state: 'open', crowdingLevel: 0, recoveryTimer: 0 },
    ],
    spawnAreas: [
      { x: 22, y: 22, width: 53, height: 80 },
      { x: 90, y: 22, width: 65, height: 80 },
      { x: 170, y: 22, width: 65, height: 80 },
      { x: 250, y: 22, width: 65, height: 80 },
      { x: 330, y: 22, width: 65, height: 80 },
      { x: 410, y: 22, width: 65, height: 80 },
      { x: 490, y: 22, width: 65, height: 80 },
      { x: 570, y: 22, width: 65, height: 80 },
      { x: 650, y: 22, width: 65, height: 80 },
      { x: 730, y: 22, width: 130, height: 80 },
    ],
    securityCheckpoints: [
      { x: 138, y: 390, width: 55, height: 90, label: 'TSA 1' },
      { x: 208, y: 390, width: 55, height: 90, label: 'TSA 2' },
      { x: 278, y: 390, width: 55, height: 90, label: 'TSA 3' },
      { x: 398, y: 390, width: 55, height: 90, label: 'TSA 4' },
      { x: 468, y: 390, width: 55, height: 90, label: 'TSA 5' },
      { x: 538, y: 390, width: 55, height: 90, label: 'TSA 6' },
      { x: 658, y: 390, width: 55, height: 90, label: 'TSA 7' },
    ],
    shops: [
      { x: 110, y: 170, width: 130, height: 55, label: 'Smithsonian Store' },
      { x: 265, y: 170, width: 45, height: 55, label: 'Café' },
      { x: 340, y: 170, width: 170, height: 55, label: 'Duty Free Americas' },
      { x: 535, y: 170, width: 55, height: 55, label: 'Books' },
      { x: 610, y: 170, width: 90, height: 55, label: 'Travel Gear' },
    ],
    baggageClaims: [
      { x: 170, y: 590, width: 180, height: 65, label: 'Baggage 1' },
      { x: 370, y: 590, width: 180, height: 65, label: 'Baggage 2' },
      { x: 570, y: 590, width: 180, height: 65, label: 'Baggage 3' },
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
      targetNode: '', // Not used in spatial simulation
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

// Check if agent is in exit area (and exit is open)
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

// Thigmonastic response - Mimosa pudica-inspired exit control
function updateExitStates(layout: AirportLayout, agents: Agent[], deltaTime: number, useCrowdLeaf: boolean): void {
  const CROWD_THRESHOLD = 15; // Critical crowd density to trigger closing
  const RECOVERY_TIME = 5; // Seconds to recover (like Mimosa reopening)

  layout.exits.forEach(exit => {
    // Count agents near this exit (stimulus detection)
    const nearbyAgents = agents.filter(a => {
      if (a.isEvacuated) return false;
      const dx = a.x - (exit.x + exit.width / 2);
      const dy = a.y - (exit.y + exit.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < 100; // Detection radius
    });

    exit.crowdingLevel = nearbyAgents.length;

    if (!useCrowdLeaf) {
      // Without CrowdLeaf: exits stay open (no thigmonastic response)
      exit.state = 'open';
      return;
    }

    // CrowdLeaf: Mimosa-like behavior
    switch (exit.state) {
      case 'open':
        if (exit.crowdingLevel > CROWD_THRESHOLD) {
          // Stimulus threshold exceeded - trigger closing!
          exit.state = 'closing';
          exit.recoveryTimer = RECOVERY_TIME;
        }
        break;

      case 'closing':
        // Transition to fully closed
        exit.state = 'closed';
        break;

      case 'closed':
        // Recovery timer (like Mimosa pudica slow reopening)
        exit.recoveryTimer -= deltaTime;
        if (exit.recoveryTimer <= 0) {
          exit.state = 'reopening';
        }
        break;

      case 'reopening':
        // Check if safe to reopen
        if (exit.crowdingLevel < CROWD_THRESHOLD * 0.5) {
          exit.state = 'open';
          exit.recoveryTimer = 0;
        } else {
          // Still too crowded, stay in reopening state
          exit.recoveryTimer = RECOVERY_TIME * 0.3;
        }
        break;
    }
  });
}

// Get target exit for agent (CrowdLeaf redistributes, standard picks nearest)
function getTargetExit(
  agent: Agent,
  layout: AirportLayout,
  allAgents: Agent[],
  useCrowdLeaf: boolean,
  time: number
): Exit {
  if (useCrowdLeaf) {
    // CrowdLeaf: Avoid closed/closing exits (thigmonastic avoidance)
    const openExits = layout.exits.filter(e => e.state === 'open' || e.state === 'reopening');

    if (openExits.length === 0) {
      // All exits closed - pick least crowded one anyway
      let minCrowd = layout.exits[0];
      for (const exit of layout.exits) {
        if (exit.crowdingLevel < minCrowd.crowdingLevel) {
          minCrowd = exit;
        }
      }
      return minCrowd;
    }

    // Find least crowded open exit
    let best = openExits[0];
    for (const exit of openExits) {
      if (exit.crowdingLevel < best.crowdingLevel) {
        best = exit;
      }
    }

    return best;
  } else {
    // Standard: Always go to nearest exit (ignore state)
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

// Update agent positions with collision detection
function updateAgents(
  agents: Agent[],
  layout: AirportLayout,
  useCrowdLeaf: boolean,
  time: number,
  deltaTime: number
): Agent[] {
  return agents.map(agent => {
    if (agent.isEvacuated) return agent;

    // Check if reached exit
    if (isInExit(agent.x, agent.y, layout.exits)) {
      return { ...agent, isEvacuated: true };
    }

    // Get target exit
    const targetExit = getTargetExit(agent, layout, agents, useCrowdLeaf, time);
    const targetX = targetExit.x + targetExit.width / 2;
    const targetY = targetExit.y + targetExit.height / 2;

    // Calculate movement direction
    const dx = targetX - agent.x;
    const dy = targetY - agent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) return agent; // Already at target

    // Movement speed (CrowdLeaf slightly better flow)
    const baseSpeed = useCrowdLeaf ? 2.8 : 2.2;
    const vx = (dx / dist) * baseSpeed;
    const vy = (dy / dist) * baseSpeed;

    let newX = agent.x + vx;
    let newY = agent.y + vy;

    // Collision detection with walls
    if (checkWallCollision(newX, newY, layout.walls)) {
      // Try sliding along walls
      if (!checkWallCollision(agent.x, newY, layout.walls)) {
        newX = agent.x; // Slide vertically
      } else if (!checkWallCollision(newX, agent.y, layout.walls)) {
        newY = agent.y; // Slide horizontally
      } else {
        // Can't move, add some randomness to escape
        newX = agent.x + (Math.random() - 0.5) * 2;
        newY = agent.y + (Math.random() - 0.5) * 2;

        // Check again
        if (checkWallCollision(newX, newY, layout.walls)) {
          newX = agent.x;
          newY = agent.y;
        }
      }
    }

    // Agent-agent collision (simple repulsion)
    for (const other of agents) {
      if (other.id !== agent.id && !other.isEvacuated) {
        const odx = newX - other.x;
        const ody = newY - other.y;
        const oDist = Math.sqrt(odx * odx + ody * ody);

        if (oDist < 8 && oDist > 0) {
          // Push apart
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

// Calculate metrics from agents
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
  const layout = airportLayouts[airport] || airportLayouts['DFW'];

  // Initialize or update
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

  // Update exit states (Mimosa-like thigmonastic response)
  updateExitStates(layout, cachedState.withoutAgents, deltaTime, false);
  updateExitStates(layout, cachedState.withAgents, deltaTime, true);

  // Update agents
  const withoutAgents = updateAgents(cachedState.withoutAgents, layout, false, currentTime, deltaTime);
  const withAgents = updateAgents(cachedState.withAgents, layout, true, currentTime, deltaTime);

  // Add injuries/deaths based on overcrowding (without CrowdLeaf has more)
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

  // Calculate metrics
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
