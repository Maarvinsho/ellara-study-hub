"use client";

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  formatValue?: (v: number) => string;
}

export default function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
  formatValue,
}: SliderProps) {
  const display = formatValue ? formatValue(value) : value.toString();

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-gray-600 font-mono">
          {display} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}