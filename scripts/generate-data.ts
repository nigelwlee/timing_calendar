/**
 * Data generation script for Starbook.
 *
 * Uses astronomy-engine to compute Western astrology data and
 * modular arithmetic for the Chinese almanac. Outputs monthly
 * JSON files to public/data/general/YYYY/MM.json.
 *
 * Run with: npx tsx scripts/generate-data.ts
 */

import * as Astronomy from "astronomy-engine";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  format,
  addDays,
  subDays,
} from "date-fns";
import * as fs from "fs";
import * as path from "path";

import type {
  AuspiciousDayData,
  MoonPhaseData,
  VoidOfCourseMoon,
  PlanetaryAspect,
  ChineseAlmanac,
  MonthData,
  ScoreLabel,
} from "../src/types/index";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const PLANETS: Astronomy.Body[] = [
  "Sun" as Astronomy.Body,
  "Moon" as Astronomy.Body,
  "Mercury" as Astronomy.Body,
  "Venus" as Astronomy.Body,
  "Mars" as Astronomy.Body,
  "Jupiter" as Astronomy.Body,
  "Saturn" as Astronomy.Body,
];

const ASPECT_DEFINITIONS = [
  { name: "conjunction", angle: 0, orb: 8, harmonious: true },
  { name: "sextile", angle: 60, orb: 4, harmonious: true },
  { name: "square", angle: 90, orb: 6, harmonious: false },
  { name: "trine", angle: 120, orb: 6, harmonious: true },
  { name: "opposition", angle: 180, orb: 8, harmonious: false },
];

// Chinese Almanac constants
const HEAVENLY_STEMS = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
];
const HEAVENLY_STEMS_EN = [
  "Jia",
  "Yi",
  "Bing",
  "Ding",
  "Wu",
  "Ji",
  "Geng",
  "Xin",
  "Ren",
  "Gui",
];
const EARTHLY_BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];
const ANIMALS = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];
const CLASH_ANIMALS = [
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
];
const ELEMENTS = [
  "Wood",
  "Wood",
  "Fire",
  "Fire",
  "Earth",
  "Earth",
  "Metal",
  "Metal",
  "Water",
  "Water",
];

const DAY_OFFICERS_CN = [
  "建",
  "除",
  "满",
  "平",
  "定",
  "执",
  "破",
  "危",
  "成",
  "收",
  "开",
  "闭",
];
const DAY_OFFICERS_EN = [
  "Establish",
  "Remove",
  "Full",
  "Balance",
  "Stable",
  "Initiate",
  "Break",
  "Danger",
  "Success",
  "Receive",
  "Open",
  "Close",
];

// Auspicious/inauspicious activities by Day Officer index
const OFFICER_ACTIVITIES: {
  [key: number]: { good: string[]; bad: string[] };
} = {
  0: {
    // Establish (建)
    good: ["Worship", "Travel", "Meeting friends"],
    bad: ["Construction", "Moving", "Opening business"],
  },
  1: {
    // Remove (除)
    good: [
      "Cleaning",
      "Medical treatment",
      "Pest control",
      "Ending bad habits",
    ],
    bad: ["Marriage", "Opening business"],
  },
  2: {
    // Full (满)
    good: ["Worship", "Engagements", "Moving", "Construction"],
    bad: ["Medical treatment", "Lawsuits"],
  },
  3: {
    // Balance (平)
    good: ["Road repairs", "Painting", "Decorating"],
    bad: ["Marriage", "Travel", "Lawsuits"],
  },
  4: {
    // Stable (定)
    good: [
      "Marriage",
      "Engagements",
      "Construction",
      "Moving",
      "Signing contracts",
    ],
    bad: ["Lawsuits", "Travel far"],
  },
  5: {
    // Initiate (执)
    good: ["Construction", "Planting", "Catching pests"],
    bad: ["Moving", "Travel", "Opening business"],
  },
  6: {
    // Break (破)
    good: ["Demolition", "Medical treatment"],
    bad: [
      "Marriage",
      "Moving",
      "Opening business",
      "Signing contracts",
      "Travel",
    ],
  },
  7: {
    // Danger (危)
    good: ["Worship", "Fasting", "Quiet activities"],
    bad: [
      "Construction",
      "Moving",
      "Travel",
      "Marriage",
      "Opening business",
    ],
  },
  8: {
    // Success (成)
    good: [
      "Marriage",
      "Opening business",
      "Construction",
      "Moving",
      "Signing contracts",
      "Travel",
    ],
    bad: ["Lawsuits"],
  },
  9: {
    // Receive (收)
    good: ["Collecting debts", "Savings", "Storage", "Harvest"],
    bad: ["Medical treatment", "Funerals"],
  },
  10: {
    // Open (开)
    good: [
      "Opening business",
      "Marriage",
      "Moving",
      "Construction",
      "Travel",
      "Celebrations",
    ],
    bad: ["Funerals"],
  },
  11: {
    // Close (闭)
    good: ["Storage", "Burial", "Quiet reflection"],
    bad: [
      "Opening business",
      "Marriage",
      "Construction",
      "Moving",
      "Travel",
    ],
  },
};

// Reference point: JD 2458485.5 = 2019-01-01 (甲子 day Stem=0, Branch=0 offset)
// Actually, let's use a known reference: 2019-02-05 (甲子日)
// JD for 2019-02-05 00:00 UT = 2458519.5
// On that day: stem index = 0, branch index = 0
const REFERENCE_JD = 2458519.5; // 2019-02-05, a 甲子 day

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function dateToJD(date: Date): number {
  // Julian Day Number from a JS Date (at 0h UT)
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045 -
    0.5
  );
}

function longitudeToSign(longitude: number): string {
  const index = Math.floor(((longitude % 360) + 360) % 360 / 30);
  return ZODIAC_SIGNS[index];
}

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

function angleDiff(a: number, b: number): number {
  let diff = normalizeAngle(a - b);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

// ---------------------------------------------------------------------------
// Western Astrology
// ---------------------------------------------------------------------------

function getMoonPhase(date: Date): MoonPhaseData {
  const angle = Astronomy.MoonPhase(date);
  const illumination = (1 - Math.cos((angle * Math.PI) / 180)) / 2;

  let name: string;
  if (angle < 5 || angle > 355) name = "New Moon";
  else if (angle < 85) name = "Waxing Crescent";
  else if (angle < 95) name = "First Quarter";
  else if (angle < 175) name = "Waxing Gibbous";
  else if (angle < 185) name = "Full Moon";
  else if (angle < 265) name = "Waning Gibbous";
  else if (angle < 275) name = "Third Quarter";
  else name = "Waning Crescent";

  const isExactQuarter =
    angle < 5 ||
    angle > 355 ||
    (angle > 85 && angle < 95) ||
    (angle > 175 && angle < 185) ||
    (angle > 265 && angle < 275);

  return {
    angle: Math.round(angle * 10) / 10,
    name,
    illumination: Math.round(illumination * 100) / 100,
    isExactQuarter,
  };
}

function getMoonSign(date: Date): string {
  const moon = Astronomy.EclipticGeoMoon(date);
  return longitudeToSign(moon.lon);
}

function getSunSign(date: Date): string {
  const sun = Astronomy.SunPosition(date);
  return longitudeToSign(sun.elon);
}

function getPlanetLongitude(
  body: Astronomy.Body,
  date: Date
): number {
  if (body === ("Sun" as Astronomy.Body)) {
    return Astronomy.SunPosition(date).elon;
  }
  if (body === ("Moon" as Astronomy.Body)) {
    return Astronomy.EclipticGeoMoon(date).lon;
  }
  return Astronomy.EclipticLongitude(body, date);
}

function getPlanetaryAspects(date: Date): PlanetaryAspect[] {
  const aspects: PlanetaryAspect[] = [];
  const longitudes = new Map<string, number>();

  for (const planet of PLANETS) {
    longitudes.set(planet as string, getPlanetLongitude(planet, date));
  }

  for (let i = 0; i < PLANETS.length; i++) {
    for (let j = i + 1; j < PLANETS.length; j++) {
      const p1 = PLANETS[i] as string;
      const p2 = PLANETS[j] as string;
      const lon1 = longitudes.get(p1)!;
      const lon2 = longitudes.get(p2)!;
      const diff = angleDiff(lon1, lon2);

      for (const aspectDef of ASPECT_DEFINITIONS) {
        if (Math.abs(diff - aspectDef.angle) <= aspectDef.orb) {
          aspects.push({
            aspect: aspectDef.name,
            planet1: p1,
            planet2: p2,
            isHarmonious: aspectDef.harmonious,
          });
          break;
        }
      }
    }
  }

  return aspects;
}

function getRetrogradePlanets(date: Date): string[] {
  const retro: string[] = [];
  const outerPlanets: Astronomy.Body[] = [
    "Mercury" as Astronomy.Body,
    "Venus" as Astronomy.Body,
    "Mars" as Astronomy.Body,
    "Jupiter" as Astronomy.Body,
    "Saturn" as Astronomy.Body,
  ];

  const dayBefore = subDays(date, 1);

  for (const planet of outerPlanets) {
    const lonToday = Astronomy.EclipticLongitude(planet, date);
    const lonYesterday = Astronomy.EclipticLongitude(planet, dayBefore);

    let diff = lonToday - lonYesterday;
    // Handle wraparound at 0/360
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (diff < 0) {
      retro.push(planet as string);
    }
  }

  return retro;
}

function getVoidOfCourseMoon(date: Date): VoidOfCourseMoon {
  // Simplified VOC check: look at the moon sign at start and end of the day.
  // If the sign changes during the day, the VOC period is from the last
  // major aspect before the sign change until the sign change.
  //
  // For the prototype, we check if the Moon changes sign during this day and
  // approximate the VOC period.

  const startOfDay = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0
    )
  );
  const endOfDay = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59
    )
  );

  const moonStart = Astronomy.EclipticGeoMoon(startOfDay);
  const moonEnd = Astronomy.EclipticGeoMoon(endOfDay);

  const signStart = Math.floor(moonStart.lon / 30);
  const signEnd = Math.floor(moonEnd.lon / 30);

  if (signStart === signEnd) {
    return { isVoid: false, startTime: null, endTime: null };
  }

  // Moon changes sign during this day. Find the approximate time by binary search.
  let lo = startOfDay.getTime();
  let hi = endOfDay.getTime();

  for (let i = 0; i < 20; i++) {
    const mid = new Date((lo + hi) / 2);
    const midSign = Math.floor(Astronomy.EclipticGeoMoon(mid).lon / 30);
    if (midSign === signStart) {
      lo = mid.getTime();
    } else {
      hi = mid.getTime();
    }
  }

  const signChangeTime = new Date((lo + hi) / 2);

  // Approximate the VOC start as 2-4 hours before the sign change
  // (a simplification — real VOC requires finding the last major aspect)
  const vocHoursBefore = 2 + Math.random() * 2;
  const vocStart = new Date(
    signChangeTime.getTime() - vocHoursBefore * 60 * 60 * 1000
  );

  const vocStartHour = vocStart.getUTCHours();
  const vocStartMin = vocStart.getUTCMinutes();
  const changeHour = signChangeTime.getUTCHours();
  const changeMin = signChangeTime.getUTCMinutes();

  return {
    isVoid: true,
    startTime: `${String(vocStartHour).padStart(2, "0")}:${String(vocStartMin).padStart(2, "0")}`,
    endTime: `${String(changeHour).padStart(2, "0")}:${String(changeMin).padStart(2, "0")}`,
  };
}

// ---------------------------------------------------------------------------
// Chinese Almanac
// ---------------------------------------------------------------------------

function getChineseAlmanac(date: Date): ChineseAlmanac {
  const jd = dateToJD(date);

  // Stem and branch indices relative to our reference point
  const daysDiff = Math.round(jd - REFERENCE_JD);
  const stemIndex = ((daysDiff % 10) + 10) % 10;
  const branchIndex = ((daysDiff % 12) + 12) % 12;

  const heavenlyStem = HEAVENLY_STEMS[stemIndex];
  const earthlyBranch = EARTHLY_BRANCHES[branchIndex];
  const stemBranchDay = `${heavenlyStem}${earthlyBranch}`;

  // Determine the solar month from the month of the Gregorian date
  // Approximate: Chinese solar months roughly map to Gregorian months offset by ~1
  // Month 1 (寅) starts around Feb 4, Month 2 (卯) around Mar 6, etc.
  const month = date.getUTCMonth(); // 0-indexed (0=Jan)
  // Solar month branch: Month 1=寅(2), Month 2=卯(3), ... Month 11=丑(1), Month 12=寅(2)
  // Mapping Gregorian month -> solar month branch index:
  // Feb->2, Mar->3, Apr->4, May->5, Jun->6, Jul->7, Aug->8, Sep->9, Oct->10, Nov->11, Dec->0, Jan->1
  const monthBranchMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0]; // Jan=1(丑), Feb=2(寅), etc.
  const monthBranch = monthBranchMap[month];

  // Day Officer = (dayBranch - monthBranch + 12) % 12
  const officerIndex = ((branchIndex - monthBranch + 12) % 12);
  const dayOfficerChinese = DAY_OFFICERS_CN[officerIndex];
  const dayOfficer = DAY_OFFICERS_EN[officerIndex];

  const activities = OFFICER_ACTIVITIES[officerIndex];
  const element = ELEMENTS[stemIndex];
  const animalDay = ANIMALS[branchIndex];
  const clashAnimal = CLASH_ANIMALS[branchIndex];

  // Approximate lunar date from the Gregorian date. This is a rough
  // approximation — real lunar calendar conversion requires tables.
  // We use a simplified mapping for the prototype.
  const lunarDate = approximateLunarDate(date);

  return {
    lunarDate,
    heavenlyStem,
    earthlyBranch,
    stemBranchDay,
    dayOfficer,
    dayOfficerChinese,
    auspiciousActivities: activities.good,
    inauspiciousActivities: activities.bad,
    element,
    animalDay,
    clashAnimal,
  };
}

function approximateLunarDate(date: Date): string {
  // Use moon phase to approximate the lunar day.
  // New Moon ≈ Lunar Day 1, Full Moon ≈ Lunar Day 15.
  const phase = Astronomy.MoonPhase(date);
  const lunarDay = Math.round((phase / 360) * 29.5) + 1;
  const clampedDay = Math.max(1, Math.min(30, lunarDay));

  // Approximate the lunar month from the Gregorian date
  // This is a rough mapping; real conversion requires astronomical tables
  const month = date.getUTCMonth(); // 0-indexed
  const dayOfMonth = date.getUTCDate();

  // Lunar months are roughly offset by about 3-7 weeks from Gregorian months
  // For a reasonable approximation:
  let lunarMonth: number;
  if (month === 0 && dayOfMonth < 20) {
    lunarMonth = 12; // Previous year's 12th month
  } else if (month === 0) {
    lunarMonth = 1;
  } else {
    lunarMonth = month + (dayOfMonth < 15 ? 0 : 1);
    if (lunarMonth > 12) lunarMonth = 12;
    if (lunarMonth < 1) lunarMonth = 1;
  }

  const monthNames = [
    "",
    "正月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "冬月",
    "腊月",
  ];

  const dayNames: { [key: number]: string } = {
    1: "初一",
    2: "初二",
    3: "初三",
    4: "初四",
    5: "初五",
    6: "初六",
    7: "初七",
    8: "初八",
    9: "初九",
    10: "初十",
    11: "十一",
    12: "十二",
    13: "十三",
    14: "十四",
    15: "十五",
    16: "十六",
    17: "十七",
    18: "十八",
    19: "十九",
    20: "二十",
    21: "廿一",
    22: "廿二",
    23: "廿三",
    24: "廿四",
    25: "廿五",
    26: "廿六",
    27: "廿七",
    28: "廿八",
    29: "廿九",
    30: "三十",
  };

  return `${monthNames[lunarMonth]}${dayNames[clampedDay] || "初一"}`;
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function computeScore(day: Omit<AuspiciousDayData, "score" | "scoreLabel" | "summary">): {
  score: number;
  scoreLabel: ScoreLabel;
} {
  // Moon Phase score (20%)
  let moonPhaseScore: number;
  const phaseName = day.moonPhase.name;
  if (phaseName === "Full Moon") moonPhaseScore = 5;
  else if (phaseName === "New Moon") moonPhaseScore = 4;
  else if (
    phaseName === "First Quarter" ||
    phaseName === "Third Quarter"
  )
    moonPhaseScore = 3;
  else if (phaseName.includes("Waxing")) moonPhaseScore = 4;
  else moonPhaseScore = 2; // Waning

  // Void of Course Moon score (20%)
  let vocScore: number;
  if (!day.voidOfCourseMoon.isVoid) {
    vocScore = 5;
  } else {
    // Parse start/end to determine duration
    if (day.voidOfCourseMoon.startTime && day.voidOfCourseMoon.endTime) {
      const [sh, sm] = day.voidOfCourseMoon.startTime.split(":").map(Number);
      const [eh, em] = day.voidOfCourseMoon.endTime.split(":").map(Number);
      const duration = (eh * 60 + em) - (sh * 60 + sm);
      vocScore = duration > 240 ? 1 : duration > 120 ? 3 : 4;
    } else {
      vocScore = 3;
    }
  }

  // Planetary Aspects score (25%)
  const harmoniousCount = day.planetaryAspects.filter(
    (a) => a.isHarmonious
  ).length;
  const challengingCount = day.planetaryAspects.filter(
    (a) => !a.isHarmonious
  ).length;
  const netAspect = harmoniousCount - challengingCount;
  let aspectScore: number;
  if (netAspect >= 3) aspectScore = 5;
  else if (netAspect >= 1) aspectScore = 4;
  else if (netAspect === 0) aspectScore = 3;
  else if (netAspect >= -2) aspectScore = 2;
  else aspectScore = 1;

  // Retrogrades score (10%)
  let retroScore: number;
  const retroCount = day.retrograde.length;
  if (retroCount === 0) retroScore = 5;
  else if (retroCount === 1) retroScore = 3;
  else retroScore = 2;

  // Day Officer score (15%)
  let officerScore: number;
  const officer = day.chinese.dayOfficer;
  if (officer === "Success" || officer === "Open" || officer === "Establish")
    officerScore = 5;
  else if (officer === "Remove" || officer === "Full") officerScore = 4;
  else if (officer === "Balance" || officer === "Stable") officerScore = 3;
  else if (officer === "Danger" || officer === "Receive") officerScore = 2;
  else officerScore = 1; // Break, Close

  // Chinese Activities score (10%)
  const goodCount = day.chinese.auspiciousActivities.length;
  const badCount = day.chinese.inauspiciousActivities.length;
  let activityScore: number;
  if (goodCount >= 4 && badCount <= 1) activityScore = 5;
  else if (goodCount >= 3) activityScore = 4;
  else if (goodCount >= 2) activityScore = 3;
  else if (badCount >= 3) activityScore = 2;
  else activityScore = 1;

  // Weighted total
  const raw =
    moonPhaseScore * 0.2 +
    vocScore * 0.2 +
    aspectScore * 0.25 +
    retroScore * 0.1 +
    officerScore * 0.15 +
    activityScore * 0.1;

  const score = Math.max(1, Math.min(5, Math.round(raw)));

  const labels: ScoreLabel[] = ["Avoid", "Poor", "Neutral", "Good", "Great"];
  const scoreLabel = labels[score - 1];

  return { score, scoreLabel };
}

// ---------------------------------------------------------------------------
// Summary Generation
// ---------------------------------------------------------------------------

function generateSummary(day: AuspiciousDayData): string {
  const parts: string[] = [];

  if (day.moonPhase.isExactQuarter) {
    parts.push(`${day.moonPhase.name} in ${day.moonSign}`);
  }

  const harmonious = day.planetaryAspects.filter((a) => a.isHarmonious);
  const challenging = day.planetaryAspects.filter((a) => !a.isHarmonious);

  if (harmonious.length > challenging.length && harmonious.length >= 2) {
    parts.push("Favorable planetary energy");
  } else if (challenging.length > harmonious.length && challenging.length >= 2) {
    parts.push("Challenging aspects present");
  }

  if (day.voidOfCourseMoon.isVoid) {
    parts.push("Moon void-of-course");
  }

  if (day.retrograde.length > 0) {
    parts.push(`${day.retrograde.join(", ")} retrograde`);
  }

  if (
    day.chinese.dayOfficer === "Success" ||
    day.chinese.dayOfficer === "Open"
  ) {
    parts.push(`${day.chinese.dayOfficer} day`);
  } else if (
    day.chinese.dayOfficer === "Break" ||
    day.chinese.dayOfficer === "Close"
  ) {
    parts.push(`${day.chinese.dayOfficer} day — caution advised`);
  }

  if (parts.length === 0) {
    // Fallback based on score
    if (day.score >= 4) parts.push("Generally favorable energy");
    else if (day.score <= 2) parts.push("Exercise caution today");
    else parts.push("A balanced day");
  }

  return parts.join(". ") + ".";
}

// ---------------------------------------------------------------------------
// Main generation
// ---------------------------------------------------------------------------

function generateDayData(date: Date): AuspiciousDayData {
  const dateStr = format(date, "yyyy-MM-dd");

  const moonPhase = getMoonPhase(date);
  const moonSign = getMoonSign(date);
  const sunSign = getSunSign(date);
  const voidOfCourseMoon = getVoidOfCourseMoon(date);
  const planetaryAspects = getPlanetaryAspects(date);
  const retrograde = getRetrogradePlanets(date);
  const chinese = getChineseAlmanac(date);

  const partial = {
    date: dateStr,
    moonPhase,
    moonSign,
    sunSign,
    voidOfCourseMoon,
    planetaryAspects,
    retrograde,
    chinese,
  };

  const { score, scoreLabel } = computeScore(partial);

  const day: AuspiciousDayData = {
    ...partial,
    score,
    scoreLabel,
    summary: "",
  };

  day.summary = generateSummary(day);

  return day;
}

function generateMonthData(year: number, month: number): MonthData {
  const monthDate = new Date(Date.UTC(year, month - 1, 1));
  const days = eachDayOfInterval({
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate),
  });

  // Use UTC noon for each day to avoid timezone issues
  const dayData = days.map((d) => {
    const utcNoon = new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0)
    );
    return generateDayData(utcNoon);
  });

  return {
    year,
    month,
    generatedAt: new Date().toISOString(),
    days: dayData,
  };
}

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------

function main() {
  const outputBase = path.join(__dirname, "..", "public", "data", "general");

  const years = [2025, 2026];

  for (const year of years) {
    for (let month = 1; month <= 12; month++) {
      const dir = path.join(outputBase, String(year));
      fs.mkdirSync(dir, { recursive: true });

      const monthStr = String(month).padStart(2, "0");
      const filePath = path.join(dir, `${monthStr}.json`);

      console.log(`Generating ${year}/${monthStr}...`);
      const data = generateMonthData(year, month);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      console.log(
        `  -> ${filePath} (${data.days.length} days)`
      );
    }
  }

  console.log("\nDone! Generated data for 2025-2026.");
}

main();
