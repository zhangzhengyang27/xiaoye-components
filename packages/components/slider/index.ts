import Slider from "./src/slider.vue";
import type {
  SliderFocusHandler,
  SliderInstance,
  SliderPlacement,
  SliderProps,
  SliderValue,
  SliderValueChangeHandler
} from "./src/slider";
import { withInstall } from "@xiaoye/primitives";

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
