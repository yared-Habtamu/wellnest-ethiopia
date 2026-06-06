import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard, SoftBadge } from "@/components/SectionCard";
import { enqueue } from "@/lib/offline-queue";
import { Droplet, Moon, Sun, Flower2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/wellness/cycle")({
  head: () => ({ meta: [{ title: "Cycle — WellNest" }] }),
  component: CyclePage,
});

function CyclePage() {
  const { t } = useTranslation();
  const phases = [
    { key: "menstrual", label: t("cycle.menstrual"), Icon: Droplet, color: "bg-bloom/40" },
    { key: "follicular", label: t("cycle.follicular"), Icon: Sun, color: "bg-warm/40" },
    { key: "ovulation", label: t("cycle.ovulation"), Icon: Flower2, color: "bg-primary-soft/50" },
    { key: "luteal", label: t("cycle.luteal"), Icon: Moon, color: "bg-accent/40" },
  ];
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
        eyebrow={t("cycle.eyebrow")}
        title={t("cycle.title")}
        subtitle={t("cycle.subtitle")}
        action={<SoftBadge tone="bloom">{t("cycle.dayBadge", { n: cycleDay })}</SoftBadge>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title={t("cycle.thisCycle")} className="lg:col-span-2">
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

        <SectionCard title={t("cycle.logToday")} hint={today.toDateString()}>
          <div className="space-y-2">
            {[
              { k: "Light", l: t("cycle.flowLight") },
              { k: "Medium", l: t("cycle.flowMedium") },
              { k: "Heavy", l: t("cycle.flowHeavy") },
              { k: "Spotting", l: t("cycle.flowSpotting") },
              { k: "None", l: t("cycle.flowNone") },
            ].map((v) => (
              <button
                key={v.k}
                onClick={() => logFlow(v.k)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm hover:bg-muted"
              >
                {v.l}
              </button>
            ))}
          </div>
          {logged && <p className="mt-3 text-xs text-primary">{t("cycle.saved")}</p>}
        </SectionCard>

        <SectionCard title={t("cycle.outlook")} className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <Outlook title={t("cycle.nextPeriod")} value={t("cycle.nextPeriodVal")} />
            <Outlook title={t("cycle.fertile")} value={t("cycle.fertileVal")} />
            <Outlook title={t("cycle.pmdd")} value={t("cycle.pmddVal")} tone="muted" />
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
