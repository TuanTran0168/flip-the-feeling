"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Song, Mood } from "@/types";
import { songs as allSongs } from "@/data/songs";
import { moods as allMoods } from "@/data/moods";
import { HistoryEntry } from "./PlayerTab";

function formatDate(isoString: string): string {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(isoString));
  } catch {
    return isoString.slice(0, 10);
  }
}

interface ArchiveTabProps {
  onPlaySong: (song: Song, mood: Mood) => void;
  onNewCard: () => void;
}

export default function ArchiveTab({ onPlaySong, onNewCard }: ArchiveTabProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored: HistoryEntry[] = JSON.parse(localStorage.getItem("ftf_history") || "[]");
    setEntries(stored);
  }, []);

  const scrollTo = (pos: "top" | "bottom") => {
    scrollRef.current?.scrollTo({ top: pos === "top" ? 0 : scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  const isEmpty = entries.length === 0;

  return (
    <div
      ref={scrollRef}
      className="h-dvh overflow-y-auto"
      style={{ paddingTop: "clamp(56px,10vw,80px)", paddingBottom: "clamp(80px,10vw,32px)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-16 py-8 md:py-12">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <p
            className="font-[family-name:var(--font-inter)] text-[11px] tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--cosmic-text-muted)" }}
          >
            Nhật ký Giao hưởng
          </p>
          <h1
            className="font-[family-name:var(--font-playfair)] font-semibold mb-3"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
              color: "var(--cosmic-text)",
              textShadow: "0 0 40px rgba(233,196,0,0.1)",
            }}
          >
            Lịch Sử Giao Hưởng
          </h1>
          <p
            className="font-[family-name:var(--font-inter)] text-sm max-w-md mx-auto"
            style={{ color: "var(--cosmic-text-muted)" }}
          >
            Những bài hát định mệnh đã đồng hành cùng cảm xúc của bạn
          </p>
        </motion.div>

        {/* ── Empty State ──────────────────────────────────────────────────── */}
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-6 py-24 text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl orbit-glow"
              style={{ border: "1px solid rgba(233,196,0,0.3)", background: "rgba(233,196,0,0.05)" }}
            >
              ◈
            </div>
            <p className="font-[family-name:var(--font-playfair)] text-xl" style={{ color: "var(--cosmic-text)" }}>
              Chưa có ký ức nào
            </p>
            <p className="font-[family-name:var(--font-inter)] text-sm" style={{ color: "var(--cosmic-text-muted)" }}>
              Hãy rút bài đầu tiên và để âm nhạc viết lên vũ trụ của bạn.
            </p>
            <button
              onClick={onNewCard}
              className="btn-orbital rounded-full px-8 py-3 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--cosmic-gold)" }}
            >
              ✦ Rút Bài Ngay
            </button>
          </motion.div>
        ) : (
          /* ── Grid ─────────────────────────────────────────────────────── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {entries.map((entry, index) => {
              const song = allSongs.find((s) => s.id === entry.songId);
              const entryMood = allMoods.find((m) => m.id === entry.moodId);
              if (!song || !entryMood) return null;

              return (
                <motion.article
                  key={`${entry.songId}-${entry.timestamp}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.4) }}
                  onClick={() => onPlaySong(song, entryMood)}
                  className="tarot-card-hover relative rounded-xl p-6 flex flex-col overflow-hidden cursor-pointer group"
                  style={{
                    background: "linear-gradient(160deg, rgba(79,61,114,0.18) 0%, rgba(19,19,19,0.85) 100%)",
                    border: "1px solid rgba(233, 196, 0, 0.28)",
                    minHeight: 220,
                  }}
                >
                  {/* Purple nebula glow on hover */}
                  <div
                    className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl transition-all duration-500"
                    style={{
                      background: "rgba(79,61,114,0.12)",
                    }}
                  />

                  {/* Top row */}
                  <div className="relative z-10 flex justify-between items-start mb-10">
                    <span
                      className="rounded-full px-3 py-1 font-[family-name:var(--font-inter)] text-[10px] tracking-wider backdrop-blur-sm"
                      style={{
                        border: "1px solid rgba(233,196,0,0.3)",
                        color: "var(--cosmic-gold)",
                        background: "rgba(0,0,0,0.4)",
                      }}
                    >
                      {entryMood.emoji}&nbsp;{entryMood.label}
                    </span>
                    <span
                      className="font-[family-name:var(--font-inter)] text-[11px]"
                      style={{ color: "var(--cosmic-text-muted)" }}
                    >
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="relative z-10 mt-auto">
                    <h3
                      className="font-[family-name:var(--font-playfair)] text-lg mb-1 leading-tight"
                      style={{ color: "var(--cosmic-text)" }}
                    >
                      {song.title}
                    </h3>
                    <p
                      className="font-[family-name:var(--font-inter)] text-xs mb-4"
                      style={{ color: "var(--cosmic-text-variant)" }}
                    >
                      Bùi Anh Tuấn · {song.year}
                    </p>
                    {/* Constellation divider */}
                    <div
                      className="h-px mb-4"
                      style={{ background: "linear-gradient(to right, rgba(233,196,0,0.45), transparent)" }}
                    />
                    <button
                      aria-label={`Nghe lại ${song.title}`}
                      onClick={(e) => { e.stopPropagation(); onPlaySong(song, entryMood); }}
                      className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs transition-colors hover:opacity-80"
                      style={{ color: "var(--cosmic-text-muted)" }}
                    >
                      ▶&nbsp;Nghe Lại
                    </button>
                  </div>
                </motion.article>
              );
            })}

            {/* ── New Card CTA ──────────────────────────────────────────────── */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(entries.length * 0.04, 0.4) + 0.05 }}
              onClick={onNewCard}
              className="rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer group transition-all duration-300"
              style={{
                border: "1px dashed rgba(233,196,0,0.35)",
                background: "rgba(19,19,19,0.3)",
                minHeight: 220,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 orbit-glow"
                style={{
                  border: "1px solid rgba(233,196,0,0.3)",
                  color: "var(--cosmic-gold)",
                  background: "rgba(233,196,0,0.05)",
                  fontSize: 22,
                }}
              >
                +
              </div>
              <h3
                className="font-[family-name:var(--font-playfair)] text-lg mb-2 text-center"
                style={{ color: "var(--cosmic-text)" }}
              >
                Rút Định Mệnh Mới
              </h3>
              <p
                className="font-[family-name:var(--font-inter)] text-xs text-center px-4"
                style={{ color: "var(--cosmic-text-muted)" }}
              >
                Tham khảo Oracle để tìm bài hát tiếp theo của bạn.
              </p>
            </motion.article>
          </div>
        )}
      </div>

      {/* Mobile scroll buttons — only on small screens */}
      {!isEmpty && (
        <div className="md:hidden fixed bottom-24 right-4 z-40 flex flex-col gap-2">
          <button
            aria-label="Cuộn lên đầu"
            onClick={() => scrollTo("top")}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity active:scale-90"
            style={{
              background: "rgba(13,13,13,0.85)",
              border: "1px solid rgba(233,196,0,0.3)",
              color: "rgba(233,196,0,0.8)",
              backdropFilter: "blur(8px)",
              fontSize: 14,
            }}
          >
            ▲
          </button>
          <button
            aria-label="Cuộn xuống cuối"
            onClick={() => scrollTo("bottom")}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity active:scale-90"
            style={{
              background: "rgba(13,13,13,0.85)",
              border: "1px solid rgba(233,196,0,0.3)",
              color: "rgba(233,196,0,0.8)",
              backdropFilter: "blur(8px)",
              fontSize: 14,
            }}
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
}
