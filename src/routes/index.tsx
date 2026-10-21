import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HeartPulse, Droplets, Wheat, Gauge, AlertTriangle, CalendarClock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { PageIntro, Panel, Stat, Notice, DemoBadge, chartTooltip, axisProps } from "@/components/kit";
import { weatherFor, RECENT_ACTIVITIES, COMMODITIES, priceAt } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AgriSmart AI" },
      { name: "description", content: "Farm overview with crop health, soil moisture, yield and water efficiency (simulated demo data)." },
      { property: "og:title", content: "AgriSmart AI Dashboard" },
      { property: "og:description", content: "Smart agriculture overview built on simulated demo data." },
    ],
  }),
  component: Dashboard,
});

const FIELDS = {
  All: { health: 86, moisture: 54, yieldT: 3.6, eff: 78, dist: [62, 24, 10, 4] },
  Wheat: { health: 91, moisture: 46, yieldT: 3.8, eff: 82, dist: [72, 18, 8, 2] },
  Rice: { health: 80, moisture: 74, yieldT: 4.1, eff: 64, dist: [52, 28, 14, 6] },
  Tomato: { health: 73, moisture: 58, yieldT: 24, eff: 88, dist: [44, 30, 18, 8] },
} as const;
type CropKey = keyof typeof FIELDS;

const MOISTURE_SERIES = { "7d": 7, "14d": 14, "30d": 30 } as const;

function Dashboard() {
  const [crop, setCrop] = useState<CropKey>("All");
  const [range, setRange] = useState<keyof typeof MOISTURE_SERIES>("14d");
  const f = FIELDS[crop];
  const week = weatherFor("Maharashtra (Vidarbha)");

  const moisture = useMemo(() => {
    const n = MOISTURE_SERIES[range];
    return Array.from({ length: n }, (_, i) => ({ d: `D${i + 1}`, moisture: Math.round(f.moisture + 9 * Math.sin(i / 2.2) - (i % 5) * 0.8), target: 55 }));
  }, [range, f.moisture]);

  const dist = [
    { name: "Healthy", value: f.dist[0], color: "var(--chart-1)" },
    { name: "Mild stress", value: f.dist[1], color: "var(--chart-3)" },
    { name: "Nutrient deficit", value: f.dist[2], color: "var(--chart-4)" },
    { name: "Disease", value: f.dist[3], color: "var(--chart-5)" },
  ];
  const prices = COMMODITIES.slice(0, 5).map((c) => ({ name: c.name, ...priceAt(c, 0) }));

  return (
    <>
      <PageIntro eyebrow="Overview · Season 2026" title="Farm dashboard" desc="A snapshot of your fields, weather and markets."
        actions={<>
          <select aria-label="Crop filter" className="field h-9 w-36" value={crop} onChange={(e) => setCrop(e.target.value as CropKey)}>
            {Object.keys(FIELDS).map((k) => <option key={k}>{k}</option>)}
          </select>
          <DemoBadge />
        </>} />
      <div className="mb-6"><Notice tone="warning">All information shown is <strong>simulated demo data</strong> and is not live agricultural advice.</Notice></div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Crop health" value={`${f.health}%`} sub="Index across plots" icon={<HeartPulse className="h-4 w-4" />} tone={f.health > 80 ? "success" : "warning"} />
        <Stat label="Soil moisture" value={`${f.moisture}%`} sub="Avg. root zone" icon={<Droplets className="h-4 w-4" />} />
        <Stat label="Est. yield" value={`${f.yieldT} t/ha`} sub="Illustrative estimate" icon={<Wheat className="h-4 w-4" />} />
        <Stat label="Water efficiency" value={`${f.eff}%`} sub="vs. flood baseline" icon={<Gauge className="h-4 w-4" />} tone="success" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel eyebrow="Sample forecast" title="Weekly weather" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={week}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" {...axisProps} />
                <YAxis yAxisId="t" {...axisProps} width={28} />
                <YAxis yAxisId="r" orientation="right" {...axisProps} width={28} />
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="r" dataKey="rain" name="Rain (mm)" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="t" dataKey="high" name="High (°C)" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel eyebrow="Recommendation" title="Crop overview">
          <p className="text-sm text-muted-foreground">Based on the latest sample soil test for Plot C:</p>
          <ul className="mt-3 space-y-2">
            {[["Chickpea", 92], ["Wheat", 88], ["Mustard", 81]].map(([n, s]) => (
              <li key={n} className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium">{n}</span>
                <div className="h-2 flex-1 rounded-full bg-muted"><div className="h-2 rounded-full bg-success" style={{ width: `${s}%` }} /></div>
                <span className="w-10 text-right font-mono text-xs">{s}%</span>
              </li>
            ))}
          </ul>
          <Link to="/crop-recommendation" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">Run a new recommendation →</Link>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel eyebrow="Trend" title="Soil moisture" className="lg:col-span-2"
          action={<div className="flex rounded-md border p-0.5" role="group" aria-label="Date range">
            {(Object.keys(MOISTURE_SERIES) as (keyof typeof MOISTURE_SERIES)[]).map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`rounded px-2 py-1 text-xs ${range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{r}</button>
            ))}
          </div>}>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={moisture}>
                <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" {...axisProps} interval="preserveStartEnd" />
                <YAxis {...axisProps} width={28} domain={[20, 100]} />
                <Tooltip {...chartTooltip} />
                <Area dataKey="moisture" name="Moisture %" stroke="var(--chart-3)" fill="url(#mg)" strokeWidth={2} />
                <Line dataKey="target" name="Target" stroke="var(--chart-1)" strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel eyebrow="Distribution" title="Crop health">
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={2}>
                  {dist.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Panel eyebrow="Log" title="Recent activities" className="lg:col-span-2">
          <ul className="divide-y">
            {RECENT_ACTIVITIES.map((a) => (
              <li key={a.text} className="flex gap-3 py-2.5 text-sm">
                <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">{a.date}</span>
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.tone === "success" ? "bg-success" : a.tone === "warning" ? "bg-warning" : "bg-primary"}`} />
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel eyebrow="Alerts" title="Disease">
          <div className="space-y-2">
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
              <p className="flex items-center gap-1.5 font-medium text-destructive"><AlertTriangle className="h-4 w-4" /> Early blight risk</p>
              <p className="mt-1 text-xs text-muted-foreground">Tomato · Plot A · humid spell ahead</p>
            </div>
            <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
              <p className="font-medium">Rust watch</p>
              <p className="mt-1 text-xs text-muted-foreground">Wheat · Plot B · low risk</p>
            </div>
          </div>
          <Link to="/disease-detection" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">Open disease module →</Link>
        </Panel>
        <Panel eyebrow="Upcoming" title="Irrigation">
          <ul className="space-y-2 text-sm">
            {[["Tomorrow 06:00", "Plot B · Wheat · 18 kL"], ["Fri 06:30", "Plot A · Tomato · 9 kL"], ["Sun 05:45", "Plot D · Chickpea · 6 kL"]].map(([t, d]) => (
              <li key={t} className="flex gap-2"><CalendarClock className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="font-medium">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div></li>
            ))}
          </ul>
          <Link to="/irrigation" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">Plan irrigation →</Link>
        </Panel>
      </div>

      <Panel eyebrow="Azadpur · sample" title="Market summary" className="mt-4" action={<DemoBadge>Demo market data</DemoBadge>}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {prices.map((p) => (
            <div key={p.name} className="rounded-lg bg-lavender p-3">
              <p className="text-xs text-muted-foreground">{p.name}</p>
              <p className="mt-1 font-semibold">₹{p.price.toLocaleString("en-IN")}<span className="text-xs font-normal text-muted-foreground">/q</span></p>
              <p className={`mt-0.5 flex items-center text-xs ${p.changePct >= 0 ? "text-success" : "text-destructive"}`}>
                {p.changePct >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{Math.abs(p.changePct)}%
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
