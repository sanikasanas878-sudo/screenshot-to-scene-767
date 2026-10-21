import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Trash2, Eye, History as HistoryIcon, Database } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageIntro, Panel, Empty } from "@/components/kit";
import { useHistory, type HistoryRecord, type HistoryCategory } from "@/lib/storage";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Farming History — AgriSmart AI" },
      { name: "description", content: "Your saved recommendations, demo reports, irrigation plans and yield estimates." },
      { property: "og:title", content: "Farming History — AgriSmart AI" },
      { property: "og:description", content: "Browse and manage records stored locally in your browser." },
    ],
  }),
  component: HistoryPage,
});

const CATS: ("All" | HistoryCategory)[] = ["All", "Crop recommendation", "Disease demo", "Irrigation plan", "Yield estimate"];
const TONE: Record<HistoryCategory, string> = { "Crop recommendation": "bg-success/15 text-success", "Disease demo": "bg-destructive/15 text-destructive", "Irrigation plan": "bg-chart-3/20 text-foreground", "Yield estimate": "bg-warning/20 text-foreground" };

function HistoryPage() {
  const { list, ready, remove, clear, loadSample } = useHistory();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [view, setView] = useState<HistoryRecord | null>(null);
  const [confirm, setConfirm] = useState(false);

  const rows = useMemo(() => list
    .filter((r) => (cat === "All" || r.category === cat) && (r.title + r.summary).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === "new" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt))), [list, q, cat, sort]);

  return (
    <>
      <PageIntro eyebrow="Records" title="Farming history" desc="Everything you save is stored only in this browser."
        actions={<>
          <Button variant="outline" size="sm" onClick={() => { loadSample(); toast.success("Sample records loaded"); }}><Database className="h-4 w-4" /> Load sample data</Button>
          <Button variant="destructive" size="sm" disabled={list.length === 0} onClick={() => setConfirm(true)}><Trash2 className="h-4 w-4" /> Clear history</Button>
        </>} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input aria-label="Search records" placeholder="Search records…" className="field pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select aria-label="Category" className="field sm:w-52" value={cat} onChange={(e) => setCat(e.target.value as typeof cat)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        <select aria-label="Sort" className="field sm:w-40" value={sort} onChange={(e) => setSort(e.target.value as "new" | "old")}><option value="new">Newest first</option><option value="old">Oldest first</option></select>
      </div>
      <Panel>
        {!ready ? <div className="h-24 animate-pulse rounded bg-muted" /> : rows.length === 0 ? (
          <Empty icon={<HistoryIcon className="h-5 w-5" />} title="No records" desc={list.length ? "No records match your filters." : "Save results from any module, or load sample data."} />
        ) : (
          <ul className="divide-y">{rows.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-3">
              <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium sm:inline ${TONE[r.category]}`}>{r.category}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{r.title}</p><p className="truncate text-xs text-muted-foreground">{r.summary} · {new Date(r.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div>
              <Button size="icon" variant="ghost" aria-label="View details" onClick={() => setView(r)}><Eye className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete record" onClick={() => { remove(r.id); toast.success("Record deleted"); }}><Trash2 className="h-4 w-4" /></Button>
            </li>))}</ul>
        )}
      </Panel>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{view?.title}</DialogTitle><DialogDescription>{view?.category} · {view && new Date(view.createdAt).toLocaleString("en-IN")}</DialogDescription></DialogHeader>
          <dl className="divide-y rounded-lg border text-sm">{view && Object.entries(view.details).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-3 py-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>))}</dl>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Clear all history?</AlertDialogTitle><AlertDialogDescription>This permanently deletes {list.length} record(s) from this browser.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { clear(); toast.success("History cleared"); }}>Clear</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
