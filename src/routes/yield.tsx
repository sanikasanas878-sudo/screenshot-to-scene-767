import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, Save } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { PageIntro, Panel, Field, Notice, Stat, Empty, chartTooltip, axisProps } from "@/components/kit";
import { CROP_TYPES } from "@/lib/data";
import { estimateYield, type YieldInput } from "@/lib/logic";
import { addHistory } from "@/lib/storage";

export const Route = createFileRoute("/yield")({
  head: () => ({
    meta: [
      { title: "Yield Prediction — AgriSmart AI" },
      { name: "description", content: "Illustrative yield estimates with low, medium and high scenarios from transparent formulas." },
      { property: "og:title", content: "Yield Prediction — AgriSmart AI" },
      { property: "og:description", content: "Estimate crop yield per hectare and total production (simulated)." },
    ],
  }),
  component: YieldPage,
});

type F = { crop: string; area: string; soilQuality: string; rainfall: string; temp: string; irrigation: string; fertilizer: string; previous: string };
const INIT: F = { crop: "Wheat", area: "2", soilQuality: "7", rainfall: "75", temp: "20", irrigation: "yes", fertilizer: "150", previous: "" };

function YieldPage() {
  const [f, setF] = useState<F>(INIT);
  const [errors, setErrors] = useState<Partial<Record<keyof F, string>>>({});
  const [res, setRes] = useState<ReturnType<typeof estimateYield> | null>(null);
  const [used, setUsed] = useState<YieldInput | null>(null);
  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    const chk = (k: keyof F, min: number, max: number) => { const v = Number(f[k]); if (f[k] === "" || Number.isNaN(v)) er[k] = "Required"; else if (v < min || v > max) er[k] = `Enter ${min}–${max}`; };
    chk("area", 0.01, 1000); chk("soilQuality", 1, 10); chk("rainfall", 0, 600); chk("temp", -5, 50); chk("fertilizer", 0, 600);
    if (f.previous !== "" && (Number.isNaN(+f.previous) || +f.previous < 0)) er.previous = "Must be a positive number";
    setErrors(er);
    if (Object.keys(er).length) { toast.error("Please fix the highlighted fields"); return; }
    const input: YieldInput = { crop: f.crop, area: +f.area, soilQuality: +f.soilQuality, rainfall: +f.rainfall, temp: +f.temp, irrigation: f.irrigation === "yes", fertilizer: +f.fertilizer, previous: f.previous ? +f.previous : undefined };
    setRes(estimateYield(input)); setUsed(input);
  };

  const save = () => {
    if (!res || !used) return;
    addHistory({ category: "Yield estimate", title: `${used.crop} · ${res.perHa} t/ha`, summary: `${used.area} ha · total ${res.total} t`, details: { Crop: used.crop, Area: `${used.area} ha`, "Per hectare": `${res.perHa} t`, Total: `${res.total} t`, Low: `${res.low} t/ha`, High: `${res.high} t/ha` } });
    toast.success("Saved to Farming History");
  };

  const num = (k: keyof F, label: string, step = "1") => (
    <Field id={k} label={label} error={errors[k]}><input id={k} type="number" step={step} className="field" value={f[k]} aria-invalid={!!errors[k]} onChange={set(k)} /></Field>
  );

  return (
    <>
      <PageIntro eyebrow="Module 04" title="Yield prediction" desc="Estimate production using crop-specific sample baselines and adjustment factors." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="Field details" className="lg:col-span-2">
          <form onSubmit={submit} noValidate className="grid grid-cols-2 gap-3">
            <Field id="crop" label="Crop type"><select id="crop" className="field" value={f.crop} onChange={set("crop")}>{CROP_TYPES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            {num("area", "Area (ha)", "0.1")}
            {num("soilQuality", "Soil quality (1–10)")}
            {num("rainfall", "Rainfall (mm/month)")}
            {num("temp", "Avg. temp (°C)")}
            <Field id="irrigation" label="Irrigation available"><select id="irrigation" className="field" value={f.irrigation} onChange={set("irrigation")}><option value="yes">Yes</option><option value="no">No</option></select></Field>
            {num("fertilizer", "Fertilizer (kg/ha)")}
            {num("previous", "Previous yield (t/ha, optional)", "0.1")}
            <Button type="submit" className="col-span-2"><BarChart3 className="h-4 w-4" /> Estimate yield</Button>
          </form>
        </Panel>
        <div className="space-y-4 lg:col-span-3">
          {!res ? <Empty icon={<BarChart3 className="h-5 w-5" />} title="No estimate yet" desc="Fill in the field details and click Estimate yield." /> : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Per hectare" value={`${res.perHa} t`} sub="Medium scenario" icon={<BarChart3 className="h-4 w-4" />} tone="success" />
                <Stat label="Total production" value={`${res.total} t`} sub={`${used?.area} ha`} icon={<BarChart3 className="h-4 w-4" />} />
              </div>
              <Panel title="Scenario ranges (t/ha)" action={<Button size="sm" variant="outline" onClick={save}><Save className="h-4 w-4" /> Save</Button>}>
                <div className="h-52">
                  <ResponsiveContainer>
                    <BarChart data={[{ s: "Low", v: res.low }, { s: "Medium", v: res.perHa }, { s: "High", v: res.high }]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="s" {...axisProps} /><YAxis {...axisProps} width={32} />
                      <Tooltip {...chartTooltip} />
                      <Bar dataKey="v" name="t/ha" radius={[4, 4, 0, 0]}>{["var(--chart-4)", "var(--chart-1)", "var(--chart-2)"].map((c) => <Cell key={c} fill={c} />)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="What affected this estimate">
                <ul className="space-y-2">{Object.entries(res.factors).map(([k, v]) => (
                  <li key={k} className="flex items-center gap-3 text-sm"><span className="w-24">{k}</span>
                    <div className="h-2 flex-1 rounded-full bg-muted"><div className={`h-2 rounded-full ${v >= 1 ? "bg-success" : "bg-warning"}`} style={{ width: `${Math.min(100, (v / 1.2) * 100)}%` }} /></div>
                    <span className="w-12 text-right font-mono text-xs">×{v.toFixed(2)}</span></li>))}</ul>
                <p className="mt-3 text-xs text-muted-foreground">yield = baseline(crop) × soil × rainfall × temperature × fertilizer{used?.previous ? " (blended 70/30 with your previous yield)" : ""}</p>
              </Panel>
            </>
          )}
          <Notice>These are <strong>simulated estimates</strong> from transparent formulas — not predictions from a trained regression or LSTM model.</Notice>
        </div>
      </div>
    </>
  );
}
