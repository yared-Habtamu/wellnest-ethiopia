import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Type, Save } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { enqueue } from "@/lib/offline-queue";

export const Route = createFileRoute("/_app/journal")({
  head: () => ({ meta: [{ title: "Journal — WellNest" }] }),
  component: JournalPage,
});

function JournalPage() {
  const [mode, setMode] = useState<"voice" | "text">("text");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) {
      timer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
      setElapsed(0);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [recording]);

  const save = () => {
    enqueue("journal", { mode, text, durationSec: elapsed, at: Date.now() });
    setText("");
  };

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Say it however you can."
        subtitle="Voice or text. Stored privately on your device until you choose to sync."
      />

      <div className="mb-4 inline-flex rounded-full border border-border bg-card p-1">
        {(["text", "voice"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium capitalize ${
              mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {m === "text" ? <Type className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />} {m}
          </button>
        ))}
      </div>

      <SectionCard>
        {mode === "text" ? (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Today, I noticed…"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-base leading-relaxed outline-none focus:border-primary"
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{text.length} characters · auto-private</span>
              <button
                onClick={save}
                disabled={!text.trim()}
                className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                <Save className="h-4 w-4" /> Save entry
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-8">
            <button
              onClick={() => setRecording((r) => !r)}
              className={`grid h-24 w-24 place-items-center rounded-full text-primary-foreground shadow-lg transition ${
                recording ? "animate-pulse bg-destructive" : "bg-gradient-bloom"
              }`}
              aria-label={recording ? "Stop recording" : "Start recording"}
            >
              {recording ? <Square className="h-8 w-8" /> : <Mic className="h-9 w-9" />}
            </button>
            <div className="mt-4 font-display text-2xl tabular-nums">
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Recordings stay on this device. Raw audio purges after 90 days.
            </p>
            {!recording && elapsed === 0 && (
              <p className="mt-6 max-w-sm text-center text-sm text-muted-foreground">
                Tap to speak. There's no minimum, no maximum. You can stop whenever.
              </p>
            )}
            {!recording && elapsed > 0 && (
              <button
                onClick={save}
                className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Save recording
              </button>
            )}
          </div>
        )}
      </SectionCard>
    </>
  );
}
