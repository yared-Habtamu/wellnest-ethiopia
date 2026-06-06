import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Upload, Sparkles } from "lucide-react";
import { PageHeader, SectionCard, SoftBadge } from "@/components/SectionCard";
import { enqueue } from "@/lib/offline-queue";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition — WellNest" }] }),
  component: NutritionPage,
});

const examples = [
  { name: "Injera with Doro Wat", kcal: 540, protein: 28, carbs: 64, fat: 18 },
  { name: "Shiro with Injera", kcal: 420, protein: 18, carbs: 58, fat: 12 },
  { name: "Kitfo (lean)", kcal: 380, protein: 32, carbs: 4, fat: 26 },
];

function NutritionPage() {
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState<typeof examples[number] | null>(null);
  const pick = () => {
    const guess = examples[Math.floor(Math.random() * examples.length)];
    setAnalysis(guess);
    enqueue("nutrition", { ...guess, at: Date.now() });
  };

  return (
    <>
      <PageHeader
        eyebrow={t("nutrition.eyebrow")}
        title={t("nutrition.title")}
        subtitle={t("nutrition.subtitle")}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title={t("nutrition.scan")}>
          <div className="grid place-items-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 px-6 py-12 text-center">
            <Camera className="h-10 w-10 text-primary" />
            <p className="mt-3 text-sm font-medium">{t("nutrition.tap")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("nutrition.or")}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={pick} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                <Camera className="h-3.5 w-3.5" /> {t("nutrition.useCamera")}
              </button>
              <button onClick={pick} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs">
                <Upload className="h-3.5 w-3.5" /> {t("nutrition.upload")}
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("nutrition.weSee")}>
          {analysis ? (
            <div>
              <div className="flex items-center justify-between">
                <div className="font-display text-lg font-semibold">{analysis.name}</div>
                <SoftBadge tone="bloom">~{analysis.kcal} kcal</SoftBadge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: t("nutrition.protein"), v: analysis.protein, suf: "g" },
                  { label: t("nutrition.carbs"), v: analysis.carbs, suf: "g" },
                  { label: t("nutrition.fat"), v: analysis.fat, suf: "g" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-secondary/60 p-3">
                    <div className="font-display text-xl font-semibold">{m.v}{m.suf}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary/50 p-3 text-sm">
                <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                <p>{t("nutrition.balance")}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("nutrition.empty")}</p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
