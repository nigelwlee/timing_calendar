export interface MoonPhaseData {
  angle: number;
  name: string;
  illumination: number;
  isExactQuarter: boolean;
}

export interface VoidOfCourseMoon {
  isVoid: boolean;
  startTime: string | null;
  endTime: string | null;
}

export interface PlanetaryAspect {
  aspect: string;
  planet1: string;
  planet2: string;
  isHarmonious: boolean;
}

export interface ChineseAlmanac {
  lunarDate: string;
  heavenlyStem: string;
  earthlyBranch: string;
  stemBranchDay: string;
  dayOfficer: string;
  dayOfficerChinese: string;
  auspiciousActivities: string[];
  inauspiciousActivities: string[];
  element: string;
  animalDay: string;
  clashAnimal: string;
}

export interface AuspiciousDayData {
  date: string;
  moonPhase: MoonPhaseData;
  moonSign: string;
  sunSign: string;
  voidOfCourseMoon: VoidOfCourseMoon;
  planetaryAspects: PlanetaryAspect[];
  retrograde: string[];
  chinese: ChineseAlmanac;
  score: number;
  scoreLabel: string;
  summary: string;
}

export interface MonthData {
  year: number;
  month: number;
  generatedAt: string;
  days: AuspiciousDayData[];
}

export type ScoreLabel = "Great" | "Good" | "Neutral" | "Poor" | "Avoid";
