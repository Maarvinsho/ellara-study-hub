"use client";

import { Element } from "@/lib/solver/types";

interface ElementRowProps {
  element: Element;
  numNodes: number;
  onUpdate: (patch: Partial<Element>) => void;
  onRemove: () => void;
}

export default function ElementRow({
  element,
  numNodes,
  onUpdate,
  onRemove,
}: ElementRowProps) {
  const nodeOptions = Array.from({ length: numNodes }, (_, i) => i);

  const valueField = () => {
    if (element.type === "resistor") {
      return (
        <input
          type="number"
          value={element.resistance}
          onChange={(e) => onUpdate({ resistance: parseFloat(e.target.value) || 0 })}
          className="w-24 border rounded px-2 py-1 text-sm text-right font-mono"
          min={0.01}
          step={1}
        />
      );
    }
    if (element.type === "voltageSource") {
      return (
        <input
          type="number"
          value={element.voltage}
          onChange={(e) => onUpdate({ voltage: parseFloat(e.target.value) || 0 })}
          className="w-24 border rounded px-2 py-1 text-sm text-right font-mono"
          step={0.1}
        />
      );
    }
    return (
      <input
        type="number"
        value={element.current}
        onChange={(e) => onUpdate({ current: parseFloat(e.target.value) || 0 })}
        className="w-24 border rounded px-2 py-1 text-sm text-right font-mono"
        step={0.001}
      />
    );
  };

  const unitLabel =
    element.type === "resistor" ? "Ω" : element.type === "voltageSource" ? "V" : "A";

  const typeLabel =
    element.type === "resistor"
      ? "R"
      : element.type === "voltageSource"
      ? "V-source"
      : "I-source";

  return (
    <div className="flex items-center gap-2 py-2 border-b">
      <span className="font-mono text-sm w-20 text-gray-600">
        {element.id} <span className="text-xs text-gray-400">({typeLabel})</span>
      </span>

      <label className="text-xs text-gray-500">n+</label>
      <select
        value={element.nPlus}
        onChange={(e) => onUpdate({ nPlus: parseInt(e.target.value) })}
        className="border rounded px-2 py-1 text-sm"
      >
        {nodeOptions.map((n) => (
          <option key={n} value={n}>
            {n}
            {n === 0 ? " (gnd)" : ""}
          </option>
        ))}
      </select>

      <label className="text-xs text-gray-500">n−</label>
      <select
        value={element.nMinus}
        onChange={(e) => onUpdate({ nMinus: parseInt(e.target.value) })}
        className="border rounded px-2 py-1 text-sm"
      >
        {nodeOptions.map((n) => (
          <option key={n} value={n}>
            {n}
            {n === 0 ? " (gnd)" : ""}
          </option>
        ))}
      </select>

      <div className="flex-1" />

      {valueField()}
      <span className="text-sm text-gray-500 w-4">{unitLabel}</span>

      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 text-sm ml-2 px-2"
        aria-label="Remove element"
      >
        ✕
      </button>
    </div>
  );
}