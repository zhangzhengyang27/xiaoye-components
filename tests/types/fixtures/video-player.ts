import type {
  VideoPlayerInstance,
  VideoPlayerProps,
  VideoPlayerSource
} from "xiaoye-components";
import { XyVideoPlayer } from "xiaoye-components";

const source: VideoPlayerSource = {
  src: "/video/demo.mp4",
  type: "video/mp4"
};

const props: VideoPlayerProps = {
  sources: [source],
  controls: true,
  poster: "/video/poster.png"
};

declare const instance: VideoPlayerInstance;

instance.play();
instance.pause();
instance.load([source]);

void source;
void props;
void XyVideoPlayer;
