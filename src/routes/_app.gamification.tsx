import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, SoftBadge } from "@/components/SectionCard";
import { Trophy, Flame, Sparkles, Leaf } from "lucide-react";

export const Route = createFileRoute("/_app/gamification")({
  head: () => ({ meta: [{ title: "Growth — WellNest" }] }),
  component: GamificationPage,
});

const levels = [
  { lvl: 1, title: "Seedling", xp: 0 },
  { lvl: 2, title: "Sprout", xp: 100 },
  { lvl: 3, title: "Bloom", xp: 300 },
  { lvl: 4, title: "Mindful Root", xp: 700 },
  { lvl: 5, title: "Steady Tree", xp: 1500 },
];

const badges = [
  { name: "First Bloom", desc: "Completed your first mood check-in", got: true },
  { name: "Gentle Streak", desc: "5-day quiet streak", got: true },
  { name: "Voice Found", desc: "Recorded your first journal", got: true },
  { name: "Sister", desc: "Shared anonymously in Sisterhood", got: false },
  { name: "Grounded", desc: "Used grounding 10 times", got: false },
  { name: "Nourished", desc: "Logged 7 meals this week", got: false },
];

function GamificationPage() {
  const xp = 820;
  const current = levels[3];
  const next = levels[4];
  const pct = ((xp - current.xp) / (next.xp - current.xp)) * 100;

  return (
    <>
      <PageHeader
        eyebrow="Growth"
        title="Small things compound, gently."
        subtitle="Streaks pause, never break. Badges from Women's Wellness stay private."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Level" className="lg:col-span-2">
          <div className="flex items-center gap-5">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-bloom">
              <Leaf className="h-9 w-9 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Level {current.lvl}</div>
                  <div className="font-display text-2xl font-semibold">{current.title}</div>
                </div>
                <SoftBadge tone="warm">{xp} XP</SoftBadge>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {next.xp - xp} XP to {next.title}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Streak" hint="Pauses are welcome">
          <div className="flex items-center gap-3">
            <Flame className="h-7 w-7 text-bloom" />
            <div>
              <div className="font-display text-3xl font-semibold">5</div>
              <div className="text-xs text-muted-foreground">consecutive days</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Badges" className="lg:col-span-3">
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
