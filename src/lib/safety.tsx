import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { purgeAllLocalData } from "./offline-queue";

type SafetyCtx = {
  camouflage: boolean;
  setCamouflage: (v: boolean) => void;
  panicExit: () => void;
  panicPurge: () => void;
};

const Ctx = createContext<SafetyCtx | null>(null);

const CAMO_KEY = "wellnest.camouflage";

export function SafetyProvider({ children }: { children: ReactNode }) {
  const [camouflage, setCamouflageState] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(CAMO_KEY);
      if (v === "1") setCamouflageState(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (camouflage) root.classList.add("camouflage");
    else root.classList.remove("camouflage");
  }, [camouflage]);

  const setCamouflage = (v: boolean) => {
    setCamouflageState(v);
    try {
      window.localStorage.setItem(CAMO_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const panicExit = () => {
    // Immediately leave to a neutral page — no confirmation
    window.location.replace("https://www.google.com/search?q=weather+today");
  };

  const panicPurge = () => {
    purgeAllLocalData();
    panicExit();
  };

  return (
    <Ctx.Provider value={{ camouflage, setCamouflage, panicExit, panicPurge }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSafety() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSafety must be used within SafetyProvider");
  return ctx;
}
