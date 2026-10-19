import {
  ITRA_CATEGORIES,
  QUICK_PRESETS,
  TERRAIN_PROFILES,
  VALIDATION_LIMITS,
} from './constants';
import type {
  CalculationEvaluation,
  EffortCalculationResult,
  FieldValidationErrors,
  ItraCategoryInfo,
  QuickPreset,
  RawCalculatorInput,
  RoadBenchmarkInfo,
  TerrainId,
  TimePaceEstimate,
  VisualBreakdownPercentages,
} from './types';

/**
 * Rounds a number to 1 decimal place cleanly.
 */
export function roundToOneDecimal(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

/**
 * Formats seconds per km into mm:ss string (e.g., 360 -> "06:00").
 */
export function formatPaceMMSS(totalSecondsPerKm: number): string {
  const safeSeconds = Math.max(0, Math.round(totalSecondsPerKm));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Formats total minutes into human-readable Indonesian duration string.
 * Examples:
 * - 45 -> { full: "45 menit", short: "45 mnt" }
 * - 180 -> { full: "3 jam 00 menit", short: "3 jam 00 mnt" }
 * - 205 -> { full: "3 jam 25 menit", short: "3 jam 25 mnt" }
 */
export function formatDurationFromMinutes(totalMinutes: number): {
  full: string;
  short: string;
} {
  const safeMinutes = Math.max(1, Math.round(totalMinutes));
  if (safeMinutes < 60) {
    return {
      full: `${safeMinutes} menit`,
      short: `${safeMinutes} mnt`,
    };
  }
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  const paddedMins = String(minutes).padStart(2, '0');
  return {
    full: `${hours} jam ${paddedMins} menit`,
    short: `${hours} jam ${paddedMins} mnt`,
  };
}

/**
 * Classifies Base ITRA Km-Effort into official ITRA categories (XXS to XXL).
 */
export function classifyItraCategory(baseItraKmEffort: number): ItraCategoryInfo {
  const effort = Math.max(0, baseItraKmEffort);
  if (effort < 20) return ITRA_CATEGORIES[0]!;
  if (effort < 35) return ITRA_CATEGORIES[1]!;
  if (effort < 65) return ITRA_CATEGORIES[2]!;
  if (effort < 100) return ITRA_CATEGORIES[3]!;
  if (effort < 140) return ITRA_CATEGORIES[4]!;
  if (effort < 190) return ITRA_CATEGORIES[5]!;
  return ITRA_CATEGORIES[6]!;
}

/**
 * Computes contextual road race benchmark for a given Adjusted Road Equivalent distance.
 */
export function computeRoadBenchmark(adjustedRoadEquivalentKm: number): RoadBenchmarkInfo {
  if (adjustedRoadEquivalentKm < 12) {
    const multiplier = roundToOneDecimal(adjustedRoadEquivalentKm / 10);
    return {
      multiplier,
      eventName: 'lari 10K',
      formattedText: `~${multiplier.toFixed(1)}x lari 10K di jalan raya`,
    };
  }
  if (adjustedRoadEquivalentKm <= 32) {
    const multiplier = roundToOneDecimal(adjustedRoadEquivalentKm / 21.1);
    return {
      multiplier,
      eventName: 'Half Marathon (21.1K)',
      formattedText: `~${multiplier.toFixed(1)}x Half Marathon (21.1K) di jalan raya`,
    };
  }
  const multiplier = roundToOneDecimal(adjustedRoadEquivalentKm / 42.2);
  return {
    multiplier,
    eventName: 'Full Marathon (42.2K)',
    formattedText: `~${multiplier.toFixed(1)}x Full Marathon (42.2K) di jalan raya`,
  };
}

/**
 * Computes proportional percentages for the Visual Comparison Bar.
 */
export function computeVisualBreakdown(
  distanceKm: number,
  elevationEffortKm: number,
  terrainPenaltyKm: number,
  adjustedRoadEquivalentKm: number
): VisualBreakdownPercentages {
  if (adjustedRoadEquivalentKm <= 0) {
    return { distancePct: 100, elevationPct: 0, terrainPct: 0 };
  }
  const distancePct = roundToOneDecimal((distanceKm / adjustedRoadEquivalentKm) * 100);
  const elevationPct = roundToOneDecimal((elevationEffortKm / adjustedRoadEquivalentKm) * 100);
  const terrainPct =
    terrainPenaltyKm <= 0
      ? 0
      : Math.max(0, roundToOneDecimal(100 - distancePct - elevationPct));
  return {
    distancePct,
    elevationPct,
    terrainPct,
  };
}

/**
 * Pure calculation of ITRA Km-Effort and Terrain-Adjusted Road Equivalent.
 */
export function calculateEffortMetrics(
  distanceKm: number,
  elevationGainM: number,
  terrainId: TerrainId
): Omit<EffortCalculationResult, 'timeEstimate' | 'paceStatus'> {
  const terrain = TERRAIN_PROFILES[terrainId] ?? TERRAIN_PROFILES.runable;
  const elevationEffortKm = roundToOneDecimal(elevationGainM / 100);
  const baseItraKmEffort = roundToOneDecimal(distanceKm + elevationEffortKm);
  const adjustedRoadEquivalentKm = roundToOneDecimal(baseItraKmEffort * terrain.multiplier);
  const terrainPenaltyKm = roundToOneDecimal(adjustedRoadEquivalentKm - baseItraKmEffort);
  const extraEffortPercentage = roundToOneDecimal(
    ((adjustedRoadEquivalentKm - distanceKm) / distanceKm) * 100
  );

  const itraCategory = classifyItraCategory(baseItraKmEffort);
  const roadBenchmark = computeRoadBenchmark(adjustedRoadEquivalentKm);
  const visualBreakdown = computeVisualBreakdown(
    distanceKm,
    elevationEffortKm,
    terrainPenaltyKm,
    adjustedRoadEquivalentKm
  );

  const isUltraWarningActive =
    adjustedRoadEquivalentKm >= VALIDATION_LIMITS.ULTRA_KM_EFFORT_THRESHOLD ||
    distanceKm >= VALIDATION_LIMITS.ULTRA_DISTANCE_KM_THRESHOLD;

  return {
    distanceKm: roundToOneDecimal(distanceKm),
    elevationGainM: Math.round(elevationGainM),
    terrain,
    elevationEffortKm,
    baseItraKmEffort,
    terrainPenaltyKm,
    adjustedRoadEquivalentKm,
    extraEffortPercentage,
    itraCategory,
    roadBenchmark,
    visualBreakdown,
    isUltraWarningActive,
  };
}

/**
 * Pure calculation of Trail Time Estimate and Effective Trail Pace from Flat Road Pace.
 */
export function calculateTimeAndPace(
  distanceKm: number,
  adjustedRoadEquivalentKm: number,
  flatRoadPaceSecondsPerKm: number
): TimePaceEstimate {
  const estimatedTotalSeconds = Math.round(adjustedRoadEquivalentKm * flatRoadPaceSecondsPerKm);
  const estimatedTotalMinutes = Math.max(1, Math.round(estimatedTotalSeconds / 60));
  const durationFormatted = formatDurationFromMinutes(estimatedTotalMinutes);

  const effectiveTrailPaceSecondsPerKm = Math.round(estimatedTotalSeconds / distanceKm);
  const paceSlowdownSecondsPerKm = Math.max(
    0,
    effectiveTrailPaceSecondsPerKm - flatRoadPaceSecondsPerKm
  );

  return {
    flatRoadPaceSecondsPerKm,
    formattedFlatRoadPace: formatPaceMMSS(flatRoadPaceSecondsPerKm),
    estimatedTotalSeconds,
    estimatedTotalMinutes,
    formattedDuration: durationFormatted.full,
    formattedDurationShort: durationFormatted.short,
    effectiveTrailPaceSecondsPerKm,
    formattedEffectiveTrailPace: formatPaceMMSS(effectiveTrailPaceSecondsPerKm),
    paceSlowdownSecondsPerKm,
    formattedPaceSlowdown: `+${formatPaceMMSS(paceSlowdownSecondsPerKm)} /km`,
  };
}

/**
 * Validates and evaluates the raw string inputs from the UI into a structured CalculationEvaluation.
 */
export function evaluateCalculatorInput(raw: RawCalculatorInput): CalculationEvaluation {
  const distTrimmed = raw.distanceKm.trim();
  const elevTrimmed = raw.elevationGainM.trim();
  const paceMinTrimmed = raw.paceMinutes.trim();
  const paceSecTrimmed = raw.paceSeconds.trim();

  // Check if completely empty state
  if (distTrimmed === '' && elevTrimmed === '') {
    return {
      status: 'empty',
      errors: {},
      result: null,
    };
  }

  const errors: FieldValidationErrors = {};

  // 1. Validate Distance
  const distNum = Number(distTrimmed);
  if (distTrimmed === '' || Number.isNaN(distNum) || distNum <= 0) {
    errors.distance =
      'Jarak rute belum valid. Masukkan angka jarak lebih dari 0 km (contoh: 15 atau 21.5).';
  } else if (distNum < VALIDATION_LIMITS.DISTANCE_MIN_KM) {
    errors.distance = 'Masukkan jarak trail antara 0,1 km hingga 500 km.';
  } else if (distNum > VALIDATION_LIMITS.DISTANCE_MAX_KM) {
    errors.distance =
      'Jarak melebihi batas kalkulator (maksimal 500 km). Kurangi angka jarak untuk melihat hasil.';
  }

  // 2. Validate Elevation Gain D+
  const elevNum = Number(elevTrimmed);
  if (elevTrimmed === '' || Number.isNaN(elevNum)) {
    errors.elevation =
      'Elevasi D+ belum diisi. Masukkan angka 0 hingga 25.000 m (contoh: 800).';
  } else if (elevNum < VALIDATION_LIMITS.ELEVATION_MIN_M) {
    errors.elevation =
      'Total tanjakan (D+) tidak boleh bernilai negatif. Masukkan angka 0 atau lebih (contoh: 800).';
  } else if (elevNum > VALIDATION_LIMITS.ELEVATION_MAX_M) {
    errors.elevation =
      'Total tanjakan melebihi batas wajar satu lomba (maksimal 25.000 m). Periksa kembali satuan meter Anda.';
  }

  // 3. Validate Optional Pace
  let paceStatus: 'empty' | 'valid' | 'invalid' = 'empty';
  let validPaceSecondsPerKm: number | null = null;

  if (paceMinTrimmed !== '' || paceSecTrimmed !== '') {
    const minVal = paceMinTrimmed === '' ? NaN : Number(paceMinTrimmed);
    const secVal = paceSecTrimmed === '' ? 0 : Number(paceSecTrimmed);

    if (
      Number.isNaN(secVal) ||
      !Number.isInteger(secVal) ||
      secVal < 0 ||
      secVal >= 60
    ) {
      errors.pace = 'Format detik tidak valid. Masukkan angka detik antara 00 hingga 59.';
      paceStatus = 'invalid';
    } else if (Number.isNaN(minVal) || !Number.isInteger(minVal) || minVal < 0) {
      errors.pace =
        'Pace berada di luar rentang lari wajar. Masukkan pace jalan raya antara 02:30/km hingga 20:00/km.';
      paceStatus = 'invalid';
    } else {
      const totalPaceSeconds = minVal * 60 + secVal;
      if (
        totalPaceSeconds < VALIDATION_LIMITS.PACE_MIN_SECONDS_PER_KM ||
        totalPaceSeconds > VALIDATION_LIMITS.PACE_MAX_SECONDS_PER_KM
      ) {
        errors.pace =
          'Pace berada di luar rentang lari wajar. Masukkan pace jalan raya antara 02:30/km hingga 20:00/km.';
        paceStatus = 'invalid';
      } else {
        paceStatus = 'valid';
        validPaceSecondsPerKm = totalPaceSeconds;
      }
    }
  }

  // If core fields (distance or elevation) have errors, return invalid state
  if (errors.distance || errors.elevation) {
    return {
      status: 'invalid',
      errors,
      result: null,
    };
  }

  const coreResult = calculateEffortMetrics(distNum, elevNum, raw.terrainId);
  const timeEstimate =
    paceStatus === 'valid' && validPaceSecondsPerKm !== null
      ? calculateTimeAndPace(
          coreResult.distanceKm,
          coreResult.adjustedRoadEquivalentKm,
          validPaceSecondsPerKm
        )
      : null;

  return {
    status: 'valid',
    errors,
    result: {
      ...coreResult,
      timeEstimate,
      paceStatus,
    },
  };
}

/**
 * Checks if current input matches one of the Quick Presets.
 */
export function findMatchingPreset(raw: RawCalculatorInput): QuickPreset | null {
  const distTrimmed = raw.distanceKm.trim();
  const elevTrimmed = raw.elevationGainM.trim();
  if (distTrimmed === '' || elevTrimmed === '') return null;

  const distNum = Number(distTrimmed);
  const elevNum = Number(elevTrimmed);
  if (Number.isNaN(distNum) || Number.isNaN(elevNum)) return null;

  return (
    QUICK_PRESETS.find(
      (preset) =>
        preset.distanceKm === distNum &&
        preset.elevationGainM === elevNum &&
        preset.terrainId === raw.terrainId
    ) ?? null
  );
}

/**
 * Formats the calculation result into WhatsApp / Strava ready summary text.
 */
export function formatShareableSummary(result: EffortCalculationResult): string {
  const lines: string[] = [
    '🏔️ *RINGKASAN BEBAN LARI TRAIL (KM-EFFORT)*',
    `• Rute Trail: *${result.distanceKm} km* | Tanjakan: *D+ ${result.elevationGainM} m*`,
    `• Kondisi Medan: *${result.terrain.label} (+${result.terrain.percentageBonus}%)*`,
    '',
    '🛣️ *Ekuivalen Jalan Raya (Road Equivalent):*',
    `👉 *${result.adjustedRoadEquivalentKm.toFixed(1)} km* di aspal datar *(+${result.extraEffortPercentage}% ekstra beban)*`,
    `• Standar Murni ITRA: ${result.baseItraKmEffort.toFixed(1)} Km-Effort (ITRA ${result.itraCategory.code}: ${result.itraCategory.rangeLabel})`,
    `• Pembanding: Setara ${result.roadBenchmark.formattedText}`,
    '',
  ];

  if (result.timeEstimate) {
    lines.push(
      `⏱️ *Estimasi Waktu & Pace (Road Pace ${result.timeEstimate.formattedFlatRoadPace}/km):*`,
      `• Perkiraan Waktu Tempuh: *${result.timeEstimate.formattedDuration}*`,
      `• Effective Trail Pace: *${result.timeEstimate.formattedEffectiveTrailPace}/km*`
    );
  } else {
    lines.push('⏱️ *Estimasi Waktu:* (Isi Flat Road Pace untuk melihat target waktu)');
  }

  lines.push('', 'Dihitung via Trail-to-Road Effort Converter');
  return lines.join('\n');
}
