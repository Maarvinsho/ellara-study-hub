import { ACCircuit } from "./types";

// Series RLC at resonance.
// f = 1/(2π√LC). With L=1mH, C=1µF: f₀ ≈ 5032.92 Hz.
// At resonance, impedance is purely resistive = R, so current is in phase with source.
// With V=10V peak, R=10Ω: |I| = 1A, phase = 0°.
// V_L = V_C in magnitude but 180° out of phase; they cancel.
export const seriesRLCResonance: ACCircuit = {
  numNodes: 4, // 0=gnd, 1=after source, 2=after R, 3=after L
  frequency: 5032.92,
  elements: [
    { id: "V1", type: "acVoltageSource", nPlus: 1, nMinus: 0, magnitude: 10, phase: 0 },
    { id: "R1", type: "resistor", nPlus: 1, nMinus: 2, resistance: 10 },
    { id: "L1", type: "inductor", nPlus: 2, nMinus: 3, inductance: 1e-3 },
    { id: "C1", type: "capacitor", nPlus: 3, nMinus: 0, capacitance: 1e-6 },
  ],
};

// RC low-pass filter.
// Cutoff frequency f_c = 1/(2πRC). R=1kΩ, C=1µF → f_c ≈ 159.15 Hz.
// At f = f_c, output magnitude = 1/√2 ≈ 0.707 of input, phase lag = 45°.
export const rcLowPass: ACCircuit = {
  numNodes: 3,
  frequency: 159.15,
  elements: [
    { id: "V1", type: "acVoltageSource", nPlus: 1, nMinus: 0, magnitude: 1, phase: 0 },
    { id: "R1", type: "resistor", nPlus: 1, nMinus: 2, resistance: 1000 },
    { id: "C1", type: "capacitor", nPlus: 2, nMinus: 0, capacitance: 1e-6 },
  ],
};

// Simple RL circuit — AC current lags voltage.
// R=100Ω, L=10mH, f=1kHz → XL = 2π·1000·0.01 ≈ 62.83Ω
// Z = 100 + j62.83 → |Z| ≈ 118.1Ω, ∠Z ≈ 32.14°
// With V=10V∠0°: |I| ≈ 0.0847 A, ∠I ≈ -32.14°
export const simpleRL: ACCircuit = {
  numNodes: 2,
  frequency: 1000,
  elements: [
    { id: "V1", type: "acVoltageSource", nPlus: 1, nMinus: 0, magnitude: 10, phase: 0 },
    { id: "R1", type: "resistor", nPlus: 1, nMinus: 0, resistance: 100 },
    { id: "L1", type: "inductor", nPlus: 1, nMinus: 0, inductance: 0.01 },
  ],
};