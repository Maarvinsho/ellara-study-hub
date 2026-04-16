import { Circuit, Element } from "./types";

export interface MatrixStamp {
  description: string;
  element: Element;
  affectedRows: number[];
  affectedCols: number[];
}

export interface SolverExplanation {
  numNodes: number;
  numVoltageSources: number;
  matrixSize: number;
  conductanceStamps: MatrixStamp[];
  voltageSourceStamps: MatrixStamp[];
  currentSourceStamps: MatrixStamp[];
  matrixA: number[][];
  vectorZ: number[];
  nodeEquations: string[];
  rowLabels: string[]; // Human-readable label for each matrix row
}

// Mirrors the stamping logic in mna.ts, but captures each step for display.
export function explainDC(circuit: Circuit): SolverExplanation {
  const n = circuit.numNodes - 1;
  const voltageSources = circuit.elements.filter((e) => e.type === "voltageSource");
  const m = voltageSources.length;
  const size = n + m;

  const A: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  const z: number[] = Array(size).fill(0);
  const idx = (id: number) => (id === 0 ? -1 : id - 1);

  const conductanceStamps: MatrixStamp[] = [];
  const voltageSourceStamps: MatrixStamp[] = [];
  const currentSourceStamps: MatrixStamp[] = [];

  // Resistor stamps
  for (const el of circuit.elements) {
    if (el.type !== "resistor") continue;
    const g = 1 / el.resistance;
    const p = idx(el.nPlus);
    const q = idx(el.nMinus);
    const rows: number[] = [];
    const cols: number[] = [];
    if (p >= 0) {
      A[p][p] += g;
      rows.push(p);
      cols.push(p);
    }
    if (q >= 0) {
      A[q][q] += g;
      rows.push(q);
      cols.push(q);
    }
    if (p >= 0 && q >= 0) {
      A[p][q] -= g;
      A[q][p] -= g;
      rows.push(p, q);
      cols.push(q, p);
    }
    conductanceStamps.push({
      description: `${el.id} (${el.resistance} Ω, G = ${g.toExponential(3)} S) between nodes ${el.nPlus} and ${el.nMinus}`,
      element: el,
      affectedRows: Array.from(new Set(rows)),
      affectedCols: Array.from(new Set(cols)),
    });
  }

  // Current source stamps
  for (const el of circuit.elements) {
    if (el.type !== "currentSource") continue;
    const p = idx(el.nPlus);
    const q = idx(el.nMinus);
    const rows: number[] = [];
    if (p >= 0) {
      z[p] -= el.current;
      rows.push(p);
    }
    if (q >= 0) {
      z[q] += el.current;
      rows.push(q);
    }
    currentSourceStamps.push({
      description: `${el.id} (${el.current} A) from node ${el.nPlus} to node ${el.nMinus} — current leaves n+, enters n−`,
      element: el,
      affectedRows: rows,
      affectedCols: [],
    });
  }

  // Voltage source stamps (MNA extension)
  voltageSources.forEach((el, k) => {
    const row = n + k;
    const p = idx(el.nPlus);
    const q = idx(el.nMinus);
    const rows: number[] = [row];
    const cols: number[] = [row];
    if (p >= 0) {
      A[row][p] = 1;
      A[p][row] = 1;
      rows.push(p);
      cols.push(p);
    }
    if (q >= 0) {
      A[row][q] = -1;
      A[q][row] = -1;
      rows.push(q);
      cols.push(q);
    }
    z[row] = el.voltage;
    voltageSourceStamps.push({
      description: `${el.id} (${el.voltage} V) between nodes ${el.nPlus} and ${el.nMinus} — adds constraint V(n+) − V(n−) = ${el.voltage}`,
      element: el,
      affectedRows: rows,
      affectedCols: cols,
    });
  });

  // Row labels
  const rowLabels: string[] = [];
  for (let i = 0; i < n; i++) rowLabels.push(`KCL @ node ${i + 1}`);
  voltageSources.forEach((el) => rowLabels.push(`V: ${el.id} constraint`));

  // Human-readable KCL equations
  const nodeEquations: string[] = [];
  for (let i = 0; i < n; i++) {
    const nodeId = i + 1;
    const terms: string[] = [];

    // Resistor contributions
    for (const el of circuit.elements) {
      if (el.type !== "resistor") continue;
      if (el.nPlus !== nodeId && el.nMinus !== nodeId) continue;
      const other = el.nPlus === nodeId ? el.nMinus : el.nPlus;
      const otherLabel = other === 0 ? "0" : `V${other}`;
      terms.push(`(V${nodeId} − ${otherLabel})/${el.resistance}`);
    }

    // Current source contributions
    for (const el of circuit.elements) {
      if (el.type !== "currentSource") continue;
      if (el.nPlus === nodeId) terms.push(`+ ${el.current} (leaving via ${el.id})`);
      if (el.nMinus === nodeId) terms.push(`− ${el.current} (entering via ${el.id})`);
    }

    // Voltage source contributions
    for (const el of voltageSources) {
      if (el.nPlus === nodeId) terms.push(`+ I(${el.id})`);
      if (el.nMinus === nodeId) terms.push(`− I(${el.id})`);
    }

    nodeEquations.push(terms.length > 0 ? `${terms.join(" ")} = 0` : `(no elements at node ${nodeId})`);
  }

  return {
    numNodes: circuit.numNodes,
    numVoltageSources: m,
    matrixSize: size,
    conductanceStamps,
    voltageSourceStamps,
    currentSourceStamps,
    matrixA: A,
    vectorZ: z,
    nodeEquations,
    rowLabels,
  };
}