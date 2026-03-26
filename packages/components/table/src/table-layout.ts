import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import type { ComputedRef } from "vue";

export interface TableLayoutState {
  headerWrapperRef: Ref<HTMLElement | null>;
  bodyWrapperRef: Ref<HTMLElement | null>;
  footerWrapperRef: Ref<HTMLElement | null>;
  scrollLeft: Ref<number>;
  scrollTop: Ref<number>;
  bodyClientWidth: Ref<number>;
  bodyClientHeight: Ref<number>;
  hasHorizontalScroll: Ref<boolean>;
  hasVerticalScroll: Ref<boolean>;
  showLeftShadow: Ref<boolean>;
  showRightShadow: Ref<boolean>;
  handleBodyScroll: () => void;
  handleFixedWheel: (event: WheelEvent) => void;
  syncLayout: () => void;
  scrollTo: (options: ScrollToOptions | number, top?: number) => void;
  setScrollLeft: (left: number) => void;
  setScrollTop: (top: number) => void;
}

export function useTableLayout(deps: {
  deps: ComputedRef<unknown>;
}): TableLayoutState {
  const headerWrapperRef = ref<HTMLElement | null>(null);
  const bodyWrapperRef = ref<HTMLElement | null>(null);
  const footerWrapperRef = ref<HTMLElement | null>(null);
  const scrollLeft = ref(0);
  const scrollTop = ref(0);
  const bodyClientWidth = ref(0);
  const bodyClientHeight = ref(0);
  const hasHorizontalScroll = ref(false);
  const hasVerticalScroll = ref(false);
  const showLeftShadow = ref(false);
  const showRightShadow = ref(false);
  let resizeObserver: ResizeObserver | null = null;

  function syncLayout() {
    const body = bodyWrapperRef.value;

    if (!body) {
      return;
    }

    scrollLeft.value = body.scrollLeft;
    scrollTop.value = body.scrollTop;
    bodyClientWidth.value = body.clientWidth;
    bodyClientHeight.value = body.clientHeight;
    hasHorizontalScroll.value = body.scrollWidth > body.clientWidth;
    hasVerticalScroll.value = body.scrollHeight > body.clientHeight;
    showLeftShadow.value = body.scrollLeft > 0;
    showRightShadow.value = body.scrollLeft + body.clientWidth < body.scrollWidth - 1;

    if (headerWrapperRef.value) {
      headerWrapperRef.value.scrollLeft = body.scrollLeft;
    }

    if (footerWrapperRef.value) {
      footerWrapperRef.value.scrollLeft = body.scrollLeft;
    }
  }

  function handleBodyScroll() {
    syncLayout();
  }

  function handleFixedWheel(event: WheelEvent) {
    const body = bodyWrapperRef.value;

    if (!body) {
      return;
    }

    body.scrollLeft += event.deltaX;
    body.scrollTop += event.deltaY;
    syncLayout();
  }

  function scrollTo(arg1: ScrollToOptions | number, arg2?: number) {
    const body = bodyWrapperRef.value;

    if (!body) {
      return;
    }

    if (typeof arg1 === "object") {
      if (typeof body.scrollTo === "function") {
        body.scrollTo(arg1);
      } else {
        if (arg1.left !== undefined) {
          body.scrollLeft = arg1.left;
        }

        if (arg1.top !== undefined) {
          body.scrollTop = arg1.top;
        }
      }
    } else if (typeof body.scrollTo === "function") {
      if (arg2 === undefined) {
        body.scrollTo(arg1, body.scrollTop);
      } else {
        body.scrollTo(arg1, arg2);
      }
    } else {
      body.scrollLeft = arg1;
      body.scrollTop = arg2 ?? body.scrollTop;
    }

    syncLayout();
  }

  function setScrollLeft(left: number) {
    const body = bodyWrapperRef.value;

    if (!body) {
      return;
    }

    body.scrollLeft = left;
    syncLayout();
  }

  function setScrollTop(top: number) {
    const body = bodyWrapperRef.value;

    if (!body) {
      return;
    }

    body.scrollTop = top;
    syncLayout();
  }

  onMounted(async () => {
    await nextTick();
    syncLayout();

    if (typeof ResizeObserver !== "undefined" && bodyWrapperRef.value) {
      resizeObserver = new ResizeObserver(() => {
        syncLayout();
      });

      resizeObserver.observe(bodyWrapperRef.value);
    }
  });

  watch(
    deps.deps,
    async () => {
      await nextTick();
      syncLayout();
    },
    {
      deep: true
    }
  );

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });

  return {
    headerWrapperRef,
    bodyWrapperRef,
    footerWrapperRef,
    scrollLeft,
    scrollTop,
    bodyClientWidth,
    bodyClientHeight,
    hasHorizontalScroll,
    hasVerticalScroll,
    showLeftShadow,
    showRightShadow,
    handleBodyScroll,
    handleFixedWheel,
    syncLayout,
    scrollTo,
    setScrollLeft,
    setScrollTop
  };
}
