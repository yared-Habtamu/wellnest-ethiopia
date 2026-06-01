import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard, SoftBadge } from "@/components/SectionCard";
import { enqueue } from "@/lib/offline-queue";
import { Droplet, Moon, Sun, Flower2 } from "lucide-react";

export const Route = createFileRoute("/_app/wellness/cycle")({
  head: () => ({ meta: [{ title: "Cycle — WellNest" }] }),
  component: CyclePage,
});

const phases = [
  { key: "menstrual", label: "Menstrual", Icon: Droplet, color: "bg-bloom/40" },
  { key: "follicular", label: "Follicular", Icon: Sun, color: "bg-warm/40" },
  { key: "ovulation", label: "Ovulation", Icon: Flower2, color: "bg-primary-soft/50" },
  { key: "luteal", label: "Luteal", Icon: Moon, color: "bg-accent/40" },
];

function CyclePage() {
  const today = new Date();
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const cycleDay = 12;
  const [logged, setLogged] = useState(false);

  const logFlow = (intensity: string) => {
    enqueue("cycle", { intensity, at: Date.now() });
    setLogged(true);
    setTimeout(() => setLogged(false), 2000);
  };

  return (
    <>
      <PageHeader
        eyebrow="Cycle"
        title="Where you are in your rhythm."
        subtitle="Predictions are gentle estimates, not certainty."
        action={<SoftBadge tone="bloom">Day {cycleDay} · Follicular</SoftBadge>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="This cycle" className="lg:col-span-2">
          <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-14">
            {days.map((d) => {
              const isToday = d === cycleDay;
              const phase =
                d <= 5 ? phases[0] : d <= 13 ? phases[1] : d <= 16 ? phases[2] : phases[3];
              return (
                <div
                  key={d}
                  className={`relative flex aspect-square items-center justify-center rounded-lg text-xs ${phase.color} ${
                    isToday ? "ring-2 ring-primary" : ""
                  }`}
                  title={phase.label}
                >
                  {d}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {phases.map((p) => (
              <span key={p.key} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} /> {p.label}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Log today" hint={today.toDateString()}>
          <div className="space-y-2">
            {["Light", "Medium", "Heavy", "Spotting", "None"].map((v) => (
              <button
                key={v}
                onClick={() => logFlow(v)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm hover:bg-muted"
              >
                {v}
              </button>
            ))}
          </div>
          {logged && <p className="mt-3 text-xs text-primary">Saved on this device.</p>}
        </SectionCard>

        <SectionCard title="Gentle outlook" className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <Outlook title="Next period (est.)" value="in 16 days" />
            <Outlook title="Fertile window" value="day 11 – 17" />
            <Outlook title="PMDD watch" value="No patterns yet" tone="muted" />
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function Outlook({ title, value, tone }: { title: string; value: string; tone?: "muted" }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className={`mt-1 font-display text-xl font-semibold ${tone === "muted" ? "text-muted-foreground" : ""}`}>
        {value}
      </div>
    </div>
  );
}
