import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Droplets, Plus, Pencil, Trash2, Check, Save, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PageIntro, Panel, Field, Notice, Stat, Empty, chartTooltip, axisProps } from "@/components/kit";
import { CROP_TYPES, GROWTH_STAGES, SOIL_TYPES, IRRIGATION_METHODS } from "@/lib/data";
import { planIrrigation, type IrrigationInput } from "@/lib/logic";
import { addHistory } from "@/lib/storage";

export const Route = createFileRoute("/irrigation")({
  head: () => ({
    meta: [
      { title: "Irrigation Planner — AgriSmart AI" },
      { name: "description", content: "Generate an illustrative seven-day irrigation schedule and manage watering tasks." },
      { property: "og:title", content: "Irrigation Planner — AgriSmart AI" },
      { property: "og:description", content: "Plan watering intervals and water use with transparent sample formulas." },
    ],
  }),
  component: IrrigationPage,
});

type Task = { id: string; date: string; plot: string; litres: number; done: boolean };
const TKEY = "agrismart.irrigationTasks";
const DEFAULT_TASKS: Task[] = [
  { id: "t1", date: "2026-10-22", plot: "Plot B · Wheat", litres: 18000, done: false },
  { id: "t2", date: "2026-10-23", plot: "Plot A · Tomato", litres: 9000, done: false },
  { id: "t3", date: "2026-10-20", plot: "Plot D · Chickpea", litres: 6000, done: true },
];

const DEFAULT_IN: IrrigationInput = { crop: "Maize", stage: "Mid-season", soil: "Loamy", moisture: 42, temp: 30, rainfall: 10, area: 1.5, method: "Drip" };
const TIPS = ["Irrigate early morning to cut evaporation losses.", "Mulch the soil surface to retain moisture.", "Switch to drip for row crops — up to ~35% less water than flood (typical range).", "Skip a cycle if more than 10 mm rain is forecast.", "Check for leaks and clogged emitters weekly."];

function IrrigationPage() {
  const [inp, setInp] = useState(DEFAULT_IN);
  const [err, setErr] = useState<string | null>(null);
  const [plan, setPlan] = useState(() => planIrrigation(DEFAULT_IN));
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [edit, setEdit] = useState<Task | null>(null);

  useEffect(() => { const raw = localStorage.getItem(TKEY); if (raw) try { setTasks(JSON.parse(raw)); } catch { /* ignore */ } }, []);
  const persist = (t: Task[]) => { setTasks(t); localStorage.setItem(TKEY, JSON.stringify(t)); };

  const num = (k: keyof IrrigationInput) => (e: React.ChangeEvent<HTMLInputElement>) => setInp({ ...inp, [k]: e.target.value === "" ? NaN : Number(e.target.value) });
  const sel = (k: keyof IrrigationInput) => (e: React.ChangeEvent<HTMLSelectElement>) => setInp({ ...inp, [k]: e.target.value });

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if ([inp.moisture, inp.temp, inp.rainfall, inp.area].some((v) => Number.isNaN(v))) { setErr("Fill in all numeric fields."); return; }
    if (inp.moisture < 0 || inp.moisture > 100) { setErr("Soil moisture must be 0–100%."); return; }
    if (inp.area <= 0 || inp.area > 500) { setErr("Field size must be between 0 and 500 ha."); return; }
    setErr(null); setPlan(planIrrigation(inp)); toast.success("Schedule generated");
  };

  const addFromPlan = () => {
    const base = new Date();
    const add = plan.days.filter((d) => d.water > 0).map((d) => {
      const dt = new Date(base); dt.setDate(base.getDate() + d.day - 1);
      return { id: crypto.randomUUID(), date: dt.toISOString().slice(0, 10), plot: `${inp.crop} · ${inp.area} ha`, litres: d.water, done: false };
    });
    persist([...add, ...tasks]);
    addHistory({ category: "Irrigation plan", title: `${inp.crop} · every ${plan.interval} day${plan.interval > 1 ? "s" : ""}`, summary: `${inp.area} ha ${inp.method.toLowerCase()} · ${plan.dailyMm} mm/day`, details: { Crop: inp.crop, Stage: inp.stage, Soil: inp.soil, Method: inp.method, "Daily need": `${plan.dailyMm} mm`, "Weekly water": `${(plan.weeklyLitres / 1000).toFixed(1)} kL` } });
    toast.success(`${add.length} tasks added and plan saved to history`);
  };

  const saveTask = () => {
    if (!edit) return;
    if (!edit.plot.trim() || !edit.date || !(edit.litres > 0)) { toast.error("Enter a date, plot and water amount"); return; }
    persist(tasks.some((t) => t.id === edit.id) ? tasks.map((t) => (t.id === edit.id ? edit : t)) : [edit, ...tasks]);
    setEdit(null); toast.success("Task saved");
  };

  const sorted = [...tasks].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageIntro eyebrow="Module 03" title="Irrigation planner" desc="Estimate water needs and build a seven-day watering schedule." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="Field conditions" className="lg:col-span-2">
          <form onSubmit={generate} className="grid grid-cols-2 gap-3" noValidate>
            <Field id="crop" label="Crop type"><select id="crop" className="field" value={inp.crop} onChange={sel("crop")}>{CROP_TYPES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field id="stage" label="Growth stage"><select id="stage" className="field" value={inp.stage} onChange={sel("stage")}>{GROWTH_STAGES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field id="soil" label="Soil type"><select id="soil" className="field" value={inp.soil} onChange={sel("soil")}>{SOIL_TYPES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field id="method" label="Method"><select id="method" className="field" value={inp.method} onChange={sel("method")}>{IRRIGATION_METHODS.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field id="moist" label="Soil moisture (%)"><input id="moist" type="number" className="field" value={Number.isNaN(inp.moisture) ? "" : inp.moisture} onChange={num("moisture")} /></Field>
            <Field id="temp" label="Temperature (°C)"><input id="temp" type="number" className="field" value={Number.isNaN(inp.temp) ? "" : inp.temp} onChange={num("temp")} /></Field>
            <Field id="rain" label="Recent rain (mm/wk)"><input id="rain" type="number" className="field" value={Number.isNaN(inp.rainfall) ? "" : inp.rainfall} onChange={num("rainfall")} /></Field>
            <Field id="area" label="Field size (ha)"><input id="area" type="number" step="0.1" className="field" value={Number.isNaN(inp.area) ? "" : inp.area} onChange={num("area")} /></Field>
            {err && <p className="col-span-2 text-xs text-destructive">{err}</p>}
            <Button type="submit" className="col-span-2"><Droplets className="h-4 w-4" /> Generate schedule</Button>
          </form>
          <p className="mt-4 rounded-lg bg-lavender p-3 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
            need = (ET₀(temp) × Kc(stage) × soil × moisture − rain/7) ÷ efficiency<br />litres = mm × ha × 10,000
          </p>
        </Panel>

        <div className="space-y-4 lg:col-span-3">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Daily need" value={`${plan.dailyMm} mm`} icon={<Droplets className="h-4 w-4" />} />
            <Stat label="Interval" value={`${plan.interval} d`} sub="between cycles" icon={<Droplets className="h-4 w-4" />} />
            <Stat label="Weekly" value={`${(plan.weeklyLitres / 1000).toFixed(1)} kL`} icon={<Droplets className="h-4 w-4" />} tone="success" />
          </div>
          <Panel title="Seven-day water schedule" action={<Button size="sm" variant="outline" onClick={addFromPlan}><Save className="h-4 w-4" /> Add to tasks</Button>}>
            <div className="h-52">
              <ResponsiveContainer>
                <BarChart data={plan.days.map((d) => ({ day: `Day ${d.day}`, kL: +(d.water / 1000).toFixed(1) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" {...axisProps} />
                  <YAxis {...axisProps} width={32} />
                  <Tooltip {...chartTooltip} />
                  <Bar dataKey="kL" name="Water (kL)" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Notice>Estimates are <strong>illustrative</strong>, based on demo inputs and simplified formulas — not live sensor readings or agronomic prescriptions.</Notice>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Irrigation tasks" className="lg:col-span-2" action={<Button size="sm" onClick={() => setEdit({ id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), plot: "", litres: 5000, done: false })}><Plus className="h-4 w-4" /> Add task</Button>}>
          {sorted.length === 0 ? <Empty icon={<Droplets className="h-5 w-5" />} title="No tasks" desc="Add a task or generate a schedule." /> : (
            <ul className="divide-y">
              {sorted.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <button aria-label={t.done ? "Mark incomplete" : "Mark complete"} onClick={() => persist(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${t.done ? "border-success bg-success text-success-foreground" : ""}`}>{t.done && <Check className="h-3 w-3" />}</button>
                  <div className={`min-w-0 flex-1 ${t.done ? "text-muted-foreground line-through" : ""}`}>
                    <p className="truncate font-medium">{t.plot}</p>
                    <p className="text-xs text-muted-foreground">{t.date} · {(t.litres / 1000).toFixed(1)} kL</p>
                  </div>
                  <Button size="icon" variant="ghost" aria-label="Edit task" onClick={() => setEdit(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete task" onClick={() => { persist(tasks.filter((x) => x.id !== t.id)); toast.success("Task deleted"); }}><Trash2 className="h-4 w-4" /></Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Water-saving tips" eyebrow="Good practice">
          <ul className="space-y-2.5 text-sm">{TIPS.map((t) => <li key={t} className="flex gap-2"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-success" />{t}</li>)}</ul>
        </Panel>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit && tasks.some((t) => t.id === edit.id) ? "Edit task" : "New task"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="space-y-3">
              <Field id="tplot" label="Plot / crop"><input id="tplot" className="field" value={edit.plot} onChange={(e) => setEdit({ ...edit, plot: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field id="tdate" label="Date"><input id="tdate" type="date" className="field" value={edit.date} onChange={(e) => setEdit({ ...edit, date: e.target.value })} /></Field>
                <Field id="tl" label="Water (litres)"><input id="tl" type="number" className="field" value={edit.litres} onChange={(e) => setEdit({ ...edit, litres: Number(e.target.value) })} /></Field>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={saveTask}>Save task</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
