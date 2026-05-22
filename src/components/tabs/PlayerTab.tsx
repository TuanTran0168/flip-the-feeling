"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Song, Mood } from "@/types";
import { moods as allMoods } from "@/data/moods";

export interface HistoryEntry {
  songId: string;
  moodId: string;
  timestamp: string;
}

const MAX_HISTORY = 20;

export function saveToHistory(song: Song, mood: Mood) {
  if (typeof window === "undefined") return;
  const all: HistoryEntry[] = JSON.parse(localStorage.getItem("ftf_history") || "[]");
  // Remove any existing entry for this song (dedup), then push to front
  const filtered = all.filter((e) => e.songId !== song.id);
  filtered.unshift({ songId: song.id, moodId: mood.id, timestamp: new Date().toISOString() });
  localStorage.setItem("ftf_history", JSON.stringify(filtered.slice(0, MAX_HISTORY)));
}

interface PlayerTabProps {
  song: Song | null;
  mood: Mood | null;
  onNewCard: () => void;
  onArchive: () => void;
}

export default function PlayerTab({ song, mood, onNewCard, onArchive }: PlayerTabProps) {
  useEffect(() => {
    if (song && mood) saveToHistory(song, mood);
  }, [song, mood]);

  if (!song || !mood) {
    return (
      <div
        className="flex h-dvh flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ paddingTop: "80px", paddingBottom: "80px" }}
      >
        <span style={{ fontSize: 48 }}>✦</span>
        <p
          className="font-[family-name:var(--font-playfair)] text-2xl"
          style={{ color: "var(--cosmic-text)" }}
        >
          Chưa có bài hát nào
        </p>
        <p
          className="font-[family-name:var(--font-inter)] text-sm"
          style={{ color: "var(--cosmic-text-muted)" }}
        >
          Hãy rút một lá bài từ Oracle để khám phá giai điệu định mệnh.
        </p>
        <button
          onClick={onNewCard}
          className="btn-orbital rounded-full px-8 py-3 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-widest uppercase"
          style={{ color: "var(--cosmic-gold)" }}
        >
          Rút bài ngay →
        </button>
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`;
  const songMoods = song.moods
    .map((id) => allMoods.find((m) => m.id === id))
    .filter(Boolean) as Mood[];

  return (
    <div
      className="h-dvh overflow-y-auto"
      style={{ paddingTop: "clamp(56px,10vw,80px)", paddingBottom: "clamp(80px,10vw,32px)" }}
    >
      <div className="mx-auto max-w-5xl px-4 md:px-16 flex flex-col md:flex-row gap-8 py-6 md:py-10">

        {/* ── Left: Tarot Card ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-shrink-0 mx-auto md:mx-0"
          style={{ width: "min(260px, 80vw)" }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              aspectRatio: "2 / 3",
              background: "linear-gradient(180deg, rgba(79,61,114,0.35) 0%, #0e0e0e 70%)",
              border: "1px solid rgba(233, 196, 0, 0.4)",
              boxShadow: "0 0 50px rgba(233,196,0,0.08), 0 24px 64px rgba(0,0,0,0.7)",
            }}
          >
            {/* Thumbnail bg */}
            <img
              src={thumbnailUrl}
              alt={song.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.35, filter: "contrast(1.15) saturate(0.6)" }}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, #0e0e0e 45%, rgba(14,14,14,0.2) 75%, transparent)" }}
            />

            {/* Corner accents */}
            {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-5 h-5`}
                style={{
                  borderTop: i < 2 ? "1px solid rgba(233,196,0,0.4)" : undefined,
                  borderBottom: i >= 2 ? "1px solid rgba(233,196,0,0.4)" : undefined,
                  borderLeft: i % 2 === 0 ? "1px solid rgba(233,196,0,0.4)" : undefined,
                  borderRight: i % 2 === 1 ? "1px solid rgba(233,196,0,0.4)" : undefined,
                }}
              />
            ))}

            {/* Card top label */}
            <div className="absolute top-5 left-0 right-0 flex justify-center">
              <span
                className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(233,196,0,0.7)" }}
              >
                Bùi Anh Tuấn
              </span>
            </div>

            {/* Card bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
              <span className="text-2xl block mb-2">{mood.emoji}</span>
              <h2
                className="font-[family-name:var(--font-playfair)] text-lg font-semibold leading-tight mb-3"
                style={{ color: "var(--cosmic-text)" }}
              >
                {song.title}
              </h2>
              {/* Divider */}
              <div
                className="h-px mx-auto mb-3"
                style={{ width: 60, background: "linear-gradient(to right, transparent, rgba(233,196,0,0.5), transparent)" }}
              />
              {/* Mood chips */}
              <div className="flex justify-center gap-2 flex-wrap">
                {songMoods.map((m) => (
                  <span
                    key={m.id}
                    className="rounded-full px-2.5 py-0.5 font-[family-name:var(--font-inter)] text-[10px] tracking-wider"
                    style={{
                      border: "1px solid rgba(233,196,0,0.25)",
                      color: "rgba(233,196,0,0.75)",
                      background: "rgba(0,0,0,0.45)",
                    }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
              <p
                className="mt-2 font-[family-name:var(--font-inter)] text-[10px] tracking-widest"
                style={{ color: "rgba(143,145,149,0.6)" }}
              >
                {song.year}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Right: Player Panel ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex-1 flex flex-col gap-5 min-w-0"
        >
          {/* Song title */}
          <div>
            <p
              className="font-[family-name:var(--font-inter)] text-[11px] tracking-[0.25em] uppercase mb-1"
              style={{ color: "rgba(233,196,0,0.7)" }}
            >
              Giai Điệu Định Mệnh
            </p>
            <h1
              className="font-[family-name:var(--font-playfair)] font-semibold leading-tight"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "var(--cosmic-text)" }}
            >
              {song.title}
            </h1>
          </div>

          {/* Lyric quote */}
          <blockquote
            className="pl-4 font-[family-name:var(--font-playfair)] text-sm italic leading-relaxed"
            style={{
              borderLeft: "2px solid rgba(233,196,0,0.45)",
              color: "var(--cosmic-text-variant)",
            }}
          >
            &ldquo;{song.lyricQuote}&rdquo;
          </blockquote>

          {/* YouTube Embed */}
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              border: "1px solid rgba(233,196,0,0.2)",
              background: "#0e0e0e",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${song.youtubeId}?rel=0&modestbranding=1`}
                title={song.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          {/* Personal note */}
          {song.personalNote && song.personalNote !== "TODO" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl p-4"
              style={{
                background: "rgba(79, 61, 114, 0.12)",
                border: "1px solid rgba(79, 61, 114, 0.3)",
              }}
            >
              <p
                className="font-[family-name:var(--font-inter)] text-sm leading-relaxed"
                style={{ color: "var(--cosmic-secondary)" }}
              >
                {song.personalNote}
              </p>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={onNewCard}
              className="btn-orbital flex-1 min-w-32 rounded-full px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-wider uppercase"
              style={{ color: "var(--cosmic-gold)" }}
            >
              ✦ Rút Bài Mới
            </button>
            <button
              onClick={onArchive}
              className="btn-orbital flex-1 min-w-32 rounded-full px-6 py-3 font-[family-name:var(--font-inter)] text-sm tracking-wider uppercase"
              style={{ color: "var(--cosmic-text-muted)" }}
            >
              ◈ Archive
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
