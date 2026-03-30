import VideoPlayer from "./src/video-player.vue";
import type {
  VideoPlayerInstance,
  VideoPlayerProps,
  VideoPlayerSource
} from "./src/video-player";
import { withInstall } from "@xiaoye/utils";

export type { VideoPlayerInstance, VideoPlayerProps, VideoPlayerSource };

export const XyVideoPlayer = withInstall(VideoPlayer, "xy-video-player");
export default XyVideoPlayer;
