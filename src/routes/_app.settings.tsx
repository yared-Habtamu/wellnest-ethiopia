import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/SectionCard";
import { useSafety } from "@/lib/safety";
import { clearQueue, getQueue } from "@/lib/offline-queue";
import { Trash2, EyeOff, ShieldAlert, Languages, BellRing, Wifi } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — WellNest" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { camouflage, setCamouflage, panicPurge } = useSafety();
  const [lang, setLang] = useState<"en" | "am">("en");
  const [notifs, setNotifs] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const queueCount = getQueue().length;

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Your space, your rules."
        subtitle="Tune privacy, language, and notifications. Nothing applied without your tap."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Privacy & safety">
          <Row
            Icon={EyeOff}
            title="Camouflage mode"
            desc="Disguise app as a neutral utility (Notes / Calendar)."
          >
            <Toggle on={camouflage} onChange={setCamouflage} />
          </Row>
          <Row Icon={ShieldAlert} title="Quick Exit" desc="Always visible. Tapping leaves to a neutral page." />
          <Row Icon={Trash2} title="Purge all local data" desc="Immediate. No cooling-off period.">
            {confirming ? (
              <div className="flex gap-2">
                <button
                  onClick={panicPurge}
                  className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"
                >
                  Yes, purge now
                </button>
                <button onClick={() => setConfirming(false)} className="rounded-full border border-border px-3 py-1.5 text-xs">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)} className="rounded-full border border-destructive px-3 py-1.5 text-xs text-destructive">
                Purge
              </button>
            )}
          </Row>
        </SectionCard>

        <SectionCard title="Experience">
          <Row Icon={Languages} title="Language" desc="Amharic support coming next.">
            <div className="inline-flex rounded-full border border-border p-0.5">
              {(["en", "am"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  disabled={l === "am"}
                  className={`rounded-full px-3 py-1 text-xs ${
                    lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  } disabled:opacity-50`}
                >
                  {l === "en" ? "English" : "አማርኛ"}
                </button>
              ))}
            </div>
          </Row>
          <Row Icon={BellRing} title="Gentle notifications" desc="We never nag. You set the rhythm.">
            <Toggle on={notifs} onChange={setNotifs} />
          </Row>
        </SectionCard>

        <SectionCard title="Offline & sync" className="lg:col-span-2">
          <Row
            Icon={Wifi}
            title={`${queueCount} items waiting to sync`}
            desc="Logs are kept on your device until you're online. Clear locally if you'd rather not sync."
          >
            <button
              onClick={() => {
                clearQueue();
                window.location.reload();
              }}
              className="rounded-full border border-border px-3 py-1.5 text-xs"
            >
              Clear queue
            </button>
          </Row>
        </SectionCard>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        WellNest is not a medical service. In an emergency, please contact a trusted professional.
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
