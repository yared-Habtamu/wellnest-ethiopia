import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Smile,
  BookHeart,
  Apple,
  Flower2,
  Trophy,
  Settings,
  WifiOff,
  Eye,
  EyeOff,

  Languages,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSafety } from "@/lib/safety";
import { getQueue } from "@/lib/offline-queue";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";

export function AppShell() {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const nav = [
    { to: "/dashboard", label: t("nav.today"), icon: Home },
    { to: "/mood", label: t("nav.mood"), icon: Smile },
    { to: "/journal", label: t("nav.journal"), icon: BookHeart },
    { to: "/nutrition", label: t("nav.nutrition"), icon: Apple },
    { to: "/wellness", label: t("nav.wellness"), icon: Flower2 },
    { to: "/gamification", label: t("nav.growth"), icon: Trophy },
    { to: "/settings", label: t("nav.settings"), icon: Settings },
  ];
  const { camouflage, setCamouflage, panicExit } = useSafety();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [online, setOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    const refresh = () => setQueueCount(getQueue().length);
    refresh();
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    window.addEventListener("wellnest:queue-changed", refresh);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      window.removeEventListener("wellnest:queue-changed", refresh);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:gap-1 md:border-r md:border-border/60 md:p-5 sticky top-0 h-screen overflow-hidden">
          <Link to="/dashboard" className="mb-6 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-bloom">
              <Flower2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold leading-none">
                {camouflage ? t("common.appNameCamouflage") : t("common.appName")}
              </div>
              <div className="text-xs text-muted-foreground">
                {camouflage ? t("common.regionCamouflage") : t("common.region")}
              </div>
            </div>
          </Link>

          <nav className="flex flex-col gap-1">
            {nav.map(({ to, label, icon: Icon }) => {
              const active = path === to || path.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-secondary text-secondary-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{camouflage && to === "/wellness" ? t("nav.wellnessCamouflage") : label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2 pt-6">
            {/* Camouflage mode */}
            <button
              onClick={() => setCamouflage(!camouflage)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors text-muted-foreground hover:bg-secondary/60 hover:text-foreground w-full text-left cursor-pointer"
            >
              {camouflage ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>{t("settings.camo")}</span>
            </button>

            {/* Logout button */}
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors text-destructive hover:bg-destructive/10 w-full text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("common.exit")}</span>
            </button>

          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Top bar (mobile + status) */}
          <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur md:px-8">
            <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-bloom">
                <Flower2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-semibold">
                {camouflage ? t("common.appNameCamouflage") : t("common.appName")}
              </span>
            </Link>
            <div className="flex flex-1 items-center justify-end gap-2">
              {!online && (
                <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  <WifiOff className="h-3 w-3" /> {t("common.offline")}
                </span>
              )}
              {queueCount > 0 && (
                <span className="rounded-full bg-accent/60 px-2.5 py-1 text-xs text-accent-foreground">
                  {t("common.pendingSync", { count: queueCount })}
                </span>
              )}
              {/* Language toggle (mobile) */}
              <div className="inline-flex rounded-full border border-border p-0.5">
                {(["en", "am"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => i18n.changeLanguage(l)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      i18n.language === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {l === "en" ? "EN" : "አማ"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 pb-28 pt-6 md:px-10 md:pb-10">
            <Outlet />
          </div>

          {/* Bottom nav (mobile) */}
          <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-border/60 bg-card/95 backdrop-blur md:hidden">
            {nav.slice(0, 5).map(({ to, icon: Icon, label }) => {
              const active = path === to || path.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label.split(" ")[0]}</span>
                </Link>
              );
            })}
          </nav>
        </main>
      </div>
    </div>
  );
}
