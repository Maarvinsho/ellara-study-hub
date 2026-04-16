"use client";

import { useMemo, useState } from "react";
import Slider from "@/lib/components/Slider";
import TransientPlot from "@/lib/components/TransientPlot";
import {
  analyzeSeriesRLC,
  rlcCapacitorVoltage,
  rlcInductorCurrent,
  rlcSuggestedTimeWindow,
  timeAxis,
} from "@/lib/simulator/transient";

export default function RLCSimulatorPage() {
  const [R, setR] = useState(10); // ohms
  const [L, setL] = useState(0.001); // 1 mH
  const [C, setC] = useState(1e-6); // 1 µF
  const [Vs, setVs] = useState(5);

  const params = { R, L, C };
  const analysis = analyzeSeriesRLC(params);

  const { voltageSeries, currentSeries, tMax } = useMemo(() => {
    const tMax = rlcSuggestedTimeWindow(params);
    const times = timeAxis(tMax, 400);
    return {
      voltageSeries: rlcCapacitorVoltage(Vs, params, times),
      currentSeries: rlcInductorCurrent(Vs, params, times),
      tMax,
    };
  }, [R, L, C, Vs]);

  const badgeColor =
    analysis.type === "overdamped"
      ? "bg-blue-100 text-blue-800"
      : analysis.type === "critically damped"
      ? "bg-green-100 text-green-800"
      : "bg-orange-100 text-orange-800";

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Series RLC Circuit</h1>
        <p className="text-gray-600 text-sm">
          Second-order step response. Zero initial conditions, source Vs applied at t = 0.
        </p>
        <div className="mt-3">
          <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${badgeColor}`}>
            {analysis.type.toUpperCase()}
          </span>
          <span className="ml-3 text-sm text-gray-600">
            ζ = {analysis.zeta.toFixed(3)} · Q = {analysis.Q.toFixed(2)}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 bg-gray-50 rounded-lg p-5 border">
          <h2 className="font-semibold mb-4">Parameters</h2>

          <Slider
            label="Resistance R"
            value={R}
            onChange={setR}
            min={0.1}
            max={200}
            step={0.1}
            unit="Ω"
            formatValue={(v) => v.toFixed(1)}
          />

          <Slider
            label="Inductance L"
            value={L}
            onChange={setL}
            min={1e-5}
            max={0.01}
            step={1e-5}
            unit="H"
            formatValue={(v) => `${(v * 1000).toFixed(3)} m`}
          />

          <Slider
            label="Capacitance C"
            value={C}
            onChange={setC}
            min={1e-8}
            max={1e-5}
            step={1e-8}
            unit="F"
            formatValue={(v) => `${(v * 1e6).toFixed(3)} µ`}
          />

          <Slider
            label="Source Vs"
            value={Vs}
            onChange={setVs}
            min={1}
            max={20}
            step={0.5}
            unit="V"
          />

          <div className="mt-6 pt-4 border-t text-xs text-gray-600 font-mono space-y-1">
            <div>α = R/(2L) = {formatFreq(analysis.alpha)}</div>
            <div>ω₀ = 1/√(LC) = {formatFreq(analysis.omega0)}</div>
            {analysis.omegaD && (
              <div>ωd = {formatFreq(analysis.omegaD)}</div>
            )}
            {analysis.s1 !== undefined && (
              <div>s₁ = {formatFreq(analysis.s1)}</div>
            )}
            {analysis.s2 !== undefined && (
              <div>s₂ = {formatFreq(analysis.s2)}</div>
            )}
            <div className="pt-1 mt-1 border-t">window: {formatTime(tMax)}</div>
          </div>

          <div className="mt-4 p-3 bg-white rounded text-xs text-gray-700 leading-relaxed">
            {analysis.type === "overdamped" &&
              "α > ω₀. Two real roots. Response decays without oscillation — slowest to reach steady state."}
            {analysis.type === "critically damped" &&
              "α = ω₀. Repeated root. Fastest possible response without overshoot."}
            {analysis.type === "underdamped" &&
              "α < ω₀. Complex roots. Response oscillates at ωd while decaying envelope e^(−αt)."}
          </div>
        </aside>

        <section className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-2 text-sm">Capacitor voltage vC(t)</h3>
            <TransientPlot
              series={[{ name: "vC", color: "#2563eb", data: voltageSeries }]}
              yLabel="V"
            />
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-2 text-sm">Inductor current iL(t)</h3>
            <TransientPlot
              series={[{ name: "iL", color: "#dc2626", data: currentSeries }]}
              yLabel="A"
            />
          </div>
        </section>
      </div>

      <a href="/simulate" className="block mt-8 text-sm text-gray-500 hover:underline">
        ← Back to simulate
      </a>
    </main>
  );
}

function formatFreq(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1e6) return `${(v / 1e6).toFixed(2)}e6 rad/s`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(2)}e3 rad/s`;
  return `${v.toFixed(2)} rad/s`;
}

function formatTime(t: number): string {
  if (t >= 1) return `${t.toFixed(2)} s`;
  if (t >= 1e-3) return `${(t * 1e3).toFixed(2)} ms`;
  if (t >= 1e-6) return `${(t * 1e6).toFixed(2)} µs`;
  return `${(t * 1e9).toFixed(2)} ns`;
}