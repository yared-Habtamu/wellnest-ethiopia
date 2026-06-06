import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { enqueue } from "@/lib/offline-queue";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/wellness/symptoms")({
  head: () => ({ meta: [{ title: "Symptoms — WellNest" }] }),
  component: SymptomsPage,
});

function SymptomsPage() {
  const { t } = useTranslation();
  const categories = [
    { group: t("symptoms.body"), items: [t("symptoms.tension"), t("symptoms.fatigue"), t("symptoms.headache"), t("symptoms.stomach"), t("symptoms.restless")] },
    { group: t("symptoms.feelings"), items: [t("symptoms.anxious"), t("symptoms.numb"), t("symptoms.tearful"), t("symptoms.hyper"), t("symptoms.disconnected")] },
    { group: t("symptoms.mind"), items: [t("symptoms.racing"), t("symptoms.fog"), t("symptoms.flashes"), t("symptoms.focus")] },
  ];
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const toggle = (v: string) => {
    const n = new Set(selected);
    n.has(v) ? n.delete(v) : n.add(v);
    setSelected(n);
  };

  const save = () => {
    enqueue("symptom", {
      items: Array.from(selected),
      intensity,
      note,
      at: Date.now(),
    });
    setSelected(new Set());
    setNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <PageHeader
        eyebrow={t("symptoms.eyebrow")}
        title={t("symptoms.title")}
        subtitle={t("symptoms.subtitle")}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title={t("symptoms.present")} className="lg:col-span-2">
          <div className="space-y-5">
            {categories.map((c) => (
              <div key={c.group}>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {c.group}
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.items.map((it) => {
                    const on = selected.has(it);
                    return (
                      <button
                        key={it}
                        onClick={() => toggle(it)}
                        className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                          on
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-background hover:bg-muted"
                        }`}
                      >
                        {it}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("symptoms.intensity")}>
          <div className="space-y-3">
            <input
              type="range"
              min={1}
              max={5}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-[oklch(var(--primary))]"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t("symptoms.whisper")}</span>
              <span>{t("symptoms.loud")}</span>
            </div>
            <div className="text-center font-display text-3xl font-semibold">{intensity}</div>
          </div>
        </SectionCard>

        <SectionCard title={t("symptoms.other")} className="lg:col-span-3">
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("symptoms.placeholder")}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {t("symptoms.privacy")}
            </p>
            <button
              onClick={save}
              disabled={selected.size === 0}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              {t("symptoms.save")}
            </button>
          </div>
          {saved && (
            <p className="mt-2 flex items-center justify-end gap-1 text-xs text-primary">
              <Check className="h-3.5 w-3.5" /> {t("symptoms.logged")}
            </p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
