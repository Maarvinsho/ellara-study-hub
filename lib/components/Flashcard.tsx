"use client";

import { useState } from "react";
import { Card } from "@/lib/srs/types";
import Latex from "./Latex";

interface FlashcardProps {
  card: Card;
  onGrade: (grade: 0 | 1 | 2 | 3 | 4 | 5) => void;
}

export default function Flashcard({ card, onGrade }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip state when card changes
  const cardKey = card.id;

  return (
    <div key={cardKey} className="w-full max-w-2xl mx-auto">
      <div className="mb-3 text-sm text-gray-500">
        {card.topic} · {card.type}
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className="border-2 rounded-lg p-8 min-h-[240px] flex items-center justify-center cursor-pointer hover:border-blue-400 transition bg-white"
      >
        <div className="text-center text-lg">
          <Latex>{flipped ? card.back : card.front}</Latex>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-2">
        {flipped ? "Click card to see question" : "Click card to reveal answer"}
      </div>

      {flipped && (
        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-2 text-center">
            How well did you recall this?
          </div>
          <div className="grid grid-cols-6 gap-2">
            <GradeButton grade={0} label="Blackout" color="bg-red-600" onClick={onGrade} />
            <GradeButton grade={1} label="Wrong" color="bg-red-500" onClick={onGrade} />
            <GradeButton grade={2} label="Hard-Wrong" color="bg-orange-500" onClick={onGrade} />
            <GradeButton grade={3} label="Hard" color="bg-yellow-500" onClick={onGrade} />
            <GradeButton grade={4} label="Good" color="bg-green-500" onClick={onGrade} />
            <GradeButton grade={5} label="Easy" color="bg-green-600" onClick={onGrade} />
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            0–2 = failed (you&apos;ll see it again soon) · 3–5 = passed
          </div>
        </div>
      )}
    </div>
  );
}

function GradeButton({
  grade,
  label,
  color,
  onClick,
}: {
  grade: 0 | 1 | 2 | 3 | 4 | 5;
  label: string;
  color: string;
  onClick: (g: 0 | 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <button
      onClick={() => onClick(grade)}
      className={`${color} text-white rounded px-2 py-3 text-xs font-medium hover:opacity-90 transition`}
    >
      <div className="text-base font-bold">{grade}</div>
      <div>{label}</div>
    </button>
  );
}