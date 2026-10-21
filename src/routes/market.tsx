import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PageIntro, Panel, DemoBadge, Notice, Empty, chartTooltip, axisProps } from "@/components/kit";
import { COMMODITIES, MARKETS, priceAt, priceHistory } from "@/lib/data";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market Prices — AgriSmart AI" },
      { name: "description", content: "Illustrative Indian commodity prices in INR per quintal with market comparisons." },
      { property: "og:title", content: "Market Prices — AgriSmart AI" },
      { property: "og:description", content: "Demo mandi prices, trends and harvest timing." },
    ],
  }),
  component: MarketPage,
});

const CATS = ["All", ...Array.from(new Set(COMMODITIES.map((c) => c.category)))];
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function MarketPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [market, setMarket] = useState(0);
  const [selected, setSelected] = useState(COMMODITIES[0]!.name);

  const rows = useMemo(() => COMMODITIES.filter((c) => (cat === "All" || c.category === cat) && c.name.toLowerCase().includes(q.toLowerCase())).map((c) => ({ c, ...priceAt(c, market) })), [q, cat, market]);
  const sel = COMMODITIES.find((c) => c.name === selected)!;
  const history = priceHistory(sel, market);
  const byMarket = MARKETS.map((m, i) => ({ market: m.split(" (")[0], price: priceAt(sel, i).price }));

  return (
    <>
      <PageIntro eyebrow="Module 06" title="Market prices" desc="Sample commodity prices per quintal across selected mandis." actions={<DemoBadge>Demo market data</DemoBadge>} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input aria-label="Search crops" placeholder="Search crops…" className="field pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select aria-label="Commodity category" className="field sm:w-44" value={cat} onChange={(e) => setCat(e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        <select aria-label="Market" className="field sm:w-56" value={market} onChange={(e) => setMarket(+e.target.value)}>{MARKETS.map((m, i) => <option key={m} value={i}>{m}</option>)}</select>
      </div>

      <Panel title={`Prices · ${MARKETS[market]}`}>
        {rows.length === 0 ? <Empty icon={<Search className="h-5 w-5" />} title="No crops found" desc="Try a different search or category." /> : (
          <div className="-mx-4 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[560px] text-sm">
              <thead><tr className="border-b text-left"><th className="eyebrow py-2 pl-4 sm:pl-0">Commodity</th><th className="eyebrow">Category</th><th className="eyebrow text-right">Price/q</th><th className="eyebrow text-right">Previous</th><th className="eyebrow text-right">Change</th><th className="eyebrow pl-4">Harvest</th></tr></thead>
              <tbody>{rows.map(({ c, price, previous, changePct }) => (
                <tr key={c.name} onClick={() => setSelected(c.name)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(c.name)} className={`cursor-pointer border-b last:border-0 hover:bg-muted/60 ${selected === c.name ? "bg-accent" : ""}`}>
                  <td className="py-2.5 pl-4 font-medium sm:pl-0">{c.name}</td><td className="text-muted-foreground">{c.category}</td>
                  <td className="text-right font-mono">{inr(price)}</td><td className="text-right font-mono text-muted-foreground">{inr(previous)}</td>
                  <td className={`text-right font-mono ${changePct >= 0 ? "text-success" : "text-destructive"}`}><span className="inline-flex items-center">{changePct >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{Math.abs(changePct)}%</span></td>
                  <td className="pl-4 text-muted-foreground">{c.harvest}</td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel eyebrow="Sample history" title={`${sel.name} · last 6 months`}>
          <div className="h-56"><ResponsiveContainer><LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="month" {...axisProps} /><YAxis {...axisProps} width={48} domain={["auto", "auto"]} />
            <Tooltip {...chartTooltip} formatter={(v: number) => inr(v)} /><Line dataKey="price" name="₹/quintal" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart></ResponsiveContainer></div>
        </Panel>
        <Panel eyebrow="Comparison" title={`${sel.name} across markets`}>
          <div className="h-56"><ResponsiveContainer><BarChart data={byMarket}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="market" {...axisProps} interval={0} fontSize={10} /><YAxis {...axisProps} width={48} domain={["auto", "auto"]} />
            <Tooltip {...chartTooltip} formatter={(v: number) => inr(v)} /><Bar dataKey="price" name="₹/quintal" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart></ResponsiveContainer></div>
          <p className="mt-2 text-xs text-muted-foreground">Typical harvest window: <strong>{sel.harvest}</strong></p>
        </Panel>
      </div>
      <div className="mt-4"><Notice>Values are fictional/illustrative samples and are not verified live mandi prices.</Notice></div>
    </>
  );
}
