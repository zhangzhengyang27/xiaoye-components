import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { CarouselItemProps } from "./carousel-item";

export interface CarouselItemRegistration {
  uid: number;
  props: CarouselItemProps;
  getEl: () => HTMLElement | null;
}

export interface CarouselContext {
  root: Ref<HTMLElement | null>;
  viewport: Ref<HTMLElement | null>;
  viewportSize: Ref<number>;
  items: Ref<CarouselItemRegistration[]>;
  resolvedActiveIndex: Ref<number>;
  visualIndex: Ref<number>;
  previousIndex: Ref<number>;
  activeIndicatorIndex: Ref<number>;
  isCardType: ComputedRef<boolean>;
  isVertical: ComputedRef<boolean>;
  isFadeEffect: ComputedRef<boolean>;
  seamlessLoop: ComputedRef<boolean>;
  loopTransitionDirection: Ref<"next" | "prev" | null>;
  loopTeleporting: Ref<boolean>;
  loop: ComputedRef<boolean>;
  trigger: ComputedRef<"hover" | "click">;
  cardScale: ComputedRef<number>;
  duration: ComputedRef<number>;
  easing: ComputedRef<string>;
  loopBoundaryDuration: ComputedRef<number>;
  loopBoundaryEasing: ComputedRef<string>;
  slidesPerView: ComputedRef<number>;
  slidesPerGroup: ComputedRef<number>;
  centered: ComputedRef<boolean>;
  gapPx: ComputedRef<number>;
  peekPx: ComputedRef<number>;
  dragOffset: Ref<number>;
  dragging: Ref<boolean>;
  lazy: ComputedRef<boolean>;
  virtual: ComputedRef<boolean>;
  renderIndices: ComputedRef<Set<number>>;
  registerItem: (item: CarouselItemRegistration) => void;
  unregisterItem: (uid: number) => void;
  setActiveItem: (
    index: number | string,
    options?: {
      boundaryTransitionDirection?: "next" | "prev" | null;
      deferTimerRestart?: boolean;
      preserveProgressPercent?: number | null;
    }
  ) => void;
}

export const carouselContextKey: InjectionKey<CarouselContext> = Symbol("xiaoye-carousel");
