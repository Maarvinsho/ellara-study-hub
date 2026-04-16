import { Card } from "@/lib/srs/types";
import { basicsCards } from "./basics";
import { transientsCards } from "./transients";
import { phasorCards } from "./phasors";
import { resonanceCards } from "./resonance";
import { analysisCards } from "./analysis";
import { magneticsCards } from "./magnetics";

export const allCards: Card[] = [
  ...basicsCards,
  ...transientsCards,
  ...phasorCards,
  ...resonanceCards,
  ...analysisCards,
  ...magneticsCards,
];

export function getCardById(id: string): Card | undefined {
  return allCards.find((c) => c.id === id);
}

export function getCardsByTopic(topic: string): Card[] {
  return allCards.filter((c) => c.topic === topic);
}