import AudioPlayer from "./src/audio-player.vue";
import type {
  AudioPlayerHowlHandler,
  AudioPlayerInstance,
  AudioPlayerProps,
  AudioPlayerStateChangeHandler,
  AudioPlayerTimeUpdateHandler,
  AudioPlayerTrack,
  AudioPlayerVolumeUpdateHandler
} from "./src/audio-player";
import { withInstall } from "@xiaoye/utils";

export type {
  AudioPlayerHowlHandler,
  AudioPlayerInstance,
  AudioPlayerProps,
  AudioPlayerStateChangeHandler,
  AudioPlayerTimeUpdateHandler,
  AudioPlayerTrack,
  AudioPlayerVolumeUpdateHandler
};

export const XyAudioPlayer = withInstall(AudioPlayer, "xy-audio-player");
export default XyAudioPlayer;
