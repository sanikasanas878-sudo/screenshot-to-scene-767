import { useEffect, useState, useCallback } from "react";

export type HistoryCategory = "Crop recommendation" | "Disease demo" | "Irrigation plan" | "Yield estimate";
export type HistoryRecord = { id: string; category: HistoryCategory; title: string; summary: string; createdAt: string; details: Record<string, string | number> };

const KEY = "agrismart.history.v1";
const EVT = "agrismart:history";

export function sampleHistory(): HistoryRecord[] {
  return [
    { id: "s1", category: "Crop recommendation", title: "Top pick: Wheat (94%)", summary: "Punjab · Rabi · Sprinkler", createdAt: "2026-10-12T09:30:00Z", details: { N: 100, P: 48, K: 40, pH: 7, "Top crop": "Wheat", Score: "94%" } },
    { id: "s2", category: "Yield estimate", title: "Rice · 4.2 t/ha", summary: "2.0 ha · total 8.4 t", createdAt: "2026-10-08T14:10:00Z", details: { Crop: "Rice", Area: "2 ha", "Per hectare": "4.2 t", Total: "8.4 t" } },
    { id: "s3", category: "Disease demo", title: "Tomato · Early Blight (demo)", summary: "Moderate severity · 87% demo confidence", createdAt: "2026-10-05T07:45:00Z", details: { Crop: "Tomato", Label: "Early Blight", Mode: "Demonstration" } },
    { id: "s4", category: "Irrigation plan", title: "Maize · every 2 days", summary: "1.5 ha drip · 5.1 mm/day", createdAt: "2026-10-02T06:00:00Z", details: { Crop: "Maize", Method: "Drip", Interval: "2 days" } },
  ];
}

function read(): HistoryRecord[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (raw === null) { localStorage.setItem(KEY, JSON.stringify(sampleHistory())); return sampleHistory(); }
  try { return JSON.parse(raw); } catch { return []; }
}
function write(list: HistoryRecord[]) { localStorage.setItem(KEY, JSON.stringify(list)); window.dispatchEvent(new Event(EVT)); }

export function addHistory(r: Omit<HistoryRecord, "id" | "createdAt">) {
  write([{ ...r, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...read()]);
}

export function useHistory() {
  const [list, setList] = useState<HistoryRecord[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setList(read());
    sync(); setReady(true);
    window.addEventListener(EVT, sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const remove = useCallback((id: string) => write(read().filter((r) => r.id !== id)), []);
  const clear = useCallback(() => write([]), []);
  const loadSample = useCallback(() => write(sampleHistory()), []);
  return { list, ready, remove, clear, loadSample };
}

export function resetDemo() {
  Object.keys(localStorage).filter((k) => k.startsWith("agrismart.")).forEach((k) => localStorage.removeItem(k));
  read();
  window.dispatchEvent(new Event(EVT));
}
