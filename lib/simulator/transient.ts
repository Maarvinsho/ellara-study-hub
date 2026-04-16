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