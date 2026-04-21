import VideoPlayer from "./src/video-player.vue";
import type {
  VideoPlayerInstance,
  VideoPlayerPlayerHandler,
  VideoPlayerProps,
  VideoPlayerSource,
  VideoPlayerStateChangeHandler
} from "./src/video-player";
import { withInstall } from "@xiaoye/primitives";

export type {
  VideoPlayerInstance,
  VideoPlayerPlayerHandler,
  VideoPlayerProps,
  VideoPlayerSource,
  VideoPlayerStateChangeHandler
};

export const XyVideoPlayer = withInstall(VideoPlayer, "xy-video-player");
export default XyVideoPlayer;
