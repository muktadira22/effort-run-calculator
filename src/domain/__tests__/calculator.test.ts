import { describe, expect, it } from 'vitest';
import {
  calculateEffortMetrics,
  calculateTimeAndPace,
  classifyItraCategory,
  computeRoadBenchmark,
  evaluateCalculatorInput,
  findMatchingPreset,
  formatDurationFromMinutes,
  formatPaceMMSS,
  formatShareableSummary,
} from '../calculator';

describe('Domain Calculator — Core ITRA & Terrain Effort Conversion', () => {
  it('US-1: converts 20 km + D+ 1000m (Runable 0%) to 30.0 km Road Equivalent (+50% extra effort, ITRA XS)', () => {
    const res = calculateEffortMetrics(20, 1000, 'runable');
    expect(res.elevationEffortKm).toBe(10.0);
    expect(res.baseItraKmEffort).toBe(30.0);
    expect(res.terrainPenaltyKm).toBe(0);
    expect(res.adjustedRoadEquivalentKm).toBe(30.0);
    expect(res.extraEffortPercentage).toBe(50.0);
    expect(res.itraCategory.code).toBe('XS');
    expect(res.isUltraWarningActive).toBe(false);
  });

  it('US-2: applies Terrain Technicality multipliers (+10% Moderate, +20% Technical) transparently', () => {
    const moderate = calculateEffortMetrics(20, 1000, 'moderate');
    expect(moderate.baseItraKmEffort).toBe(30.0);
    expect(moderate.terrainPenaltyKm).toBe(3.0);
    expect(moderate.adjustedRoadEquivalentKm).toBe(33.0);
    expect(moderate.extraEffortPercentage).toBe(65.0);

    const technical = calculateEffortMetrics(20, 1000, 'technical');
    expect(technical.baseItraKmEffort).toBe(30.0);
    expect(technical.terrainPenaltyKm).toBe(6.0);
    expect(technical.adjustedRoadEquivalentKm).toBe(36.0);
    expect(technical.extraEffortPercentage).toBe(80.0);
  });

  it('calculates Tahura 21K preset (21 km, D+ 1000m, Moderate +10%) accurately to 34.1 km', () => {
    const tahura = calculateEffortMetrics(21, 1000, 'moderate');
    expect(tahura.baseItraKmEffort).toBe(31.0);
    expect(tahura.terrainPenaltyKm).toBe(3.1);
    expect(tahura.adjustedRoadEquivalentKm).toBe(34.1);
    expect(tahura.extraEffortPercentage).toBe(62.4);
    expect(tahura.itraCategory.code).toBe('XS');
  });

  it('triggers Extreme Ultra Warning when Adjusted Road Equivalent >= 50 km or Trail Distance >= 42.2 km', () => {
    const ultraByEffort = calculateEffortMetrics(30, 1500, 'technical'); // Base 45 * 1.2 = 54.0 km
    expect(ultraByEffort.adjustedRoadEquivalentKm).toBe(54.0);
    expect(ultraByEffort.isUltraWarningActive).toBe(true);

    const ultraByDistance = calculateEffortMetrics(42.2, 100, 'runable'); // 43.2 km effort, but distance >= 42.2
    expect(ultraByDistance.isUltraWarningActive).toBe(true);

    const nonUltra = calculateEffortMetrics(25, 1000, 'runable'); // 35.0 km
    expect(nonUltra.isUltraWarningActive).toBe(false);
  });
});

describe('Domain Calculator — ITRA Category Classification & Road Benchmarks', () => {
  it('classifies all ITRA category boundaries (XXS to XXL) accurately', () => {
    expect(classifyItraCategory(12).code).toBe('XXS');
    expect(classifyItraCategory(19.9).code).toBe('XXS');
    expect(classifyItraCategory(20).code).toBe('XS');
    expect(classifyItraCategory(34.9).code).toBe('XS');
    expect(classifyItraCategory(35).code).toBe('S');
    expect(classifyItraCategory(64.9).code).toBe('S');
    expect(classifyItraCategory(65).code).toBe('M');
    expect(classifyItraCategory(99.9).code).toBe('M');
    expect(classifyItraCategory(100).code).toBe('L');
    expect(classifyItraCategory(139.9).code).toBe('L');
    expect(classifyItraCategory(140).code).toBe('XL');
    expect(classifyItraCategory(189.9).code).toBe('XL');
    expect(classifyItraCategory(190).code).toBe('XXL');
    expect(classifyItraCategory(250).code).toBe('XXL');
  });

  it('computes contextual Road Race Benchmarks for 10K, Half Marathon, and Full Marathon ranges', () => {
    const shortBench = computeRoadBenchmark(11.0);
    expect(shortBench.eventName).toBe('lari 10K');
    expect(shortBench.formattedText).toContain('~1.1x lari 10K');

    const halfBench = computeRoadBenchmark(30.0);
    expect(halfBench.eventName).toBe('Half Marathon (21.1K)');
    expect(halfBench.formattedText).toContain('~1.4x Half Marathon (21.1K)');

    const fullBench = computeRoadBenchmark(63.3);
    expect(fullBench.eventName).toBe('Full Marathon (42.2K)');
    expect(fullBench.formattedText).toContain('~1.5x Full Marathon (42.2K)');
  });
});

describe('Domain Calculator — US-3 Road Pace to Trail Time & Effective Pace', () => {
  it('US-3: converts 30.0 km Road Equivalent (from 20 km trail) at 06:00/km into 3 jam 00 menit and 09:00/km Effective Pace', () => {
    const timeEst = calculateTimeAndPace(20, 30.0, 360); // 06:00/km = 360s
    expect(timeEst.estimatedTotalMinutes).toBe(180);
    expect(timeEst.formattedDuration).toBe('3 jam 00 menit');
    expect(timeEst.formattedEffectiveTrailPace).toBe('09:00');
    expect(timeEst.formattedPaceSlowdown).toBe('+03:00 /km');
  });

  it('formats durations under 60 minutes without hours prefix', () => {
    expect(formatDurationFromMinutes(45).full).toBe('45 menit');
    expect(formatDurationFromMinutes(60).full).toBe('1 jam 00 menit');
    expect(formatPaceMMSS(330)).toBe('05:30');
  });
});

describe('Domain Calculator — Input Validation & System States', () => {
  it('returns empty state when both distance and elevation are blank', () => {
    const evaluation = evaluateCalculatorInput({
      distanceKm: '  ',
      elevationGainM: '',
      terrainId: 'runable',
      paceMinutes: '',
      paceSeconds: '',
    });
    expect(evaluation.status).toBe('empty');
    expect(evaluation.result).toBeNull();
  });

  it('rejects invalid distance (<= 0, < 0.1, > 500, or NaN)', () => {
    const zeroDist = evaluateCalculatorInput({
      distanceKm: '0',
      elevationGainM: '500',
      terrainId: 'runable',
      paceMinutes: '',
      paceSeconds: '',
    });
    expect(zeroDist.status).toBe('invalid');
    expect(zeroDist.errors.distance).toBeDefined();

    const tinyDist = evaluateCalculatorInput({
      distanceKm: '0.05',
      elevationGainM: '500',
      terrainId: 'runable',
      paceMinutes: '',
      paceSeconds: '',
    });
    expect(tinyDist.status).toBe('invalid');
    expect(tinyDist.errors.distance).toContain('0,1 km hingga 500 km');

    const hugeDist = evaluateCalculatorInput({
      distanceKm: '501',
      elevationGainM: '500',
      terrainId: 'runable',
      paceMinutes: '',
      paceSeconds: '',
    });
    expect(hugeDist.status).toBe('invalid');
    expect(hugeDist.errors.distance).toContain('maksimal 500 km');
  });

  it('rejects invalid elevation (< 0 or > 25000)', () => {
    const negElev = evaluateCalculatorInput({
      distanceKm: '15',
      elevationGainM: '-100',
      terrainId: 'runable',
      paceMinutes: '',
      paceSeconds: '',
    });
    expect(negElev.status).toBe('invalid');
    expect(negElev.errors.elevation).toContain('tidak boleh bernilai negatif');

    const hugeElev = evaluateCalculatorInput({
      distanceKm: '15',
      elevationGainM: '26000',
      terrainId: 'runable',
      paceMinutes: '',
      paceSeconds: '',
    });
    expect(hugeElev.status).toBe('invalid');
    expect(hugeElev.errors.elevation).toContain('maksimal 25.000 m');
  });

  it('validates optional Flat Road Pace boundaries (02:30 to 20:00 /km, seconds 0-59)', () => {
    // Valid route, invalid seconds (>= 60)
    const badSec = evaluateCalculatorInput({
      distanceKm: '20',
      elevationGainM: '1000',
      terrainId: 'runable',
      paceMinutes: '6',
      paceSeconds: '75',
    });
    // Core calculation still succeeds while paceStatus is invalid
    expect(badSec.status).toBe('valid');
    if (badSec.status === 'valid') {
      expect(badSec.result.paceStatus).toBe('invalid');
      expect(badSec.errors.pace).toContain('00 hingga 59');
      expect(badSec.result.timeEstimate).toBeNull();
    }

    // Pace faster than 02:30/km
    const tooFast = evaluateCalculatorInput({
      distanceKm: '20',
      elevationGainM: '1000',
      terrainId: 'runable',
      paceMinutes: '2',
      paceSeconds: '15',
    });
    expect(tooFast.status).toBe('valid');
    if (tooFast.status === 'valid') {
      expect(tooFast.result.paceStatus).toBe('invalid');
      expect(tooFast.errors.pace).toContain('02:30/km hingga 20:00/km');
    }

    // Pace slower than 20:00/km
    const tooSlow = evaluateCalculatorInput({
      distanceKm: '20',
      elevationGainM: '1000',
      terrainId: 'runable',
      paceMinutes: '20',
      paceSeconds: '01',
    });
    expect(tooSlow.status).toBe('valid');
    if (tooSlow.status === 'valid') {
      expect(tooSlow.result.paceStatus).toBe('invalid');
    }
  });

  it('matches Quick Presets and generates WhatsApp/Strava shareable summary text', () => {
    const raw = {
      distanceKm: '15',
      elevationGainM: '1200',
      terrainId: 'technical' as const,
      paceMinutes: '6',
      paceSeconds: '00',
    };
    const preset = findMatchingPreset(raw);
    expect(preset?.id).toBe('preset-siksorogo');

    const evaluation = evaluateCalculatorInput(raw);
    expect(evaluation.status).toBe('valid');
    if (evaluation.status === 'valid') {
      const summary = formatShareableSummary(evaluation.result);
      expect(summary).toContain('*RINGKASAN BEBAN LARI TRAIL (KM-EFFORT)*');
      expect(summary).toContain('*15 km*');
      expect(summary).toContain('*D+ 1200 m*');
      expect(summary).toContain('*32.4 km* di aspal datar');
      expect(summary).toContain('Effective Trail Pace:');
    }
  });
});

describe('QA Edge Cases, Boundary Values & Sad Paths', () => {
  it('accepts exact lower and upper boundaries for distance (0.1 km and 500 km) and elevation (0 m and 25000 m)', () => {
    // Arrange & Act: Minimum valid boundary (0.1 km, 0 m)
    const minBoundary = evaluateCalculatorInput({
      distanceKm: '0.1',
      elevationGainM: '0',
      terrainId: 'runable',
      paceMinutes: '2',
      paceSeconds: '30',
    });

    // Assert
    expect(minBoundary.status).toBe('valid');
    if (minBoundary.status === 'valid') {
      expect(minBoundary.result.distanceKm).toBe(0.1);
      expect(minBoundary.result.elevationGainM).toBe(0);
      expect(minBoundary.result.adjustedRoadEquivalentKm).toBe(0.1);
      expect(minBoundary.result.extraEffortPercentage).toBe(0);
      expect(minBoundary.result.itraCategory.code).toBe('XXS');
      expect(minBoundary.result.timeEstimate?.formattedFlatRoadPace).toBe('02:30');
      expect(minBoundary.result.timeEstimate?.estimatedTotalMinutes).toBe(1);
    }

    // Arrange & Act: Maximum valid boundary (500 km, 25000 m)
    const maxBoundary = evaluateCalculatorInput({
      distanceKm: '500',
      elevationGainM: '25000',
      terrainId: 'technical',
      paceMinutes: '20',
      paceSeconds: '00',
    });

    // Assert
    expect(maxBoundary.status).toBe('valid');
    if (maxBoundary.status === 'valid') {
      expect(maxBoundary.result.baseItraKmEffort).toBe(750.0);
      expect(maxBoundary.result.adjustedRoadEquivalentKm).toBe(900.0);
      expect(maxBoundary.result.itraCategory.code).toBe('XXL');
      expect(maxBoundary.result.isUltraWarningActive).toBe(true);
      expect(maxBoundary.result.timeEstimate?.formattedFlatRoadPace).toBe('20:00');
    }
  });

  it('rejects just-outside boundary values (0.09 km, 500.1 km, -0.1 m, 25000.1 m, pace 02:29 and 20:01)', () => {
    expect(
      evaluateCalculatorInput({
        distanceKm: '0.09',
        elevationGainM: '0',
        terrainId: 'runable',
        paceMinutes: '',
        paceSeconds: '',
      }).status
    ).toBe('invalid');

    expect(
      evaluateCalculatorInput({
        distanceKm: '500.1',
        elevationGainM: '0',
        terrainId: 'runable',
        paceMinutes: '',
        paceSeconds: '',
      }).status
    ).toBe('invalid');

    expect(
      evaluateCalculatorInput({
        distanceKm: '10',
        elevationGainM: '-0.1',
        terrainId: 'runable',
        paceMinutes: '',
        paceSeconds: '',
      }).status
    ).toBe('invalid');

    expect(
      evaluateCalculatorInput({
        distanceKm: '10',
        elevationGainM: '25000.1',
        terrainId: 'runable',
        paceMinutes: '',
        paceSeconds: '',
      }).status
    ).toBe('invalid');

    const pace229 = evaluateCalculatorInput({
      distanceKm: '10',
      elevationGainM: '100',
      terrainId: 'runable',
      paceMinutes: '2',
      paceSeconds: '29',
    });
    expect(pace229.status).toBe('valid');
    if (pace229.status === 'valid') {
      expect(pace229.result.paceStatus).toBe('invalid');
    }

    const paceSec60 = evaluateCalculatorInput({
      distanceKm: '10',
      elevationGainM: '100',
      terrainId: 'runable',
      paceMinutes: '5',
      paceSeconds: '60',
    });
    expect(paceSec60.status).toBe('valid');
    if (paceSec60.status === 'valid') {
      expect(paceSec60.result.paceStatus).toBe('invalid');
      expect(paceSec60.errors.pace).toContain('00 hingga 59');
    }
  });

  it('handles non-numeric strings, comma decimals, Infinity, NaN, and Unicode/XSS payloads safely without crashing', () => {
    const commaDecimal = evaluateCalculatorInput({
      distanceKm: '21,5',
      elevationGainM: '1000',
      terrainId: 'runable',
      paceMinutes: '',
      paceSeconds: '',
    });
    expect(commaDecimal.status).toBe('invalid');
    expect(commaDecimal.errors.distance).toBeDefined();

    const infinityInput = evaluateCalculatorInput({
      distanceKm: 'Infinity',
      elevationGainM: '-Infinity',
      terrainId: 'runable',
      paceMinutes: 'Infinity',
      paceSeconds: 'NaN',
    });
    expect(infinityInput.status).toBe('invalid');
    expect(infinityInput.errors.distance).toBeDefined();
    expect(infinityInput.errors.elevation).toBeDefined();

    const xssAndUnicode = evaluateCalculatorInput({
      distanceKm: '<script>alert(1)</script>',
      elevationGainM: '🏃‍♂️⛰️ ১০০০',
      terrainId: 'runable',
      paceMinutes: '6.5',
      paceSeconds: '-1',
    });
    expect(xssAndUnicode.status).toBe('invalid');
    expect(xssAndUnicode.errors.distance).toBeDefined();
    expect(xssAndUnicode.errors.elevation).toBeDefined();
    expect(xssAndUnicode.errors.pace).toBeDefined();
  });

  it('handles floating point precision cleanly without IEEE-754 artifacts', () => {
    // 0.1 + 0.2 in JS is 0.30000000000000004
    const res = calculateEffortMetrics(0.1, 20, 'moderate');
    expect(res.elevationEffortKm).toBe(0.2);
    expect(res.baseItraKmEffort).toBe(0.3);
    expect(res.adjustedRoadEquivalentKm).toBe(0.3);
    expect(res.visualBreakdown.distancePct + res.visualBreakdown.elevationPct + res.visualBreakdown.terrainPct).toBeCloseTo(100, 0);
  });

  it('handles partial pace input (minutes filled with blank seconds defaults to :00, blank minutes with seconds is invalid)', () => {
    const minOnly = evaluateCalculatorInput({
      distanceKm: '10',
      elevationGainM: '500',
      terrainId: 'runable',
      paceMinutes: '6',
      paceSeconds: '',
    });
    expect(minOnly.status).toBe('valid');
    if (minOnly.status === 'valid') {
      expect(minOnly.result.paceStatus).toBe('valid');
      expect(minOnly.result.timeEstimate?.formattedFlatRoadPace).toBe('06:00');
    }

    const secOnly = evaluateCalculatorInput({
      distanceKm: '10',
      elevationGainM: '500',
      terrainId: 'runable',
      paceMinutes: '',
      paceSeconds: '30',
    });
    expect(secOnly.status).toBe('valid');
    if (secOnly.status === 'valid') {
      expect(secOnly.result.paceStatus).toBe('invalid');
      expect(secOnly.errors.pace).toBeDefined();
    }
  });
});

