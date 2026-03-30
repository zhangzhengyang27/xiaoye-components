import type { Howl } from "howler";

export interface AudioPlayerTrack {
  src: string | string[];
  title?: string;
  artist?: string;
  cover?: string;
}

export interface AudioPlayerProps {
  src?: string | string[];
  track?: AudioPlayerTrack;
  title?: string;
  artist?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playbackRates?: number[];
}

export interface AudioPlayerInstance {
  howl: Howl | null;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
  setVolume: (value: number) => void;
}
