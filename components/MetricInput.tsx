import React from 'react';
import { MetricConfig } from '../types';

interface MetricInputProps {
  config: MetricConfig;
  value: number;
  onChange: (value: number) => void;
}

export const MetricInput: React.FC<MetricInputProps> = ({ config, value, onChange }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-slate-700">{config.label}</label>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{value} / 5</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      />
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>{config.minLabel}</span>
        <span>{config.maxLabel}</span>
      </div>
    </div>
  );
};
