// Local demo datasets. All values are illustrative sample data, not live or verified figures.

export type CropProfile = {
  name: string;
  n: [number, number]; p: [number, number]; k: [number, number];
  ph: [number, number]; temp: [number, number]; humidity: [number, number];
  rainfall: [number, number]; moisture: [number, number];
  seasons: string[];
  waterMm: number; // approx. seasonal water requirement (sample)
  baseYield: number; // t/ha sample baseline
  pricePerQuintal: number;
  sowing: string;
  precautions: string[];
};

export const CROPS: CropProfile[] = [
  { name: "Rice", n: [60, 100], p: [35, 60], k: [35, 50], ph: [5.5, 7], temp: [22, 32], humidity: [75, 90], rainfall: [150, 300], moisture: [60, 90], seasons: ["Kharif"], waterMm: 1200, baseYield: 4.0, pricePerQuintal: 2300, sowing: "Transplant 25–30 day seedlings into puddled fields with standing water.", precautions: ["Watch for blast and brown planthopper", "Avoid prolonged drought at flowering"] },
  { name: "Wheat", n: [80, 120], p: [40, 60], k: [30, 50], ph: [6, 7.5], temp: [12, 25], humidity: [40, 65], rainfall: [50, 100], moisture: [35, 60], seasons: ["Rabi"], waterMm: 450, baseYield: 3.5, pricePerQuintal: 2275, sowing: "Sow in well-tilled soil in Nov; maintain 20 cm row spacing.", precautions: ["Monitor for rust", "Irrigate at crown root initiation"] },
  { name: "Maize", n: [70, 110], p: [40, 60], k: [30, 50], ph: [5.8, 7.5], temp: [18, 30], humidity: [55, 75], rainfall: [60, 110], moisture: [40, 65], seasons: ["Kharif", "Rabi"], waterMm: 550, baseYield: 3.2, pricePerQuintal: 2090, sowing: "Sow on ridges at 60×20 cm spacing after soil warms.", precautions: ["Scout for fall armyworm", "Ensure drainage"] },
  { name: "Cotton", n: [100, 140], p: [35, 55], k: [15, 35], ph: [6, 8], temp: [22, 34], humidity: [50, 75], rainfall: [60, 120], moisture: [40, 60], seasons: ["Kharif"], waterMm: 700, baseYield: 1.8, pricePerQuintal: 7020, sowing: "Sow after first monsoon showers with adequate soil moisture.", precautions: ["Watch for pink bollworm", "Avoid waterlogging"] },
  { name: "Sugarcane", n: [90, 140], p: [40, 70], k: [40, 70], ph: [6, 8], temp: [21, 35], humidity: [60, 85], rainfall: [120, 250], moisture: [55, 80], seasons: ["Kharif", "Zaid"], waterMm: 1800, baseYield: 70, pricePerQuintal: 340, sowing: "Plant 2–3 bud setts in furrows; keep field moist.", precautions: ["High water demand", "Manage red rot"] },
  { name: "Chickpea", n: [20, 50], p: [50, 80], k: [70, 90], ph: [6, 8], temp: [15, 28], humidity: [30, 55], rainfall: [40, 90], moisture: [25, 45], seasons: ["Rabi"], waterMm: 300, baseYield: 1.2, pricePerQuintal: 5440, sowing: "Sow on residual moisture in Oct–Nov; seed treat before sowing.", precautions: ["Sensitive to waterlogging", "Watch for wilt"] },
  { name: "Groundnut", n: [20, 40], p: [40, 70], k: [30, 50], ph: [6, 7.5], temp: [24, 32], humidity: [50, 70], rainfall: [50, 120], moisture: [35, 55], seasons: ["Kharif", "Zaid"], waterMm: 500, baseYield: 1.6, pricePerQuintal: 6380, sowing: "Sow in light sandy loam; apply gypsum at flowering.", precautions: ["Leaf spot risk in humid spells"] },
  { name: "Soybean", n: [20, 45], p: [55, 80], k: [35, 55], ph: [6, 7.5], temp: [20, 30], humidity: [60, 80], rainfall: [70, 130], moisture: [45, 65], seasons: ["Kharif"], waterMm: 500, baseYield: 1.4, pricePerQuintal: 4600, sowing: "Sow with onset of monsoon at 45 cm row spacing.", precautions: ["Yellow mosaic risk", "Ensure drainage"] },
  { name: "Mustard", n: [60, 90], p: [30, 50], k: [20, 40], ph: [6, 7.8], temp: [10, 25], humidity: [35, 60], rainfall: [30, 70], moisture: [25, 45], seasons: ["Rabi"], waterMm: 300, baseYield: 1.5, pricePerQuintal: 5650, sowing: "Sow in Oct on fine seedbed; thin to 15 cm spacing.", precautions: ["Aphid monitoring in Jan"] },
  { name: "Tomato", n: [80, 120], p: [50, 80], k: [50, 80], ph: [6, 7], temp: [18, 30], humidity: [50, 75], rainfall: [40, 100], moisture: [45, 70], seasons: ["Rabi", "Zaid", "Kharif"], waterMm: 600, baseYield: 25, pricePerQuintal: 1500, sowing: "Transplant 4-week seedlings; stake plants early.", precautions: ["Early/late blight risk", "Avoid overhead watering"] },
  { name: "Millet (Bajra)", n: [40, 70], p: [20, 40], k: [20, 40], ph: [6, 8.5], temp: [25, 36], humidity: [30, 60], rainfall: [30, 70], moisture: [20, 40], seasons: ["Kharif"], waterMm: 350, baseYield: 1.5, pricePerQuintal: 2500, sowing: "Sow in July in light soils; tolerant of low rainfall.", precautions: ["Downy mildew in wet spells"] },
  { name: "Potato", n: [100, 150], p: [60, 90], k: [80, 120], ph: [5, 6.5], temp: [15, 24], humidity: [60, 80], rainfall: [50, 100], moisture: [50, 70], seasons: ["Rabi"], waterMm: 500, baseYield: 22, pricePerQuintal: 1200, sowing: "Plant seed tubers on ridges in Oct–Nov.", precautions: ["Late blight in cool humid weather"] },
];

export const REGIONS = ["Punjab", "Maharashtra (Vidarbha)", "Uttar Pradesh", "Karnataka", "Tamil Nadu", "Gujarat", "West Bengal", "Madhya Pradesh"];
export const SEASONS = ["Kharif", "Rabi", "Zaid"];
export const IRRIGATION_TYPES = ["Drip", "Sprinkler", "Flood / Furrow", "Rainfed only"];

export type SoilInput = {
  n: number; p: number; k: number; ph: number; moisture: number;
  temp: number; humidity: number; rainfall: number;
  region: string; season: string; irrigation: string;
};

export const SOIL_PRESETS: { label: string; values: SoilInput }[] = [
  { label: "Monsoon paddy field", values: { n: 85, p: 45, k: 42, ph: 6.4, moisture: 72, temp: 28, humidity: 82, rainfall: 210, region: "West Bengal", season: "Kharif", irrigation: "Flood / Furrow" } },
  { label: "Winter loam (Punjab)", values: { n: 100, p: 48, k: 40, ph: 7.0, moisture: 45, temp: 18, humidity: 55, rainfall: 70, region: "Punjab", season: "Rabi", irrigation: "Sprinkler" } },
  { label: "Black cotton soil", values: { n: 118, p: 44, k: 26, ph: 7.6, moisture: 50, temp: 29, humidity: 62, rainfall: 90, region: "Maharashtra (Vidarbha)", season: "Kharif", irrigation: "Drip" } },
  { label: "Dry sandy plot", values: { n: 50, p: 30, k: 30, ph: 7.8, moisture: 28, temp: 31, humidity: 42, rainfall: 45, region: "Gujarat", season: "Kharif", irrigation: "Rainfed only" } },
];

export type WeatherDay = { day: string; high: number; low: number; humidity: number; rain: number; wind: number; condition: "Sunny" | "Cloudy" | "Rain" | "Storm" | "Partly cloudy" };

const BASE_WEEK: WeatherDay[] = [
  { day: "Mon", high: 31, low: 23, humidity: 64, rain: 0, wind: 9, condition: "Sunny" },
  { day: "Tue", high: 32, low: 24, humidity: 60, rain: 0, wind: 11, condition: "Partly cloudy" },
  { day: "Wed", high: 30, low: 23, humidity: 72, rain: 6, wind: 14, condition: "Cloudy" },
  { day: "Thu", high: 27, low: 22, humidity: 86, rain: 24, wind: 18, condition: "Rain" },
  { day: "Fri", high: 26, low: 21, humidity: 90, rain: 38, wind: 26, condition: "Storm" },
  { day: "Sat", high: 28, low: 22, humidity: 78, rain: 9, wind: 12, condition: "Cloudy" },
  { day: "Sun", high: 30, low: 23, humidity: 68, rain: 0, wind: 10, condition: "Sunny" },
];

// Deterministic region offsets so each region shows a distinct sample week.
const REGION_OFFSET: Record<string, { t: number; r: number; h: number }> = {
  "Punjab": { t: -6, r: 0.3, h: -15 },
  "Maharashtra (Vidarbha)": { t: 3, r: 0.6, h: -8 },
  "Uttar Pradesh": { t: -2, r: 0.7, h: -5 },
  "Karnataka": { t: -1, r: 0.9, h: 2 },
  "Tamil Nadu": { t: 2, r: 0.8, h: 4 },
  "Gujarat": { t: 4, r: 0.4, h: -12 },
  "West Bengal": { t: 0, r: 1.4, h: 8 },
  "Madhya Pradesh": { t: 1, r: 0.8, h: -4 },
};

export function weatherFor(region: string): WeatherDay[] {
  const o = REGION_OFFSET[region] ?? { t: 0, r: 1, h: 0 };
  return BASE_WEEK.map((d) => ({
    ...d,
    high: d.high + o.t,
    low: d.low + o.t,
    rain: Math.round(d.rain * o.r),
    humidity: Math.max(20, Math.min(98, d.humidity + o.h)),
  }));
}

export const MARKETS = ["Azadpur (Delhi)", "Vashi (Navi Mumbai)", "Khanna (Punjab)", "Indore", "Koyambedu (Chennai)"];

export type Commodity = { name: string; category: "Cereal" | "Pulse" | "Oilseed" | "Vegetable" | "Cash crop"; base: number; harvest: string };
export const COMMODITIES: Commodity[] = [
  { name: "Wheat", category: "Cereal", base: 2350, harvest: "Mar – May" },
  { name: "Rice (Paddy)", category: "Cereal", base: 2280, harvest: "Oct – Dec" },
  { name: "Maize", category: "Cereal", base: 2120, harvest: "Sep – Nov" },
  { name: "Chickpea", category: "Pulse", base: 5550, harvest: "Feb – Apr" },
  { name: "Tur (Arhar)", category: "Pulse", base: 7200, harvest: "Dec – Feb" },
  { name: "Soybean", category: "Oilseed", base: 4650, harvest: "Sep – Oct" },
  { name: "Mustard", category: "Oilseed", base: 5700, harvest: "Feb – Mar" },
  { name: "Groundnut", category: "Oilseed", base: 6400, harvest: "Sep – Nov" },
  { name: "Onion", category: "Vegetable", base: 1850, harvest: "Nov – May" },
  { name: "Tomato", category: "Vegetable", base: 1600, harvest: "Year-round" },
  { name: "Potato", category: "Vegetable", base: 1250, harvest: "Jan – Mar" },
  { name: "Cotton", category: "Cash crop", base: 7050, harvest: "Oct – Jan" },
];

const MARKET_FACTOR = [1.04, 1.02, 0.97, 0.99, 1.01];
// Deterministic pseudo-variation from name hash.
function hash(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

export function priceAt(c: Commodity, marketIdx: number) {
  const f = MARKET_FACTOR[marketIdx] ?? 1;
  const h = hash(c.name + marketIdx);
  const price = Math.round((c.base * f) / 5) * 5;
  const changePct = ((h % 140) - 60) / 10; // -6.0 .. +8.0
  const previous = Math.round(price / (1 + changePct / 100));
  return { price, previous, changePct: Math.round(((price - previous) / previous) * 1000) / 10 };
}

export function priceHistory(c: Commodity, marketIdx: number) {
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const { price } = priceAt(c, marketIdx);
  const h = hash(c.name);
  return months.map((m, i) => ({ month: m, price: Math.round(price * (0.9 + (((h >> i) % 9) / 100) + i * 0.012)) }));
}

export type DiseaseCase = { id: string; crop: string; label: string; confidence: number; severity: "Low" | "Moderate" | "High"; symptoms: string[]; prevention: string[]; nextSteps: string[] };
export const DISEASE_CASES: DiseaseCase[] = [
  { id: "tomato-early-blight", crop: "Tomato", label: "Early Blight (Alternaria solani)", confidence: 0.87, severity: "Moderate", symptoms: ["Brown concentric 'target' rings on older leaves", "Yellowing around lesions", "Lower leaves drop first"], prevention: ["Rotate crops (avoid solanaceae for 2 seasons)", "Mulch to reduce soil splash", "Avoid overhead irrigation"], nextSteps: ["Remove and destroy infected leaves", "Consult local KVK for approved fungicide", "Re-inspect plants in 5–7 days"] },
  { id: "rice-blast", crop: "Rice", label: "Rice Blast (Magnaporthe oryzae)", confidence: 0.82, severity: "High", symptoms: ["Spindle-shaped lesions with grey centres", "Neck rot near panicle", "Lesions merge in humid weather"], prevention: ["Use resistant varieties", "Balanced nitrogen application", "Maintain field sanitation"], nextSteps: ["Contact agriculture extension officer", "Avoid excess nitrogen top dressing", "Monitor neighbouring plots"] },
  { id: "wheat-rust", crop: "Wheat", label: "Leaf Rust (Puccinia triticina)", confidence: 0.79, severity: "Moderate", symptoms: ["Orange-brown pustules on leaf surface", "Powdery spores rub off on fingers", "Reduced leaf greenness"], prevention: ["Sow recommended rust-resistant varieties", "Timely sowing", "Remove volunteer plants"], nextSteps: ["Survey field for spread pattern", "Seek expert advice on control options"] },
  { id: "potato-late-blight", crop: "Potato", label: "Late Blight (Phytophthora infestans)", confidence: 0.84, severity: "High", symptoms: ["Water-soaked dark patches on leaves", "White growth on leaf underside", "Rapid collapse in cool humid weather"], prevention: ["Use certified seed tubers", "Hill up soil around plants", "Ensure good drainage"], nextSteps: ["Isolate affected rows", "Consult extension services urgently"] },
  { id: "healthy-leaf", crop: "Maize", label: "No visible disease (Healthy)", confidence: 0.91, severity: "Low", symptoms: ["Uniform green colour", "No lesions or spots observed"], prevention: ["Continue regular scouting", "Maintain balanced nutrition"], nextSteps: ["Re-check weekly during humid periods"] },
];

export const CROP_TYPES = CROPS.map((c) => c.name);
export const GROWTH_STAGES = ["Initial", "Development", "Mid-season", "Late season"] as const;
export const SOIL_TYPES = ["Sandy", "Loamy", "Clay", "Black (Regur)", "Red"] as const;
export const IRRIGATION_METHODS = ["Drip", "Sprinkler", "Flood / Furrow"] as const;

export const RECENT_ACTIVITIES = [
  { date: "Oct 20", text: "Applied urea top dressing — Plot B (Wheat)", tone: "success" as const },
  { date: "Oct 19", text: "Drip irrigation 2.5 h — Plot A (Tomato)", tone: "default" as const },
  { date: "Oct 18", text: "Early blight spotted on 4 tomato plants", tone: "warning" as const },
  { date: "Oct 16", text: "Soil test sample collected — Plot C", tone: "default" as const },
  { date: "Oct 14", text: "Sowed chickpea on 1.2 ha — Plot D", tone: "success" as const },
];
