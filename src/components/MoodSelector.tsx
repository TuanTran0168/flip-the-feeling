"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mood } from "@/types";

// Fixed rotations — no Math.random() to avoid hydration mismatch
const DEAL_ROTATIONS = [10, -14, 13, -8, 15, -11, 9, -13];

// Each card starts at the center of the 4×2 grid, then deals outward.
// col spacing ≈ 228px, row spacing ≈ 168px (4-col max-w-4xl grid)
function dealOffset(i: number) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return {
    x: (1.5 - col) * 228,
    y: (0.5 - row) * 168,
  };
}

const variants = {
  hidden: (i: number) => {
    const { x, y } = dealOffset(i);
    return { opacity: 0, scale: 0.55, rotateZ: DEAL_ROTATIONS[i], x, y };
  },
  idle: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateZ: 0,
    x: 0,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 22,
      delay: i * 0.06,
    },
  }),
  selected: {
    opacity: 1,
    scale: 1.05,
    rotateZ: 0,
    x: 0,
    y: -12,
    transition: { type: "spring" as const, stiffness: 500, damping: 28 },
  },
  dimmed: {
    opacity: 0.25,
    scale: 0.96,
    rotateZ: 0,
    x: 0,
    y: 0,
    transition: { duration: 0.22 },
  },
};

// Separate component so each card owns its motion values (hooks in loops are not allowed)
interface CardProps {
  mood: Mood;
  index: number;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: () => void;
}

function MoodCard({ mood, index, isSelected, isDimmed, onSelect }: CardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-70, 70], [10, -10]), {
    stiffness: 400,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-70, 70], [-10, 10]), {
    stiffness: 400,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isSelected || isDimmed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const state = isSelected ? "selected" : isDimmed ? "dimmed" : "idle";

  return (
    <motion.button
      custom={index}
      variants={variants}
      initial="hidden"
      animate={state}
      whileTap={{ scale: 0.93 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      className="relative rounded-2xl p-5 text-left cursor-pointer overflow-hidden"
      style={{
        rotateX: isSelected || isDimmed ? 0 : rotateX,
        rotateY: isSelected || isDimmed ? 0 : rotateY,
        transformPerspective: 900,
        backgroundColor: isSelected ? mood.color : "#111118",
        border: `1px solid ${isSelected ? mood.color : "#1f2937"}`,
        boxShadow: isSelected
          ? `0 12px 40px ${mood.color}55, 0 0 0 1px ${mood.color}40, inset 0 1px 0 rgba(255,255,255,0.15)`
          : isDimmed
          ? "none"
          : "0 4px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Radial glow behind content when selected */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 30%, ${mood.color}60 0%, transparent 65%)`,
          }}
        />
      )}

      {/* Shimmer edge — top highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: isSelected
            ? `linear-gradient(90deg, transparent, ${mood.textColor}40, transparent)`
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
        }}
      />

      <div className="relative">
        <div className="text-3xl mb-3">{mood.emoji}</div>
        <div
          className="text-base font-semibold font-[family-name:var(--font-playfair)]"
          style={{ color: isSelected ? mood.textColor : "#e8e6f0" }}
        >
          {mood.label}
        </div>
        <div
          className="text-xs mt-1.5 font-[family-name:var(--font-inter)] leading-relaxed"
          style={{ color: isSelected ? `${mood.textColor}99` : "#6b7280" }}
        >
          {mood.description}
        </div>
      </div>
    </motion.button>
  );
}

interface Props {
  moods: Mood[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function MoodSelector({ moods, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {moods.map((mood, i) => (
        <MoodCard
          key={mood.id}
          mood={mood}
          index={i}
          isSelected={selectedId === mood.id}
          isDimmed={selectedId !== null && selectedId !== mood.id}
          onSelect={() => onSelect(mood.id)}
        />
      ))}
    </div>
  );
}
