import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { useSafety } from "@/lib/safety";
import { clearQueue, getQueue } from "@/lib/offline-queue";
import { Trash2, EyeOff, ShieldAlert, Languages, BellRing, Wifi } from "lucide-react";
import { useTranslation } from "react-i18next";
import { setLanguage, getLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — WellNest" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { camouflage, setCamouflage, panicPurge } = useSafety();
  const [lang, setLang] = useState<"en" | "am">(getLanguage());
  const [notifs, setNotifs] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const queueCount = getQueue().length;

  const changeLang = (l: "en" | "am") => {
    setLang(l);
    setLanguage(l);
  };
  void i18n;

  return (
    <>
      <PageHeader
        eyebrow={t("settings.eyebrow")}
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title={t("settings.privacy")}>
          <Row
            Icon={EyeOff}
            title={t("settings.camo")}
            desc={t("settings.camoDesc")}
          >
            <Toggle on={camouflage} onChange={setCamouflage} />
          </Row>
          <Row Icon={ShieldAlert} title={t("settings.quickExitTitle")} desc={t("settings.quickExitDesc")} />
          <Row Icon={Trash2} title={t("settings.purge")} desc={t("settings.purgeDesc")}>
            {confirming ? (
              <div className="flex gap-2">
                <button
                  onClick={panicPurge}
                  className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"
                >
                  {t("settings.purgeYes")}
                </button>
                <button onClick={() => setConfirming(false)} className="rounded-full border border-border px-3 py-1.5 text-xs">
                  {t("common.cancel")}
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)} className="rounded-full border border-destructive px-3 py-1.5 text-xs text-destructive">
                {t("settings.purgeBtn")}
              </button>
            )}
          </Row>
        </SectionCard>

        <SectionCard title={t("settings.experience")}>
          <Row Icon={Languages} title={t("settings.language")} desc={t("settings.languageDesc")}>
            <div className="inline-flex rounded-full border border-border p-0.5">
              {(["en", "am"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => changeLang(l)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {l === "en" ? "English" : "አማርኛ"}
                </button>
              ))}
            </div>
          </Row>
          <Row Icon={BellRing} title={t("settings.notifs")} desc={t("settings.notifsDesc")}>
            <Toggle on={notifs} onChange={setNotifs} />
          </Row>
        </SectionCard>

        <SectionCard title={t("settings.offline")} className="lg:col-span-2">
          <Row
            Icon={Wifi}
            title={t("settings.waiting", { n: queueCount })}
            desc={t("settings.waitingDesc")}
          >
            <button
              onClick={() => {
                clearQueue();
                window.location.reload();
              }}
              className="rounded-full border border-border px-3 py-1.5 text-xs"
            >
              {t("settings.clearQueue")}
            </button>
          </Row>
        </SectionCard>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        {t("common.notMedical")}
      </p>
    </>
  );
}

function Row({
  Icon,
  title,
  desc,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-3.5 last:border-0">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 text-primary" />
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
