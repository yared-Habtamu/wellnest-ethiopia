import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Flower2, ShieldCheck, WifiOff, HeartHandshake, Brain, Apple,
  Smile, BookHeart, Trophy, Users, Sparkles, ArrowRight, Heart,
  Lock, Globe, ChevronRight, Star, CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { setLanguage, getLanguage } from "@/lib/i18n";
import { useState } from "react";

export const Route = createFileRoute("/")(  {
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

/* ─── tiny reusable pieces ─── */

function LangToggle() {
  const [lang, setLang] = useState(getLanguage());
  const toggle = (l: "en" | "am") => { setLanguage(l); setLang(l); };
  return (
    <div className="inline-flex rounded-full border border-white/20 p-0.5 backdrop-blur-sm bg-white/10">
      {(["en", "am"] as const).map((l) => (
        <button
          key={l}
          onClick={() => toggle(l)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
            lang === l
              ? "bg-white text-primary shadow-sm"
              : "text-white/80 hover:text-white"
          }`}
        >
          {l === "en" ? "EN" : "አማ"}
        </button>
      ))}
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-bold text-white md:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-white/70">{label}</div>
    </div>
  );
}

/* ─── main page ─── */

function Index() {
  const { t } = useTranslation();

  const services = [
    { Icon: Smile, title: "Mood Tracking", body: "5-point gentle mood scale with trend visualization. No judgments — just reflections.", color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-600" },
    { Icon: BookHeart, title: "Private Journal", body: "Text or voice entries stored on-device. Raw audio purges after 90 days for your safety.", color: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-600" },
    { Icon: Apple, title: "Nutrition Scanner", body: "AI-powered Ethiopian cuisine recognition. Injera, Doro Wat, Kitfo — we know your food.", color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-600" },
    { Icon: Heart, title: "Women's Wellness", body: "Cycle tracking, symptom logging, and trauma-informed healing — all under zero-knowledge privacy.", color: "from-rose-500/20 to-pink-500/20", iconColor: "text-rose-600" },
    { Icon: Brain, title: "AI Mental Guide", body: "A gentle companion, not a clinician. Trauma-informed responses with grounding exercises built in.", color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-600" },
    { Icon: Trophy, title: "Gamified Growth", body: "Earn XP and badges for self-care. Streaks pause — they never break. Progress without pressure.", color: "from-yellow-500/20 to-lime-500/20", iconColor: "text-yellow-600" },
  ];

  const pillars = [
    { Icon: HeartHandshake, title: t("index.f1Title"), body: t("index.f1Body") },
    { Icon: ShieldCheck, title: t("index.f2Title"), body: t("index.f2Body") },
    { Icon: WifiOff, title: t("index.f3Title"), body: t("index.f3Body") },
    { Icon: Flower2, title: t("index.f4Title"), body: t("index.f4Body") },
  ];

  const userNeeds = [
    { icon: "🧠", title: "Struggling with anxiety?", body: "Our gentle mood tracker and AI guide help you process emotions at your own pace." },
    { icon: "🍽️", title: "Want healthier eating habits?", body: "Snap your meals and get instant nutritional insights tailored to Ethiopian cuisine." },
    { icon: "🌸", title: "Need a private space for women's health?", body: "Track your cycle, log symptoms, and access healing resources — all hidden from prying eyes." },
    { icon: "📝", title: "Looking for a safe place to journal?", body: "Write or speak your thoughts. Everything stays on your device until you choose otherwise." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ══════ NAV ══════ */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-[#1a4731] via-[#1a5c3a] to-[#1a4731] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
              <Flower2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-semibold text-white">
              {t("common.appName")} <span className="text-white/70">{t("common.region")}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LangToggle />
            <Link
              to="/login"
              className="hidden rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:inline-block"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#1a4731] shadow-sm transition hover:bg-white/90"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="relative bg-gradient-to-br from-[#1a4731] via-[#1a5c3a] to-[#0f3023] pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-teal-300/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-2xl" />

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> Built for Ethiopian Youth — Hackathon 2026
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-7xl">
            Wellness that meets you <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">where you are.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            {t("index.body")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#1a4731] shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:shadow-black/25 hover:-translate-y-0.5"
            >
              {t("index.begin")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              {t("index.skip")}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ STATS BAR ══════ */}
      <section className="bg-[#143b28]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          <StatCard value="10K+" label="Active Users" />
          <StatCard value="98%" label="Data Privacy" />
          <StatCard value="2" label="Languages" />
          <StatCard value="100%" label="Offline Ready" />
        </div>
      </section>

      {/* ══════ TRUST PILLARS ══════ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Why WellNest?</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Built on trust, designed with care
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ Icon, title, body }) => (
            <div key={title} className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-bloom">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="mt-4 font-display text-base font-semibold">{title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ SERVICES ══════ */}
      <section className="bg-secondary/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Our Services</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need, nothing you don't
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Six integrated modules designed to support your complete wellbeing — mental, physical, and emotional.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ Icon, title, body, color, iconColor }) => (
              <div key={title} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`grid h-12 w-12 place-items-center rounded-xl bg-secondary/80 ${iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ USER NEEDS ══════ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Made For You</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Whatever you're facing, we're here
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {userNeeds.map(({ icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/80 text-2xl">
                {icon}
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ PRIVACY HIGHLIGHT ══════ */}
      <section className="bg-gradient-to-br from-[#1a4731] to-[#0f3023] py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Lock className="mx-auto h-10 w-10 text-emerald-300" />
          <h2 className="mt-6 font-display text-3xl font-bold md:text-4xl">Your privacy is non-negotiable</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Women's wellness data is never used to train AI. Sensitive logs stay on your device.
            Camouflage mode disguises the app as a neutral utility. One-tap exit at any time.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              "Zero-knowledge architecture",
              "On-device encryption",
              "Camouflage mode",
              "One-tap panic exit",
              "No tracking, ever",
              "90-day audio purge",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Voices</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Stories from our community
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { quote: "WellNest helped me understand my cycle without shame. The camouflage mode means no one knows what app I'm using.", name: "Anonymous", role: "University Student, Addis Ababa", stars: 5 },
            { quote: "I journal every morning now. The voice option means I don't even need to type — I just talk and it feels like someone is listening.", name: "Anonymous", role: "Young Professional, Hawassa", stars: 5 },
            { quote: "The nutrition scanner recognized my mom's injera platter! Finally an app that knows Ethiopian food.", name: "Anonymous", role: "High School Student, Bahir Dar", stars: 5 },
          ].map(({ quote, name, role, stars }) => (
            <div key={role} className="flex flex-col rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground italic">"{quote}"</p>
              <div className="mt-4 border-t border-border/50 pt-4">
                <div className="text-sm font-semibold">{name}</div>
                <div className="text-xs text-muted-foreground">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="bg-gradient-to-br from-[#1a4731] via-[#1f6b45] to-[#1a4731] py-20 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Globe className="mx-auto h-10 w-10 text-emerald-300" />
          <h2 className="mt-6 font-display text-3xl font-bold md:text-5xl">
            Ready to begin?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70">
            Join thousands of Ethiopian youth who chose gentle, private wellness. It takes 30 seconds to sign up — and everything is optional from there.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#1a4731] shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Create Free Account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-border/50 bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-bloom">
              <Flower2 className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-semibold">
              {t("common.appName")} {t("common.region")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            {t("index.note")}
          </p>
          <p className="text-xs text-muted-foreground">© 2026 WellNest Ethiopia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
