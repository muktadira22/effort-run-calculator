import type { ItraCategoryInfo, QuickPreset, RawCalculatorInput, TerrainId, TerrainProfile } from './types';

export const VALIDATION_LIMITS = {
  DISTANCE_MIN_KM: 0.1,
  DISTANCE_MAX_KM: 500,
  ELEVATION_MIN_M: 0,
  ELEVATION_MAX_M: 25000,
  PACE_MIN_SECONDS_PER_KM: 150, // 02:30 /km
  PACE_MAX_SECONDS_PER_KM: 1200, // 20:00 /km
  ULTRA_KM_EFFORT_THRESHOLD: 50,
  ULTRA_DISTANCE_KM_THRESHOLD: 42.2,
} as const;

export const TERRAIN_PROFILES: Record<TerrainId, TerrainProfile> = {
  runable: {
    id: 'runable',
    label: 'Runable / Fire Road',
    shortLabel: 'Runable',
    percentageBonus: 0,
    multiplier: 1.0,
    description: 'Tanah padat, jalur lebar, minim hambatan teknis (Standar ITRA murni).',
  },
  moderate: {
    id: 'moderate',
    label: 'Moderate Singletrack',
    shortLabel: 'Moderate',
    percentageBonus: 10,
    multiplier: 1.1,
    description: 'Jalur setapak hutan, akar pohon, tanah gembur, dan bebatuan sedang.',
  },
  technical: {
    id: 'technical',
    label: 'Technical / Rocky / Muddy',
    shortLabel: 'Technical',
    percentageBonus: 20,
    multiplier: 1.2,
    description: 'Batu lepas, lumpur licin, tanjakan/turunan curam yang memaksa jalan kaki.',
  },
};

export const TERRAIN_LIST: TerrainProfile[] = [
  TERRAIN_PROFILES.runable,
  TERRAIN_PROFILES.moderate,
  TERRAIN_PROFILES.technical,
];

export const QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'preset-10k',
    name: '10K Short Trail',
    subtitle: 'D+ 400m',
    distanceKm: 10,
    elevationGainM: 400,
    terrainId: 'moderate',
    contextNote: 'Rute perbukitan ramah pemula / latihan akhir pekan',
  },
  {
    id: 'preset-tahura',
    name: 'Tahura / 21K Half Trail',
    subtitle: 'D+ 1.000m',
    distanceKm: 21,
    elevationGainM: 1000,
    terrainId: 'moderate',
    contextNote: 'Karakteristik rolling hills & hutan pinus klasik',
  },
  {
    id: 'preset-siksorogo',
    name: 'Siksorogo / 15K Steep',
    subtitle: 'D+ 1.200m',
    distanceKm: 15,
    elevationGainM: 1200,
    terrainId: 'technical',
    contextNote: 'Tanjakan curam & teknis khas gunung tropis Indonesia',
  },
  {
    id: 'preset-ultra50k',
    name: '50K Ultra Mountain',
    subtitle: 'D+ 3.000m',
    distanceKm: 50,
    elevationGainM: 3000,
    terrainId: 'technical',
    contextNote: 'Skenario ultra trail (memicu Ultra Fatigue Warning)',
  },
];

export const ITRA_CATEGORIES: ItraCategoryInfo[] = [
  {
    code: 'XXS',
    rangeLabel: '0–19 Km-Effort',
    title: 'ITRA XXS (Short Trail)',
    minKmEffort: 0,
    maxKmEffort: 19,
  },
  {
    code: 'XS',
    rangeLabel: '20–34 Km-Effort',
    title: 'ITRA XS',
    minKmEffort: 20,
    maxKmEffort: 34,
  },
  {
    code: 'S',
    rangeLabel: '35–64 Km-Effort',
    title: 'ITRA S',
    minKmEffort: 35,
    maxKmEffort: 64,
  },
  {
    code: 'M',
    rangeLabel: '65–99 Km-Effort',
    title: 'ITRA M',
    minKmEffort: 65,
    maxKmEffort: 99,
  },
  {
    code: 'L',
    rangeLabel: '100–139 Km-Effort',
    title: 'ITRA L',
    minKmEffort: 100,
    maxKmEffort: 139,
  },
  {
    code: 'XL',
    rangeLabel: '140–189 Km-Effort',
    title: 'ITRA XL',
    minKmEffort: 140,
    maxKmEffort: 189,
  },
  {
    code: 'XXL',
    rangeLabel: '≥190 Km-Effort',
    title: 'ITRA XXL',
    minKmEffort: 190,
    maxKmEffort: null,
  },
];

export const DEFAULT_CALCULATOR_INPUT: RawCalculatorInput = {
  distanceKm: '21',
  elevationGainM: '1000',
  terrainId: 'moderate',
  paceMinutes: '6',
  paceSeconds: '00',
};

export const EMPTY_CALCULATOR_INPUT: RawCalculatorInput = {
  distanceKm: '',
  elevationGainM: '',
  terrainId: 'runable',
  paceMinutes: '',
  paceSeconds: '',
};
