import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { enqueue } from "@/lib/offline-queue";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGuestGuard } from "@/lib/auth";

export const Route = createFileRoute("/_app/mood")({
  head: () => ({ meta: [{ title: "Mood — WellNest" }] }),
  component: MoodPage,
});

function MoodPage() {
  const { t } = useTranslation();
  const guardAction = useGuestGuard();
  const moods = [
    { emoji: "😞", label: t("mood.heavy"), value: 1 },
    { emoji: "😕", label: t("mood.low"), value: 2 },
    { emoji: "😐", label: t("mood.okay"), value: 3 },
    { emoji: "🙂", label: t("mood.light"), value: 4 },
    { emoji: "🌿", label: t("mood.bright"), value: 5 },
  ];
  const [score, setScore] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (guardAction()) return;
    if (score == null) return;
    enqueue("mood", { score, note, at: Date.now() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setNote("");
  };

  return (
    <>
      <PageHeader
        eyebrow={t("mood.eyebrow")}
        title={t("mood.title")}
        subtitle={t("mood.subtitle")}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title={t("mood.scale")}>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setScore(m.value)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-4 text-xs transition ${
                  score === m.value ? "border-primary bg-primary-soft/40" : "border-border bg-background hover:bg-muted"
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
          <label className="mt-5 block text-xs font-medium text-muted-foreground">
            {t("mood.optional")}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={t("mood.placeholder")}
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="mt-4 flex items-center justify-between">
            <button onClick={save} disabled={score == null} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40">
              {t("mood.saveBtn")}
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-primary">
                <Check className="h-3.5 w-3.5" /> {t("mood.saved")}
              </span>
            )}
          </div>
        </SectionCard>

        <SectionCard title={t("mood.recent")} hint={t("mood.recentHint")}>
          <div className="flex h-32 items-end gap-2">
            {[3, 2, 4, 3, 4, 5, score ?? 3].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-primary/70"
                style={{ height: `${(v / 5) * 100}%` }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("mood.recentNote")}
          </p>
        </SectionCard>
      </div>
    </>
  );
}
