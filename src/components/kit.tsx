import type { ReactNode } from "react";
import { Info, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageIntro({ eyebrow, title, desc, actions }: { eyebrow: string; title: string; desc?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, eyebrow, children, className, action }: { title?: string; eyebrow?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={cn("rounded-xl border bg-card p-4 shadow-soft sm:p-5", className)}>
      {(title || eyebrow) && (
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="text-base font-semibold">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function DemoBadge({ children = "Demo data" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-foreground">
      <FlaskConical className="h-3 w-3" /> {children}
    </span>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" }) {
  return (
    <div className={cn("flex gap-2.5 rounded-lg border p-3 text-sm", tone === "warning" ? "border-warning/40 bg-warning/10" : "border-border bg-lavender")}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

export function Field({ label, id, error, children, hint }: { label: string; id: string; error?: string | undefined; hint?: string | undefined; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium">{label}</label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Stat({ label, value, sub, icon, tone = "default" }: { label: string; value: string; sub?: string; icon: ReactNode; tone?: "default" | "success" | "warning" | "danger" }) {
  const toneCls = { default: "bg-accent text-accent-foreground", success: "bg-success/15 text-success", warning: "bg-warning/20 text-warning-foreground", danger: "bg-destructive/15 text-destructive" }[tone];
  return (
    <div className="lift rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{label}</p>
        <span className={cn("rounded-lg p-2", toneCls)}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Empty({ icon, title, desc, action }: { icon: ReactNode; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-lavender/50 px-6 py-12 text-center">
      <div className="mb-3 rounded-full bg-card p-3 text-muted-foreground">{icon}</div>
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export const chartTooltip = {
  contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--popover-foreground)" },
  labelStyle: { color: "var(--muted-foreground)" },
};
export const axisProps = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false } as const;
