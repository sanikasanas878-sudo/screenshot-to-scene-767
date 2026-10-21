// Transparent, rule-based frontend algorithms. Educational estimates only — not trained ML models.
import { CROPS, type SoilInput, type CropProfile } from "./data";

function rangeScore(v: number, [lo, hi]: [number, number]) {
  if (v >= lo && v <= hi) return 1;
  const width = Math.max(hi - lo, 1);
  const dist = v < lo ? lo - v : v - hi;
  return Math.max(0, 1 - dist / width);
}

const WEIGHTS = { n: 1, p: 1, k: 1, ph: 1.5, temp: 1.5, humidity: 1, rainfall: 1.5, moisture: 1 } as const;

export type Recommendation = { crop: CropProfile; score: number; reasons: string[] };

export function recommendCrops(input: SoilInput, top = 3): Recommendation[] {
  const results = CROPS.map((crop) => {
    const parts: Record<keyof typeof WEIGHTS, number> = {
      n: rangeScore(input.n, crop.n), p: rangeScore(input.p, crop.p), k: rangeScore(input.k, crop.k),
      ph: rangeScore(input.ph, crop.ph), temp: rangeScore(input.temp, crop.temp),
      humidity: rangeScore(input.humidity, crop.humidity), rainfall: rangeScore(input.rainfall, crop.rainfall),
      moisture: rangeScore(input.moisture, crop.moisture),
    };
    let total = 0, wsum = 0;
    for (const k of Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[]) { total += parts[k] * WEIGHTS[k]; wsum += WEIGHTS[k]; }
    let score = total / wsum;
    if (!crop.seasons.includes(input.season)) score *= 0.75;
    if (input.irrigation === "Rainfed only" && crop.waterMm > 900) score *= 0.8;

    const labels: Record<string, string> = { n: "Nitrogen", p: "Phosphorus", k: "Potassium", ph: "Soil pH", temp: "Temperature", humidity: "Humidity", rainfall: "Rainfall", moisture: "Soil moisture" };
    const reasons = (Object.keys(parts) as (keyof typeof parts)[]).filter((k) => parts[k] === 1).map((k) => `${labels[k]} within ideal range`);
    if (crop.seasons.includes(input.season)) reasons.unshift(`Suited to ${input.season} season`);
    return { crop, score: Math.round(score * 1000) / 10, reasons: reasons.slice(0, 4) };
  });
  return results.sort((a, b) => b.score - a.score).slice(0, top);
}

// Irrigation — simplified sample formula:
// daily need (mm) = baseET(temp) × stage coefficient × soil factor − rainfall credit, then ÷ method efficiency.
export const STAGE_KC: Record<string, number> = { Initial: 0.5, Development: 0.8, "Mid-season": 1.15, "Late season": 0.75 };
export const SOIL_FACTOR: Record<string, number> = { Sandy: 1.25, Loamy: 1, Clay: 0.85, "Black (Regur)": 0.9, Red: 1.1 };
export const METHOD_EFF: Record<string, number> = { Drip: 0.9, Sprinkler: 0.75, "Flood / Furrow": 0.55 };

export type IrrigationInput = { crop: string; stage: string; soil: string; moisture: number; temp: number; rainfall: number; area: number; method: string };

export function planIrrigation(i: IrrigationInput) {
  const baseET = Math.max(2, 0.25 * i.temp - 1.5); // mm/day sample
  const kc = STAGE_KC[i.stage] ?? 1;
  const sf = SOIL_FACTOR[i.soil] ?? 1;
  const eff = METHOD_EFF[i.method] ?? 0.7;
  const moistureCredit = i.moisture > 70 ? 0.4 : i.moisture > 50 ? 0.75 : 1;
  const dailyMm = Math.max(0, (baseET * kc * sf * moistureCredit - i.rainfall / 7) / eff);
  const interval = dailyMm < 2 ? 4 : dailyMm < 4 ? 3 : dailyMm < 6 ? 2 : 1;
  const litresPerDay = dailyMm * i.area * 10000; // 1 mm over 1 ha = 10,000 L
  const days = Array.from({ length: 7 }, (_, d) => {
    const water = d % interval === 0 ? Math.round(litresPerDay * interval) : 0;
    return { day: d + 1, water };
  });
  return { dailyMm: Math.round(dailyMm * 10) / 10, interval, litresPerDay: Math.round(litresPerDay), days, weeklyLitres: days.reduce((s, d) => s + d.water, 0) };
}

export type YieldInput = { crop: string; area: number; soilQuality: number; rainfall: number; temp: number; irrigation: boolean; fertilizer: number; previous?: number };

// Yield — multiplicative sample factors applied to a crop baseline (t/ha).
export function estimateYield(i: YieldInput) {
  const crop = CROPS.find((c) => c.name === i.crop) ?? CROPS[0];
  const soilF = 0.7 + (i.soilQuality / 10) * 0.5; // 1–10 → 0.75–1.2
  const midRain = (crop.rainfall[0] + crop.rainfall[1]) / 2;
  const rainF = 0.75 + 0.25 * rangeScore(i.rainfall, crop.rainfall) + (i.irrigation ? 0.1 : 0) - (i.rainfall > midRain * 2 ? 0.1 : 0);
  const tempF = 0.8 + 0.2 * rangeScore(i.temp, crop.temp);
  const fertF = Math.min(1.15, 0.85 + i.fertilizer / 600); // kg/ha
  let perHa = crop.baseYield * soilF * rainF * tempF * fertF;
  if (i.previous && i.previous > 0) perHa = perHa * 0.7 + i.previous * 0.3;
  perHa = Math.round(perHa * 100) / 100;
  return {
    perHa, total: Math.round(perHa * i.area * 100) / 100,
    low: Math.round(perHa * 0.85 * 100) / 100, high: Math.round(perHa * 1.12 * 100) / 100,
    factors: { Soil: soilF, Rainfall: rainF, Temperature: tempF, Fertilizer: fertF },
  };
}
