"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { songs as allSongs } from "@/data/songs";
import { moods as allMoods } from "@/data/moods";
import { Mood, Song } from "@/types";

// ── Layout constants ────────────────────────────────────────────────────────

const CARD_W = 148;
const CARD_H = 216;
const CARD_SPACING = 76;   // horizontal px between card centers
const VISIBLE_HALF = 4;    // visible on each side of center
const TOTAL = allSongs.length;

// ── Types ───────────────────────────────────────────────────────────────────

type CardData = { song: Song; mood: Mood };
type ShuffleType = 0 | 1 | 2 | 3;
const SHUFFLE_COUNT = 4;

// ── Deck helpers ────────────────────────────────────────────────────────────

function buildDeck(): CardData[] {
  return [...allSongs]
    .sort(() => Math.random() - 0.5)
    .map((song) => ({
      song,
      mood: allMoods.find((m) => m.id === song.moods[0]) ?? allMoods[0],
    }));
}

// ── Arc position (fan layout) ───────────────────────────────────────────────

function getArcPos(relPos: number) {
  return {
    x: relPos * CARD_SPACING,
    y: -(relPos * relPos * 2.6),   // parabolic curve — sides rise slightly
    rotate: relPos * 5,
    scale: Math.max(0.62, 1 - Math.abs(relPos) * 0.065),
    opacity:
      Math.abs(relPos) > VISIBLE_HALF + 0.5
        ? 0
        : Math.max(0.08, 1 - Math.abs(relPos) * 0.22),
    zIndex: 20 - Math.round(Math.abs(relPos)),
  };
}

// ── Deterministic pseudo-random (Knuth multiplicative hash) ─────────────────
const prand = (n: number) => ((Math.abs(n) * 2654435761 + 1) >>> 0) / 4294967296;

// ── Shuffle exit positions ──────────────────────────────────────────────────

function getShuffleExit(idx: number, type: ShuffleType) {
  switch (type) {
    case 0: // Vortex — cards spiral inward with explosive spin
      return { x: 0, y: 0, scale: 0, opacity: 0, rotate: 900 + idx * 40 };
    case 1: { // Storm — each card flies off in its own chaotic direction
      const a = prand(idx) * Math.PI * 2;
      const r = 950 + prand(idx + 17) * 500;
      return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.52, scale: 0, opacity: 0, rotate: (prand(idx + 3) - 0.5) * 1080 };
    }
    case 2: { // Cascade — waterfall: cards tumble down with heavy spread
      const xSpread = (idx - TOTAL / 2) * 30 + (prand(idx + 7) - 0.5) * 140;
      return { y: 820 + prand(idx) * 280, x: xSpread, scale: 0.25, opacity: 0, rotate: (idx - TOTAL / 2) * 16 + (prand(idx + 11) - 0.5) * 70 };
    }
    case 3: { // Orbit — expand to giant ring, dissolve
      const oa = (idx / TOTAL) * Math.PI * 2;
      return { x: Math.cos(oa) * 580, y: Math.sin(oa) * 350, scale: 0, opacity: 0, rotate: oa * 180 / Math.PI + 540 };
    }
  }
}

function getExitTransition(idx: number, type: ShuffleType) {
  const delay = (() => {
    switch (type) {
      case 0: return Math.abs(idx - TOTAL / 2) * 0.016 + prand(idx) * 0.04;
      case 1: return prand(idx * 3 + 1) * 0.26;   // fully random delays — true storm chaos
      case 2: return idx * 0.016 + prand(idx + 5) * 0.05;
      case 3: return prand(idx * 2 + 7) * 0.16;
    }
  })();
  return { duration: 0.40, ease: "easeIn" as const, delay };
}

// ── Shuffle entrance (initial positions after remount) ──────────────────────

function getEnterInitial(idx: number, type: ShuffleType) {
  switch (type) {
    case 0: // Vortex — burst outward from centre
      return { x: 0, y: 0, scale: 0, opacity: 0, rotate: -(900 + idx * 40) };
    case 1: { // Storm — arrive from same random far positions
      const a = prand(idx) * Math.PI * 2;
      const r = 950 + prand(idx + 17) * 500;
      return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.52, scale: 0, opacity: 0, rotate: (prand(idx + 3) - 0.5) * 1080 };
    }
    case 2: { // Cascade — rain from above
      const xSpread = (idx - TOTAL / 2) * 30 + (prand(idx + 7) - 0.5) * 140;
      return { y: -(820 + prand(idx) * 280), x: xSpread, scale: 0.25, opacity: 0, rotate: (idx - TOTAL / 2) * 16 };
    }
    case 3: { // Orbit — emerge from ring
      const oa = (idx / TOTAL) * Math.PI * 2;
      return { x: Math.cos(oa) * 580, y: Math.sin(oa) * 350, scale: 0, opacity: 0, rotate: oa * 180 / Math.PI };
    }
  }
}

function getEnterTransition(idx: number, type: ShuffleType) {
  const delay = (() => {
    switch (type) {
      case 0: return (TOTAL - 1 - Math.abs(idx - TOTAL / 2)) * 0.022 + prand(idx) * 0.04;
      case 1: return prand(idx * 7 + 11) * 0.22; // random arrival order
      case 2: return Math.abs(idx - TOTAL / 2) * 0.030 + prand(idx + 9) * 0.04;
      case 3: return prand(idx * 5 + 3) * 0.16 + prand(idx) * 0.04;
    }
  })();
  return { type: "spring" as const, stiffness: 200, damping: 24, delay };
}

// ── Card Back ───────────────────────────────────────────────────────────────

function CardBack() {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[14px] tarot-pattern"
      style={{
        backfaceVisibility: "hidden",
        background: "linear-gradient(160deg, rgba(22,14,42,0.99) 0%, rgba(12,8,24,1) 50%, rgba(20,12,36,0.99) 100%)",
        border: "1px solid rgba(233, 196, 0, 0.28)",
      }}
    >
      <div className="absolute inset-[5px] rounded-[10px]" style={{ border: "1px solid rgba(233,196,0,0.14)" }} />
      <div className="absolute inset-[10px] rounded-[8px]" style={{ border: "1px solid rgba(233,196,0,0.07)" }} />
      {["top-2.5 left-2.5", "top-2.5 right-2.5", "bottom-2.5 left-2.5", "bottom-2.5 right-2.5"].map((pos) => (
        <div key={pos} className={`absolute ${pos}`} style={{ color: "rgba(233,196,0,0.28)", fontSize: 8, lineHeight: 1 }}>
          ✦
        </div>
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="font-[family-name:var(--font-playfair)]" style={{ fontSize: 32, color: "rgba(233,196,0,0.2)", lineHeight: 1 }}>
          ✦
        </span>
        <span className="font-[family-name:var(--font-inter)]" style={{ fontSize: 9, letterSpacing: "0.32em", color: "rgba(233,196,0,0.16)" }}>
          FTF
        </span>
        <span className="rotate-180" style={{ fontSize: 32, color: "rgba(233,196,0,0.2)", lineHeight: 1 }}>
          ✦
        </span>
      </div>
    </div>
  );
}

// ── Card Front ──────────────────────────────────────────────────────────────

function CardFront({ mood, song, onPlay }: { mood: Mood; song: Song | null; onPlay?: () => void }) {
  const hasLink = !!song;

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden rounded-[14px]"
      style={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        background: "linear-gradient(160deg, rgba(79,61,114,0.48) 0%, #0e0e0e 58%)",
        border: "1px solid rgba(233, 196, 0, 0.5)",
        boxShadow: "inset 0 0 36px rgba(79,61,114,0.22)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(233,196,0,0.55), transparent)" }} />
      <div className="absolute top-2 left-2 w-3.5 h-3.5" style={{ borderTop: "1px solid rgba(233,196,0,0.4)", borderLeft: "1px solid rgba(233,196,0,0.4)" }} />
      <div className="absolute top-2 right-2 w-3.5 h-3.5" style={{ borderTop: "1px solid rgba(233,196,0,0.4)", borderRight: "1px solid rgba(233,196,0,0.4)" }} />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5" style={{ borderBottom: "1px solid rgba(233,196,0,0.4)", borderLeft: "1px solid rgba(233,196,0,0.4)" }} />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5" style={{ borderBottom: "1px solid rgba(233,196,0,0.4)", borderRight: "1px solid rgba(233,196,0,0.4)" }} />

      <div className="flex items-center gap-2 px-4 pt-5 pb-2">
        <span style={{ fontSize: 20, lineHeight: 1 }}>{mood.emoji}</span>
        <span className="font-[family-name:var(--font-playfair)] text-xs font-semibold" style={{ color: "rgba(233,196,0,0.9)" }}>
          {mood.label}
        </span>
      </div>

      <div className="mx-4 h-px" style={{ background: "linear-gradient(90deg, rgba(233,196,0,0.32), transparent)" }} />

      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        {song ? (
          <>
            <p className="font-[family-name:var(--font-playfair)] text-sm font-semibold leading-snug" style={{ color: "var(--cosmic-text)" }}>
              {song.title}
            </p>
            <p className="font-[family-name:var(--font-playfair)] text-[10px] italic leading-relaxed line-clamp-3" style={{ color: "rgba(198,198,202,0.72)" }}>
              &ldquo;{song.lyricQuote}&rdquo;
            </p>
            <div className="mt-auto pt-1">
              {hasLink ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onPlay?.(); }}
                  className="btn-orbital inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-[family-name:var(--font-inter)] text-[10px] font-semibold tracking-wide"
                  style={{ color: "var(--cosmic-gold)", border: "1px solid rgba(233,196,0,0.45)", background: "rgba(0,0,0,0.5)" }}
                >
                  ▶&nbsp;Nghe ngay
                </button>
              ) : (
                <span className="text-[9px] font-[family-name:var(--font-inter)]" style={{ color: "rgba(143,145,149,0.5)" }}>
                  chưa có link nhạc
                </span>
              )}
            </div>
          </>
        ) : (
          <span className="text-[9px] font-[family-name:var(--font-inter)]" style={{ color: "rgba(143,145,149,0.5)" }}>
            Chưa có bài hát
          </span>
        )}
      </div>
    </div>
  );
}

// ── CardFan ─────────────────────────────────────────────────────────────────

interface CardFanProps {
  onSongReveal: (song: Song, mood: Mood) => void;
}

export default function CardFan({ onSongReveal }: CardFanProps) {
  const [deck, setDeck] = useState<CardData[]>(() => buildDeck());
  const [deckKey, setDeckKey] = useState(0);
  const [shuffleType, setShuffleType] = useState<ShuffleType>(0);
  const [shuffling, setShuffling] = useState(false);
  const [arcOffset, setArcOffset] = useState(7.0);   // float — centre card index
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [showFront, setShowFront] = useState(false);
  const [ready, setReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startArc: number; dragging: boolean } | null>(null);
  const arcRef = useRef(7.0);

  // Mark ready after entrance animations settle
  useEffect(() => {
    setReady(false);
    const maxDelay =
      deckKey === 0
        ? TOTAL * 0.055 + 900
        : Math.max(...Array.from({ length: TOTAL }, (_, i) => getEnterTransition(i, shuffleType).delay ?? 0)) * 1000 + 900;
    const t = setTimeout(() => setReady(true), maxDelay);
    return () => clearTimeout(t);
  }, [deckKey, shuffleType]);

  // ── Interaction handlers ─────────────────────────────────────────────────

  const handleCardClick = useCallback(
    (index: number) => {
      if (!ready || shuffling || selectedIndex !== null) return;
      setArcOffset(index);
      arcRef.current = index;
      setSelectedIndex(index);
      setTimeout(() => setFlipped(true), 260);
      // Remove CardBack from DOM after flip animation completes (0.92s)
      setTimeout(() => setShowFront(true), 260 + 950);
    },
    [ready, shuffling, selectedIndex]
  );

  const handleShuffle = useCallback(() => {
    if (shuffling) return;
    const type = (Math.floor(Math.random() * SHUFFLE_COUNT) as ShuffleType);
    setShuffleType(type);
    setShuffling(true);
    setSelectedIndex(null);
    setFlipped(false);
    setShowFront(false);

    setTimeout(() => {
      setDeck(buildDeck());
      setDeckKey((k) => k + 1);
      setArcOffset(7);
      arcRef.current = 7;
      setShuffling(false);
    }, 560);
  }, [shuffling]);

  const handleReset = useCallback(() => {
    setSelectedIndex(null);
    setFlipped(false);
    setShowFront(false);
  }, []);

  // Drag — pointer down
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (selectedIndex !== null || shuffling) return;
      dragRef.current = { startX: e.clientX, startArc: arcRef.current, dragging: false };
    },
    [selectedIndex, shuffling]
  );

  // Drag — pointer move (threshold 6px before drag activates)
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (!dragRef.current.dragging && Math.abs(dx) < 6) return;
    dragRef.current.dragging = true;
    const newOffset = Math.max(0, Math.min(TOTAL - 1, dragRef.current.startArc - dx / CARD_SPACING));
    arcRef.current = newOffset;
    setArcOffset(newOffset);
  }, []);

  // Drag — pointer up: snap to nearest card
  const handlePointerUp = useCallback(() => {
    if (!dragRef.current) return;
    const wasDragging = dragRef.current.dragging;
    dragRef.current = null;
    if (wasDragging) {
      const snapped = Math.round(arcRef.current);
      arcRef.current = snapped;
      setArcOffset(snapped);
    }
  }, []);

  // Mouse wheel
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (selectedIndex !== null || shuffling) return;
      e.preventDefault();
      const newVal = Math.max(0, Math.min(TOTAL - 1, arcRef.current + e.deltaY * 0.009));
      arcRef.current = newVal;
      setArcOffset(newVal);
    },
    [selectedIndex, shuffling]
  );

  // Snap wheel on idle
  useEffect(() => {
    if (selectedIndex !== null || shuffling) return;
    const t = setTimeout(() => {
      const snapped = Math.round(arcRef.current);
      arcRef.current = snapped;
      setArcOffset(snapped);
    }, 260);
    return () => clearTimeout(t);
  }, [arcOffset, selectedIndex, shuffling]);

  // ── Hint text ────────────────────────────────────────────────────────────

  const hint = shuffling
    ? "Đang xáo bài..."
    : !ready
    ? "Đang triệu hồi vận mệnh..."
    : selectedIndex === null
    ? `Chọn lá bài · cuộn hoặc kéo để xem (${TOTAL} lá)`
    : showFront
    ? "Định mệnh đã hiện ra"
    : "Lật bài...";

  const canInteract = ready && !shuffling && selectedIndex === null;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex w-full flex-col items-center gap-4">

      {/* Card area */}
      <div
        ref={containerRef}
        className="relative touch-none"
        style={{
          width: "min(880px, 100vw - 16px)",
          height: "min(380px, calc(100dvh - 280px))",
          minHeight: 300,
          cursor: canInteract ? "grab" : "default",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        {deck.map((card, index) => {
          const relPos = index - arcOffset;
          const arcPos = getArcPos(relPos);
          const isSelected = selectedIndex === index;
          const isOther = selectedIndex !== null && !isSelected;
          const isHidden = Math.abs(relPos) > VISIBLE_HALF + 0.5;

          // Animate target
          const animateTarget = (() => {
            if (shuffling) return getShuffleExit(index, shuffleType);
            if (isSelected) return { x: 0, y: -82, rotate: 0, scale: 1.12, opacity: 1, zIndex: 30 };
            if (isOther) return { ...arcPos, opacity: arcPos.opacity * 0.22, scale: arcPos.scale * 0.88 };
            return arcPos;
          })();

          // Transition
          const transition = (() => {
            if (shuffling) return getExitTransition(index, shuffleType);
            if (isSelected) return { type: "spring" as const, stiffness: 185, damping: 22, mass: 0.9 };
            if (!ready) {
              if (deckKey === 0) {
                return { type: "spring" as const, stiffness: 170, damping: 22, delay: Math.abs(index - 7) * 0.055 };
              }
              return getEnterTransition(index, shuffleType);
            }
            return { type: "spring" as const, stiffness: 360, damping: 30 };
          })();

          // Initial position (on mount / remount after shuffle)
          const initial = (() => {
            if (deckKey === 0) {
              return { x: arcPos.x, y: arcPos.y + 100, scale: arcPos.scale * 0.6, opacity: 0, rotate: arcPos.rotate };
            }
            return getEnterInitial(index, shuffleType);
          })();

          return (
            <motion.div
              key={`${deckKey}-${index}`}
              className="absolute touch-none"
              style={{
                width: CARD_W,
                height: CARD_H,
                left: "50%",
                top: "50%",
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H / 2,
                zIndex: isSelected ? 30 : arcPos.zIndex,
                perspective: 1200,
                pointerEvents: isHidden && !isSelected ? "none" : "auto",
                cursor: canInteract && !isHidden ? "pointer" : "default",
              }}
              initial={initial}
              animate={animateTarget}
              transition={transition}
              whileHover={
                canInteract && !isHidden && Math.abs(relPos) <= VISIBLE_HALF
                  ? { y: arcPos.y - 20, scale: arcPos.scale * 1.07, transition: { duration: 0.14 } }
                  : {}
              }
              onClick={() => handleCardClick(index)}
            >
              {/* Gold glow when flipped */}
              {/* Gold glow when front revealed */}
              {isSelected && showFront && (
                <div
                  className="absolute inset-0 rounded-[14px] pointer-events-none"
                  style={{ boxShadow: "0 0 52px rgba(233,196,0,0.2), 0 0 100px rgba(233,196,0,0.09)" }}
                />
              )}

              {/* 3D flip wrapper */}
              <motion.div
                animate={{
                  rotateY: isSelected && flipped ? 180 : 0,
                  scale: isSelected && flipped ? [1, 1.22, 1.04] : 1,
                }}
                transition={{
                  rotateY: { duration: 0.92, ease: [0.18, 0.65, 0.32, 1] },
                  scale: { duration: 0.92, times: [0, 0.42, 1], ease: "easeOut" },
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  borderRadius: 14,
                  boxShadow: isSelected
                    ? "0 0 60px rgba(233,196,0,0.22), 0 0 120px rgba(233,196,0,0.08), 0 24px 64px rgba(0,0,0,0.82)"
                    : "0 8px 28px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.45)",
                }}
              >
                {/* During flip: both faces exist with backfaceVisibility.
                    After flip completes: CardBack removed from DOM to prevent bleed-through */}
                {!(isSelected && showFront) && <CardBack />}
                {isSelected && (
                  <CardFront
                    mood={card.mood}
                    song={card.song}
                    onPlay={card.song ? () => onSongReveal(card.song, card.mood) : undefined}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Scroll hint arrows (only when no card selected) */}
        {canInteract && (
          <>
            {arcOffset > 0.5 && (
              <button
                aria-label="Lá bài trước"
                className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full transition-opacity opacity-40 hover:opacity-90"
                style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(233,196,0,0.25)", color: "rgba(233,196,0,0.9)", fontSize: 12 }}
                onClick={(e) => { e.stopPropagation(); const t = Math.max(0, Math.round(arcOffset) - 1); arcRef.current = t; setArcOffset(t); }}
              >
                ‹
              </button>
            )}
            {arcOffset < TOTAL - 1.5 && (
              <button
                aria-label="Lá bài tiếp theo"
                className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full transition-opacity opacity-40 hover:opacity-90"
                style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(233,196,0,0.25)", color: "rgba(233,196,0,0.9)", fontSize: 12 }}
                onClick={(e) => { e.stopPropagation(); const t = Math.min(TOTAL - 1, Math.round(arcOffset) + 1); arcRef.current = t; setArcOffset(t); }}
              >
                ›
              </button>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex w-full max-w-[400px] flex-col items-center gap-3">
        <p
          className="min-h-5 text-center font-[family-name:var(--font-inter)] text-xs tracking-wide"
          style={{ color: "var(--cosmic-text-muted)" }}
        >
          {hint}
        </p>

        <div className="flex w-full gap-3">
          {selectedIndex !== null && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleReset}
              className="btn-orbital flex h-12 flex-1 touch-manipulation items-center justify-center gap-2 rounded-2xl px-4 font-[family-name:var(--font-inter)] text-sm tracking-wide"
              style={{ color: "var(--cosmic-text-muted)" }}
            >
              ← Chọn lại
            </motion.button>
          )}

          <motion.button
            onClick={handleShuffle}
            disabled={shuffling}
            whileHover={!shuffling ? { scale: 1.03 } : {}}
            whileTap={!shuffling ? { scale: 0.97 } : {}}
            className="btn-orbital relative flex h-12 flex-1 touch-manipulation items-center justify-center gap-3 overflow-hidden rounded-2xl px-6 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-wide"
            style={{
              background: "linear-gradient(135deg, rgba(13,12,13,0.96), rgba(30,25,40,0.96))",
              color: shuffling ? "rgba(143,145,149,0.5)" : "var(--cosmic-text)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg, transparent, rgba(233,196,0,0.06), transparent)" }}
            />
            <motion.span
              animate={{ rotate: shuffling ? 360 : 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="relative grid size-8 place-items-center rounded-full font-[family-name:var(--font-playfair)] text-base"
              style={{
                border: "1px solid rgba(233,196,0,0.4)",
                background: "rgba(233,196,0,0.06)",
                color: "var(--cosmic-gold)",
              }}
            >
              ♠
            </motion.span>
            <span className="relative">Xáo bài</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
