import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Thermometer, Droplets, CloudRain, Wind, Sun, Cloud, CloudLightning, CloudSun, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PageIntro, Panel, Stat, DemoBadge, chartTooltip, axisProps } from "@/components/kit";
import { REGIONS, weatherFor, type WeatherDay } from "@/lib/data";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Weather Insights — AgriSmart AI" },
      { name: "description", content: "Sample seven-day weather for Indian agricultural regions with irrigation guidance." },
      { property: "og:title", content: "Weather Insights — AgriSmart AI" },
      { property: "og:description", content: "Demo weather dashboard with forecast, rainfall trend and alerts." },
    ],
  }),
  component: WeatherPage,
});

const ICON: Record<WeatherDay["condition"], typeof Sun> = { Sunny: Sun, Cloudy: Cloud, Rain: CloudRain, Storm: CloudLightning, "Partly cloudy": CloudSun };

function WeatherPage() {
  const [region, setRegion] = useState(REGIONS[1]!);
  const week = weatherFor(region);
  const today = week[0]!;
  const totalRain = week.reduce((s, d) => s + d.rain, 0);
  const alerts = [
    ...week.filter((d) => d.rain >= 25).map((d) => ({ tone: "danger", t: `${d.day}: heavy rain (${d.rain} mm) — postpone spraying & fertiliser` })),
    ...week.filter((d) => d.high >= 35).map((d) => ({ tone: "warning", t: `${d.day}: heat stress risk (${d.high}°C) — irrigate in evening` })),
    ...week.filter((d) => d.wind >= 22).map((d) => ({ tone: "warning", t: `${d.day}: strong winds (${d.wind} km/h) — avoid sprinkler use` })),
  ];
  const advice = totalRain > 40 ? "Significant rain expected — reduce irrigation and ensure field drainage." : totalRain > 10 ? "Moderate rain — skip irrigation on rainy days and the day after." : "Dry week — maintain regular irrigation, prefer early mornings.";

  return (
    <>
      <PageIntro eyebrow="Module 05" title="Weather insights" desc="Sample forecast for planning field operations."
        actions={<><select aria-label="Region" className="field h-9 w-56" value={region} onChange={(e) => setRegion(e.target.value)}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select><DemoBadge>Demo weather data</DemoBadge></>} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Temperature" value={`${today.high}°C`} sub={`Low ${today.low}°C`} icon={<Thermometer className="h-4 w-4" />} />
        <Stat label="Humidity" value={`${today.humidity}%`} icon={<Droplets className="h-4 w-4" />} />
        <Stat label="Rainfall" value={`${today.rain} mm`} sub={`${totalRain} mm this week`} icon={<CloudRain className="h-4 w-4" />} />
        <Stat label="Wind" value={`${today.wind} km/h`} icon={<Wind className="h-4 w-4" />} />
      </div>

      <Panel title="Seven-day sample forecast" className="mt-4">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {week.map((d) => { const I = ICON[d.condition]; return (
            <div key={d.day} className="rounded-lg bg-lavender p-3 text-center">
              <p className="eyebrow">{d.day}</p><I className="mx-auto my-2 h-6 w-6 text-primary" />
              <p className="text-sm font-semibold">{d.high}°<span className="font-normal text-muted-foreground"> / {d.low}°</span></p>
              <p className="text-xs text-muted-foreground">{d.rain} mm</p>
            </div>); })}
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Rainfall & humidity trend" className="lg:col-span-2">
          <div className="h-60">
            <ResponsiveContainer>
              <AreaChart data={week}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" {...axisProps} /><YAxis {...axisProps} width={30} />
                <Tooltip {...chartTooltip} />
                <Area dataKey="humidity" name="Humidity %" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.1} />
                <Area dataKey="rain" name="Rain (mm)" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel eyebrow="Irrigation" title="Recommendation"><p className="text-sm">{advice}</p></Panel>
          <Panel eyebrow="Alerts" title="Weather alerts">
            {alerts.length === 0 ? <p className="text-sm text-muted-foreground">No alerts for this sample week.</p> : (
              <ul className="space-y-2">{alerts.map((a) => (
                <li key={a.t} className={`flex gap-2 rounded-lg border p-2.5 text-xs ${a.tone === "danger" ? "border-destructive/30 bg-destructive/10" : "border-warning/40 bg-warning/10"}`}><AlertTriangle className="h-4 w-4 shrink-0" />{a.t}</li>))}</ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
