export interface Mood {
  id: string;
  label: string;
  emoji: string;
  color: string;
  textColor: string;
  description: string;
}

export interface Song {
  id: string;
  title: string;
  year: number;
  youtubeId: string;
  lyricQuote: string;
  moods: string[];
  personalNote: string;
}
