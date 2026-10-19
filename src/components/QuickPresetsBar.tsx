import React from 'react';
import { QUICK_PRESETS } from '../domain/constants';
import type { QuickPreset } from '../domain/types';

interface QuickPresetsBarProps {
  activePresetId: string | null;
  onSelectPreset: (preset: QuickPreset) => void;
}

export const QuickPresetsBar: React.FC<QuickPresetsBarProps> = ({
  activePresetId,
  onSelectPreset,
}) => {
  return (
    <section
      aria-labelledby="presets-heading"
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h2
          id="presets-heading"
          className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"
        >
          <svg
            className="w-4 h-4 text-trail-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Coba Preset Rute &amp; Lomba Populer:
        </h2>
        <span className="text-xs text-slate-500">
          Pilih skenario 1-klik untuk mengisi kalkulator secara instan
        </span>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Preset Skenario Rute Trail">
        {QUICK_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectPreset(preset)}
              title={preset.contextNote}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus:ring-3 focus:ring-trail-700/30 ${
                isSelected
                  ? 'bg-trail-800 border border-trail-800 text-white shadow-sm'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-stone-50 hover:border-slate-400'
              }`}
            >
              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-emerald-300" aria-hidden="true" />
              )}
              <span>{preset.name}</span>
              <span
                className={`font-mono text-[11px] ${
                  isSelected ? 'text-emerald-100' : 'text-slate-500'
                }`}
              >
                ({preset.subtitle})
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
