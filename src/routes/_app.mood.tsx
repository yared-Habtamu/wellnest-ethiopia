import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { enqueue } from "@/lib/offline-queue";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_app/mood")({
  head: () => ({ meta: [{ title: "Mood — WellNest" }] }),
  component: MoodPage,
});

const moods = [
  { emoji: "😞", label: "Heavy", value: 1 },
  { emoji: "😕", label: "Low", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Light", value: 4 },
  { emoji: "🌿", label: "Bright", value: 5 },
];

function MoodPage() {
  const [score, setScore] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (score == null) return;
    enqueue("mood", { score, note, at: Date.now() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setNote("");
  };

  return (
    <>
      <PageHeader
        eyebrow="Mood"
        title="How is your weather inside?"
        subtitle="No right answer. You can also skip and come back later."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="A gentle 5-point scale">
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
            A word, if you have one (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Soft thoughts welcome…"
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="mt-4 flex items-center justify-between">
            <button onClick={save} disabled={score == null} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40">
              Save quietly
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-primary">
                <Check className="h-3.5 w-3.5" /> Saved on this device
              </span>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Recent rhythm" hint="Last 7 check-ins">
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
            Lines are reflections, not judgments. A dip is information, not failure.
          </p>
        </SectionCard>
      </div>
    </>
  );
}
