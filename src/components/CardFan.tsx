"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { moods as allMoods } from "@/data/moods";
import { songs } from "@/data/songs";
import { Mood, Song } from "@/types";

const CARD_W = 136;
const CARD_H = 190;
const DECK_SIZE = Math.max(songs.length, 3);

const FAN = [
  { x: -64, y: 12, rotate: -16 },
  { x: 0, y: -18, rotate: 0 },
  { x: 64, y: 12, rotate: 16 },
] as const;

type Phase = "hidden" | "deck" | "spread" | "fan" | "scatter";
type Pose = { x: number; y: number; rotate: number; scale?: number; opacity?: number };
type SelectedCard = { deckIndex: number; mood: Mood };

function pickMoods(count = 3) {
  return [...allMoods].sort(() => Math.random() - 0.5).slice(0, count);
}

function pickSong(moodId: string): Song | null {
  const pool = songs.filter((song) => song.moods.includes(moodId));
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

function pickSelectedCards(): SelectedCard[] {
  const topCards = Array.from({ length: DECK_SIZE }, (_, index) => index)
    .slice(-3)
    .sort(() => Math.random() - 0.5);

  return pickMoods().map((mood, slot) => ({ deckIndex: topCards[slot], mood }));
}

function deckPose(index: number): Pose {
  const fromTop = DECK_SIZE - index - 1;
  const drift = index - (DECK_SIZE - 1) / 2;
  return {
    x: drift * 0.85,
    y: fromTop * -1,
    rotate: ((index % 5) - 2) * 0.8,
    scale: 0.96,
    opacity: 1,
  };
}

function spreadPose(index: number): Pose {
  const center = (DECK_SIZE - 1) / 2;
  const progress = center ? (index - center) / center : 0;
  return {
    x: progress * 158,
    y: 18 + Math.abs(progress) * 22 - Math.cos(progress * Math.PI) * 12,
    rotate: progress * 29,
    scale: 0.84,
    opacity: 1,
  };
}

function restPose(index: number): Pose {
  const pileIndex = index % Math.max(DECK_SIZE - 3, 1);
  return {
    x: (pileIndex - 3) * 0.8,
    y: 118 - pileIndex * 0.8,
    rotate: ((index % 7) - 3) * 0.7,
    scale: 0.64,
    opacity: 0.42,
  };
}

function scatterPose(index: number): Pose {
  const side = index % 2 === 0 ? -1 : 1;
  const arc = (index / Math.max(DECK_SIZE - 1, 1)) * Math.PI;
  return {
    x: side * (84 + (index % 5) * 24),
    y: -20 + Math.sin(arc) * 86 + ((index % 3) - 1) * 22,
    rotate: side * (44 + (index % 4) * 19),
    scale: 0.78,
    opacity: 0.82,
  };
}

function CardBack({ muted = false }: { muted?: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-xl"
      style={{
        backfaceVisibility: "hidden",
        backgroundColor: "#9f1d2d",
        backgroundImage: [
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0 2px, transparent 2.6px)",
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0 1px, transparent 1px 12px)",
          "repeating-linear-gradient(-45deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 12px)",
        ].join(","),
        backgroundSize: "18px 18px, auto, auto",
      }}
    >
      <div className="absolute inset-[5px] rounded-[9px] border border-white/55" />
      <div className="absolute inset-[10px] rounded-[7px] border border-white/25" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
        <span className={`${muted ? "text-lg" : "text-2xl"} leading-none text-white/30`}>*</span>
        <span className="font-[family-name:var(--font-inter)] text-[8px] tracking-[0.3em] text-white/25">
          FTF
        </span>
        <span className={`${muted ? "text-lg" : "text-2xl"} rotate-180 leading-none text-white/30`}>
          *
        </span>
      </div>
    </div>
  );
}

function CardFront({ mood, song }: { mood: Mood; song: Song | null }) {
  const ytUrl =
    song && song.youtubeId !== "TODO_YOUTUBE_ID"
      ? `https://www.youtube.com/watch?v=${song.youtubeId}`
      : null;

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden rounded-xl"
      style={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        backgroundColor: "#fafaf5",
        border: "1px solid rgba(0,0,0,0.12)",
      }}
    >
      <div className="absolute left-2 top-2 text-[13px] leading-none">{mood.emoji}</div>
      <div className="absolute bottom-2 right-2 rotate-180 text-[13px] leading-none">{mood.emoji}</div>

      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-3 pb-2 pt-5 text-center">
        <span className="text-[2.55rem] leading-none drop-shadow-sm">{mood.emoji}</span>
        <span
          className="font-[family-name:var(--font-playfair)] text-[12px] font-bold leading-tight"
          style={{ color: mood.color }}
        >
          {mood.label}
        </span>
        <div className="mt-0.5 flex gap-1.5">
          {[0, 1, 2].map((n) => (
            <span key={n} className="text-[9px] leading-none opacity-40" style={{ color: mood.color }}>
              ♦
            </span>
          ))}
        </div>
      </div>

      <div
        className="px-2.5 pb-2.5 pt-2"
        style={{ borderTop: `1px solid ${mood.color}25`, backgroundColor: `${mood.color}08` }}
      >
        {song ? (
          <>
            <p className="mb-1 font-[family-name:var(--font-playfair)] text-[10px] font-bold leading-tight" style={{ color: mood.color }}>
              {song.title}
            </p>
            <p className="mb-1 line-clamp-2 font-[family-name:var(--font-playfair)] text-[8px] italic leading-relaxed" style={{ color: `${mood.color}99` }}>
              &ldquo;{song.lyricQuote}&rdquo;
            </p>
            {ytUrl ? (
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="inline-block rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[8px]"
                style={{ backgroundColor: `${mood.color}18`, color: mood.color, border: `1px solid ${mood.color}40` }}
              >
                Play
              </a>
            ) : (
              <span className="font-[family-name:var(--font-inter)] text-[8px]" style={{ color: `${mood.color}55` }}>
                No link yet
              </span>
            )}
          </>
        ) : (
          <span className="font-[family-name:var(--font-inter)] text-[9px]" style={{ color: `${mood.color}60` }}>
            No song yet
          </span>
        )}
      </div>
    </div>
  );
}

function DeckCard({
  index,
  pose,
  isSelected,
  slot,
  phase,
  mood,
  song,
  isFlipped,
  onClick,
}: {
  index: number;
  pose: Pose;
  isSelected: boolean;
  slot: number;
  phase: Phase;
  mood?: Mood;
  song: Song | null;
  isFlipped: boolean;
  onClick: () => void;
}) {
  const canClick = phase === "fan" && isSelected && !isFlipped;
  const delay =
    phase === "deck"
      ? index * 0.022
      : phase === "spread"
        ? index * 0.028
        : phase === "fan"
          ? isSelected
            ? slot * 0.07
            : index * 0.01
          : 0;

  return (
    <motion.div
      className="absolute touch-none"
      style={{
        width: CARD_W,
        height: CARD_H,
        zIndex: isSelected ? 40 + slot : index,
        perspective: 1100,
        cursor: canClick ? "pointer" : "default",
      }}
      initial={{ x: 0, y: 24, rotate: 0, scale: 0.45, opacity: 0 }}
      animate={{
        x: pose.x,
        y: pose.y,
        rotate: pose.rotate,
        scale: pose.scale ?? 1,
        opacity: phase === "hidden" ? 0 : (pose.opacity ?? 1),
      }}
      transition={{ type: "spring", stiffness: phase === "scatter" ? 470 : 230, damping: phase === "scatter" ? 31 : 24, mass: 0.9, delay }}
      whileHover={canClick ? { y: pose.y - 16, transition: { duration: 0.16 } } : {}}
      whileTap={canClick ? { scale: (pose.scale ?? 1) * 0.97 } : {}}
      onClick={canClick ? onClick : undefined}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          borderRadius: 12,
          boxShadow: isFlipped
            ? "0 18px 56px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 9px 28px rgba(0,0,0,0.62), 0 2px 7px rgba(0,0,0,0.5)",
        }}
      >
        <CardBack muted={!isSelected} />
        {isSelected && mood ? <CardFront mood={mood} song={song} /> : null}
      </motion.div>
    </motion.div>
  );
}

export default function CardFan() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>(() =>
    allMoods.slice(0, 3).map((mood, slot) => ({ deckIndex: DECK_SIZE - 3 + slot, mood }))
  );
  const [cardSongs, setCardSongs] = useState<(Song | null)[]>([null, null, null]);
  const [flipped, setFlipped] = useState([false, false, false]);
  const [scatterPoses, setScatterPoses] = useState<Pose[]>(
    Array.from({ length: DECK_SIZE }, (_, index) => scatterPose(index))
  );
  const [locked, setLocked] = useState(true);

  const selectedByDeckIndex = useMemo(() => {
    const map = new Map<number, number>();
    selectedCards.forEach((card, slot) => map.set(card.deckIndex, slot));
    return map;
  }, [selectedCards]);

  const runDealSequence = useCallback((nextCards?: SelectedCard[]) => {
    if (nextCards) setSelectedCards(nextCards);
    setCardSongs([null, null, null]);
    setFlipped([false, false, false]);
    setPhase("deck");

    const spreadTimer = window.setTimeout(() => setPhase("spread"), 560);
    const fanTimer = window.setTimeout(() => {
      setPhase("fan");
      setLocked(false);
    }, 1160);

    return () => {
      window.clearTimeout(spreadTimer);
      window.clearTimeout(fanTimer);
    };
  }, []);

  useEffect(() => {
    setSelectedCards(pickSelectedCards());
    const startTimer = window.setTimeout(() => runDealSequence(), 160);
    return () => window.clearTimeout(startTimer);
  }, [runDealSequence]);

  const getPose = useCallback(
    (index: number): Pose => {
      const slot = selectedByDeckIndex.get(index);
      if (phase === "hidden") return { x: 0, y: 24, rotate: 0, scale: 0.45, opacity: 0 };
      if (phase === "deck") return deckPose(index);
      if (phase === "spread") return spreadPose(index);
      if (phase === "scatter") return scatterPoses[index];
      if (slot !== undefined) return { ...FAN[slot], scale: 1, opacity: 1 };
      return restPose(index);
    },
    [phase, scatterPoses, selectedByDeckIndex]
  );

  const handleFlip = useCallback(
    (slot: number) => {
      if (phase !== "fan" || flipped[slot] || locked) return;

      setCardSongs((previous) => {
        const next = [...previous];
        next[slot] = pickSong(selectedCards[slot].mood.id);
        return next;
      });
      setFlipped((previous) => {
        const next = [...previous];
        next[slot] = true;
        return next;
      });
    },
    [flipped, locked, phase, selectedCards]
  );

  const handleShuffle = useCallback(() => {
    if (locked) return;
    setLocked(true);
    setScatterPoses(Array.from({ length: DECK_SIZE }, (_, index) => scatterPose(index)));
    setPhase("scatter");
    window.setTimeout(() => runDealSequence(pickSelectedCards()), 360);
  }, [locked, runDealSequence]);

  const allFlipped = flipped.every(Boolean);
  const hint =
    phase === "deck"
      ? `Đang gom ${DECK_SIZE} lá bài...`
      : phase === "spread"
        ? "Đang trải bản đồ cảm xúc..."
        : phase !== "fan"
          ? "Đang xáo bài..."
          : allFlipped
            ? "Đã lật hết - xáo lại để chơi tiếp"
            : "Bấm vào 1 lá để lật";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div
        className="relative flex touch-none items-center justify-center"
        style={{ width: "min(500px, 100vw - 24px)", height: "min(350px, calc(100dvh - 250px))", minHeight: 300 }}
      >
        {Array.from({ length: DECK_SIZE }, (_, index) => {
          const slot = selectedByDeckIndex.get(index);
          const isSelected = slot !== undefined;

          return (
            <DeckCard
              key={index}
              index={index}
              pose={getPose(index)}
              isSelected={isSelected}
              slot={slot ?? 0}
              phase={phase}
              mood={isSelected ? selectedCards[slot].mood : undefined}
              song={isSelected ? cardSongs[slot] : null}
              isFlipped={isSelected ? flipped[slot] : false}
              onClick={() => {
                if (slot !== undefined) handleFlip(slot);
              }}
            />
          );
        })}
      </div>

      <div className="flex w-full max-w-[360px] flex-col items-center gap-3">
        <p className="min-h-5 text-center font-[family-name:var(--font-inter)] text-xs tracking-wide text-[#8b95aa] sm:text-sm">
          {hint}
        </p>
        <motion.button
          onClick={handleShuffle}
          disabled={locked}
          whileHover={!locked ? { scale: 1.035 } : {}}
          whileTap={!locked ? { scale: 0.965 } : {}}
          className="group relative flex h-12 w-full touch-manipulation items-center justify-center gap-3 overflow-hidden rounded-2xl px-6 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-wide"
          style={{
            background:
              "linear-gradient(135deg, rgba(19,27,48,0.96), rgba(10,12,22,0.94) 55%, rgba(37,25,45,0.96))",
            border: "1px solid rgba(142,184,255,0.38)",
            color: locked ? "#59657b" : "#e9f1ff",
            boxShadow:
              "0 12px 34px rgba(0,0,0,0.44), 0 0 26px rgba(96,139,255,0.16), inset 0 1px 0 rgba(255,255,255,0.12)",
            cursor: locked ? "not-allowed" : "pointer",
          }}
        >
          <span
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
          />
          <motion.span
            animate={{ rotate: locked ? 180 : 0 }}
            transition={{ duration: 0.45 }}
            className="relative grid size-8 place-items-center rounded-full border border-[#8eb8ff55] bg-[#8eb8ff14] text-base"
          >
            ♠
          </motion.span>
          <span className="relative">Xáo bài</span>
        </motion.button>
      </div>
    </div>
  );
}
