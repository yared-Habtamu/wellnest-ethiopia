import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, SkipForward, ShieldAlert, Check } from "lucide-react";
import { useSafety } from "@/lib/safety";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — WellNest" },
      { name: "description", content: "A gentle, fully skippable onboarding for WellNest." },
    ],
  }),
  component: Onboarding,
});

type Step = {
  eyebrow: string;
  title: string;
  body: string;
  options: { label: string; value: string }[];
  multi?: boolean;
  storageKey: string;
};

const STORAGE_KEYS = ["goals", "rhythm", "wwt", "privacy", "ack"] as const;
const VALUE_KEYS: string[][] = [
  ["calm", "sleep", "nutrition", "mood", "cycle", "healing"],
  ["1", "few", "self"],
  ["on", "off", "later"],
  ["local", "camo", "exit"],
  ["ok"],
];
const MULTI = [true, false, false, true, false];

function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { panicExit } = useSafety();
  const [i, setI] = useState(0);
  const rawSteps = t("onboarding.steps", { returnObjects: true }) as Array<{
    eyebrow: string; title: string; body: string; options: string[];
  }>;
  const steps: Step[] = rawSteps.map((s, idx) => ({
    eyebrow: s.eyebrow,
    title: s.title,
    body: s.body,
    storageKey: STORAGE_KEYS[idx],
    multi: MULTI[idx],
    options: s.options.map((label, j) => ({ label, value: VALUE_KEYS[idx][j] ?? String(j) })),
  }));
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const step = steps[i];
  const selected = answers[step.storageKey] || [];

  const finish = () => {
    try {
      window.localStorage.setItem("wellnest.onboarding", JSON.stringify(answers));
    } catch {
      /* ignore */
    }
    navigate({ to: "/dashboard" });
  };

  const next = () => {
    if (i + 1 >= steps.length) finish();
    else setI(i + 1);
  };

  const toggle = (v: string) => {
    setAnswers((prev) => {
      const cur = new Set(prev[step.storageKey] || []);
      if (step.multi) {
        cur.has(v) ? cur.delete(v) : cur.add(v);
      } else {
        cur.clear();
        cur.add(v);
      }
      return { ...prev, [step.storageKey]: Array.from(cur) };
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-5">
        <button
          onClick={() => (i === 0 ? navigate({ to: "/" }) : setI(i - 1))}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("common.back")}
        </button>
        <button
          onClick={panicExit}
          className="flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"
        >
          <ShieldAlert className="h-3.5 w-3.5" /> {t("common.quickExit")}
        </button>
      </header>

      <div className="mx-auto max-w-xl px-6 pb-16">
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((i + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-primary">
          {step.eyebrow}
        </div>
        <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {step.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>

        <div className="mt-6 grid gap-2.5">
          {step.options?.map((opt) => {
            const on = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm transition ${
                  on
                    ? "border-primary bg-primary-soft/40"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <span>{opt.label}</span>
                {on && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={next}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="h-3.5 w-3.5" /> {t("common.skip")}
          </button>
          <button
            onClick={next}
            className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {i + 1 >= steps.length ? t("onboarding.enter") : t("common.continue")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("onboarding.footer")}
        </p>
      </div>
    </div>
  );
}
