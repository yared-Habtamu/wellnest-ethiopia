import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from "react";
import { Camera, Upload, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { PageHeader, SectionCard, SoftBadge } from "@/components/SectionCard";
import { enqueue } from "@/lib/offline-queue";
import { useTranslation } from "react-i18next";
import { useGuestGuard } from "@/lib/auth";
import { analyzeMealImage } from "@/lib/api/nutrition.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition — WellNest" }] }),
  component: NutritionPage,
});

const examples = [
  { name: "Injera with Doro Wat", kcal: 540, protein: 28, carbs: 64, fat: 18 },
  { name: "Shiro with Injera", kcal: 420, protein: 18, carbs: 58, fat: 12 },
  { name: "Kitfo (lean)", kcal: 380, protein: 32, carbs: 4, fat: 26 },
];

function NutritionPage() {
  const { t } = useTranslation();
  const guardAction = useGuestGuard();
  const [analysis, setAnalysis] = useState<typeof examples[number] | null>(null);
  const pick = () => {
    if (guardAction()) return;
    const guess = examples[Math.floor(Math.random() * examples.length)];
    setAnalysis(guess);
    enqueue("nutrition", { ...guess, at: Date.now() });
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg("");
    setAnalysis(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        
        try {
          const result = await analyzeMealImage({
            data: {
              imageBase64: base64String,
              mimeType: file.type
            }
          });

          if (result.isMeal) {
            setAnalysis(result);
            enqueue("nutrition", { ...result, at: Date.now() });
          } else {
            setErrorMsg(result.error === "not_food" ? "We couldn't clearly identify a meal in this photo. Please try snapping a clearer picture!" : "Failed to identify meal.");
          }
        } catch (err) {
          console.error(err);
          setErrorMsg("Failed to analyze image. Please try again later.");
        } finally {
          setIsLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          if (cameraInputRef.current) cameraInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to read file.");
      setIsLoading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCamera = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      toast.info("Camera unavailable on desktop", {
        description: "The live camera feature is only available on mobile phones. Please use the Upload button instead to select an image from your computer.",
      });
      return;
    }
    cameraInputRef.current?.click();
  };

  return (
    <>
      <PageHeader
        eyebrow={t("nutrition.eyebrow")}
        title={t("nutrition.title")}
        subtitle={t("nutrition.subtitle")}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title={t("nutrition.scan")}>
          <div className="grid place-items-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 px-6 py-12 text-center">
            <Camera className="h-10 w-10 text-primary" />
            <p className="mt-3 text-sm font-medium">{t("nutrition.tap")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("nutrition.or")}</p>
            <div className="mt-5 flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                ref={cameraInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <button onClick={triggerCamera} disabled={isLoading} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />} {t("nutrition.useCamera")}
              </button>
              <button onClick={triggerUpload} disabled={isLoading} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs disabled:opacity-50">
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} {t("nutrition.upload")}
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("nutrition.weSee")}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm">Analyzing your meal...</p>
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-destructive/10 p-6 text-center text-destructive">
              <AlertCircle className="h-8 w-8" />
              <p className="mt-2 text-sm font-medium">{errorMsg}</p>
            </div>
          ) : analysis ? (
            <div>
              <div className="flex items-center justify-between">
                <div className="font-display text-lg font-semibold">{analysis.name}</div>
                <SoftBadge tone="bloom">~{analysis.kcal} kcal</SoftBadge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: t("nutrition.protein"), v: analysis.protein, suf: "g" },
                  { label: t("nutrition.carbs"), v: analysis.carbs, suf: "g" },
                  { label: t("nutrition.fat"), v: analysis.fat, suf: "g" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-secondary/60 p-3">
                    <div className="font-display text-xl font-semibold">{m.v}{m.suf}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary/50 p-3 text-sm">
                <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                <p>{t("nutrition.balance")}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("nutrition.empty")}</p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
