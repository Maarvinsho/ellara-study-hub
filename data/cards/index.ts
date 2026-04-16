import { Card } from "@/lib/srs/types";
import { basicsCards } from "./basics";

export const allCards: Card[] = [
  ...basicsCards,
  // More decks added in later days: transients, phasors, etc.
];

export function getCardById(id: string): Card | undefined {
  return allCards.find((c) => c.id === id);
}