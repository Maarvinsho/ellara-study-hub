"use client";

import { useCircuitEditor } from "@/lib/solver/useCircuitEditor";
import ElementRow from "@/lib/components/ElementRow";
import SolutionDisplay from "@/lib/components/SolutionDisplay";
import {
  voltageDivider,
  parallelResistors,
  balancedBridge,
} from "@/lib/solver/examples";

export default function SolvePage() {
  const editor = useCircuitEditor();

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Solve</h1>
        <p className="text-gray-600 text-sm">
          Build a DC circuit by adding elements and choosing which nodes each connects
          to. Node 0 is ground. Solution updates in real time using Modified Nodal
          Analysis.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          {/* Node controls */}
          <div className="bg-white border rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Nodes</h2>
              <div className="flex gap-2">
                <button
                  onClick={editor.removeNode}
                  disabled={editor.state.numNodes <= 2}
                  className="text-sm border rounded px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  − Remove
                </button>
                <button
                  onClick={editor.addNode}
                  className="text-sm border rounded px-3 py-1 hover:bg-gray-50"
                >
                  + Add
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {editor.state.numNodes} total: 0 (ground) through {editor.state.numNodes - 1}
            </p>
          </div>

          {/* Elements */}
          <div className="bg-white border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Elements</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => editor.addElement("resistor")}
                  className="text-sm bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
                >
                  + Resistor
                </button>
                <button
                  onClick={() => editor.addElement("voltageSource")}
                  className="text-sm bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
                >
                  + V-source
                </button>
                <button
                  onClick={() => editor.addElement("currentSource")}
                  className="text-sm bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
                >
                  + I-source
                </button>
              </div>
            </div>

            {editor.state.elements.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-4 text-center">
                No elements yet. Add one above.
              </p>
            ) : (
              <div>
                {editor.state.elements.map((el) => (
                  <ElementRow
                    key={el.id}
                    element={el}
                    numNodes={editor.state.numNodes}
                    onUpdate={(patch) => editor.updateElement(el.id, patch)}
                    onRemove={() => editor.removeElement(el.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="bg-gray-50 border rounded-lg p-5">
            <h2 className="font-semibold mb-3">Load preset</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => editor.loadCircuit(voltageDivider)}
                className="text-sm border rounded px-3 py-1 hover:bg-white"
              >
                Voltage divider
              </button>
              <button
                onClick={() => editor.loadCircuit(parallelResistors)}
                className="text-sm border rounded px-3 py-1 hover:bg-white"
              >
                Parallel resistors
              </button>
              <button
                onClick={() => editor.loadCircuit(balancedBridge)}
                className="text-sm border rounded px-3 py-1 hover:bg-white"
              >
                Wheatstone bridge
              </button>
              <button
                onClick={editor.reset}
                className="text-sm border rounded px-3 py-1 hover:bg-white text-red-600"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Solution panel */}
        <aside className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-5 sticky top-4">
            <h2 className="font-semibold mb-4">Solution</h2>
            <SolutionDisplay circuit={editor.circuit} />
          </div>
        </aside>
      </div>

      <a href="/" className="block mt-8 text-sm text-gray-500 hover:underline">
        ← Back to home
      </a>
    </main>
  );
}