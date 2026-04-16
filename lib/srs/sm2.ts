import { CardProgress, Grade } from "./types";

export function createInitialProgress(cardId: string): CardProgress {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    lastReviewed: null,
  };
}

export function updateProgress(
  progress: CardProgress,
  grade: Grade,
  now: Date = new Date()
): CardProgress {
  let { easeFactor, interval, repetitions } = progress;

  if (grade < 3) {
    // Failed — reset repetitions, short interval
    repetitions = 0;
    interval = 1;
  } else {
    // Passed — compute next interval
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor (clamped to minimum 1.3)
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    cardId: progress.cardId,
    easeFactor,
    interval,
    repetitions,
    dueDate: dueDate.toISOString(),
    lastReviewed: now.toISOString(),
  };
}

export function isDue(progress: CardProgress, now: Date = new Date()): boolean {
  return new Date(progress.dueDate) <= now;
}