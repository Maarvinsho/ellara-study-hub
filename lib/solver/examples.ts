import { Circuit } from "./types";

// Simple voltage divider: 10V source, two 1kΩ resistors in series.
// Expected: node 1 = 10V, node 2 = 5V (midpoint).
export const voltageDivider: Circuit = {
  numNodes: 3, // node 0 = ground, node 1 = top, node 2 = middle
  elements: [
    {
      id: "V1",
      type: "voltageSource",
      nPlus: 1,
      nMinus: 0,
      voltage: 10,
    },
    {
      id: "R1",
      type: "resistor",
      nPlus: 1,
      nMinus: 2,
      resistance: 1000,
    },
    {
      id: "R2",
      type: "resistor",
      nPlus: 2,
      nMinus: 0,
      resistance: 1000,
    },
  ],
};

// Parallel resistors with current source: 2A source, two 100Ω in parallel.
// Expected: node 1 voltage = 2A × 50Ω = 100V. Each resistor carries 1A.
export const parallelResistors: Circuit = {
  numNodes: 2,
  elements: [
    {
      id: "I1",
      type: "currentSource",
      nPlus: 0,
      nMinus: 1,
      current: 2,
    },
    {
      id: "R1",
      type: "resistor",
      nPlus: 1,
      nMinus: 0,
      resistance: 100,
    },
    {
      id: "R2",
      type: "resistor",
      nPlus: 1,
      nMinus: 0,
      resistance: 100,
    },
  ],
};

// Bridge circuit — non-trivial topology.
// 10V source drives a Wheatstone-like bridge of four 1kΩ resistors.
// With all resistors equal, the bridge is balanced: midpoints at 5V each.
export const balancedBridge: Circuit = {
  numNodes: 4, // 0 = ground, 1 = top, 2 = left mid, 3 = right mid
  elements: [
    { id: "V1", type: "voltageSource", nPlus: 1, nMinus: 0, voltage: 10 },
    { id: "R1", type: "resistor", nPlus: 1, nMinus: 2, resistance: 1000 },
    { id: "R2", type: "resistor", nPlus: 1, nMinus: 3, resistance: 1000 },
    { id: "R3", type: "resistor", nPlus: 2, nMinus: 0, resistance: 1000 },
    { id: "R4", type: "resistor", nPlus: 3, nMinus: 0, resistance: 1000 },
  ],
};