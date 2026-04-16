export type CardType = "formula" | "concept" | "unit";

export interface Card {
  id: string;
  type: CardType;
  topic: string;           // e.g., "Ohm's Law", "RC Transient"
  front: string;           // Question (supports LaTeX via $...$)
  back: string;            // Answer (supports LaTeX via $...$)
  tags?: string[];         // e.g., ["dc", "basics"]
}

export interface CardProgress {
  cardId: string;
  easeFactor: number;      // SM-2: starts at 2.5
  interval: number;        // Days until next review
  repetitions: number;     // Consecutive correct reviews
  dueDate: string;         // ISO date string
  lastReviewed: string | null;
}

export type Grade = 0 | 1 | 2 | 3 | 4 | 5;
// 0-2 = failed, 3-5 = passed
// 0: complete blackout
// 1: incorrect, correct answer remembered
// 2: incorrect, correct answer seemed easy
// 3: correct with serious difficulty
// 4: correct after hesitation
// 5: perfect recall