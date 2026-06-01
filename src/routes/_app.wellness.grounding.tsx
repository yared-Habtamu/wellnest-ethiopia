import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";

export const Route = createFileRoute("/_app/wellness/grounding")({
  head: () => ({ meta: [{ title: "Grounding — WellNest" }] }),
  component: GroundingPage,
});

const phases = ["Breathe in…", "Hold…", "Breathe out…", "Rest…"];
const senses = [
  { n: 5, label: "things you can see" },
  { n: 4, label: "things you can touch" },
  { n: 3, label: "things you can hear" },
  { n: 2, label: "things you can smell" },
  { n: 1, label: "thing you can taste" },
];

function GroundingPage() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % phases.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="One-tap grounding"
        title="Right here. Right now."
        subtitle="Move with the breath, or just watch. Both are enough."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Box breathing">
          <div className="grid place-items-center py-8">
            <div
              className="relative grid h-56 w-56 place-items-center rounded-full bg-gradient-bloom transition-transform duration-[4000ms] ease-in-out"
              style={{ transform: phase === 0 ? "scale(1.15)" : phase === 2 ? "scale(0.85)" : "scale(1)" }}
            >
              <div className="grid h-40 w-40 place-items-center rounded-full bg-card">
                <div className="text-center">
                  <div className="font-display text-xl font-semibold">{phases[phase]}</div>
                  <div className="mt-1 text-xs text-muted-foreground">4 · 4 · 4 · 4</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="5-4-3-2-1 sensory">
          <ol className="space-y-3">
            {senses.map((s) => (
              <li
                key={s.n}
                className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"
              >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-display font-semibold">
                  {s.n}
                </div>
                <span className="text-sm">{s.label}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted-foreground">
            Move only as fast as feels safe. There's no finish line.
          </p>
        </SectionCard>
      </div>
    </>
  );
}
