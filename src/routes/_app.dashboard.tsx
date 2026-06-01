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

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Today — WellNest" }] }),
  component: Dashboard,
});

function Dashboard() {
  const dws = 72; // mocked Daily Wellness Score

  const signals = useMemo(
    () => [
      { label: "Mood", value: 80 },
      { label: "Sleep", value: 64 },
      { label: "Nutrition", value: 70 },
      { label: "Movement", value: 55 },
      { label: "Hydration", value: 88 },
      { label: "Journaling", value: 60 },
      { label: "Screen", value: 75 },
    ],
    [],
  );

  const missions = [
    { title: "1-minute breathing", xp: 10, to: "/wellness/grounding", Icon: Wind },
    { title: "Quick mood check-in", xp: 15, to: "/mood", Icon: Smile },
    { title: "Note 3 grateful things", xp: 20, to: "/journal", Icon: BookHeart },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Soft start. You're already doing enough."
        subtitle="A quiet snapshot of how you're showing up. Nothing here is a grade."
        action={<SoftBadge tone="bloom">Level 4 · Mindful Root</SoftBadge>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Daily Wellness Score" hint="Composite of 7 gentle signals" className="lg:col-span-2">
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

        <SectionCard title="Today's missions" hint="Earn XP — only if you feel like it">
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

        <SectionCard title="Jump back in" className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: "/mood", Icon: Smile, title: "Log mood", body: "5-point gentle scale" },
              { to: "/journal", Icon: BookHeart, title: "Voice or text journal", body: "Private, on-device" },
              { to: "/nutrition", Icon: Apple, title: "Scan a meal", body: "Ethiopian cuisine aware" },
              { to: "/wellness", Icon: Flower2, title: "Women's Wellness", body: "Cycle, healing, AI guide" },
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

        <SectionCard title="Wellness Coach" hint="A gentle suggestion, never a prescription" className="lg:col-span-2">
          <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div className="text-sm">
              Your sleep dipped a little this week. Tonight, would you like a 4-minute wind-down breathing exercise around 10pm?
              <div className="mt-3 flex gap-2">
                <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  Yes, gently remind me
                </button>
                <button className="rounded-full border border-border bg-card px-3 py-1.5 text-xs">Not tonight</button>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            WellNest is not a medical service. We don't diagnose — we suggest.
          </p>
        </SectionCard>

        <SectionCard title="Streak" hint="Gentle, not punishing">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <div className="font-display text-2xl font-semibold">5 days</div>
              <div className="text-xs text-muted-foreground">A pause won't break it. Promise.</div>
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
