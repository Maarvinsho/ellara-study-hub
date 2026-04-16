"use client";

import { useState } from "react";
import { solveAC, isACError, toPolar } from "@/lib/solver/mnaAC";
import {
  seriesRLCResonance,
  rcLowPass,
  simpleRL,
} from "@/lib/solver/examplesAC";
import { ACCircuit, Complex } from "@/lib/solver/types";

type ExampleKey = "resonance" | "lowpass" | "rl";

const examples: Record<ExampleKey, { name: string; circuit: ACCircuit; expected: string }> = {
  resonance: {
    name: "Series RLC at resonance (L=1mH, C=1µF, R=10Ω, f≈5033 Hz)",
    circuit: seriesRLCResonance,
    expected:
      "Source current should be ~1.0 A ∠0° (purely resistive at resonance). |V_L| ≈ |V_C|, opposite phase.",
  },
  lowpass: {
    name: "RC low-pass at cutoff (R=1kΩ, C=1µF, f≈159.15 Hz)",
    circuit: rcLowPass,
    expected:
      "Output V_2 should be ~0.707 V (−3 dB) at phase ≈ −45°.",
  },
  rl: {
    name: "Parallel RL (R=100Ω, L=10mH, f=1 kHz)",
    circuit: simpleRL,
    expected:
      "Source current leads through R (in phase), lags through L (−90°). Net source current lags by ≈ 32°.",
  },
};

export default function ACSolvePage() {
  const [key, setKey] = useState<ExampleKey>("resonance");
  const example = examples[key];
  const result = solveAC(example.circuit);

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AC Solver — Verification</h1>
        <p className="text-gray-600 text-sm">
          Same MNA framework as the DC solver, but with complex impedances at a single
          steady-state frequency. All quantities are phasors (peak magnitude, phase in
          degrees).
        </p>
      </header>

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Example circuit</label>
        <select
          value={key}
          onChange={(e) => setKey(e.target.value as ExampleKey)}
          className="border rounded px-3 py-2 w-full"
        >
          {Object.entries(examples).map(([k, v]) => (
            <option key={k} value={k}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 rounded-lg p-5 border mb-6">
        <h2 className="font-semibold mb-2">Expected</h2>
        <p className="text-sm text-gray-700">{example.expected}</p>
      </div>

      <div className="bg-white rounded-lg p-5 border">
        <h2 className="font-semibold mb-3">Solver output</h2>

        {isACError(result) ? (
          <div className="text-red-600 text-sm">{result.error}</div>
        ) : (
          <>
            <div className="text-xs text-gray-600 mb-3 font-mono">
              ω = {result.omega.toFixed(2)} rad/s · f = {result.frequency.toFixed(2)} Hz
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Node voltages (phasors)</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Node</th>
                    <th className="text-right py-1">|V|</th>
                    <th className="text-right py-1">∠V (°)</th>
                    <th className="text-right py-1 text-gray-400">Re + jIm</th>
                  </tr>
                </thead>
                <tbody>
                  {result.nodeVoltages.map((v, i) => {
                    const polar = toPolar(v);
                    return (
                      <tr key={i} className="border-b">
                        <td className="py-1 font-mono">
                          {i === 0 ? "0 (gnd)" : i}
                        </td>
                        <td className="py-1 text-right font-mono">
                          {polar.magnitude.toFixed(4)}
                        </td>
                        <td className="py-1 text-right font-mono">
                          {polar.phaseDeg.toFixed(2)}
                        </td>
                        <td className="py-1 text-right font-mono text-gray-400 text-xs">
                          {formatComplex(v)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Element results</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Element</th>
                    <th className="text-right py-1">|V|</th>
                    <th className="text-right py-1">∠V</th>
                    <th className="text-right py-1">|I|</th>
                    <th className="text-right py-1">∠I</th>
                  </tr>
                </thead>
                <tbody>
                  {example.circuit.elements.map((el) => {
                    const vp = toPolar(result.elementVoltages[el.id]);
                    const ip = toPolar(result.elementCurrents[el.id]);
                    return (
                      <tr key={el.id} className="border-b">
                        <td className="py-1 font-mono">{el.id}</td>
                        <td className="py-1 text-right font-mono">
                          {vp.magnitude.toFixed(4)}
                        </td>
                        <td className="py-1 text-right font-mono">
                          {vp.phaseDeg.toFixed(2)}°
                        </td>
                        <td className="py-1 text-right font-mono">
                          {ip.magnitude.toFixed(4)}
                        </td>
                        <td className="py-1 text-right font-mono">
                          {ip.phaseDeg.toFixed(2)}°
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <a href="/solve" className="block mt-8 text-sm text-gray-500 hover:underline">
        ← Back to DC solver
      </a>
    </main>
  );
}

function formatComplex(z: Complex): string {
  const re = z.re.toFixed(3);
  const imAbs = Math.abs(z.im).toFixed(3);
  const sign = z.im >= 0 ? "+" : "−";
  return `${re} ${sign} j${imAbs}`;
}