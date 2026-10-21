import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sprout, ScanSearch, Droplets, CloudSun, BarChart3, ChevronRight } from "lucide-react";
import { Panel } from "@/components/kit";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — AgriSmart AI" },
      { name: "description", content: "Academic documentation: problem statement, objectives, research gap, stack and evaluation framework." },
      { property: "og:title", content: "About AgriSmart AI" },
      { property: "og:description", content: "Project documentation for an AI-assisted smart agriculture advisory platform." },
    ],
  }),
  component: About,
});

const CHALLENGES = [
  ["Crop selection uncertainty", "Farmers often choose crops by habit rather than soil and climate suitability."],
  ["Disease identification delays", "Late recognition of symptoms leads to avoidable losses."],
  ["Inefficient irrigation", "Flood irrigation and fixed schedules waste scarce water."],
  ["Weather uncertainty", "Erratic monsoons complicate sowing and spraying decisions."],
  ["Unpredictable yields", "Little visibility into expected output hampers planning and credit."],
  ["Limited digital advisory", "Existing tools are fragmented, technical or not locally accessible."],
];
const OBJECTIVES = [
  [Sprout, "Crop Recommendation Engine", "Rank suitable crops from soil nutrients, pH and climate."],
  [ScanSearch, "Disease Detection Demonstration", "Illustrate an image-based diagnosis workflow and report."],
  [Droplets, "Irrigation Optimization Planner", "Estimate water needs and generate watering schedules."],
  [CloudSun, "Weather-Informed Decision Support", "Translate forecasts into field-level guidance."],
  [BarChart3, "Yield Estimation Module", "Provide scenario-based production estimates."],
] as const;
const WORKFLOW = ["Requirements", "Data Collection", "Preprocessing", "Model Design", "Frontend Implementation", "Testing", "Evaluation"];

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return <section className="py-8 first:pt-0"><p className="eyebrow">{label}</p><h2 className="mt-1 mb-4 text-xl font-semibold tracking-tight">{title}</h2>{children}</section>;
}

function About() {
  return (
    <div className="mx-auto max-w-5xl divide-y">
      <Section label="01 · Abstract" title="AgriSmart AI — an intelligent farming assistant">
        <div className="grid gap-4 md:grid-cols-3">
          <p className="text-sm leading-relaxed text-muted-foreground md:col-span-2">AgriSmart AI explores how a single, farmer-friendly interface can bring together crop suitability guidance, disease awareness, irrigation planning, weather-informed decisions and yield estimation. This prototype runs entirely in the browser using local sample datasets and transparent rule-based logic, and is structured so that validated machine-learning models and live data services can be integrated later.</p>
          <div className="rounded-xl bg-panel p-5 text-panel-foreground"><p className="eyebrow opacity-70">Scope</p><p className="mt-2 text-sm">5 modules · frontend-only · local demo data · no backend</p></div>
        </div>
      </Section>

      <Section label="02 · Context" title="Challenges facing Indian agriculture">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{CHALLENGES.map(([t, d], i) => (
          <div key={t} className="lift rounded-xl border bg-lavender p-4"><p className="font-mono text-xs text-muted-foreground">0{i + 1}</p><p className="mt-1 font-medium">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>))}</div>
      </Section>

      <Section label="03 · Problem" title="Problem statement">
        <Panel><p className="text-sm leading-relaxed">Agricultural advisory today is spread across disconnected sources — soil labs, extension officers, weather bulletins and market boards. Each provides partial information in different formats, which makes timely, combined decisions difficult. There is a need for a unified, accessible interface that consolidates these inputs into clear, actionable guidance while being transparent about its limitations.</p></Panel>
      </Section>

      <Section label="04 · Objectives" title="Project objectives">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{OBJECTIVES.map(([I, t, d], i) => (
          <div key={t} className="rounded-xl border bg-card p-4"><I className="h-5 w-5 text-success" /><p className="mt-3 text-xs font-mono text-muted-foreground">Objective {i + 1}</p><p className="font-medium leading-snug">{t}</p><p className="mt-1 text-xs text-muted-foreground">{d}</p></div>))}</div>
      </Section>

      <Section label="05 · Literature" title="Literature review & research gap">
        <div className="grid gap-3 md:grid-cols-2">
          {[["Crop recommendation", "Commonly framed as classification over soil (N, P, K, pH) and climate features using decision trees, random forests and similar models."],
            ["Disease classification", "Convolutional neural networks trained on labelled leaf images are widely studied for identifying visible plant diseases."],
            ["Yield prediction", "Regression and time-series approaches relate weather, soil and management inputs to historical yields."],
            ["Smart irrigation", "Evapotranspiration-based scheduling and soil-moisture sensing are used to match water supply to crop demand."]].map(([t, d]) => (
            <div key={t} className="rounded-xl border bg-card p-4"><p className="font-medium">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>))}
        </div>
        <div className="mt-3 rounded-xl border-l-4 border-success bg-success/5 p-4 text-sm"><strong>Gap addressed:</strong> these approaches are usually studied and deployed in isolation. AgriSmart AI proposes integrating them into one consistent, accessible interface.</div>
      </Section>

      <Section label="06 · Stack" title="Technology stack & architecture">
        <div className="grid gap-3 md:grid-cols-3">
          {[["Frontend", ["React", "TypeScript", "Tailwind CSS", "Recharts", "Lucide icons"]], ["Client-side storage", ["Browser LocalStorage"]], ["Architecture", ["Responsive interface", "Client-side validation", "Browser-based calculations", "Local demo datasets", "No backend or database"]]].map(([t, items]) => (
            <div key={t as string} className="rounded-xl border bg-card p-4"><p className="eyebrow">{t as string}</p><ul className="mt-2 space-y-1 text-sm">{(items as string[]).map((x) => <li key={x} className="flex items-center gap-1.5"><ChevronRight className="h-3 w-3 text-muted-foreground" />{x}</li>)}</ul></div>))}
        </div>
      </Section>

      <Section label="07 · Method" title="Development workflow">
        <div className="flex flex-col items-stretch gap-2 rounded-xl bg-panel p-5 text-panel-foreground md:flex-row md:items-center md:flex-wrap">
          {WORKFLOW.map((s, i) => (
            <div key={s} className="flex items-center gap-2 md:contents">
              <div className="flex-1 rounded-lg border border-panel-foreground/15 px-3 py-2 text-center text-sm md:flex-none"><span className="mr-1.5 font-mono text-xs opacity-60">{i + 1}</span>{s}</div>
              {i < WORKFLOW.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 rotate-90 opacity-50 md:rotate-0" />}
            </div>))}
        </div>
      </Section>

      <Section label="08 · I/O" title="System inputs & outputs">
        <div className="grid gap-3 md:grid-cols-2">
          {[["Inputs", ["Soil parameters", "Weather sample data", "Crop information", "Disease image uploads", "Market price sample data"]], ["Outputs", ["Ranked crop recommendations", "Demonstration disease reports", "Irrigation schedules", "Yield estimates", "Illustrative market insights"]]].map(([t, items]) => (
            <div key={t as string} className="rounded-xl border bg-lavender p-4"><p className="font-medium">{t as string}</p><ul className="mt-2 grid gap-1 text-sm">{(items as string[]).map((x) => <li key={x}>• {x}</li>)}</ul></div>))}
        </div>
      </Section>

      <Section label="09 · Evaluation" title="Evaluation framework (future ML)">
        <p className="mb-3 text-sm text-muted-foreground">No model metrics are reported for this prototype. A future implementation with trained models could be evaluated as follows:</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[["Accuracy", "Share of correct crop / disease classifications."], ["Precision", "How many predicted positives are truly positive."], ["Recall", "How many actual cases the model catches."], ["F1-score", "Balance of precision and recall for imbalanced classes."], ["MAE", "Average absolute error of yield estimates."], ["RMSE", "Penalises large yield-prediction errors."]].map(([t, d]) => (
            <div key={t} className="rounded-xl border bg-card p-4"><p className="font-mono text-sm font-medium">{t}</p><p className="mt-1 text-xs text-muted-foreground">{d}</p></div>))}
        </div>
      </Section>

      <Section label="10 · Impact" title="Benefits & future scope">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-4"><p className="eyebrow">Benefits</p><ul className="mt-2 space-y-1 text-sm">{["Data-informed farming", "Improved accessibility", "Water conservation awareness", "Early disease awareness"].map((x) => <li key={x}>• {x}</li>)}</ul></div>
          <div className="rounded-xl border bg-card p-4"><p className="eyebrow">Future scope</p><ul className="mt-2 space-y-1 text-sm">{["Regional language support", "Mobile application", "IoT sensor integration", "Live weather and market APIs", "Validated ML model integration"].map((x) => <li key={x}>• {x}</li>)}</ul></div>
        </div>
      </Section>
    </div>
  );
}
