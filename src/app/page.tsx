"use client";

import { motion } from "framer-motion";
import CardFan from "@/components/CardFan";

export default function Home() {
  return (
    <main className="relative flex h-dvh flex-col overflow-hidden px-4 text-[#e8e6f0]">
      <section className="flex shrink-0 flex-col items-center px-2 pb-1 pt-5 text-center sm:pt-7 md:pt-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.36em] text-[#8c96ad] sm:text-xs"
        >
          Bùi Anh Tuấn x Your Feelings
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="mb-1 font-[family-name:var(--font-playfair)] text-[12px] italic tracking-[0.18em] text-[#6d7488] sm:text-sm"
        >
          Trần Đăng Tuấn
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-2 font-[family-name:var(--font-playfair)] text-[clamp(2.9rem,6.4vw,5.8rem)] font-semibold leading-[0.92] tracking-[0.01em] text-[#f1eef8]"
          style={{
            textShadow: "0 2px 18px rgba(8,10,22,0.9), 0 0 32px rgba(130,155,220,0.18)",
          }}
        >
          Flip the Feeling
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#aeb6c8] sm:text-[15px]"
        >
          Lật thẻ để khám phá bài hát cho cảm xúc của bạn
        </motion.p>
      </section>

      <section className="flex min-h-0 flex-1 items-center justify-center">
        <CardFan />
      </section>
    </main>
  );
}
