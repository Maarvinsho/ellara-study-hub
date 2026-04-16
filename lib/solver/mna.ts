import { create, all, Matrix } from "mathjs";
import { Circuit, Element, SolutionResult, SolverError } from "./types";

const math = create(all);

// Modified Nodal Analysis builds a matrix equation Ax = z where:
//   x = [node voltages v1..vN, source currents i1..iM]
//   A = conductance/incidence matrix
//   z = source vector
//
// This handles voltage sources directly without source transformation —
// the "modified" part of MNA. Mesh analysis is equivalent but less general.

export function solveDC(circuit: Circuit): SolutionResult | SolverError {
  const n = circuit.numNodes - 1; // Exclude ground
  if (n <= 0) {
    return { error: "Circuit must have at least 2 nodes (one non-ground)." };
  }

  const voltageSources = circuit.elements.filter((e) => e.type === "voltageSource");
  const m = voltageSources.length;
  const size = n + m;

  // Initialize A and z with zeros
  const A: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  const z: number[] = Array(size).fill(0);

  // Helper: map node id to matrix index (node 0 → ignored, node k → k-1)
  const idx = (nodeId: number) => (nodeId === 0 ? -1 : nodeId - 1);

  // Stamp resistors (conductance matrix G contribution)
  for (const el of circuit.elements) {
    if (el.type !== "resistor") continue;
    const g = 1 / el.resistance;
    const p = idx(el.nPlus);
    const q = idx(el.nMinus);
    if (p >= 0) A[p][p] += g;
    if (q >= 0) A[q][q] += g;
    if (p >= 0 && q >= 0) {
      A[p][q] -= g;
      A[q][p] -= g;
    }
  }

  // Stamp current sources (RHS contribution)
  for (const el of circuit.elements) {
    if (el.type !== "currentSource") continue;
    const p = idx(el.nPlus);
    const q = idx(el.nMinus);
    // Current flows FROM n+ TO n- through source → leaves n+, enters n-
    if (p >= 0) z[p] -= el.current;
    if (q >= 0) z[q] += el.current;
  }

  // Stamp voltage sources (MNA extension: each adds a row/column)
  voltageSources.forEach((el, k) => {
    const row = n + k; // Extra rows are appended after node equations
    const p = idx(el.nPlus);
    const q = idx(el.nMinus);
    if (p >= 0) {
      A[row][p] = 1;
      A[p][row] = 1;
    }
    if (q >= 0) {
      A[row][q] = -1;
      A[q][row] = -1;
    }
    z[row] = el.voltage;
  });

  // Solve A x = z
  let x: number[];
  try {
    const matA = math.matrix(A);
    const vecZ = math.matrix(z);
    const solution = math.lusolve(matA, vecZ) as Matrix;
    x = (solution.toArray() as number[][]).map((row) => row[0]);
  } catch (e) {
    return {
      error:
        "Circuit could not be solved. Check for isolated nodes, shorted sources, or floating sections. " +
        (e instanceof Error ? e.message : ""),
    };
  }

  // Extract node voltages (node 0 is 0 V by definition)
  const nodeVoltages: number[] = [0];
  for (let i = 0; i < n; i++) nodeVoltages.push(x[i]);

  // Compute element voltages and currents
  const elementVoltages: Record<string, number> = {};
  const elementCurrents: Record<string, number> = {};

  // Voltage source currents came out of the MNA solution
  voltageSources.forEach((el, k) => {
    elementCurrents[el.id] = x[n + k];
    elementVoltages[el.id] = el.voltage;
  });

  // Resistor: V = V(n+) - V(n-), I = V/R
  for (const el of circuit.elements) {
    if (el.type !== "resistor") continue;
    const v = nodeVoltages[el.nPlus] - nodeVoltages[el.nMinus];
    elementVoltages[el.id] = v;
    elementCurrents[el.id] = v / el.resistance;
  }

  // Current source: current is known, voltage is V(n+) - V(n-)
  for (const el of circuit.elements) {
    if (el.type !== "currentSource") continue;
    elementVoltages[el.id] = nodeVoltages[el.nPlus] - nodeVoltages[el.nMinus];
    elementCurrents[el.id] = el.current;
  }

  return { nodeVoltages, elementVoltages, elementCurrents };
}

export function isError(r: SolutionResult | SolverError): r is SolverError {
  return (r as SolverError).error !== undefined;
}