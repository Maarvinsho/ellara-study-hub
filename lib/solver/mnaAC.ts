import { create, all, Matrix } from "mathjs";
import {
  ACCircuit,
  ACSolutionResult,
  Complex,
  SolverError,
} from "./types";

const math = create(all);

// Tiny helpers so the code below reads like the DC version.
function c(re: number, im: number = 0): Complex {
  return { re, im };
}

function cAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

function cSub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}

function cMul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

function cDiv(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im;
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  };
}

// Phasor from magnitude (peak) and phase (degrees)
function phasor(mag: number, phaseDeg: number): Complex {
  const rad = (phaseDeg * Math.PI) / 180;
  return { re: mag * Math.cos(rad), im: mag * Math.sin(rad) };
}

// Impedance of each element at angular frequency omega
function impedance(
  el: ACCircuit["elements"][number],
  omega: number
): Complex | null {
  if (el.type === "resistor") return c(el.resistance);
  if (el.type === "inductor") return c(0, omega * el.inductance);
  if (el.type === "capacitor") {
    // Z_C = 1 / (jωC) = -j / (ωC)
    if (omega === 0 || el.capacitance === 0) return null;
    return c(0, -1 / (omega * el.capacitance));
  }
  return null; // sources handled separately
}

// Admittance Y = 1/Z
function admittance(z: Complex): Complex {
  return cDiv(c(1), z);
}

export function solveAC(circuit: ACCircuit): ACSolutionResult | SolverError {
  const n = circuit.numNodes - 1;
  if (n <= 0) return { error: "Circuit must have at least 2 nodes." };
  if (circuit.frequency <= 0)
    return { error: "Frequency must be positive. Use the DC solver for f = 0." };

  const omega = 2 * Math.PI * circuit.frequency;

  const vSources = circuit.elements.filter((e) => e.type === "acVoltageSource");
  const m = vSources.length;
  const size = n + m;

  // Complex A matrix and z vector (initialized to 0)
  const A: Complex[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => c(0))
  );
  const z: Complex[] = Array.from({ length: size }, () => c(0));

  const idx = (id: number) => (id === 0 ? -1 : id - 1);

  // Stamp passive elements (R, L, C) by admittance
  for (const el of circuit.elements) {
    if (el.type === "acVoltageSource" || el.type === "acCurrentSource") continue;
    const z_el = impedance(el, omega);
    if (!z_el) continue;
    const y = admittance(z_el);
    const p = idx(el.nPlus);
    const q = idx(el.nMinus);
    if (p >= 0) A[p][p] = cAdd(A[p][p], y);
    if (q >= 0) A[q][q] = cAdd(A[q][q], y);
    if (p >= 0 && q >= 0) {
      A[p][q] = cSub(A[p][q], y);
      A[q][p] = cSub(A[q][p], y);
    }
  }

  // Stamp AC current sources
  for (const el of circuit.elements) {
    if (el.type !== "acCurrentSource") continue;
    const iPhasor = phasor(el.magnitude, el.phase);
    const p = idx(el.nPlus);
    const q = idx(el.nMinus);
    if (p >= 0) z[p] = cSub(z[p], iPhasor);
    if (q >= 0) z[q] = cAdd(z[q], iPhasor);
  }

  // Stamp AC voltage sources (MNA extension)
  vSources.forEach((el, k) => {
    if (el.type !== "acVoltageSource") return;
    const row = n + k;
    const p = idx(el.nPlus);
    const q = idx(el.nMinus);
    if (p >= 0) {
      A[row][p] = c(1);
      A[p][row] = c(1);
    }
    if (q >= 0) {
      A[row][q] = c(-1);
      A[q][row] = c(-1);
    }
    z[row] = phasor(el.magnitude, el.phase);
  });

  // Convert to math.js complex matrix and solve
  const mathA = A.map((row) =>
    row.map((v) => math.complex(v.re, v.im) as unknown as number)
  );
  const mathZ = z.map((v) => math.complex(v.re, v.im) as unknown as number);

  let x: Complex[];
  try {
    const solution = math.lusolve(math.matrix(mathA), math.matrix(mathZ)) as Matrix;
    // Each row is a 1-element array containing a math.js Complex
    x = (solution.toArray() as unknown[][]).map((row) => {
      const v = row[0] as { re?: number; im?: number; toJSON?: () => unknown };
      // math.js Complex objects expose .re and .im
      return { re: v.re ?? 0, im: v.im ?? 0 };
    });
  } catch (e) {
    return {
      error:
        "AC circuit could not be solved. Check for shorted sources or floating nodes. " +
        (e instanceof Error ? e.message : ""),
    };
  }

  // Node voltages (node 0 = 0)
  const nodeVoltages: Complex[] = [c(0)];
  for (let i = 0; i < n; i++) nodeVoltages.push(x[i]);

  const elementVoltages: Record<string, Complex> = {};
  const elementCurrents: Record<string, Complex> = {};

  // V-source currents from MNA solution
  vSources.forEach((el, k) => {
    if (el.type !== "acVoltageSource") return;
    elementCurrents[el.id] = x[n + k];
    elementVoltages[el.id] = phasor(el.magnitude, el.phase);
  });

  // Passive elements: V = V(n+) - V(n-), I = V/Z
  for (const el of circuit.elements) {
    if (el.type === "acVoltageSource" || el.type === "acCurrentSource") continue;
    const v = cSub(nodeVoltages[el.nPlus], nodeVoltages[el.nMinus]);
    elementVoltages[el.id] = v;
    const z_el = impedance(el, omega);
    elementCurrents[el.id] = z_el ? cDiv(v, z_el) : c(0);
  }

  // Current sources: known current, voltage = V(n+) - V(n-)
  for (const el of circuit.elements) {
    if (el.type !== "acCurrentSource") continue;
    elementVoltages[el.id] = cSub(
      nodeVoltages[el.nPlus],
      nodeVoltages[el.nMinus]
    );
    elementCurrents[el.id] = phasor(el.magnitude, el.phase);
  }

  return { frequency: circuit.frequency, omega, nodeVoltages, elementVoltages, elementCurrents };
}

// Convenience: convert complex to magnitude/phase for display
export function toPolar(z: Complex): { magnitude: number; phaseDeg: number } {
  const magnitude = Math.sqrt(z.re * z.re + z.im * z.im);
  const phaseDeg = (Math.atan2(z.im, z.re) * 180) / Math.PI;
  return { magnitude, phaseDeg };
}

export function isACError(r: ACSolutionResult | SolverError): r is SolverError {
  return (r as SolverError).error !== undefined;
}