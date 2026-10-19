import React from 'react';
import { TERRAIN_LIST } from '../domain/constants';
import type { FieldValidationErrors, RawCalculatorInput, TerrainId } from '../domain/types';

interface RouteInputPanelProps {
  input: RawCalculatorInput;
  errors: FieldValidationErrors;
  onChangeField: <K extends keyof RawCalculatorInput>(
    field: K,
    value: RawCalculatorInput[K]
  ) => void;
  onResetDefault: () => void;
  onClearAll: () => void;
}

export const RouteInputPanel: React.FC<RouteInputPanelProps> = ({
  input,
  errors,
  onChangeField,
  onResetDefault,
  onClearAll,
}) => {
  const handleTerrainKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    currentIndex: number
  ) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % TERRAIN_LIST.length;
      const nextTerrain = TERRAIN_LIST[nextIndex];
      if (nextTerrain) {
        onChangeField('terrainId', nextTerrain.id);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + TERRAIN_LIST.length) % TERRAIN_LIST.length;
      const prevTerrain = TERRAIN_LIST[prevIndex];
      if (prevTerrain) {
        onChangeField('terrainId', prevTerrain.id);
      }
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const currentTerrain = TERRAIN_LIST[currentIndex];
      if (currentTerrain) {
        onChangeField('terrainId', currentTerrain.id);
      }
    }
  };

  return (
    <section
      aria-labelledby="input-panel-heading"
      className="md:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-6"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 gap-2 flex-wrap">
        <div>
          <h2 id="input-panel-heading" className="text-base font-bold text-slate-900">
            Parameter Rute &amp; Pace
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hasil dihitung otomatis saat angka diketik
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-trail-700/30"
          >
            Kosongkan
          </button>
          <button
            type="button"
            onClick={onResetDefault}
            className="text-xs font-semibold text-trail-800 hover:text-trail-900 bg-trail-50 hover:bg-trail-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-trail-700/30"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3A. INPUT INTI: JARAK & ELEVASI D+ */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          1. Spesifikasi Rute Trail (Wajib)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field: Jarak Trail */}
          <div>
            <label
              htmlFor="input-distance"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Jarak Rute Trail
            </label>
            <div className="relative flex items-center">
              <input
                id="input-distance"
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0.1"
                max="500"
                value={input.distanceKm}
                onChange={(e) => onChangeField('distanceKm', e.target.value)}
                placeholder="Misal: 21"
                aria-invalid={Boolean(errors.distance)}
                aria-describedby={errors.distance ? 'error-distance' : 'helper-distance'}
                className={`w-full h-12 pl-3.5 pr-12 text-lg font-mono font-semibold tabular-nums rounded-lg transition-all focus:outline-none ${
                  errors.distance
                    ? 'bg-red-50/40 border-2 border-red-600 text-red-900 focus:ring-3 focus:ring-red-600/20'
                    : 'bg-white border border-slate-300 text-slate-900 hover:border-slate-400 focus:border-trail-700 focus:ring-3 focus:ring-trail-700/20'
                }`}
              />
              <span className="absolute right-1.5 px-2 py-1 text-xs font-bold text-slate-600 bg-stone-100 rounded-md pointer-events-none">
                km
              </span>
            </div>
            {errors.distance ? (
              <p
                id="error-distance"
                role="alert"
                className="mt-1.5 text-xs font-medium text-red-700 leading-snug flex items-start gap-1"
              >
                <span aria-hidden="true">⚠️</span>
                <span>{errors.distance}</span>
              </p>
            ) : (
              <p id="helper-distance" className="mt-1.5 text-xs text-slate-500 leading-snug">
                Jarak horizontal sesuai info lomba/rute.
              </p>
            )}
          </div>

          {/* Field: Total Tanjakan D+ */}
          <div>
            <label
              htmlFor="input-elevation"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Total Tanjakan (D+)
            </label>
            <div className="relative flex items-center">
              <input
                id="input-elevation"
                type="number"
                inputMode="numeric"
                step="50"
                min="0"
                max="25000"
                value={input.elevationGainM}
                onChange={(e) => onChangeField('elevationGainM', e.target.value)}
                placeholder="Misal: 1000"
                aria-invalid={Boolean(errors.elevation)}
                aria-describedby={errors.elevation ? 'error-elevation' : 'helper-elevation'}
                className={`w-full h-12 pl-3.5 pr-14 text-lg font-mono font-semibold tabular-nums rounded-lg transition-all focus:outline-none ${
                  errors.elevation
                    ? 'bg-red-50/40 border-2 border-red-600 text-red-900 focus:ring-3 focus:ring-red-600/20'
                    : 'bg-white border border-slate-300 text-slate-900 hover:border-slate-400 focus:border-trail-700 focus:ring-3 focus:ring-trail-700/20'
                }`}
              />
              <span className="absolute right-1.5 px-2 py-1 text-xs font-bold text-terracotta-700 bg-terracotta-50 border border-terracotta-600/20 rounded-md pointer-events-none">
                m D+
              </span>
            </div>
            {errors.elevation ? (
              <p
                id="error-elevation"
                role="alert"
                className="mt-1.5 text-xs font-medium text-red-700 leading-snug flex items-start gap-1"
              >
                <span aria-hidden="true">⚠️</span>
                <span>{errors.elevation}</span>
              </p>
            ) : (
              <p id="helper-elevation" className="mt-1.5 text-xs text-slate-500 leading-snug">
                Kumulatif naik (100m D+ = +1 km datar).
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3B. TERRAIN TECHNICALITY SELECTOR */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span
            id="terrain-group-label"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            2. Karakteristik Medan (Terrain Modifier)
          </span>
        </div>

        <div
          className="space-y-2.5"
          role="radiogroup"
          aria-labelledby="terrain-group-label"
        >
          {TERRAIN_LIST.map((terrain, index) => {
            const isSelected = input.terrainId === terrain.id;
            return (
              <div
                key={terrain.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onChangeField('terrainId', terrain.id as TerrainId)}
                onKeyDown={(e) => handleTerrainKeyDown(e, index)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 focus:outline-none focus:ring-3 focus:ring-trail-700/30 ${
                  isSelected
                    ? 'border-2 border-trail-700 bg-trail-50/70 shadow-xs'
                    : 'border border-slate-200 bg-white hover:bg-stone-50/80 hover:border-slate-300'
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-trail-700' : 'border border-slate-300'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-sm font-bold ${
                        isSelected ? 'text-slate-900' : 'text-slate-800'
                      }`}
                    >
                      {terrain.label}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-md ${
                        isSelected
                          ? 'bg-trail-800 text-white'
                          : terrain.id === 'technical'
                            ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-600/20'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      +{terrain.percentageBonus}% Effort
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 leading-snug ${
                      isSelected ? 'text-slate-700' : 'text-slate-600'
                    }`}
                  >
                    {terrain.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3C. INPUT OPSIONAL: FLAT ROAD PACE */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label
            htmlFor="input-pace-min"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            3. Kemampuan Lari Datar (Opsional)
          </label>
          <span className="text-[11px] font-semibold text-trail-800 bg-trail-50 px-2 py-0.5 rounded-md">
            Untuk Estimasi Waktu
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold text-slate-800">
              Flat Road Pace Anda (Opsional)
            </span>
            {(input.paceMinutes !== '' || input.paceSeconds !== '') && (
              <button
                type="button"
                onClick={() => {
                  onChangeField('paceMinutes', '');
                  onChangeField('paceSeconds', '');
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Kosongkan Pace
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <input
                id="input-pace-min"
                type="number"
                inputMode="numeric"
                min="2"
                max="20"
                placeholder="06"
                value={input.paceMinutes}
                onChange={(e) => onChangeField('paceMinutes', e.target.value)}
                aria-label="Menit per kilometer"
                aria-invalid={Boolean(errors.pace)}
                aria-describedby={errors.pace ? 'error-pace' : 'helper-pace'}
                className={`w-full h-12 pl-3.5 pr-12 text-lg font-mono font-semibold tabular-nums rounded-lg focus:outline-none ${
                  errors.pace
                    ? 'bg-red-50/40 border-2 border-red-600 text-red-900 focus:ring-3 focus:ring-red-600/20'
                    : 'bg-white border border-slate-300 text-slate-900 hover:border-slate-400 focus:border-trail-700 focus:ring-3 focus:ring-trail-700/20'
                }`}
              />
              <span className="absolute right-2 px-1.5 py-0.5 text-xs font-semibold text-slate-500 bg-stone-100 rounded pointer-events-none">
                mnt
              </span>
            </div>
            <span className="text-xl font-mono font-bold text-slate-400">:</span>
            <div className="relative flex-1 flex items-center">
              <input
                id="input-pace-sec"
                type="number"
                inputMode="numeric"
                min="0"
                max="59"
                placeholder="00"
                value={input.paceSeconds}
                onChange={(e) => onChangeField('paceSeconds', e.target.value)}
                aria-label="Detik per kilometer"
                aria-invalid={Boolean(errors.pace)}
                aria-describedby={errors.pace ? 'error-pace' : 'helper-pace'}
                className={`w-full h-12 pl-3.5 pr-12 text-lg font-mono font-semibold tabular-nums rounded-lg focus:outline-none ${
                  errors.pace
                    ? 'bg-red-50/40 border-2 border-red-600 text-red-900 focus:ring-3 focus:ring-red-600/20'
                    : 'bg-white border border-slate-300 text-slate-900 hover:border-slate-400 focus:border-trail-700 focus:ring-3 focus:ring-trail-700/20'
                }`}
              />
              <span className="absolute right-2 px-1.5 py-0.5 text-xs font-semibold text-slate-500 bg-stone-100 rounded pointer-events-none">
                dtk
              </span>
            </div>
            <span className="text-sm font-bold text-slate-600 shrink-0 pl-1">/ km</span>
          </div>

          {errors.pace ? (
            <p
              id="error-pace"
              role="alert"
              className="mt-1.5 text-xs font-medium text-red-700 leading-snug flex items-start gap-1"
            >
              <span aria-hidden="true">⚠️</span>
              <span>{errors.pace}</span>
            </p>
          ) : (
            <p id="helper-pace" className="mt-1.5 text-xs text-slate-500 leading-snug">
              Masukkan pace rata-rata Anda saat lari jarak menengah/jauh di jalan raya datar.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
