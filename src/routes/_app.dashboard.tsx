import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Activity,
  Apple,
  BookHeart,
  Flower2,
  Smile,
  Sparkles,
  Wind,
  ArrowRight,
} from "lucide-react";
import { PageHeader, SectionCard, SoftBadge } from "@/components/SectionCard";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Today — WellNest" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useTranslation();
  const dws = 72; // mocked Daily Wellness Score

  const signals = useMemo(
    () => [
      { label: t("dashboard.sigMood"), value: 80 },
      { label: t("dashboard.sigSleep"), value: 64 },
      { label: t("dashboard.sigNutrition"), value: 70 },
      { label: t("dashboard.sigMovement"), value: 55 },
      { label: t("dashboard.sigHydration"), value: 88 },
      { label: t("dashboard.sigJournaling"), value: 60 },
      { label: t("dashboard.sigScreen"), value: 75 },
    ],
    [t],
  );

  const missions = [
    { title: t("dashboard.m1"), xp: 10, to: "/wellness/grounding", Icon: Wind },
    { title: t("dashboard.m2"), xp: 15, to: "/mood", Icon: Smile },
    { title: t("dashboard.m3"), xp: 20, to: "/journal", Icon: BookHeart },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t("dashboard.eyebrow")}
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        action={<SoftBadge tone="bloom">{t("dashboard.levelBadge")}</SoftBadge>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title={t("dashboard.dws")} hint={t("dashboard.dwsHint")} className="lg:col-span-2">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-bloom">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-card">
                <div>
                  <div className="text-center font-display text-3xl font-semibold">{dws}</div>
                  <div className="text-center text-[10px] uppercase tracking-wider text-muted-foreground">DWS</div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {signals.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-muted-foreground">{s.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary/70" style={{ width: `${s.value}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("dashboard.missions")} hint={t("dashboard.missionsHint")}>
          <ul className="space-y-2">
            {missions.map(({ title, xp, to, Icon }) => (
              <li key={title}>
                <Link
                  to={to}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-background px-3 py-3 transition hover:bg-muted"
                >
                  <span className="flex items-center gap-3 text-sm">
                    <Icon className="h-4 w-4 text-primary" /> {title}
                  </span>
                  <SoftBadge>+{xp} XP</SoftBadge>
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title={t("dashboard.jumpBack")} className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: "/mood", Icon: Smile, title: t("dashboard.qLogMood"), body: t("dashboard.qLogMoodBody") },
              { to: "/journal", Icon: BookHeart, title: t("dashboard.qJournal"), body: t("dashboard.qJournalBody") },
              { to: "/nutrition", Icon: Apple, title: t("dashboard.qScan"), body: t("dashboard.qScanBody") },
              { to: "/wellness", Icon: Flower2, title: t("dashboard.qWellness"), body: t("dashboard.qWellnessBody") },
            ].map(({ to, Icon, title, body }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-2xl border border-border/70 bg-background p-4 transition hover:border-primary/40 hover:bg-muted"
              >
                <Icon className="h-5 w-5 text-primary" />
                <div className="mt-3 flex items-center justify-between font-display text-sm font-semibold">
                  {title}
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{body}</p>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("dashboard.coach")} hint={t("dashboard.coachHint")} className="lg:col-span-2">
          <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div className="text-sm">
              {t("dashboard.coachMsg")}
              <div className="mt-3 flex gap-2">
                <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  {t("dashboard.coachYes")}
                </button>
                <button className="rounded-full border border-border bg-card px-3 py-1.5 text-xs">{t("dashboard.coachNo")}</button>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("dashboard.coachNote")}
          </p>
        </SectionCard>

        <SectionCard title={t("dashboard.streak")} hint={t("dashboard.streakHint")}>
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <div className="font-display text-2xl font-semibold">{t("dashboard.streakDays")}</div>
              <div className="text-xs text-muted-foreground">{t("dashboard.streakBody")}</div>
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
