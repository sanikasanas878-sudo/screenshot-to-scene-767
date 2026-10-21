import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { UploadCloud, X, ScanSearch, Loader2, ShieldCheck, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageIntro, Panel, Notice, Field, Empty, DemoBadge } from "@/components/kit";
import { DISEASE_CASES, type DiseaseCase } from "@/lib/data";
import { addHistory, useHistory } from "@/lib/storage";

export const Route = createFileRoute("/disease-detection")({
  head: () => ({
    meta: [
      { title: "Disease Detection (Demo) — AgriSmart AI" },
      { name: "description", content: "Upload a leaf image and explore a clearly labelled crop disease demonstration report." },
      { property: "og:title", content: "Disease Detection Demo — AgriSmart AI" },
      { property: "og:description", content: "Demonstration of a crop disease report workflow. No real image model is used." },
    ],
  }),
  component: DiseasePage,
});

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

function DiseasePage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [scenario, setScenario] = useState(DISEASE_CASES[0]!.id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseCase | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { list, remove } = useHistory();
  const history = list.filter((r) => r.category === "Disease demo");

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const accept = (f?: File) => {
    if (!f) return;
    if (!ACCEPT.includes(f.type)) { toast.error("Please upload a JPG, JPEG, PNG or WEBP image"); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error("Image must be under 10 MB"); return; }
    if (url) URL.revokeObjectURL(url);
    setFile(f); setUrl(URL.createObjectURL(f)); setResult(null);
  };

  const analyze = () => {
    if (!file) { toast.error("Upload an image first"); return; }
    setLoading(true); setResult(null);
    setTimeout(() => { setResult(DISEASE_CASES.find((c) => c.id === scenario)!); setLoading(false); }, 1400);
  };

  const save = () => {
    if (!result) return;
    addHistory({ category: "Disease demo", title: `${result.crop} · ${result.label} (demo)`, summary: `${result.severity} severity · ${Math.round(result.confidence * 100)}% demo confidence`, details: { Crop: result.crop, Label: result.label, Severity: result.severity, Image: file?.name ?? "—", Mode: "Demonstration" } });
    toast.success("Saved to Farming History");
  };

  return (
    <>
      <PageIntro eyebrow="Module 02" title="Disease detection" desc="Upload a leaf photo and preview how a diagnosis report would look." actions={<DemoBadge>Demonstration mode</DemoBadge>} />
      <div className="mb-4"><Notice tone="warning">Your image is <strong>not analysed by a trained model</strong>. The result comes from the demo scenario you select. Real diagnosis requires integration with a validated computer-vision model and expert confirmation.</Notice></div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Leaf image">
          {!url ? (
            <div role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); accept(e.dataTransfer.files[0]); }}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors focus-visible:outline-2 focus-visible:outline-ring ${drag ? "border-success bg-success/5" : "bg-lavender/60 hover:border-ring"}`}>
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground">JPG, JPEG, PNG, WEBP · max 10 MB</p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl border">
              <img src={url} alt="Uploaded leaf preview" className="max-h-80 w-full object-contain bg-muted" />
              <div className="flex items-center justify-between gap-2 border-t bg-card p-2 text-xs">
                <span className="truncate">{file?.name}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>Replace</Button>
                  <Button size="sm" variant="ghost" aria-label="Remove image" onClick={() => { setFile(null); setUrl(null); setResult(null); }}><X className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          )}
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ""; }} />
          <div className="mt-4">
            <Field id="scenario" label="Demo scenario" hint="Choose which example case the demo should display.">
              <select id="scenario" className="field" value={scenario} onChange={(e) => setScenario(e.target.value)}>
                {DISEASE_CASES.map((c) => <option key={c.id} value={c.id}>{c.crop} — {c.label}</option>)}
              </select>
            </Field>
          </div>
          <Button className="mt-4 w-full" onClick={analyze} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />} {loading ? "Running demo…" : "Analyze image (demo)"}
          </Button>
        </Panel>

        <Panel title="Demonstration report" action={result && <Button size="sm" variant="outline" onClick={save}><Save className="h-4 w-4" /> Save</Button>}>
          {loading ? (
            <div className="space-y-3">{[80, 60, 90, 70].map((w) => <div key={w} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />)}</div>
          ) : !result ? (
            <Empty icon={<ShieldCheck className="h-5 w-5" />} title="No report yet" desc="Upload an image, choose a scenario and run the demo." />
          ) : (
            <div className="space-y-4 text-sm">
              <div className={`rounded-lg border p-3 ${result.severity === "Low" ? "border-success/40 bg-success/10" : result.severity === "High" ? "border-destructive/40 bg-destructive/10" : "border-warning/40 bg-warning/10"}`}>
                <p className="eyebrow">Example crop · {result.crop}</p>
                <p className="mt-1 text-base font-semibold">{result.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">Simulated label · demo confidence {Math.round(result.confidence * 100)}% · severity {result.severity}</p>
              </div>
              {([["Possible visible symptoms", result.symptoms], ["General preventive measures", result.prevention], ["Suggested next steps", result.nextSteps]] as const).map(([t, items]) => (
                <div key={t}><p className="eyebrow">{t}</p><ul className="mt-1 list-disc space-y-1 pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul></div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel eyebrow="Library" title="Example disease cases">
          <div className="grid gap-2 sm:grid-cols-2">
            {DISEASE_CASES.map((c) => (
              <button key={c.id} onClick={() => { setScenario(c.id); toast.info(`Scenario set: ${c.label}`); }} className={`rounded-lg border p-3 text-left text-sm transition-colors hover:border-ring ${scenario === c.id ? "border-ring bg-accent" : "bg-lavender/50"}`}>
                <p className="font-medium">{c.crop}</p><p className="text-xs text-muted-foreground">{c.label}</p>
              </button>
            ))}
          </div>
        </Panel>
        <Panel eyebrow="Saved" title="Disease history">
          {history.length === 0 ? <p className="text-sm text-muted-foreground">No saved demo reports yet.</p> : (
            <ul className="divide-y">{history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <div><p className="font-medium">{h.title}</p><p className="text-xs text-muted-foreground">{new Date(h.createdAt).toLocaleDateString("en-IN")}</p></div>
                <Button size="icon" variant="ghost" aria-label="Delete record" onClick={() => { remove(h.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4" /></Button>
              </li>))}</ul>
          )}
        </Panel>
      </div>
    </>
  );
}
