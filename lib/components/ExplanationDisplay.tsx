"use client";

import { Circuit } from "@/lib/solver/types";
import { explainDC } from "@/lib/solver/explain";

interface ExplanationDisplayProps {
  circuit: Circuit;
}

export default function ExplanationDisplay({ circuit }: ExplanationDisplayProps) {
  if (circuit.elements.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Add elements to see the step-by-step working.
      </div>
    );
  }

  const exp = explainDC(circuit);

  return (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="font-semibold mb-2">Step 1 — Identify unknowns</h3>
        <p className="text-gray-700 leading-relaxed">
          There are {exp.numNodes - 1} non-ground node{exp.numNodes > 2 ? "s" : ""} (V
          <sub>1</sub> through V<sub>{exp.numNodes - 1}</sub>) plus {exp.numVoltageSources}{" "}
          voltage-source current{exp.numVoltageSources === 1 ? "" : "s"}. Total unknowns:{" "}
          <strong>{exp.matrixSize}</strong>. We build an {exp.matrixSize}×{exp.matrixSize}{" "}
          matrix equation A·x = z.
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Step 2 — Write KCL at each node</h3>
        <div className="bg-gray-50 rounded p-3 font-mono text-xs space-y-2">
          {exp.nodeEquations.map((eq, i) => (
            <div key={i}>
              <span className="text-gray-500">Node {i + 1}: </span>
              {eq}
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-xs mt-2 italic">
          Sum of currents leaving each node equals zero.
        </p>
      </section>

      {exp.conductanceStamps.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">Step 3 — Stamp conductances</h3>
          <p className="text-gray-700 mb-2 text-xs">
            Each resistor contributes G = 1/R to the self-conductance of both its nodes,
            and −G to the mutual terms between them.
          </p>
          <ul className="space-y-1 text-xs">
            {exp.conductanceStamps.map((s, i) => (
              <li key={i} className="font-mono">• {s.description}</li>
            ))}
          </ul>
        </section>
      )}

      {exp.currentSourceStamps.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">Step 4 — Stamp current sources</h3>
          <ul className="space-y-1 text-xs">
            {exp.currentSourceStamps.map((s, i) => (
              <li key={i} className="font-mono">• {s.description}</li>
            ))}
          </ul>
        </section>
      )}

      {exp.voltageSourceStamps.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">Step 5 — Add voltage source constraints (MNA)</h3>
          <p className="text-gray-700 mb-2 text-xs">
            Each voltage source adds one equation (V<sub>n+</sub> − V<sub>n−</sub> =
            V<sub>s</sub>) and one unknown (the current through the source).
          </p>
          <ul className="space-y-1 text-xs">
            {exp.voltageSourceStamps.map((s, i) => (
              <li key={i} className="font-mono">• {s.description}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="font-semibold mb-2">Step 6 — Assembled system A·x = z</h3>
        <div className="overflow-x-auto">
          <table className="text-xs font-mono">
            <tbody>
              {exp.matrixA.map((row, i) => (
                <tr key={i}>
                  <td className="pr-2 text-gray-500 text-right">
                    {exp.rowLabels[i]}:
                  </td>
                  <td>
                    <span className="text-gray-400">[</span>
                    {row.map((v, j) => (
                      <span
                        key={j}
                        className="inline-block w-16 text-right tabular-nums"
                      >
                        {formatCell(v)}
                      </span>
                    ))}
                    <span className="text-gray-400"> ]</span>
                  </td>
                  <td className="pl-2 text-gray-400">·</td>
                  <td className="pl-2 text-gray-600">x</td>
                  <td className="pl-4 text-gray-400">=</td>
                  <td className="pl-2 tabular-nums text-right w-20">
                    {formatCell(exp.vectorZ[i])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-xs mt-2 italic">
          Solution vector x = [V<sub>1</sub>, ..., V<sub>{exp.numNodes - 1}</sub>
          {exp.numVoltageSources > 0 ? ", source currents..." : ""}]
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Step 7 — Solve</h3>
        <p className="text-gray-700 text-xs">
          The system is solved using LU decomposition (math.js{" "}
          <code className="bg-gray-100 px-1 rounded">lusolve</code>). See the{" "}
          <strong>Solution</strong> panel for the resulting node voltages and element
          currents.
        </p>
      </section>
    </div>
  );
}

function formatCell(v: number): string {
  if (v === 0) return "0";
  if (Math.abs(v) >= 1 && Math.abs(v) < 1000) return v.toFixed(3);
  return v.toExponential(2);
}