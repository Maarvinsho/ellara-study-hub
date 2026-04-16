// A node in the circuit. Node 0 is always ground (reference).
export type NodeId = number;

// Each element connects two nodes: n+ (positive) and n- (negative).
// Current is defined as flowing from n+ to n- through the element.
export interface ElementBase {
  id: string;
  nPlus: NodeId;
  nMinus: NodeId;
}

export interface Resistor extends ElementBase {
  type: "resistor";
  resistance: number; // ohms
}

export interface VoltageSource extends ElementBase {
  type: "voltageSource";
  voltage: number; // volts, from n+ to n-
}

export interface CurrentSource extends ElementBase {
  type: "currentSource";
  current: number; // amperes, flowing from n+ to n-
}

export type Element = Resistor | VoltageSource | CurrentSource;

export interface Circuit {
  numNodes: number; // Total nodes including ground (node 0)
  elements: Element[];
}

export interface SolutionResult {
  nodeVoltages: number[]; // nodeVoltages[i] = voltage at node i (node 0 = 0 V by definition)
  elementCurrents: Record<string, number>; // keyed by element id
  elementVoltages: Record<string, number>; // voltage drop n+ to n-
}

export interface SolverError {
  error: string;
}
// --- AC extensions ---

// A complex number represented as { re, im }
export interface Complex {
  re: number;
  im: number;
}

export interface Inductor extends ElementBase {
  type: "inductor";
  inductance: number; // henries
}

export interface Capacitor extends ElementBase {
  type: "capacitor";
  capacitance: number; // farads
}

export interface ACVoltageSource extends ElementBase {
  type: "acVoltageSource";
  magnitude: number; // peak volts
  phase: number;     // degrees
}

export interface ACCurrentSource extends ElementBase {
  type: "acCurrentSource";
  magnitude: number; // peak amps
  phase: number;     // degrees
}

export type ACElement =
  | Resistor
  | Inductor
  | Capacitor
  | ACVoltageSource
  | ACCurrentSource;

export interface ACCircuit {
  numNodes: number;
  frequency: number; // Hz
  elements: ACElement[];
}

export interface ACSolutionResult {
  frequency: number;
  omega: number;
  nodeVoltages: Complex[]; // Phasor voltages (node 0 = 0)
  elementCurrents: Record<string, Complex>;
  elementVoltages: Record<string, Complex>;
}