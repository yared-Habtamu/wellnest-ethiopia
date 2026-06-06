import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, SoftBadge } from "@/components/SectionCard";
import { Trophy, Flame, Sparkles, Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/gamification")({
  head: () => ({ meta: [{ title: "Growth — WellNest" }] }),
  component: GamificationPage,
});

function GamificationPage() {
  const { t } = useTranslation();
  const levels = [
    { lvl: 1, title: t("growth.lvl1"), xp: 0 },
    { lvl: 2, title: t("growth.lvl2"), xp: 100 },
    { lvl: 3, title: t("growth.lvl3"), xp: 300 },
    { lvl: 4, title: t("growth.lvl4"), xp: 700 },
    { lvl: 5, title: t("growth.lvl5"), xp: 1500 },
  ];
  const badges = [
    { name: t("growth.b1"), desc: t("growth.b1d"), got: true },
    { name: t("growth.b2"), desc: t("growth.b2d"), got: true },
    { name: t("growth.b3"), desc: t("growth.b3d"), got: true },
    { name: t("growth.b4"), desc: t("growth.b4d"), got: false },
    { name: t("growth.b5"), desc: t("growth.b5d"), got: false },
    { name: t("growth.b6"), desc: t("growth.b6d"), got: false },
  ];
  const xp = 820;
  const current = levels[3];
  const next = levels[4];
  const pct = ((xp - current.xp) / (next.xp - current.xp)) * 100;

  return (
    <>
      <PageHeader
        eyebrow={t("growth.eyebrow")}
        title={t("growth.title")}
        subtitle={t("growth.subtitle")}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title={t("growth.level")} className="lg:col-span-2">
          <div className="flex items-center gap-5">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-bloom">
              <Leaf className="h-9 w-9 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("growth.levelLabel", { n: current.lvl })}</div>
                  <div className="font-display text-2xl font-semibold">{current.title}</div>
                </div>
                <SoftBadge tone="warm">{xp} XP</SoftBadge>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t("growth.xpTo", { n: next.xp - xp, title: next.title })}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("growth.streak")} hint={t("growth.streakHint")}>
          <div className="flex items-center gap-3">
            <Flame className="h-7 w-7 text-bloom" />
            <div>
              <div className="font-display text-3xl font-semibold">5</div>
              <div className="text-xs text-muted-foreground">{t("growth.consecutive")}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("growth.badges")} className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((b) => (
              <div
                key={b.name}
                className={`flex items-start gap-3 rounded-2xl border p-4 ${
                  b.got ? "border-primary/40 bg-primary-soft/30" : "border-dashed border-border bg-card opacity-70"
                }`}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-card">
                  {b.got ? <Trophy className="h-5 w-5 text-primary" /> : <Sparkles className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div>
                  <div className="font-display text-sm font-semibold">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
