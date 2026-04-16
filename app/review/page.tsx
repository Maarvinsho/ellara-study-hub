"use client";

import { useEffect, useState } from "react";
import { allCards } from "@/data/cards";
import Flashcard from "@/lib/components/Flashcard";
import { Card, Grade } from "@/lib/srs/types";
import { updateProgress } from "@/lib/srs/sm2";
import { saveProgress } from "@/lib/srs/storage";
import { getDueCards, getOrCreateProgress, getSessionStats } from "@/lib/srs/session";

type Mode = "due" | "all";

export default function ReviewPage() {
  const [mode, setMode] = useState<Mode>("due");
  const [queue, setQueue] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ total: 0, due: 0, newCards: 0 });
  const [loaded, setLoaded] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    setStats(getSessionStats(allCards));
    setLoaded(true);
  }, []);

  const startSession = (m: Mode) => {
    const pool = m === "due" ? getDueCards(allCards) : allCards;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setMode(m);
    setQueue(shuffled);
    setIndex(0);
    setSessionStarted(true);
  };

  const handleGrade = (grade: Grade) => {
    const card = queue[index];
    const currentProgress = getOrCreateProgress(card.id);
    const newProgress = updateProgress(currentProgress, grade);
    saveProgress(newProgress);

    if (grade < 3) {
      setQueue((q) => {
        const rest = q.slice(index + 1);
        const insertAt = Math.min(rest.length, 3);
        const newRest = [...rest];
        newRest.splice(insertAt, 0, card);
        return [...q.slice(0, index + 1), ...newRest];
      });
    }

    setIndex((i) => i + 1);
  };

  const endSession = () => {
    setSessionStarted(false);
    setStats(getSessionStats(allCards));
  };

  if (!loaded) return <main className="p-8">Loading...</main>;

  if (!sessionStarted) {
    return (
      <main className="min-h-screen p-8 max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Review</h1>
          <div className="text-gray-600">
            {stats.total} cards total · {stats.due} due today · {stats.newCards} new
          </div>
        </header>

        <div className="space-y-3">
          <button
            onClick={() => startSession("due")}
            disabled={stats.due === 0 && stats.newCards === 0}
            className="w-full bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Start review session ({stats.due + stats.newCards} cards)
          </button>
          <button
            onClick={() => startSession("all")}
            className="w-full border rounded-lg p-4 hover:border-blue-500"
          >
            Cram all {stats.total} cards (ignores SRS schedule)
          </button>
          <a href="/" className="block text-center text-sm text-gray-500 hover:underline mt-4">
            ← Back to home
          </a>
        </div>
      </main>
    );
  }

  const done = index >= queue.length;

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Review</h1>
        <button onClick={endSession} className="text-sm text-gray-500 hover:underline">
          End session
        </button>
      </header>

      {done ? (
        <div className="text-center py-16">
          <div className="text-2xl font-semibold mb-2">Session complete</div>
          <div className="text-gray-600 mb-6">
            You reviewed {queue.length} card{queue.length === 1 ? "" : "s"}.
          </div>
          <button
            onClick={endSession}
            className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700"
          >
            Back to review menu
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm text-gray-500 text-center">
            Card {index + 1} of {queue.length} · {mode === "due" ? "Due review" : "Cram mode"}
          </div>
          <Flashcard card={queue[index]} onGrade={handleGrade} />
        </>
      )}
    </main>
  );
}