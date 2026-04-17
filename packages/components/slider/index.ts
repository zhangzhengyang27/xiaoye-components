import Slider from "./src/slider.vue";
import type {
  SliderFocusHandler,
  SliderInstance,
  SliderPlacement,
  SliderProps,
  SliderValue,
  SliderValueChangeHandler
} from "./src/slider";
import { withInstall } from "@xiaoye/utils";

export type {
  SliderFocusHandler,
  SliderInstance,
  SliderPlacement,
  SliderProps,
  SliderValue,
  SliderValueChangeHandler
};

export const XySlider = withInstall(Slider, "xy-slider");
export default XySlider;
