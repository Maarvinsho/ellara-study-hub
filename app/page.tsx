"use client";

import { allCards } from "@/data/cards";

export default function ReviewPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Review</h1>
      <p className="text-gray-600 mb-6">
        {allCards.length} cards loaded. UI coming tomorrow.
      </p>
      <ul className="space-y-2">
        {allCards.map((card) => (
          <li key={card.id} className="border rounded p-3">
            <div className="text-xs text-gray-500">{card.topic} · {card.type}</div>
            <div className="font-medium">{card.front}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}