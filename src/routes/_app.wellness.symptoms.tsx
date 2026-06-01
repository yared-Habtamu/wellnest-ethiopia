import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { enqueue } from "@/lib/offline-queue";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_app/wellness/symptoms")({
  head: () => ({ meta: [{ title: "Symptoms — WellNest" }] }),
  component: SymptomsPage,
});

const categories = [
  { group: "Body", items: ["Tension", "Fatigue", "Headache", "Stomach", "Restless sleep"] },
  { group: "Feelings", items: ["Anxious", "Numb", "Tearful", "Hyper-alert", "Disconnected"] },
  { group: "Mind", items: ["Racing thoughts", "Memory fog", "Flashes", "Difficulty focusing"] },
];

function SymptomsPage() {
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
        eyebrow="Trauma symptom log"
        title="Whatever you noticed — that's enough."
        subtitle="You don't have to explain anything. Tap what fits. Skip what doesn't."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="What's present" className="lg:col-span-2">
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

        <SectionCard title="Intensity">
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
              <span>Whisper</span>
              <span>Loud</span>
            </div>
            <div className="text-center font-display text-3xl font-semibold">{intensity}</div>
          </div>
        </SectionCard>

        <SectionCard title="Anything else (optional)" className="lg:col-span-3">
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A word, a sentence, or nothing at all…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Stays on this device. Never used to train AI. Purge anytime.
            </p>
            <button
              onClick={save}
              disabled={selected.size === 0}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              Save gently
            </button>
          </div>
          {saved && (
            <p className="mt-2 flex items-center justify-end gap-1 text-xs text-primary">
              <Check className="h-3.5 w-3.5" /> Logged
            </p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
