import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Flower2, ShieldCheck, WifiOff, HeartHandshake } from "lucide-react";
import { useSafety } from "@/lib/safety";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WellNest Ethiopia — Gentle Wellness, Always With You" },
      { name: "description", content: "Trauma-informed mental wellness, nutrition, and women's health support for Ethiopian youth. Private, offline-first, gentle." },
      { property: "og:title", content: "WellNest Ethiopia" },
      { property: "og:description", content: "Gentle, private wellness companion. Built for you, with you." },
    ],
  }),
  component: Index,
});

function Index() {
  const { panicExit } = useSafety();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute right-4 top-4 z-10">
        <button
          onClick={panicExit}
          className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground shadow-sm"
        >
          {t("common.quickExit")}
        </button>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex items-center gap-2 text-primary">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-bloom">
            <Flower2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold">{t("common.appName")} {t("common.region")}</span>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-primary">
              {t("index.eyebrow")}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              {t("index.title")}
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              {t("index.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/onboarding" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
                {t("index.begin")}
              </Link>
              <Link to="/dashboard" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted">
                {t("index.skip")}
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              {t("index.note")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { Icon: HeartHandshake, title: t("index.f1Title"), body: t("index.f1Body") },
              { Icon: ShieldCheck, title: t("index.f2Title"), body: t("index.f2Body") },
              { Icon: WifiOff, title: t("index.f3Title"), body: t("index.f3Body") },
              { Icon: Flower2, title: t("index.f4Title"), body: t("index.f4Body") },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border/70 bg-card p-5">
                <Icon className="h-5 w-5 text-primary" />
                <div className="mt-3 font-display text-sm font-semibold">{title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
