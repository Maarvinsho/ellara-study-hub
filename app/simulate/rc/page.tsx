"use client";

import { useMemo, useState } from "react";
import Slider from "@/lib/components/Slider";
import TransientPlot from "@/lib/components/TransientPlot";
import {
  rcCapacitorVoltage,
  rcCurrent,
  timeAxis,
  suggestedTimeWindow,
} from "@/lib/simulator/transient";

type Mode = "charging" | "discharging";

export default function RCSimulatorPage() {
  const [R, setR] = useState(1000); // ohms
  const [C, setC] = useState(1e-6); // farads
  const [Vs, setVs] = useState(5); // volts
  const [mode, setMode] = useState<Mode>("charging");

  const tau = R * C;
  const v0 = mode === "charging" ? 0 : Vs;
  const Vsource = mode === "charging" ? Vs : 0;

  const { voltageSeries, currentSeries } = useMemo(() => {
    const tMax = suggestedTimeWindow(tau);
    const times = timeAxis(tMax, 200);
    return {
      voltageSeries: rcCapacitorVoltage(Vsource, v0, R, C, times),
      currentSeries: rcCurrent(Vsource, v0, R, C, times),
    };
  }, [R, C, Vsource, v0, tau]);

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">RC Circuit</h1>
        <p className="text-gray-600 text-sm">
          First-order transient response. Time constant τ = RC ={" "}
          <span className="font-mono">{formatTau(tau)}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 bg-gray-50 rounded-lg p-5 border">
          <h2 className="font-semibold mb-4">Parameters</h2>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("charging")}
                className={`flex-1 rounded px-3 py-2 text-sm ${
                  mode === "charging"
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:border-blue-400"
                }`}
              >
                Charging
              </button>
              <button
                onClick={() => setMode("discharging")}
                className={`flex-1 rounded px-3 py-2 text-sm ${
                  mode === "discharging"
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:border-blue-400"
                }`}
              >
                Discharging
              </button>
            </div>
          </div>

          <Slider
            label="Resistance R"
            value={R}
            onChange={setR}
            min={100}
            max={10000}
            step={100}
            unit="Ω"
            formatValue={(v) => v.toFixed(0)}
          />

          <Slider
            label="Capacitance C"
            value={C}
            onChange={setC}
            min={1e-7}
            max={1e-5}
            step={1e-7}
            unit="F"
            formatValue={(v) => `${(v * 1e6).toFixed(2)} µ`}
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
            <div>τ = RC = {formatTau(tau)}</div>
            <div>5τ = {formatTau(5 * tau)}</div>
            <div>v(0⁺) = {v0.toFixed(2)} V</div>
            <div>v(∞) = {Vsource.toFixed(2)} V</div>
          </div>
        </aside>

        <section className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-2 text-sm">Capacitor voltage vC(t)</h3>
            <TransientPlot
              series={[{ name: "vC", color: "#2563eb", data: voltageSeries }]}
              yLabel="V"
              tau={tau}
            />
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-2 text-sm">Current i(t)</h3>
            <TransientPlot
              series={[{ name: "i", color: "#dc2626", data: currentSeries }]}
              yLabel="A"
              tau={tau}
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

function formatTau(t: number): string {
  if (t >= 1) return `${t.toFixed(2)} s`;
  if (t >= 1e-3) return `${(t * 1e3).toFixed(2)} ms`;
  if (t >= 1e-6) return `${(t * 1e6).toFixed(2)} µs`;
  return `${(t * 1e9).toFixed(2)} ns`;
}