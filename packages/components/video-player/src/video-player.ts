export interface VideoPlayerOptions {
  [key: string]: unknown;
}

export interface VideoPlayerSource {
  src: string;
  type?: string;
}

export interface VideoPlayerProps {
  sources?: VideoPlayerSource[];
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: "auto" | "metadata" | "none";
  width?: string | number;
  height?: string | number;
  options?: VideoPlayerOptions;
}

export interface VideoPlayerInstance {
  player: unknown;
  play: () => Promise<void> | void;
  pause: () => void;
  load: (sources?: VideoPlayerSource[]) => void;
}
