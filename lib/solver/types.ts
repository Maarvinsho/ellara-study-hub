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