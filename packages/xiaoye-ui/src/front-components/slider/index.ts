import { withInstall } from "xiaoye-primitives";
import Slider from "./slider.vue";
import type { SliderProps, SliderInstance, SliderSize } from "./slider";

export type { SliderProps, SliderInstance, SliderSize };

export const XyuSlider = withInstall(Slider, "XyuSlider");

export default XyuSlider;
