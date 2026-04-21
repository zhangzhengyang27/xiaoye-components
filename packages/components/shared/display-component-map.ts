import { XyAvatar } from "../avatar";
import { XyImage } from "../image";
import { XyLink } from "../link";
import { XyProgress } from "../progress";
import { XyTag } from "../tag";
import { XyText } from "../text";

export const displayComponentMap = {
  avatar: XyAvatar,
  image: XyImage,
  link: XyLink,
  progress: XyProgress,
  tag: XyTag,
  text: XyText
} as const;
