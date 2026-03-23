import Slider from "./src/slider.vue";
import type {
  SliderPlacement,
  SliderProps,
  SliderValue
} from "./src/slider";
import { withInstall } from "@xiaoye/utils";

export type {
  SliderPlacement,
  SliderProps,
  SliderValue
};

export const XySlider = withInstall(Slider, "xy-slider");
export default XySlider;
