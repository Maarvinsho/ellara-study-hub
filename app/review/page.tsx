"use client";

import { useEffect, useState } from "react";
import { allCards } from "@/data/cards";
import Flashcard from "@/lib/components/Flashcard";
import { Grade } from "@/lib/srs/types";
import { updateProgress } from "@/lib/srs/sm2";
import { saveProgress } from "@/lib/srs/storage";
import { getDueCards, getOrCreateProgress, getSessionStats } from "@/lib/srs/session";

export default function ReviewPage() {
  const [queue, setQueue] = useState<typeof allCards>([]);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ total: 0, due: 0, newCards: 0 });
  const [loaded, setLoaded] = useState(false);

  // Build the session queue on mount
  useEffect(() => {
    const dueCards = getDueCards(allCards);
    // Shuffle so you don't always see the same order
    const shuffled = [...dueCards].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setStats(getSessionStats(allCards));
    setLoaded(true);
  }, []);

  const handleGrade = (grade: Grade) => {
    const card = queue[index];
    const currentProgress = getOrCreateProgress(card.id);
    const newProgress = updateProgress(currentProgress, grade);
    saveProgress(newProgress);

    // If they failed (grade < 3), put the card back near the end of the queue
    if (grade < 3) {
      setQueue((q) => {
        const rest = q.slice(index + 1);
        const insertAt = Math.min(rest.length, 3); // Show again after ~3 cards
        const newRest = [...rest];
        newRest.splice(insertAt, 0, card);
        return [...q.slice(0, index + 1), ...newRest];
      });
    }

    setIndex((i) => i + 1);
  };

  if (!loaded) {
    return <main className="p-8">Loading...</main>;
  }

  const done = index >= queue.length;

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Review</h1>
        <div className="text-sm text-gray-600">
          Total: {stats.total} · Due today: {stats.due} · New: {stats.newCards}
        </div>
      </header>

      {done ? (
        <div className="text-center py-16">
          <div className="text-2xl font-semibold mb-2">Session complete</div>
          <div className="text-gray-600 mb-6">
            You reviewed {queue.length} card{queue.length === 1 ? "" : "s"}.
          </div>
          <a href="/" className="text-blue-600 hover:underline">
            ← Back to home
          </a>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm text-gray-500 text-center">
            Card {index + 1} of {queue.length}
          </div>
          <Flashcard card={queue[index]} onGrade={handleGrade} />
        </>
      )}
    </main>
  );
}