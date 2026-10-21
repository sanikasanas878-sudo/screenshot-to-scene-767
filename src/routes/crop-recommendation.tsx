import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout, RotateCcw, Save, Droplets } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { PageIntro, Panel, Field, Notice, Empty, chartTooltip, axisProps } from "@/components/kit";
import { SOIL_PRESETS, REGIONS, SEASONS, IRRIGATION_TYPES, type SoilInput } from "@/lib/data";
import { recommendCrops, type Recommendation } from "@/lib/logic";
import { addHistory } from "@/lib/storage";

export const Route = createFileRoute("/crop-recommendation")({
  head: () => ({
    meta: [
      { title: "Crop Recommendation — AgriSmart AI" },
      { name: "description", content: "Rule-based crop suitability scoring from soil nutrients, pH and climate inputs." },
      { property: "og:title", content: "Crop Recommendation — AgriSmart AI" },
      { property: "og:description", content: "Get top three crop suggestions with suitability scores (educational estimates)." },
    ],
  }),
  component: CropPage,
});

type Form = Record<keyof SoilInput, string>;
const EMPTY: Form = { n: "", p: "", k: "", ph: "", moisture: "", temp: "", humidity: "", rainfall: "", region: "", season: "", irrigation: "" };
const NUMERIC: { key: keyof SoilInput; label: string; min: number; max: number; step?: number; unit: string }[] = [
  { key: "n", label: "Nitrogen (N)", min: 0, max: 200, unit: "kg/ha" },
  { key: "p", label: "Phosphorus (P)", min: 0, max: 150, unit: "kg/ha" },
  { key: "k", label: "Potassium (K)", min: 0, max: 200, unit: "kg/ha" },
  { key: "ph", label: "Soil pH", min: 3, max: 10, step: 0.1, unit: "" },
  { key: "moisture", label: "Soil moisture", min: 0, max: 100, unit: "%" },
  { key: "temp", label: "Temperature", min: -5, max: 50, unit: "°C" },
  { key: "humidity", label: "Humidity", min: 0, max: 100, unit: "%" },
  { key: "rainfall", label: "Rainfall", min: 0, max: 500, unit: "mm/month" },
];

function toForm(v: SoilInput): Form { return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, String(x)])) as Form; }

function CropPage() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [lastInput, setLastInput] = useState<SoilInput | null>(null);

  const set = (k: keyof Form, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    for (const f of NUMERIC) {
      const raw = form[f.key];
      const v = Number(raw);
      if (raw.trim() === "" || Number.isNaN(v)) errs[f.key] = "Required";
      else if (v < f.min || v > f.max) errs[f.key] = `Enter ${f.min}–${f.max}`;
    }
    for (const k of ["region", "season", "irrigation"] as const) if (!form[k]) errs[k] = "Select an option";
    setErrors(errs);
    if (Object.keys(errs).length) { toast.error("Please fix the highlighted fields"); return; }
    const input: SoilInput = { ...form, n: +form.n, p: +form.p, k: +form.k, ph: +form.ph, moisture: +form.moisture, temp: +form.temp, humidity: +form.humidity, rainfall: +form.rainfall };
    setResults(recommendCrops(input)); setLastInput(input);
    toast.success("Recommendations generated");
  };

  const save = () => {
    if (!results || !lastInput) return;
    addHistory({ category: "Crop recommendation", title: `Top pick: ${results[0].crop.name} (${results[0].score}%)`, summary: `${lastInput.region} · ${lastInput.season} · ${lastInput.irrigation}`,
      details: { N: lastInput.n, P: lastInput.p, K: lastInput.k, pH: lastInput.ph, ...Object.fromEntries(results.map((r, i) => [`#${i + 1}`, `${r.crop.name} — ${r.score}%`])) } });
    toast.success("Saved to Farming History");
  };

  return (
    <>
      <PageIntro eyebrow="Module 01" title="Crop recommendation" desc="Enter soil and climate parameters to rank crops using a transparent rule-based scoring method." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="Field parameters" className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap gap-2">
            {SOIL_PRESETS.map((p) => (
              <button key={p.label} type="button" onClick={() => { setForm(toForm(p.values)); setErrors({}); }} className="rounded-full border bg-lavender px-3 py-1 text-xs hover:border-ring">{p.label}</button>
            ))}
          </div>
          <form onSubmit={submit} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {NUMERIC.map((f) => (
                <Field key={f.key} id={f.key} label={`${f.label}${f.unit ? ` (${f.unit})` : ""}`} error={errors[f.key]}>
                  <input id={f.key} type="number" inputMode="decimal" step={f.step ?? 1} className="field" value={form[f.key]} aria-invalid={!!errors[f.key]} onChange={(e) => set(f.key, e.target.value)} />
                </Field>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {([["region", "Region", REGIONS], ["season", "Season", SEASONS], ["irrigation", "Irrigation", IRRIGATION_TYPES]] as const).map(([k, l, opts]) => (
                <Field key={k} id={k} label={l} error={errors[k]}>
                  <select id={k} className="field" value={form[k]} aria-invalid={!!errors[k]} onChange={(e) => set(k, e.target.value)}>
                    <option value="">Select…</option>{opts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1"><Sprout className="h-4 w-4" /> Recommend crops</Button>
              <Button type="button" variant="outline" onClick={() => { setForm(EMPTY); setErrors({}); setResults(null); }}><RotateCcw className="h-4 w-4" /> Reset</Button>
            </div>
          </form>
        </Panel>

        <div className="space-y-4 lg:col-span-3">
          {!results ? (
            <Empty icon={<Sprout className="h-5 w-5" />} title="No recommendation yet" desc="Pick a preset or enter your soil test values, then click Recommend crops." />
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                {results.map((r, i) => (
                  <div key={r.crop.name} className={`lift rounded-xl border p-4 ${i === 0 ? "border-success/50 bg-success/5" : "bg-card"}`}>
                    <p className="eyebrow">Rank #{i + 1}</p>
                    <div className="mt-1 flex items-baseline justify-between"><h3 className="text-lg font-semibold">{r.crop.name}</h3><span className="font-mono text-sm text-success">{r.score}%</span></div>
                    <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-success" style={{ width: `${r.score}%` }} /></div>
                    <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><Droplets className="h-3 w-3" /> ~{r.crop.waterMm} mm / season</p>
                    <ul className="mt-2 space-y-1 text-xs">{(r.reasons.length ? r.reasons : ["Closest overall match to inputs"]).map((x) => <li key={x}>• {x}</li>)}</ul>
                  </div>
                ))}
              </div>
              <Panel title="Suitability comparison" action={<Button size="sm" variant="outline" onClick={save}><Save className="h-4 w-4" /> Save</Button>}>
                <div className="h-48">
                  <ResponsiveContainer>
                    <BarChart data={results.map((r) => ({ name: r.crop.name, score: r.score, water: r.crop.waterMm / 20 }))} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} {...axisProps} />
                      <YAxis type="category" dataKey="name" {...axisProps} width={80} />
                      <Tooltip {...chartTooltip} />
                      <Bar dataKey="score" name="Suitability %" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title={`Sowing guidance — ${results[0].crop.name}`}>
                <p className="text-sm">{results[0].crop.sowing}</p>
                <p className="eyebrow mt-4">Precautions</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{results[0].crop.precautions.map((p) => <li key={p}>{p}</li>)}</ul>
              </Panel>
            </>
          )}
          <Notice>Recommendations are <strong>educational estimates</strong> from a simple rule-based score on a local crop dataset — not a trained ML model. Verify with local agricultural guidance (e.g. your KVK).</Notice>
        </div>
      </div>
    </>
  );
}
