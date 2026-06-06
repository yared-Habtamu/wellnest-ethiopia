import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/wellness/grounding")({
  head: () => ({ meta: [{ title: "Grounding — WellNest" }] }),
  component: GroundingPage,
});

function GroundingPage() {
  const { t } = useTranslation();
  const phases = [t("grounding.in"), t("grounding.hold"), t("grounding.out"), t("grounding.rest")];
  const senses = [
    { n: 5, label: t("grounding.s5") },
    { n: 4, label: t("grounding.s4") },
    { n: 3, label: t("grounding.s3") },
    { n: 2, label: t("grounding.s2") },
    { n: 1, label: t("grounding.s1") },
  ];
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % phases.length), 4000);
    return () => clearInterval(id);
  }, [phases.length]);

  return (
    <>
      <PageHeader
        eyebrow={t("grounding.eyebrow")}
        title={t("grounding.title")}
        subtitle={t("grounding.subtitle")}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title={t("grounding.box")}>
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

        <SectionCard title={t("grounding.sensory")}>
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
            {t("grounding.note")}
          </p>
        </SectionCard>
      </div>
    </>
  );
}
