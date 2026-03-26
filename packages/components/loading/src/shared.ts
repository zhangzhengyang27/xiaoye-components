import { defineComponent, h } from "vue";
import type { PropType } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { LoadingGlobalConfig, LoadingText } from "./types";
import { DEFAULT_LOADING_SVG_VIEW_BOX } from "./types";

export type LoadingIndicatorLayout = "stacked" | "inline";
export type LoadingIndicatorSize = "sm" | "md" | "lg";

export interface LoadingIndicatorProps {
  text?: LoadingText;
  spinner?: string;
  svg?: string;
  svgViewBox?: string;
  layout?: LoadingIndicatorLayout;
  size?: LoadingIndicatorSize;
  surface?: boolean;
}

export function resolveLoadingTextValue(
  localProvided: boolean,
  localText: string | undefined,
  globalText: string | undefined,
  fallbackText: string
) {
  if (localProvided) {
    return localText ?? "";
  }

  return globalText ?? fallbackText;
}

export function resolveLoadingVisualConfig(
  globalConfig: LoadingGlobalConfig | undefined,
  fallbackText: string,
  textProvided = false,
  localText?: string
) {
  return {
    text: resolveLoadingTextValue(textProvided, localText, globalConfig?.text, fallbackText),
    background: globalConfig?.background ?? "",
    spinner: globalConfig?.spinner ?? "",
    svg: globalConfig?.svg ?? "",
    svgViewBox: globalConfig?.svgViewBox ?? DEFAULT_LOADING_SVG_VIEW_BOX
  };
}

export const XyLoadingIndicator = defineComponent({
  name: "XyLoadingIndicator",
  props: {
    text: {
      type: [String, Array, Object] as PropType<LoadingText>,
      default: ""
    },
    spinner: {
      type: String,
      default: ""
    },
    svg: {
      type: String,
      default: ""
    },
    svgViewBox: {
      type: String,
      default: DEFAULT_LOADING_SVG_VIEW_BOX
    },
    layout: {
      type: String as PropType<LoadingIndicatorLayout>,
      default: "inline"
    },
    size: {
      type: String as PropType<LoadingIndicatorSize>,
      default: "md"
    },
    surface: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const ns = useNamespace("loading");

    return () => {
      const textNodes = props.text ? (Array.isArray(props.text) ? props.text : [props.text]) : [];
      const spinnerNode = props.spinner
        ? h("i", {
            class: [
              `${ns.base.value}__indicator-icon`,
              `${ns.base.value}-spinner__icon`,
              props.spinner
            ],
            "aria-hidden": "true"
          })
        : h(
            "svg",
            {
              class: `${ns.base.value}__circular`,
              viewBox: props.svgViewBox || DEFAULT_LOADING_SVG_VIEW_BOX,
              "aria-hidden": "true",
              ...(props.svg ? { innerHTML: props.svg } : {})
            },
            props.svg
              ? undefined
              : [
                  h("circle", {
                    class: `${ns.base.value}__path`,
                    cx: "25",
                    cy: "25",
                    r: "20",
                    fill: "none"
                  })
                ]
          );

      return h(
        "div",
        {
          class: [
            `${ns.base.value}__indicator`,
            `${ns.base.value}__indicator--${props.layout}`,
            `${ns.base.value}__indicator--${props.size}`,
            props.surface ? "is-surface" : ""
          ],
          role: "status",
          "aria-live": "polite"
        },
        [
          spinnerNode,
          textNodes.length
            ? h(
                "p",
                {
                  class: [`${ns.base.value}__text`, `${ns.base.value}-text`]
                },
                textNodes
              )
            : null
        ]
      );
    };
  }
});
