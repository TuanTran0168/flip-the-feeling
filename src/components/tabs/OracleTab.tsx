"use client";

import { motion } from "framer-motion";
import CardFan from "@/components/CardFan";
import { Song, Mood } from "@/types";

interface OracleTabProps {
  onSongReveal: (song: Song, mood: Mood) => void;
}

export default function OracleTab({ onSongReveal }: OracleTabProps) {
  return (
    <div
      className="relative flex h-dvh flex-col overflow-hidden text-[var(--cosmic-text)]"
      style={{ paddingTop: "clamp(60px, 10vw, 80px)" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="flex shrink-0 flex-col items-center px-4 pb-1 pt-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-1 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.38em]"
          style={{ color: "var(--cosmic-text-muted)" }}
        >
          Bùi Anh Tuấn × Your Feelings
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.06 }}
          className="mb-1 font-[family-name:var(--font-playfair)] text-xs italic tracking-[0.22em]"
          style={{ color: "rgba(233,196,0,0.5)" }}
        >
          Trần Đăng Tuấn
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-[family-name:var(--font-playfair)] font-semibold leading-[0.95] tracking-[0.01em]"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5.2rem)",
            color: "var(--cosmic-text)",
            textShadow:
              "0 2px 20px rgba(8,10,22,0.9), 0 0 50px rgba(233,196,0,0.1)",
          }}
        >
          Flip the Feeling
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-2 max-w-sm font-[family-name:var(--font-playfair)] text-sm italic leading-relaxed tracking-[0.06em] text-center"
          style={{ color: "rgba(233,196,0,0.42)" }}
        >
          ✦ Lật thẻ để khám phá bài hát cho cảm xúc của bạn ✦
        </motion.p>
      </section>

      {/* ── Card Fan ────────────────────────────────────────────────────────── */}
      <section className="flex min-h-0 flex-1 items-center justify-center pb-20 md:pb-0">
        <CardFan onSongReveal={onSongReveal} />
      </section>
    </div>
  );
}
