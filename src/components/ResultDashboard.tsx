import React, { useEffect, useRef, useState } from 'react';
import { formatShareableSummary } from '../domain/calculator';
import type { CalculationEvaluation } from '../domain/types';

interface ResultDashboardProps {
  evaluation: CalculationEvaluation;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({ evaluation }) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'fallback'>('idle');
  const fallbackTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Reset copy feedback whenever calculation result changes
  useEffect(() => {
    setCopyState('idle');
  }, [evaluation]);

  useEffect(() => {
    if (copyState !== 'copied') return;
    const timer = window.setTimeout(() => {
      setCopyState('idle');
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  useEffect(() => {
    if (copyState === 'fallback' && fallbackTextareaRef.current) {
      fallbackTextareaRef.current.focus();
      fallbackTextareaRef.current.select();
    }
  }, [copyState]);

  const handleCopySummary = async () => {
    if (evaluation.status !== 'valid') return;
    const summaryText = formatShareableSummary(evaluation.result);

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(summaryText);
        setCopyState('copied');
        return;
      }
      throw new Error('Clipboard API unavailable');
    } catch {
      // Fallback for restricted WebViews or denied permissions
      setCopyState('fallback');
    }
  };

  if (evaluation.status === 'empty') {
    return (
      <section
        aria-labelledby="result-heading"
        aria-live="polite"
        aria-atomic="true"
        className="md:col-span-7 md:sticky md:top-20 space-y-4"
      >
        <div className="bg-asphalt-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between gap-2">
            <span
              id="result-heading"
              className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Ekuivalen Jarak Jalan Raya (Road Equivalent)
            </span>
          </div>

          <div className="py-6 border-b border-slate-800">
            <div className="flex items-baseline gap-2.5">
              <span className="text-5xl sm:text-6xl font-mono font-extrabold tracking-tight tabular-nums text-slate-500">
                &mdash;
              </span>
              <span className="text-2xl font-bold text-slate-500">km</span>
            </div>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Masukkan jarak rute (km) dan total tanjakan D+ (m), atau pilih salah satu{' '}
              <strong className="text-white">Preset Rute Populer</strong> di atas untuk melihat
              konversi beban lari.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="w-full py-3.5 px-5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 font-semibold text-sm sm:text-base cursor-not-allowed opacity-70"
          >
            Lengkapi jarak &amp; elevasi untuk menyalin hasil
          </button>
        </div>
      </section>
    );
  }

  if (evaluation.status === 'invalid') {
    return (
      <section
        aria-labelledby="result-heading"
        aria-live="polite"
        aria-atomic="true"
        className="md:col-span-7 md:sticky md:top-20 space-y-4"
      >
        <div className="bg-asphalt-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between gap-2">
            <span
              id="result-heading"
              className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Menunggu Perbaikan Input Rute
            </span>
          </div>

          <div className="py-4 border-b border-slate-800">
            <div className="flex items-baseline gap-2.5">
              <span className="text-5xl sm:text-6xl font-mono font-extrabold tracking-tight tabular-nums text-slate-500">
                &mdash;
              </span>
              <span className="text-2xl font-bold text-slate-500">km</span>
            </div>
            <div className="mt-4 rounded-xl bg-red-950/70 border border-red-700/60 p-4 text-red-100 text-xs space-y-1.5">
              <strong className="font-bold block text-red-200">
                Mohon periksa kembali input Anda:
              </strong>
              {evaluation.errors.distance && <p>• {evaluation.errors.distance}</p>}
              {evaluation.errors.elevation && <p>• {evaluation.errors.elevation}</p>}
              {evaluation.errors.pace && <p>• {evaluation.errors.pace}</p>}
            </div>
          </div>

          <button
            type="button"
            disabled
            className="w-full py-3.5 px-5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 font-semibold text-sm sm:text-base cursor-not-allowed opacity-70"
          >
            Lengkapi jarak &amp; elevasi untuk menyalin hasil
          </button>
        </div>
      </section>
    );
  }

  const { result, errors } = evaluation;
  const summaryText = formatShareableSummary(result);

  return (
    <section
      aria-labelledby="result-heading"
      aria-live="polite"
      aria-atomic="true"
      className="md:col-span-7 md:sticky md:top-20 space-y-4"
    >
      {/* 4A & 4B. HERO METRIC CARD */}
      <div className="bg-asphalt-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
        {/* Top Eyebrow & ITRA Category Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            id="result-heading"
            className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Ekuivalen Jarak Jalan Raya (Adjusted Road Effort)
          </span>
          <span
            data-testid="itra-category-badge"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-950/90 text-blue-200 border border-blue-700/50"
          >
            <span>Kategori ITRA {result.itraCategory.code}</span>
            <span className="text-blue-400">•</span>
            <span>{result.itraCategory.rangeLabel}</span>
          </span>
        </div>

        {/* Primary Hero Number & Benchmark */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-baseline gap-2.5">
              <span
                data-testid="hero-adjusted-km"
                className="text-5xl sm:text-6xl font-mono font-extrabold tracking-tight tabular-nums text-white"
              >
                {result.adjustedRoadEquivalentKm.toFixed(1)}
              </span>
              <span className="text-2xl font-bold text-slate-300">km di aspal</span>
            </div>
            <p className="text-sm text-slate-300 mt-2 font-medium">
              Beban fisik rute ini setara lari{' '}
              <strong className="text-white font-bold underline decoration-emerald-500/70 decoration-2 underline-offset-4">
                {result.roadBenchmark.formattedText}
              </strong>{' '}
              datar.
            </p>
          </div>

          {/* Extra Effort Pill */}
          <div className="inline-flex sm:flex-col items-center sm:items-end justify-between bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 shrink-0 gap-2 sm:gap-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ekstra Beban
            </span>
            <span
              data-testid="extra-effort-pct"
              className="text-lg sm:text-xl font-mono font-extrabold text-amber-400 tabular-nums"
            >
              +{result.extraEffortPercentage}%
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              vs {result.distanceKm.toFixed(1)} km datar
            </span>
          </div>
        </div>

        {/* Visual Comparison Bar & Transparent Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              Rincian Transparan Pembentuk Beban (Km-Effort)
            </span>
            <span className="font-mono text-slate-300 tabular-nums">
              Total: {result.adjustedRoadEquivalentKm.toFixed(1)} km
            </span>
          </div>

          {/* Stacked Visual Bar */}
          <div
            className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex border border-slate-700/80"
            role="img"
            aria-label={`Komposisi beban: Jarak Trail ${result.visualBreakdown.distancePct}%, Kontribusi Elevasi ${result.visualBreakdown.elevationPct}%, Faktor Medan ${result.visualBreakdown.terrainPct}%`}
          >
            <div
              style={{ width: `${result.visualBreakdown.distancePct}%` }}
              className="bg-slate-300 h-full transition-all duration-300"
              title={`Jarak Asli Trail: ${result.distanceKm.toFixed(1)} km (${result.visualBreakdown.distancePct}%)`}
            />
            {result.elevationEffortKm > 0 && (
              <div
                style={{ width: `${result.visualBreakdown.elevationPct}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Kontribusi Tanjakan D+: +${result.elevationEffortKm.toFixed(1)} km (${result.visualBreakdown.elevationPct}%)`}
              />
            )}
            {result.terrainPenaltyKm > 0 && (
              <div
                style={{ width: `${result.visualBreakdown.terrainPct}%` }}
                className="bg-amber-400 h-full transition-all duration-300"
                title={`Penalti Medan: +${result.terrainPenaltyKm.toFixed(1)} km (${result.visualBreakdown.terrainPct}%)`}
              />
            )}
          </div>

          {/* Legend & 3 Breakdown Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Box 1: Base ITRA */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Standar Murni ITRA</span>
              </div>
              <div
                data-testid="base-itra-km"
                className="text-lg font-mono font-bold text-white tabular-nums mt-0.5"
              >
                {result.baseItraKmEffort.toFixed(1)} Km-Effort
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono tabular-nums">
                {result.distanceKm.toFixed(1)} km + {result.elevationEffortKm.toFixed(1)} km (D+)
              </div>
            </div>

            {/* Box 2: Elevation Contribution */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Kontribusi Tanjakan</span>
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums mt-0.5">
                +{result.elevationEffortKm.toFixed(1)} km
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Dari D+ {result.elevationGainM.toLocaleString('id-ID')}m (100m = 1km)
              </div>
            </div>

            {/* Box 3: Terrain Penalty */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Koreksi Medan (+{result.terrain.percentageBonus}%)</span>
              </div>
              <div className="text-lg font-mono font-bold text-amber-300 tabular-nums mt-0.5">
                +{result.terrainPenaltyKm.toFixed(1)} km
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{result.terrain.label}</div>
            </div>
          </div>
        </div>

        {/* 4C. ESTIMASI WAKTU TEMPUH & EFFECTIVE TRAIL PACE */}
        <div className="bg-gradient-to-br from-trail-900/90 to-slate-900 border border-trail-700/50 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Estimasi Waktu &amp; Effective Trail Pace
            </div>
            {result.timeEstimate && (
              <span className="text-xs text-emerald-200/90 font-mono">
                Basis Road Pace: {result.timeEstimate.formattedFlatRoadPace} /km
              </span>
            )}
          </div>

          {result.paceStatus === 'valid' && result.timeEstimate ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-950/50 rounded-lg p-3.5 border border-white/10">
                <div className="text-xs text-slate-300">Perkiraan Waktu Tempuh</div>
                <div
                  data-testid="estimated-duration"
                  className="text-2xl sm:text-3xl font-mono font-extrabold text-white tabular-nums mt-1"
                >
                  {result.timeEstimate.formattedDuration}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono tabular-nums">
                  Total ~{result.timeEstimate.estimatedTotalMinutes} menit (
                  {result.adjustedRoadEquivalentKm.toFixed(1)} km &times;{' '}
                  {result.timeEstimate.formattedFlatRoadPace})
                </div>
              </div>

              <div className="bg-slate-950/50 rounded-lg p-3.5 border border-white/10">
                <div className="text-xs text-slate-300">Effective Trail Pace (Rata-rata)</div>
                <div
                  data-testid="effective-trail-pace"
                  className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 tabular-nums mt-1"
                >
                  {result.timeEstimate.formattedEffectiveTrailPace}{' '}
                  <span className="text-base font-sans font-semibold text-slate-300">/km</span>
                </div>
                <div className="text-xs text-amber-300 mt-1 font-mono tabular-nums">
                  {result.timeEstimate.formattedPaceSlowdown} lebih lambat dari road
                </div>
              </div>
            </div>
          ) : result.paceStatus === 'invalid' ? (
            <div className="bg-red-950/60 border border-red-700/50 rounded-lg p-3.5 text-xs text-red-200">
              {errors.pace ??
                'Format Flat Road Pace belum valid. Perbaiki angka menit/detik untuk melihat estimasi waktu.'}
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-white/10 rounded-lg p-3.5 text-xs text-slate-300 leading-relaxed">
              Ingin tahu perkiraan waktu finis? Isi kolom{' '}
              <strong className="text-white">Flat Road Pace</strong> di panel input untuk menghitung
              estimasi waktu tempuh dan <em>Effective Trail Pace</em> Anda.
            </div>
          )}
        </div>

        {/* 4D. EXTREME ULTRA WARNING BANNER (Conditional >= 50 Km-Effort or >= 42.2 km) */}
        {result.isUltraWarningActive && (
          <div
            data-testid="ultra-warning-banner"
            role="alert"
            className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-amber-900 flex items-start gap-3"
          >
            <svg
              className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="text-xs leading-relaxed">
              <strong className="font-bold block text-amber-950 mb-0.5">
                Perhatian Jarak Ultra (Fatigue Decay):
              </strong>
              Beban rute ini mencapai{' '}
              <strong className="font-mono">
                {result.adjustedRoadEquivalentKm.toFixed(1)} Km-Effort
              </strong>
              . Di atas 50 Km-Effort, kelelahan otot <em>quadriceps</em> pada turunan dan jeda
              nutrisi di <em>Water Station</em> membuat perlambatan bersifat non-linear. Siapkan
              cadangan waktu ekstra <strong>15%&ndash;25%</strong> dari estimasi linear di atas.
            </div>
          </div>
        )}

        {/* 4E. TOMBOL AKSI: SALIN RINGKASAN KE WHATSAPP / STRAVA */}
        <div className="pt-1 space-y-3">
          <button
            type="button"
            onClick={handleCopySummary}
            className={`w-full py-3.5 px-5 min-h-[48px] rounded-xl font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer focus:outline-none ${
              copyState === 'copied'
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/30'
                : 'bg-trail-700 hover:bg-trail-600 active:bg-trail-800 text-white focus:ring-4 focus:ring-emerald-500/40'
            }`}
          >
            {copyState === 'copied' ? (
              <>
                <span aria-hidden="true">&check;</span>
                <span>Tersalin! Siap ditempel ke grup lari</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span>Salin Ringkasan ke WhatsApp / Strava</span>
              </>
            )}
          </button>

          {/* Fallback Manual Copy Area if Clipboard API is restricted */}
          {copyState === 'fallback' && (
            <div
              data-testid="clipboard-fallback-box"
              className="rounded-xl bg-slate-800 border border-slate-600 p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-amber-300 font-medium">
                  Browser Anda membatasi akses clipboard otomatis. Teks di bawah sudah terpilih—tekan{' '}
                  <strong>Salin / Ctrl+C</strong> secara manual:
                </p>
                <button
                  type="button"
                  onClick={() => setCopyState('idle')}
                  className="text-xs text-slate-300 hover:text-white underline shrink-0"
                >
                  Tutup
                </button>
              </div>
              <textarea
                ref={fallbackTextareaRef}
                readOnly
                rows={7}
                value={summaryText}
                aria-label="Teks ringkasan untuk disalin manual"
                className="w-full rounded-lg bg-slate-950 text-slate-200 font-mono text-xs p-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
