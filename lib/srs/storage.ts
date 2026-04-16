import { CardProgress } from "./types";

const STORAGE_KEY = "ellara-srs-progress";

export function loadAllProgress(): Record<string, CardProgress> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveProgress(progress: CardProgress): void {
  if (typeof window === "undefined") return;
  const all = loadAllProgress();
  all[progress.cardId] = progress;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getProgress(cardId: string): CardProgress | null {
  const all = loadAllProgress();
  return all[cardId] || null;
}

export function resetAllProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}