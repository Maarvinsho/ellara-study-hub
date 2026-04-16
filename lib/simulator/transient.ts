// Analytical solutions for first-order RC and RL transient responses.
// All functions return values sampled at the given time points.

export interface TimePoint {
  t: number;
  value: number;
}

// Generates `numPoints` evenly spaced time values from 0 to tMax.
export function timeAxis(tMax: number, numPoints: number = 200): number[] {
  const dt = tMax / (numPoints - 1);
  return Array.from({ length: numPoints }, (_, i) => i * dt);
}

// RC step response: capacitor charging from v0 toward Vs through R.
// v(t) = Vs + (v0 - Vs) * exp(-t/tau)
export function rcCapacitorVoltage(
  Vs: number,
  v0: number,
  R: number,
  C: number,
  times: number[]
): TimePoint[] {
  const tau = R * C;
  return times.map((t) => ({
    t,
    value: Vs + (v0 - Vs) * Math.exp(-t / tau),
  }));
}

// RC current through the resistor (same as through C in a simple series loop).
// i(t) = (Vs - v0)/R * exp(-t/tau)
export function rcCurrent(
  Vs: number,
  v0: number,
  R: number,
  C: number,
  times: number[]
): TimePoint[] {
  const tau = R * C;
  return times.map((t) => ({
    t,
    value: ((Vs - v0) / R) * Math.exp(-t / tau),
  }));
}

// Suggests a reasonable time window: 5 time constants covers >99% of response.
export function suggestedTimeWindow(tau: number): number {
  return 5 * tau;
}

// RL step response: inductor current rising from i0 toward Vs/R.
// i(t) = Vs/R + (i0 - Vs/R) * exp(-t/tau)  where tau = L/R
export function rlInductorCurrent(
  Vs: number,
  i0: number,
  R: number,
  L: number,
  times: number[]
): TimePoint[] {
  const tau = L / R;
  const iFinal = Vs / R;
  return times.map((t) => ({
    t,
    value: iFinal + (i0 - iFinal) * Math.exp(-t / tau),
  }));
}

// RL voltage across the inductor: vL(t) = L * di/dt = (Vs - i0 R) * exp(-t/tau)
export function rlInductorVoltage(
  Vs: number,
  i0: number,
  R: number,
  L: number,
  times: number[]
): TimePoint[] {
  const tau = L / R;
  return times.map((t) => ({
    t,
    value: (Vs - i0 * R) * Math.exp(-t / tau),
  }));
}

// Time constant for an RL circuit.
export function rlTau(R: number, L: number): number {
  return L / R;
}

// RLC analysis types
export type DampingType = "overdamped" | "critically damped" | "underdamped";

export interface RLCParameters {
  R: number;
  L: number;
  C: number;
}

export interface RLCAnalysis {
  alpha: number;       // Damping coefficient (Neper frequency)
  omega0: number;      // Undamped natural frequency
  omegaD?: number;     // Damped natural frequency (underdamped only)
  s1?: number;         // First root (overdamped/critical)
  s2?: number;         // Second root (overdamped)
  type: DampingType;
  Q: number;           // Quality factor
  zeta: number;        // Damping ratio
}

// Compute RLC characteristic roots and classify damping (series RLC).
export function analyzeSeriesRLC(p: RLCParameters): RLCAnalysis {
  const { R, L, C } = p;
  const alpha = R / (2 * L);
  const omega0 = 1 / Math.sqrt(L * C);
  const zeta = alpha / omega0;
  const Q = 1 / (2 * zeta);

  if (alpha > omega0) {
    // Overdamped: two distinct real roots
    const disc = Math.sqrt(alpha * alpha - omega0 * omega0);
    return {
      alpha,
      omega0,
      s1: -alpha + disc,
      s2: -alpha - disc,
      type: "overdamped",
      Q,
      zeta,
    };
  } else if (Math.abs(alpha - omega0) / omega0 < 1e-4) {
    // Critically damped: repeated real root
    return {
      alpha,
      omega0,
      s1: -alpha,
      type: "critically damped",
      Q,
      zeta,
    };
  } else {
    // Underdamped: complex conjugate roots
    const omegaD = Math.sqrt(omega0 * omega0 - alpha * alpha);
    return {
      alpha,
      omega0,
      omegaD,
      type: "underdamped",
      Q,
      zeta,
    };
  }
}

// Series RLC step response for capacitor voltage with zero initial conditions.
// Source Vs applied at t=0, iL(0)=0, vC(0)=0.
// Solves: L C d²v/dt² + RC dv/dt + v = Vs
// Steady state: v(∞) = Vs
export function rlcCapacitorVoltage(
  Vs: number,
  p: RLCParameters,
  times: number[]
): TimePoint[] {
  const a = analyzeSeriesRLC(p);

  if (a.type === "overdamped") {
    const s1 = a.s1!;
    const s2 = a.s2!;
    // v(t) = Vs + A1 e^(s1 t) + A2 e^(s2 t)
    // IC: v(0)=0 → A1 + A2 = -Vs
    // IC: dv/dt(0)=0 (since iL(0)=0, and i=C dv/dt) → s1 A1 + s2 A2 = 0
    const A1 = (-Vs * s2) / (s2 - s1);
    const A2 = (Vs * s1) / (s2 - s1);
    return times.map((t) => ({
      t,
      value: Vs + A1 * Math.exp(s1 * t) + A2 * Math.exp(s2 * t),
    }));
  }

  if (a.type === "critically damped") {
    const s1 = a.s1!;
    // v(t) = Vs + (A1 + A2 t) e^(s1 t)
    // IC: v(0)=0 → A1 = -Vs
    // IC: dv/dt(0)=0 → s1 A1 + A2 = 0 → A2 = -s1 A1 = s1 Vs
    const A1 = -Vs;
    const A2 = s1 * Vs;
    return times.map((t) => ({
      t,
      value: Vs + (A1 + A2 * t) * Math.exp(s1 * t),
    }));
  }

  // Underdamped
  const alpha = a.alpha;
  const omegaD = a.omegaD!;
  // v(t) = Vs + e^(-αt) [B1 cos(ωd t) + B2 sin(ωd t)]
  // IC: v(0)=0 → B1 = -Vs
  // IC: dv/dt(0)=0 → -α B1 + ωd B2 = 0 → B2 = α B1 / ωd = -α Vs / ωd
  const B1 = -Vs;
  const B2 = (-alpha * Vs) / omegaD;
  return times.map((t) => ({
    t,
    value:
      Vs +
      Math.exp(-alpha * t) *
        (B1 * Math.cos(omegaD * t) + B2 * Math.sin(omegaD * t)),
  }));
}

// Inductor current i(t) = C dv/dt where v is the capacitor voltage above.
// We differentiate each case analytically.
export function rlcInductorCurrent(
  Vs: number,
  p: RLCParameters,
  times: number[]
): TimePoint[] {
  const { C } = p;
  const a = analyzeSeriesRLC(p);

  if (a.type === "overdamped") {
    const s1 = a.s1!;
    const s2 = a.s2!;
    const A1 = (-Vs * s2) / (s2 - s1);
    const A2 = (Vs * s1) / (s2 - s1);
    return times.map((t) => ({
      t,
      value: C * (A1 * s1 * Math.exp(s1 * t) + A2 * s2 * Math.exp(s2 * t)),
    }));
  }

  if (a.type === "critically damped") {
    const s1 = a.s1!;
    const A1 = -Vs;
    const A2 = s1 * Vs;
    // dv/dt = (A2 + s1(A1 + A2 t)) e^(s1 t)
    return times.map((t) => ({
      t,
      value: C * (A2 + s1 * (A1 + A2 * t)) * Math.exp(s1 * t),
    }));
  }

  const alpha = a.alpha;
  const omegaD = a.omegaD!;
  const B1 = -Vs;
  const B2 = (-alpha * Vs) / omegaD;
  // dv/dt = e^(-αt) [(-αB1 + ωdB2) cos + (-αB2 - ωdB1) sin]
  return times.map((t) => ({
    t,
    value:
      C *
      Math.exp(-alpha * t) *
      ((-alpha * B1 + omegaD * B2) * Math.cos(omegaD * t) +
        (-alpha * B2 - omegaD * B1) * Math.sin(omegaD * t)),
  }));
}

// Suggest a good time window for RLC — long enough to see the response settle
export function rlcSuggestedTimeWindow(p: RLCParameters): number {
  const a = analyzeSeriesRLC(p);
  if (a.type === "underdamped") {
    // Want to see at least a few oscillations and significant decay
    const settleTime = 5 / a.alpha;
    const periodTime = 10 * (2 * Math.PI) / a.omegaD!;
    return Math.max(settleTime, periodTime);
  }
  // Over/critical: settle time dominates
  return 5 / a.alpha;
}