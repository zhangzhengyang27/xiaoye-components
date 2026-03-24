import Image from "./src/image.vue";
import type {
  ImageCrossorigin,
  ImageFit,
  ImageLoading,
  ImageProps,
  ImageViewerAction
} from "./src/image";
import { withInstall } from "@xiaoye/utils";

export type { ImageCrossorigin, ImageFit, ImageLoading, ImageProps, ImageViewerAction };

export const XyImage = withInstall(Image, "xy-image");
export default XyImage;
