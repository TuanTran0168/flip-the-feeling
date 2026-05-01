"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Dot: snappy
  const springDotX = useSpring(dotX, { stiffness: 700, damping: 32 });
  const springDotY = useSpring(dotY, { stiffness: 700, damping: 32 });

  // Ring: lagging behind
  const springRingX = useSpring(dotX, { stiffness: 110, damping: 18 });
  const springRingY = useSpring(dotY, { stiffness: 110, damping: 18 });

  const isHovered = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [role='button']")) {
        isHovered.current = true;
      }
    };

    const onLeave = () => {
      isHovered.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onEnter);
    window.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [dotX, dotY]);

  return (
    <>
      {/* Inner dot — sharp & fast */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
        style={{
          x: springDotX,
          y: springDotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 7,
          height: 7,
          backgroundColor: "rgba(255,255,255,0.95)",
          mixBlendMode: "difference",
        }}
      />

      {/* Outer ring — laggy, ethereal */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full"
        style={{
          x: springRingX,
          y: springRingY,
          translateX: "-50%",
          translateY: "-50%",
          width: 34,
          height: 34,
          border: "1px solid rgba(255,255,255,0.28)",
          backgroundColor: "rgba(255,255,255,0.03)",
          boxShadow: "0 0 8px rgba(255,255,255,0.08)",
        }}
      />
    </>
  );
}
