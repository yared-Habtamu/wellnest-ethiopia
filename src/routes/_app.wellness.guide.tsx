import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { generateChatResponse } from "@/lib/api/chat.functions";
import { Send, Wind, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGuestGuard } from "@/lib/auth";

export const Route = createFileRoute("/_app/wellness/guide")({
  head: () => ({ meta: [{ title: "AI Mental Guide — WellNest" }] }),
  component: GuidePage,
});

type Msg = { role: "ai" | "you"; text: string };

function GuidePage() {
  const { t } = useTranslation();
  const guardAction = useGuestGuard();
  const gentleResponses = [t("guide.r1"), t("guide.r2"), t("guide.r3")];
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: t("guide.starter") }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const send = () => {
    if (guardAction()) return;
    if (!input.trim()) return;
  const send = async () => {
    if (!input.trim() || isLoading) return;
    const you: Msg = { role: "you", text: input.trim() };
    setMsgs((m) => [...m, you]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateChatResponse({
        data: {
          history: msgs,
          message: you.text
        }
      });
      const ai: Msg = { role: "ai", text: response.text };
      setMsgs((m) => [...m, ai]);
    } catch (e) {
      console.error(e);
      const ai: Msg = { role: "ai", text: "I'm having trouble connecting right now. Please try again later." };
      setMsgs((m) => [...m, ai]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={t("guide.eyebrow")}
        title={t("guide.title")}
        subtitle={t("guide.subtitle")}
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
                placeholder={t("guide.placeholder")}
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
          <SectionCard title={t("guide.ground")} hint={t("guide.groundHint")}>
            <Link
              to="/wellness/grounding"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-bloom px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Wind className="h-4 w-4" /> {t("guide.openGround")}
            </Link>
          </SectionCard>
          <SectionCard title={t("guide.urgent")} hint={t("guide.urgentHint")}>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-xl bg-secondary/60 p-3">
                <span>{t("guide.gbv")}</span>
                <a href="tel:909" className="flex items-center gap-1 text-primary"><Phone className="h-3.5 w-3.5" /> 909</a>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-secondary/60 p-3">
                <span>{t("guide.awa")}</span>
                <a href="tel:9352" className="flex items-center gap-1 text-primary"><Phone className="h-3.5 w-3.5" /> 9352</a>
              </li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
