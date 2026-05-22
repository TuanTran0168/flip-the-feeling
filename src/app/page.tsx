"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NavBar, { Tab } from "@/components/NavBar";
import OracleTab from "@/components/tabs/OracleTab";
import PlayerTab from "@/components/tabs/PlayerTab";
import ArchiveTab from "@/components/tabs/ArchiveTab";
import { Song, Mood } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("oracle");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);

  const handleSongReveal = (song: Song, mood: Mood) => {
    setCurrentSong(song);
    setCurrentMood(mood);
    setActiveTab("player");
  };

  const handlePlayFromArchive = (song: Song, mood: Mood) => {
    setCurrentSong(song);
    setCurrentMood(mood);
    setActiveTab("player");
  };

  return (
    <main className="relative h-dvh overflow-hidden">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence mode="wait">
        {activeTab === "oracle" && (
          <motion.div
            key="oracle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <OracleTab onSongReveal={handleSongReveal} />
          </motion.div>
        )}

        {activeTab === "player" && (
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <PlayerTab
              song={currentSong}
              mood={currentMood}
              onNewCard={() => setActiveTab("oracle")}
              onArchive={() => setActiveTab("archive")}
            />
          </motion.div>
        )}

        {activeTab === "archive" && (
          <motion.div
            key="archive"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <ArchiveTab
              onPlaySong={handlePlayFromArchive}
              onNewCard={() => setActiveTab("oracle")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
