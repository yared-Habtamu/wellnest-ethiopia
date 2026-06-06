import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard, SoftBadge } from "@/components/SectionCard";
import { Heart, Flag, EyeOff, Send } from "lucide-react";
import { enqueue } from "@/lib/offline-queue";
import { useTranslation } from "react-i18next";
import { useGuestGuard } from "@/lib/auth";

export const Route = createFileRoute("/_app/wellness/sisterhood")({
  head: () => ({ meta: [{ title: "Anonymous Sisterhood — WellNest" }] }),
  component: SisterhoodPage,
});

type Post = { id: string; pen: string; tag: string; body: string; hearts: number };

const seed: Post[] = [
  {
    id: "p1",
    pen: "Soft Sparrow",
    tag: "Healing",
    body: "Today I let myself rest without explaining why. It felt strange. Then it felt kind.",
    hearts: 42,
  },
  {
    id: "p2",
    pen: "Quiet Iris",
    tag: "Courage",
    body: "I called the hotline. It took me three months. I am proud of myself for finally listening.",
    hearts: 128,
  },
  {
    id: "p3",
    pen: "Anonymous",
    tag: "Grief",
    body: "Some days the body remembers before the mind does. Today my shoulders are tired.",
    hearts: 64,
  },
];

function SisterhoodPage() {
  const { t } = useTranslation();
  const guardAction = useGuestGuard();
  const [posts, setPosts] = useState<Post[]>(seed);
  const [tag, setTag] = useState("Healing");
  const [text, setText] = useState("");

  const share = () => {
    if (guardAction()) return;
    if (!text.trim()) return;
    const p: Post = {
      id: `p${Date.now()}`,
      pen: "Anonymous",
      tag,
      body: text.trim(),
      hearts: 0,
    };
    setPosts([p, ...posts]);
    enqueue("sisterhood", p);
    setText("");
  };

  const heart = (id: string) =>
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, hearts: p.hearts + 1 } : p)));

  return (
    <>
      <PageHeader
        eyebrow={t("sisterhood.eyebrow")}
        title={t("sisterhood.title")}
        subtitle={t("sisterhood.subtitle")}
      />

      <SectionCard className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <EyeOff className="h-3.5 w-3.5" /> {t("sisterhood.postingAs")} <SoftBadge>{t("sisterhood.anonymous")}</SoftBadge>
        </div>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("sisterhood.placeholder")}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {[
              { k: "Healing", l: t("sisterhood.healing") },
              { k: "Courage", l: t("sisterhood.courage") },
              { k: "Grief", l: t("sisterhood.grief") },
              { k: "Joy", l: t("sisterhood.joy") },
              { k: "Cycle", l: t("sisterhood.cycleTag") },
            ].map((tt) => (
              <button
                key={tt.k}
                onClick={() => setTag(tt.k)}
                className={`rounded-full px-3 py-1 text-xs ${
                  tag === tt.k ? "bg-primary text-primary-foreground" : "border border-border bg-card"
                }`}
              >
                {tt.l}
              </button>
            ))}
          </div>
          <button
            onClick={share}
            disabled={!text.trim()}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" /> {t("sisterhood.share")}
          </button>
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <article key={p.id} className="rounded-2xl border border-border/70 bg-card p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-display text-sm font-semibold text-foreground">{p.pen}</span>
              <SoftBadge tone="bloom">{p.tag}</SoftBadge>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{p.body}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <button onClick={() => heart(p.id)} className="flex items-center gap-1.5 hover:text-bloom">
                <Heart className="h-4 w-4" /> {p.hearts}
              </button>
              <button className="flex items-center gap-1 hover:text-foreground">
                <Flag className="h-3.5 w-3.5" /> {t("sisterhood.report")}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
