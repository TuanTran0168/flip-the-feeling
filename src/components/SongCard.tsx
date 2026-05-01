"use client";

import { useState } from "react";
import { Song } from "@/types";

interface Props {
  song: Song;
  moodColor: string;
  textColor: string;
}

export default function SongCard({ song, moodColor, textColor }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasThumbnail = song.youtubeId !== "TODO_YOUTUBE_ID";
  const thumbnailUrl = `https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${song.youtubeId}`;
  const hasNote = song.personalNote !== "TODO";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "#111118",
        border: `1px solid ${moodColor}30`,
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#1a1a24] overflow-hidden">
        {hasThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={song.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#374151] text-sm font-[family-name:var(--font-inter)]">
              Chưa có thumbnail
            </span>
          </div>
        )}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(to top, ${moodColor}, transparent)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold font-[family-name:var(--font-playfair)]">
              {song.title}
            </h3>
            <span className="text-xs text-[#6b7280] font-[family-name:var(--font-inter)]">
              {song.year}
            </span>
          </div>
          {hasThumbnail && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors font-[family-name:var(--font-inter)]"
              style={{
                backgroundColor: `${moodColor}30`,
                color: textColor,
                border: `1px solid ${moodColor}50`,
              }}
            >
              Nghe ▶
            </a>
          )}
        </div>

        {/* Lyric Quote */}
        <blockquote
          className="text-sm italic mb-4 pl-3 font-[family-name:var(--font-playfair)] leading-relaxed"
          style={{
            borderLeft: `2px solid ${moodColor}`,
            color: `${textColor}CC`,
          }}
        >
          &ldquo;{song.lyricQuote}&rdquo;
        </blockquote>

        {/* Personal Note */}
        {hasNote && (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors font-[family-name:var(--font-inter)]"
            >
              {isExpanded ? "Thu lại ↑" : "Tại sao bài này? ↓"}
            </button>
            {isExpanded && (
              <p className="mt-2 text-sm text-[#9ca3af] font-[family-name:var(--font-inter)] leading-relaxed">
                {song.personalNote}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
