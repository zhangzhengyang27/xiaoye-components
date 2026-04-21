import { withInstall } from "xiaoye-primitives";
import Image from "./image.vue";
import type { ImageProps, ImageInstance, ImageFit } from "./image";

export type { ImageProps, ImageInstance, ImageFit };

export const XyuImage = withInstall(Image, "XyuImage");

export default XyuImage;
