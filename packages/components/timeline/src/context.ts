import type { ComputedRef, InjectionKey } from "vue";
import type { TimelineDensity, TimelineMode } from "./timeline";

export interface TimelineContext {
  mode: ComputedRef<TimelineMode>;
  density: ComputedRef<TimelineDensity>;
}

export const timelineContextKey: InjectionKey<TimelineContext> = Symbol("xiaoye-timeline");
