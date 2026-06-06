import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Flower2, ShieldCheck, WifiOff, HeartHandshake, Brain, Apple,
  Smile, BookHeart, Trophy, Users, Sparkles, ArrowRight, Heart,
  Lock, Globe, ChevronRight, Star, CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { setLanguage, getLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

const heroImages = [
  "/src/public/hero-bg-1.png",
  "/src/public/hero-bg-2.png",
  "/src/public/hero-bg-3.png",
];

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
    <div className="inline-flex items-center rounded-full border border-border bg-card/80 p-1 shadow-sm backdrop-blur-md">
      {(["en", "am"] as const).map((l) => (
        <button
          key={l}
          onClick={() => toggle(l)}
          className={`relative rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide cursor-pointer transition-all duration-300 ease-out ${
            lang === l
              ? "bg-primary text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
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
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border/60 bg-card/65 shadow-sm backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="font-display text-3xl font-bold text-primary md:text-4xl">{value}</div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">{label}</div>
    </div>
  );
}

/* ─── main page ─── */

function Index() {
  const { t } = useTranslation();
  const { setGuest } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <nav className={`fixed top-0 z-50 w-full border-b transition-all duration-500 ${
        scrolled
          ? "border-border/10 bg-background/20 backdrop-blur-2xl"
          : "border-transparent bg-background"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-bloom">
              <Flower2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold text-foreground">
              WellNest Ethiopia
            </span>
          </div>
          <LangToggle />
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden min-h-[600px] md:min-h-[700px]">
        {/* Background image slideshow */}
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: currentImage === i ? 1 : 0,
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto max-w-6xl px-6 text-center z-10">
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-7xl">
            Wellness that meets you <span className="bg-gradient-to-r from-amber-300 to-orange-200 bg-clip-text text-transparent">where you are.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            {t("index.body")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:shadow-black/25 hover:-translate-y-0.5"
            >
              {t("index.begin")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setGuest()}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
            >
              {t("index.skip")}
            </Link>
          </div>
          {/* Slideshow indicators */}
          <div className="mt-10 flex justify-center gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentImage === i ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ STATS BAR ══════ */}
      <section className="py-14 bg-secondary/15">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
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
      <section className="border-y border-border/50 bg-secondary/30 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-bloom">
            <Lock className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold text-foreground md:text-4xl">Your privacy is non-negotiable</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Women's wellness data is never used to train AI. Sensitive logs stay on your device.
            Camouflage mode disguises the app as a neutral utility. One-tap exit at any time.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 max-w-3xl mx-auto">
            {[
              "Zero-knowledge architecture",
              "On-device encryption",
              "Camouflage mode",
              "One-tap panic exit",
              "No tracking, ever",
              "90-day audio purge",
            ].map((item) => (
              <div
                key={item}
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-border/60 bg-card/70 shadow-sm hover:border-primary/50 hover:bg-secondary/40 transition-all cursor-pointer group text-center"
              >
                <CheckCircle2 className="h-5 w-5 text-primary mb-2 transition-transform group-hover:scale-110" />
                <span className="text-xs font-semibold text-foreground leading-tight">{item}</span>
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
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-bloom">
            <Globe className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold text-foreground md:text-5xl">
            Ready to begin?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join thousands of Ethiopian youth who chose gentle, private wellness. It takes 30 seconds to sign up — and everything is optional from there.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
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
