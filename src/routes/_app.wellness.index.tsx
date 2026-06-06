import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarHeart, NotebookPen, MessageCircleHeart, Wind, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/wellness/")({
  head: () => ({ meta: [{ title: "Women's Wellness — WellNest" }] }),
  component: WellnessHub,
});

function WellnessHub() {
  const { t } = useTranslation();
  const tiles = [
    { to: "/wellness/cycle", Icon: CalendarHeart, title: t("wellness.t1"), body: t("wellness.t1b") },
    { to: "/wellness/symptoms", Icon: NotebookPen, title: t("wellness.t2"), body: t("wellness.t2b") },
    { to: "/wellness/guide", Icon: MessageCircleHeart, title: t("wellness.t3"), body: t("wellness.t3b") },
    { to: "/wellness/grounding", Icon: Wind, title: t("wellness.t4"), body: t("wellness.t4b") },
    { to: "/wellness/sisterhood", Icon: Users, title: t("wellness.t5"), body: t("wellness.t5b") },
  ];
  return (
    <>
      <PageHeader
        eyebrow={t("wellness.eyebrow")}
        title={t("wellness.title")}
        subtitle={t("wellness.subtitle")}
      />

      <SectionCard className="mb-6 bg-secondary/40">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div className="text-sm">
            <div className="font-display font-semibold">{t("wellness.privTitle")}</div>
            <p className="mt-1 text-muted-foreground">
              {t("wellness.privBody")}
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
