import { createApp, defineComponent, h, reactive, ref, toRefs } from "vue";
import type { AppContext, ComponentPublicInstance, Ref } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyLoadingIndicator } from "./shared";
import type { LoadingOptionsResolved, LoadingText, LoadingUpdatableOptions } from "./types";

const LOADING_CLOSE_DELAY = 240;

export interface LoadingInstance {
  background: Ref<string>;
  svg: Ref<string>;
  svgViewBox: Ref<string>;
  spinner: Ref<string>;
  text: Ref<LoadingText>;
  fullscreen: Ref<boolean>;
  lock: Ref<boolean>;
  customClass: Ref<string>;
  visible: Ref<boolean>;
  originalPosition: Ref<string>;
  originalOverflow: Ref<string>;
  zIndex: Ref<number>;
  setText: (text: LoadingText) => void;
  update: (patch: LoadingUpdatableOptions) => void;
  removeLoadingChild: () => void;
  close: () => void;
  handleAfterLeave: () => void;
  vm: ComponentPublicInstance;
  $el: HTMLElement;
}

export function createLoadingComponent(
  options: LoadingOptionsResolved,
  appContext: AppContext | null,
  initialZIndex: number
): LoadingInstance {
  let afterLeaveTimer: ReturnType<typeof globalThis.setTimeout> | null = null;
  const afterLeaveFlag = ref(false);
  const closed = ref(false);
  const data = reactive({
    ...options,
    originalPosition: "",
    originalOverflow: "",
    zIndex: 0
  });

  function setText(text: LoadingText) {
    data.text = text;
  }

  function update(patch: LoadingUpdatableOptions) {
    if (patch.background !== undefined) {
      data.background = patch.background;
    }

    if (patch.svg !== undefined) {
      data.svg = patch.svg;
    }

    if (patch.svgViewBox !== undefined) {
      data.svgViewBox = patch.svgViewBox;
    }

    if (patch.spinner !== undefined) {
      data.spinner = patch.spinner;
    }

    if (patch.text !== undefined) {
      data.text = patch.text;
    }

    if (patch.customClass !== undefined) {
      data.customClass = patch.customClass;
    }

    if (patch.visible !== undefined) {
      data.visible = patch.visible;
    }
  }

  function removeLoadingChild() {
    element.parentNode?.removeChild(element);
  }

  function runClosedCallback() {
    if (closed.value) {
      return;
    }

    closed.value = true;
    data.closed?.();
  }

  function handleAfterLeave() {
    if (!afterLeaveFlag.value) {
      return;
    }

    afterLeaveFlag.value = false;
    removeLoadingChild();
    loadingApp.unmount();
    runClosedCallback();
  }

  function close() {
    if (afterLeaveFlag.value) {
      return;
    }

    afterLeaveFlag.value = true;
    data.visible = false;

    if (afterLeaveTimer !== null) {
      globalThis.clearTimeout(afterLeaveTimer);
    }

    afterLeaveTimer = globalThis.setTimeout(handleAfterLeave, LOADING_CLOSE_DELAY);
  }

  const LoadingComponent = defineComponent({
    name: "XyLoadingRuntime",
    setup() {
      const ns = useNamespace("loading");
      data.zIndex = initialZIndex;

      return () => {
        return h(
          "div",
          {
            class: [
              `${ns.base.value}-mask`,
              ns.is("fullscreen", data.fullscreen),
              data.customClass,
              data.visible ? "is-visible" : "is-hidden"
            ],
            style: {
              backgroundColor: data.background || "",
              zIndex: data.zIndex
            }
          },
          [
            h(XyLoadingIndicator, {
              text: data.text,
              spinner: data.spinner,
              svg: data.svg,
              svgViewBox: data.svgViewBox,
              layout: "stacked",
              size: data.fullscreen ? "lg" : "md",
              surface: true
            })
          ]
        );
      };
    }
  });

  const host = document.createElement("div");
  const loadingApp = createApp(LoadingComponent);
  Object.assign(loadingApp._context, appContext ?? {});
  const vm = loadingApp.mount(host);
  const element = host.firstElementChild as HTMLElement;

  return {
    ...toRefs(data),
    setText,
    update,
    removeLoadingChild,
    close,
    handleAfterLeave,
    vm,
    get $el() {
      return element;
    }
  };
}
