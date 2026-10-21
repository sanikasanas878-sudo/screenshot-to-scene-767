import { describe, it, expect } from "vitest";
import { recommendCrops, planIrrigation, estimateYield } from "@/lib/logic";
import { SOIL_PRESETS } from "@/lib/data";

describe("rule-based logic", () => {
  it("recommends rice first for the monsoon paddy preset", () => {
    expect(recommendCrops(SOIL_PRESETS[0].values)[0].crop.name).toBe("Rice");
  });
  it("returns exactly three recommendations", () => {
    expect(recommendCrops(SOIL_PRESETS[1].values)).toHaveLength(3);
  });
  it("converts 1 mm over 1 ha to 10,000 litres", () => {
    const p = planIrrigation({ crop: "Maize", stage: "Mid-season", soil: "Loamy", moisture: 30, temp: 30, rainfall: 0, area: 1, method: "Drip" });
    expect(p.litresPerDay).toBe(Math.round(p.dailyMm * 10000));
  });
  it("yield low < medium < high", () => {
    const y = estimateYield({ crop: "Wheat", area: 2, soilQuality: 7, rainfall: 75, temp: 20, irrigation: true, fertilizer: 150 });
    expect(y.low).toBeLessThan(y.perHa);
    expect(y.perHa).toBeLessThan(y.high);
  });
});
