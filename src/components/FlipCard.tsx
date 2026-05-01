"use client";

import { motion } from "framer-motion";
import { Mood, Song } from "@/types";

// Cards deal outward from the center of the 4×2 grid.
// Approximate column spacing for max-w-4xl 4-col grid.
const COL_STEP = 230;
const ROW_STEP = 268;
const DEAL_ROTATIONS = [11, -15, 13, -9, 16, -12, 10, -14];

function dealOffset(i: number) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return { x: (1.5 - col) * COL_STEP, y: (0.5 - row) * ROW_STEP };
}

// ─── Card back (face-down design) ─────────────────────────────────────────────

function CardBack() {
  return (
    <div
      className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center select-none"
      style={{
        backfaceVisibility: "hidden",
        backgroundColor: "#0c0c18",
        border: "1px solid rgba(255,255,255,0.07)",
        backgroundImage: [
          "repeating-linear-gradient(45deg,  transparent, transparent 12px, rgba(255,255,255,0.018) 12px, rgba(255,255,255,0.018) 13px)",
          "repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255,255,255,0.018) 12px, rgba(255,255,255,0.018) 13px)",
        ].join(", "),
      }}
    >
      {/* Inner frame */}
      <div
        className="absolute inset-[10px] rounded-xl pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.05)" }}
      />
      {/* Corner dots */}
      {[
        "top-3 left-3",
        "top-3 right-3",
        "bottom-3 left-3",
        "bottom-3 right-3",
      ].map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos} w-1.5 h-1.5 rounded-full`}
          style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        />
      ))}
      {/* Center emblem */}
      <div className="relative flex flex-col items-center gap-2">
        <span className="text-3xl" style={{ filter: "grayscale(1) opacity(0.35)" }}>
          🎵
        </span>
        <span
          className="text-[10px] tracking-[0.3em] font-[family-name:var(--font-inter)]"
          style={{ color: "rgba(255,255,255,0.18)" }}
        >
          B · A · T
        </span>
      </div>
    </div>
  );
}

// ─── Card front (revealed content) ────────────────────────────────────────────

function CardFront({ mood, song }: { mood: Mood; song: Song | null }) {
  const youtubeUrl =
    song && song.youtubeId !== "TODO_YOUTUBE_ID"
      ? `https://www.youtube.com/watch?v=${song.youtubeId}`
      : null;

  return (
    <div
      className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col p-4 select-none"
      style={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        backgroundColor: mood.color,
        backgroundImage: `radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.18) 0%, transparent 55%)`,
        border: `1px solid ${mood.textColor}20`,
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${mood.textColor}50, transparent)`,
        }}
      />

      {/* Mood header */}
      <div className="flex items-center gap-2 mb-auto">
        <span className="text-2xl">{mood.emoji}</span>
        <span
          className="text-base font-bold font-[family-name:var(--font-playfair)]"
          style={{ color: mood.textColor }}
        >
          {mood.label}
        </span>
      </div>

      {/* Song content */}
      {song ? (
        <div
          className="mt-3 pt-3 flex flex-col gap-2"
          style={{ borderTop: `1px solid ${mood.textColor}25` }}
        >
          <p
            className="text-sm font-semibold font-[family-name:var(--font-playfair)] leading-snug"
            style={{ color: mood.textColor }}
          >
            {song.title}
          </p>
          <p
            className="text-[11px] italic font-[family-name:var(--font-playfair)] leading-relaxed line-clamp-2"
            style={{ color: `${mood.textColor}99` }}
          >
            &ldquo;{song.lyricQuote}&rdquo;
          </p>
          {youtubeUrl ? (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-1 self-start inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full font-[family-name:var(--font-inter)] transition-opacity active:opacity-70"
              style={{
                backgroundColor: `${mood.textColor}22`,
                color: mood.textColor,
                border: `1px solid ${mood.textColor}35`,
              }}
            >
              ▶&nbsp;Nghe ngay
            </a>
          ) : (
            <span
              className="text-[10px] font-[family-name:var(--font-inter)] opacity-40"
              style={{ color: mood.textColor }}
            >
              (chưa có link nhạc)
            </span>
          )}
        </div>
      ) : (
        <p
          className="mt-3 text-xs opacity-40 font-[family-name:var(--font-inter)]"
          style={{ color: mood.textColor }}
        >
          Chưa có bài hát
        </p>
      )}
    </div>
  );
}

// ─── FlipCard ──────────────────────────────────────────────────────────────────

interface Props {
  mood: Mood;
  song: Song | null;
  index: number;
  isFlipped: boolean;
  onClick: () => void;
}

export default function FlipCard({ mood, song, index, isFlipped, onClick }: Props) {
  const { x, y } = dealOffset(index);

  return (
    <motion.div
      /* Deal-in from center pile */
      initial={{ opacity: 0, scale: 0.45, rotateZ: DEAL_ROTATIONS[index], x, y }}
      animate={{ opacity: 1, scale: 1, rotateZ: 0, x: 0, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 210,
        damping: 24,
        delay: index * 0.07,
      }}
      /* Hover lift only when face-down */
      whileHover={!isFlipped ? { y: -8, transition: { duration: 0.18 } } : {}}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="cursor-pointer"
      style={{ perspective: "1100px" }}
    >
      {/* 3-D flip container */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          height: "260px",
          borderRadius: "16px",
          boxShadow: isFlipped
            ? `0 16px 48px ${mood.color}55, 0 4px 16px rgba(0,0,0,0.5)`
            : "0 6px 28px rgba(0,0,0,0.55)",
        }}
      >
        <CardBack />
        <CardFront mood={mood} song={song} />
      </motion.div>
    </motion.div>
  );
}
