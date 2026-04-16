import { Card } from "./types";
import { loadAllProgress, getProgress } from "./storage";
import { isDue, createInitialProgress } from "./sm2";

export interface SessionStats {
  total: number;
  due: number;
  newCards: number;
}

// Returns cards that are either new (no progress yet) or due for review
export function getDueCards(allCards: Card[], now: Date = new Date()): Card[] {
  const progress = loadAllProgress();
  return allCards.filter((card) => {
    const p = progress[card.id];
    if (!p) return true; // New card
    return isDue(p, now);
  });
}

export function getSessionStats(allCards: Card[], now: Date = new Date()): SessionStats {
  const progress = loadAllProgress();
  let due = 0;
  let newCards = 0;
  for (const card of allCards) {
    const p = progress[card.id];
    if (!p) {
      newCards += 1;
    } else if (isDue(p, now)) {
      due += 1;
    }
  }
  return {
    total: allCards.length,
    due,
    newCards,
  };
}

export function getOrCreateProgress(cardId: string) {
  return getProgress(cardId) || createInitialProgress(cardId);
}