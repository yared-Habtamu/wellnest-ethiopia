import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { Send, Wind, Phone } from "lucide-react";

export const Route = createFileRoute("/_app/wellness/guide")({
  head: () => ({ meta: [{ title: "AI Mental Guide — WellNest" }] }),
  component: GuidePage,
});

type Msg = { role: "ai" | "you"; text: string };

const starter: Msg[] = [
  {
    role: "ai",
    text: "Hi. I'm here, gently. There's no right way to start. Whatever is true for you right now is welcome.",
  },
];

const gentleResponses = [
  "Thank you for sharing that with me. Take all the time you need.",
  "That sounds really heavy. Would you like to slow down and breathe together for a moment?",
  "I hear you. You're not alone in this. Would a grounding exercise help right now?",
];

function GuidePage() {
  const [msgs, setMsgs] = useState<Msg[]>(starter);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const you: Msg = { role: "you", text: input.trim() };
    const ai: Msg = {
      role: "ai",
      text: gentleResponses[Math.floor(Math.random() * gentleResponses.length)],
    };
    setMsgs((m) => [...m, you, ai]);
    setInput("");
  };

  return (
    <>
      <PageHeader
        eyebrow="AI Mental Guide"
        title="A companion, not a clinician."
        subtitle="This guide listens gently. It does not diagnose. In an emergency, please reach a real person."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2">
          <div className="flex h-[480px] flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "ai"
                      ? "bg-secondary text-secondary-foreground"
                      : "ml-auto bg-primary text-primary-foreground"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Whatever you can say…"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={send}
                className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Need to ground?" hint="One tap, anytime">
            <Link
              to="/wellness/grounding"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-bloom px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Wind className="h-4 w-4" /> Open grounding
            </Link>
          </SectionCard>
          <SectionCard title="If it's urgent" hint="Real-people resources">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-xl bg-secondary/60 p-3">
                <span>Ethiopia GBV Hotline</span>
                <a href="tel:909" className="flex items-center gap-1 text-primary"><Phone className="h-3.5 w-3.5" /> 909</a>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-secondary/60 p-3">
                <span>Addis Women's Affairs</span>
                <a href="tel:9352" className="flex items-center gap-1 text-primary"><Phone className="h-3.5 w-3.5" /> 9352</a>
              </li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
