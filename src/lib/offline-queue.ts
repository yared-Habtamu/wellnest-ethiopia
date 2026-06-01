// Trauma-informed offline queue: any sensitive log can be saved locally and
// flushed when the user is online. Pure browser-side; no PII leaves the device.
const KEY = "wellnest.offline-queue.v1";

export type QueuedItem = {
  id: string;
  kind: "mood" | "journal" | "symptom" | "cycle" | "nutrition" | "sisterhood";
  payload: unknown;
  createdAt: number;
};

function safeRead(): QueuedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QueuedItem[]) : [];
  } catch {
    return [];
  }
}

function safeWrite(items: QueuedItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("wellnest:queue-changed"));
  } catch {
    /* storage full or blocked — silently ignore so UX stays calm */
  }
}

export function enqueue(kind: QueuedItem["kind"], payload: unknown) {
  const items = safeRead();
  items.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    payload,
    createdAt: Date.now(),
  });
  safeWrite(items);
}

export function getQueue(): QueuedItem[] {
  return safeRead();
}

export function clearQueue() {
  safeWrite([]);
}

export function purgeAllLocalData() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {
    /* ignore */
  }
}
