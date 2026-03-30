import AudioPlayer from "./src/audio-player.vue";
import type {
  AudioPlayerInstance,
  AudioPlayerProps,
  AudioPlayerTrack
} from "./src/audio-player";
import { withInstall } from "@xiaoye/utils";

export type { AudioPlayerInstance, AudioPlayerProps, AudioPlayerTrack };

export const XyAudioPlayer = withInstall(AudioPlayer, "xy-audio-player");
export default XyAudioPlayer;
