export type TerrainId = 'runable' | 'moderate' | 'technical';

export interface TerrainProfile {
  id: TerrainId;
  label: string;
  shortLabel: string;
  percentageBonus: number;
  multiplier: number;
  description: string;
}

export interface QuickPreset {
  id: string;
  name: string;
  subtitle: string;
  distanceKm: number;
  elevationGainM: number;
  terrainId: TerrainId;
  contextNote: string;
}

export interface RawCalculatorInput {
  distanceKm: string;
  elevationGainM: string;
  terrainId: TerrainId;
  paceMinutes: string;
  paceSeconds: string;
}

export interface FieldValidationErrors {
  distance?: string;
  elevation?: string;
  pace?: string;
}

export type ItraCategoryCode = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ItraCategoryInfo {
  code: ItraCategoryCode;
  rangeLabel: string;
  title: string;
  minKmEffort: number;
  maxKmEffort: number | null;
}

export interface RoadBenchmarkInfo {
  multiplier: number;
  eventName: string;
  formattedText: string;
}

export interface VisualBreakdownPercentages {
  distancePct: number;
  elevationPct: number;
  terrainPct: number;
}

export interface TimePaceEstimate {
  flatRoadPaceSecondsPerKm: number;
  formattedFlatRoadPace: string;
  estimatedTotalSeconds: number;
  estimatedTotalMinutes: number;
  formattedDuration: string;
  formattedDurationShort: string;
  effectiveTrailPaceSecondsPerKm: number;
  formattedEffectiveTrailPace: string;
  paceSlowdownSecondsPerKm: number;
  formattedPaceSlowdown: string;
}

export interface EffortCalculationResult {
  distanceKm: number;
  elevationGainM: number;
  terrain: TerrainProfile;
  elevationEffortKm: number;
  baseItraKmEffort: number;
  terrainPenaltyKm: number;
  adjustedRoadEquivalentKm: number;
  extraEffortPercentage: number;
  itraCategory: ItraCategoryInfo;
  roadBenchmark: RoadBenchmarkInfo;
  visualBreakdown: VisualBreakdownPercentages;
  isUltraWarningActive: boolean;
  timeEstimate: TimePaceEstimate | null;
  paceStatus: 'empty' | 'valid' | 'invalid';
}

export type CalculationEvaluation =
  | {
      status: 'empty';
      errors: FieldValidationErrors;
      result: null;
    }
  | {
      status: 'invalid';
      errors: FieldValidationErrors;
      result: null;
    }
  | {
      status: 'valid';
      errors: FieldValidationErrors;
      result: EffortCalculationResult;
    };
