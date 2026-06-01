import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarHeart, NotebookPen, MessageCircleHeart, Wind, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/SectionCard";

export const Route = createFileRoute("/_app/wellness/")({
  head: () => ({ meta: [{ title: "Women's Wellness — WellNest" }] }),
  component: WellnessHub,
});

const tiles = [
  { to: "/wellness/cycle", Icon: CalendarHeart, title: "Cycle tracker", body: "Phases, predictions, gentle reminders" },
  { to: "/wellness/symptoms", Icon: NotebookPen, title: "Symptom log", body: "Trauma-informed, body-first prompts" },
  { to: "/wellness/guide", Icon: MessageCircleHeart, title: "AI Mental Guide", body: "Trauma-informed companion chat" },
  { to: "/wellness/grounding", Icon: Wind, title: "One-tap grounding", body: "Breathing & 5-4-3-2-1 sensory" },
  { to: "/wellness/sisterhood", Icon: Users, title: "Anonymous Sisterhood", body: "Story sharing, fully anonymous" },
];

function WellnessHub() {
  return (
    <>
      <PageHeader
        eyebrow="Women's Wellness & Trauma Support"
        title="Your healing space."
        subtitle="Everything here is private. Everything is optional. You are always in control."
      />

      <SectionCard className="mb-6 bg-secondary/40">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div className="text-sm">
            <div className="font-display font-semibold">Zero-knowledge privacy</div>
            <p className="mt-1 text-muted-foreground">
              Women's wellness data is never used to train AI and never appears on public profiles. You can purge everything at any time from Settings.
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(({ to, Icon, title, body }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border/70 bg-card p-5 transition hover:border-primary/40 hover:bg-muted"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-bloom">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="mt-4 flex items-center justify-between font-display text-base font-semibold">
              {title}
              <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
