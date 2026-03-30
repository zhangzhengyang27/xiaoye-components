import type {
  AudioPlayerInstance,
  AudioPlayerProps,
  AudioPlayerTrack
} from "xiaoye-components";
import { XyAudioPlayer } from "xiaoye-components";

const track: AudioPlayerTrack = {
  src: "/audio/demo.mp3",
  title: "播客片段",
  artist: "小叶"
};

const props: AudioPlayerProps = {
  track,
  volume: 0.8,
  playbackRates: [1, 1.5, 2]
};

declare const instance: AudioPlayerInstance;

instance.play();
instance.pause();
instance.stop();
instance.seek(12);
instance.setVolume(0.5);

void track;
void props;
void XyAudioPlayer;
