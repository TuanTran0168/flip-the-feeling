"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlipCard from "./FlipCard";
import { moods } from "@/data/moods";
import { songs } from "@/data/songs";
import { Song } from "@/types";

interface CardState {
  isFlipped: boolean;
  song: Song | null;
}

function pickRandomSong(moodId: string, excluding?: Song | null): Song | null {
  const pool = songs.filter((s) => s.moods.includes(moodId));
  if (!pool.length) return null;
  // Try to avoid showing the same song twice in a row
  const candidates = pool.length > 1 && excluding
    ? pool.filter((s) => s.id !== excluding.id)
    : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function CardDeck() {
  const [states, setStates] = useState<Record<string, CardState>>({});
  const flippedCount = Object.values(states).filter((s) => s.isFlipped).length;

  const handleClick = useCallback((moodId: string) => {
    setStates((prev) => {
      const current = prev[moodId];
      if (current?.isFlipped) {
        // Flip back face-down; next click will deal a new random song
        return { ...prev, [moodId]: { isFlipped: false, song: current.song } };
      }
      return {
        ...prev,
        [moodId]: {
          isFlipped: true,
          song: pickRandomSong(moodId, current?.song),
        },
      };
    });
  }, []);

  const handleResetAll = () => setStates({});

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Hint text */}
      <AnimatePresence mode="wait">
        {flippedCount === 0 ? (
          <motion.p
            key="hint-flip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-[#6b7280] font-[family-name:var(--font-inter)] tracking-wide"
          >
            Chọn một thẻ để lật
          </motion.p>
        ) : (
          <motion.p
            key="hint-more"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-[#6b7280] font-[family-name:var(--font-inter)] tracking-wide"
          >
            {flippedCount}/{moods.length} thẻ đã lật
            {flippedCount > 0 && (
              <button
                onClick={handleResetAll}
                className="ml-3 text-[#4b5563] hover:text-[#9ca3af] transition-colors underline underline-offset-2"
              >
                xáo bài lại
              </button>
            )}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {moods.map((mood, i) => {
          const state = states[mood.id];
          return (
            <FlipCard
              key={mood.id}
              mood={mood}
              song={state?.song ?? null}
              index={i}
              isFlipped={state?.isFlipped ?? false}
              onClick={() => handleClick(mood.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
