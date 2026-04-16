"use client";

import { useMemo, useState } from "react";
import Slider from "@/lib/components/Slider";
import TransientPlot from "@/lib/components/TransientPlot";
import {
  rlInductorCurrent,
  rlInductorVoltage,
  rlTau,
  timeAxis,
  suggestedTimeWindow,
} from "@/lib/simulator/transient";

type Mode = "energizing" | "de-energizing";

export default function RLSimulatorPage() {
  const [R, setR] = useState(100); // ohms
  const [L, setL] = useState(0.01); // henries (10 mH)
  const [Vs, setVs] = useState(5); // volts
  const [mode, setMode] = useState<Mode>("energizing");

  const tau = rlTau(R, L);
  const iFinalSteadyState = Vs / R;
  const i0 = mode === "energizing" ? 0 : iFinalSteadyState;
  const Vsource = mode === "energizing" ? Vs : 0;

  const { currentSeries, voltageSeries } = useMemo(() => {
    const tMax = suggestedTimeWindow(tau);
    const times = timeAxis(tMax, 200);
    return {
      currentSeries: rlInductorCurrent(Vsource, i0, R, L, times),
      voltageSeries: rlInductorVoltage(Vsource, i0, R, L, times),
    };
  }, [R, L, Vsource, i0, tau]);

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">RL Circuit</h1>
        <p className="text-gray-600 text-sm">
          First-order transient response. Time constant τ = L/R ={" "}
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
                onClick={() => setMode("energizing")}
                className={`flex-1 rounded px-3 py-2 text-sm ${
                  mode === "energizing"
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:border-blue-400"
                }`}
              >
                Energizing
              </button>
              <button
                onClick={() => setMode("de-energizing")}
                className={`flex-1 rounded px-3 py-2 text-sm ${
                  mode === "de-energizing"
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:border-blue-400"
                }`}
              >
                De-energizing
              </button>
            </div>
          </div>

          <Slider
            label="Resistance R"
            value={R}
            onChange={setR}
            min={10}
            max={1000}
            step={10}
            unit="Ω"
            formatValue={(v) => v.toFixed(0)}
          />

          <Slider
            label="Inductance L"
            value={L}
            onChange={setL}
            min={1e-4}
            max={0.1}
            step={1e-4}
            unit="H"
            formatValue={(v) => `${(v * 1000).toFixed(2)} m`}
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
            <div>τ = L/R = {formatTau(tau)}</div>
            <div>5τ = {formatTau(5 * tau)}</div>
            <div>i(0⁺) = {i0.toFixed(4)} A</div>
            <div>i(∞) = {(Vsource / R).toFixed(4)} A</div>
          </div>
        </aside>

        <section className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-2 text-sm">Inductor current iL(t)</h3>
            <TransientPlot
              series={[{ name: "iL", color: "#dc2626", data: currentSeries }]}
              yLabel="A"
              tau={tau}
            />
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold mb-2 text-sm">Inductor voltage vL(t)</h3>
            <TransientPlot
              series={[{ name: "vL", color: "#2563eb", data: voltageSeries }]}
              yLabel="V"
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