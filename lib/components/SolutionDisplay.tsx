"use client";

import { Circuit } from "@/lib/solver/types";
import { solveDC, isError } from "@/lib/solver/mna";

interface SolutionDisplayProps {
  circuit: Circuit;
}

export default function SolutionDisplay({ circuit }: SolutionDisplayProps) {
  if (circuit.elements.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Add elements to see the solution.
      </div>
    );
  }

  const result = solveDC(circuit);

  if (isError(result)) {
    return <div className="text-red-600 text-sm">{result.error}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Node voltages</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="text-left py-1 font-medium">Node</th>
              <th className="text-right py-1 font-medium">V</th>
            </tr>
          </thead>
          <tbody>
            {result.nodeVoltages.map((v, i) => (
              <tr key={i} className="border-b">
                <td className="py-1 font-mono">
                  {i === 0 ? "0 (gnd)" : i}
                </td>
                <td className="py-1 text-right font-mono">
                  {formatValue(v, "V")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Element results</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="text-left py-1 font-medium">Element</th>
              <th className="text-right py-1 font-medium">V drop</th>
              <th className="text-right py-1 font-medium">Current</th>
            </tr>
          </thead>
          <tbody>
            {circuit.elements.map((el) => (
              <tr key={el.id} className="border-b">
                <td className="py-1 font-mono">{el.id}</td>
                <td className="py-1 text-right font-mono">
                  {formatValue(result.elementVoltages[el.id], "V")}
                </td>
                <td className="py-1 text-right font-mono">
                  {formatValue(result.elementCurrents[el.id], "A")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatValue(v: number, unit: string): string {
  const abs = Math.abs(v);
  if (abs === 0) return `0 ${unit}`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(3)} k${unit}`;
  if (abs >= 1) return `${v.toFixed(3)} ${unit}`;
  if (abs >= 1e-3) return `${(v * 1e3).toFixed(3)} m${unit}`;
  if (abs >= 1e-6) return `${(v * 1e6).toFixed(3)} µ${unit}`;
  return `${v.toExponential(3)} ${unit}`;
}