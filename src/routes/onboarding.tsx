import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, SkipForward, ShieldAlert, Check } from "lucide-react";
import { useSafety } from "@/lib/safety";

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
  options?: { label: string; value: string }[];
  multi?: boolean;
  storageKey: string;
};

const steps: Step[] = [
  {
    eyebrow: "Step 1 of 5",
    title: "What feels most supportive right now?",
    body: "Pick anything that resonates. You can change this anytime, or skip.",
    multi: true,
    storageKey: "goals",
    options: [
      { label: "Calmer days", value: "calm" },
      { label: "Better sleep", value: "sleep" },
      { label: "Gentler eating", value: "nutrition" },
      { label: "Mood awareness", value: "mood" },
      { label: "Cycle understanding", value: "cycle" },
      { label: "Healing space", value: "healing" },
    ],
  },
  {
    eyebrow: "Step 2 of 5",
    title: "How would you like check-ins?",
    body: "We'll never demand a response. You set the rhythm.",
    storageKey: "rhythm",
    options: [
      { label: "Once a day", value: "1" },
      { label: "A few times a week", value: "few" },
      { label: "Only when I open the app", value: "self" },
    ],
  },
  {
    eyebrow: "Step 3 of 5",
    title: "Would you like the Women's Wellness module?",
    body: "Cycle tracking, gentle symptom logging, and a private healing space. Fully optional.",
    storageKey: "wwt",
    options: [
      { label: "Yes, enable it", value: "on" },
      { label: "Not right now", value: "off" },
      { label: "Ask me later", value: "later" },
    ],
  },
  {
    eyebrow: "Step 4 of 5",
    title: "Privacy preferences",
    body: "Your sensitive data is yours. These can be changed anytime.",
    multi: true,
    storageKey: "privacy",
    options: [
      { label: "Save sensitive logs only on this device", value: "local" },
      { label: "Disguise the app icon (camouflage)", value: "camo" },
      { label: "Enable one-tap Quick Exit", value: "exit" },
    ],
  },
  {
    eyebrow: "Step 5 of 5",
    title: "A small reminder",
    body: "WellNest is a gentle companion, not a medical service. We'll always offer professional resources when it matters.",
    storageKey: "ack",
    options: [{ label: "I understand", value: "ok" }],
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const { panicExit } = useSafety();
  const [i, setI] = useState(0);
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
          ← Back
        </button>
        <button
          onClick={panicExit}
          className="flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"
        >
          <ShieldAlert className="h-3.5 w-3.5" /> Quick Exit
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
            <SkipForward className="h-3.5 w-3.5" /> Skip this
          </button>
          <button
            onClick={next}
            className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {i + 1 >= steps.length ? "Enter WellNest" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Every step is optional. We don't track silence as a problem.
        </p>
      </div>
    </div>
  );
}
