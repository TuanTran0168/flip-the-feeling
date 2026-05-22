"use client";

import { motion } from "framer-motion";

export type Tab = "oracle" | "player" | "archive";

interface NavBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: string; mobileIcon: string }[] = [
  { id: "oracle",  label: "Oracle",           icon: "✦", mobileIcon: "✦" },
  { id: "player",  label: "Celestial Player", icon: "▶", mobileIcon: "▶" },
  { id: "archive", label: "Archive",          icon: "◈", mobileIcon: "◈" },
];

function OrbitIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 18 18" fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", marginRight: 7, flexShrink: 0 }}
    >
      <circle cx="9" cy="9" r="2.6" fill="#e9c400" opacity="0.92" />
      <ellipse cx="9" cy="9" rx="7.8" ry="3.2" stroke="#e9c400" strokeWidth="0.9" strokeOpacity="0.55" fill="none" />
      <ellipse cx="9" cy="9" rx="7.8" ry="3.2" stroke="#e9c400" strokeWidth="0.6" strokeOpacity="0.22" fill="none"
        transform="rotate(58 9 9)" />
    </svg>
  );
}

export default function NavBar({ activeTab, onTabChange }: NavBarProps) {
  return (
    <>
      {/* ── Desktop Top Header ──────────────────────────────────────────────── */}
      <header
        className="hidden md:flex fixed top-0 w-full z-50 items-center justify-between px-16 py-3"
        style={{
          background: "rgba(19, 19, 19, 0.72)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(233, 196, 0, 0.15)",
          boxShadow: "0 0 20px rgba(233, 196, 0, 0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange("oracle")}
            className="flex items-center font-[family-name:var(--font-playfair)] tracking-[0.32em] uppercase select-none transition-all duration-300 hover:opacity-85"
            style={{ color: "var(--cosmic-gold)", fontSize: 16, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <OrbitIcon />
            TUANIVERSE
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {TABS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="relative font-[family-name:var(--font-inter)] tracking-wide transition-colors px-5 py-2 rounded-full"
                style={{
                  color: isActive ? "var(--cosmic-gold)" : "var(--cosmic-text-muted)",
                  fontSize: isActive ? 15 : 13,
                  fontWeight: isActive ? 600 : 400,
                  textShadow: isActive ? "0 0 18px rgba(233,196,0,0.7), 0 0 36px rgba(233,196,0,0.3)" : "none",
                  letterSpacing: isActive ? "0.04em" : "0.06em",
                  transition: "color 0.25s, font-size 0.25s, text-shadow 0.25s",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(233,196,0,0.07)",
                      border: "1px solid rgba(233,196,0,0.28)",
                      boxShadow: "0 0 18px rgba(233,196,0,0.1), inset 0 0 8px rgba(233,196,0,0.04)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="w-[140px]" />
      </header>

      {/* ── Mobile Bottom Nav ───────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-20 rounded-t-2xl"
        style={{
          background: "rgba(13, 13, 13, 0.90)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(233, 196, 0, 0.2)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
        }}
      >
        {TABS.map(({ id, label, mobileIcon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-xl transition-all active:scale-90"
              style={{ minWidth: 64 }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active-bg"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "rgba(233,196,0,0.07)",
                    border: "1px solid rgba(233,196,0,0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}

              <motion.span
                animate={{
                  scale: isActive ? 1.45 : 1,
                  filter: isActive
                    ? "drop-shadow(0 0 8px rgba(233,196,0,0.9)) drop-shadow(0 0 16px rgba(233,196,0,0.4))"
                    : "none",
                }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className="relative z-10 font-[family-name:var(--font-playfair)] text-xl leading-none"
                style={{ color: isActive ? "var(--cosmic-gold)" : "var(--cosmic-text-muted)" }}
              >
                {mobileIcon}
              </motion.span>

              <motion.span
                animate={{
                  color: isActive ? "var(--cosmic-gold)" : "var(--cosmic-text-muted)",
                  fontSize: isActive ? "11px" : "10px",
                  fontWeight: isActive ? 600 : 400,
                }}
                transition={{ duration: 0.2 }}
                className="relative z-10 font-[family-name:var(--font-inter)] tracking-wider uppercase"
              >
                {label.split(" ")[0]}
              </motion.span>

              {isActive && (
                <motion.div
                  layoutId="mobile-nav-dot"
                  className="relative z-10 w-1 h-1 rounded-full"
                  style={{ background: "var(--cosmic-gold)", boxShadow: "0 0 6px rgba(233,196,0,0.8)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
