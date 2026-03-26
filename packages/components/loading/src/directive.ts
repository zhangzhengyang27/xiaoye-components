import type { AppContext, DirectiveBinding, ObjectDirective } from "vue";
import { createDirectiveLoading } from "./service";
import type { LoadingInstance } from "./loading";
import type { LoadingOptions, LoadingUpdatableOptions } from "./types";

const INSTANCE_KEY = Symbol("XyLoading");

function hyphenate(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function getAttributeName(name: string) {
  return `xy-loading-${hyphenate(name)}`;
}

export type LoadingBinding = boolean | LoadingOptions;

export interface ElementLoading extends HTMLElement {
  [INSTANCE_KEY]?: {
    appContext: AppContext | null;
    instance: LoadingInstance;
    options: LoadingOptions;
  } | null;
}

function getAppContext(binding: DirectiveBinding<LoadingBinding>) {
  return (
    (binding.instance as { $?: { appContext?: AppContext } } | null)?.$?.appContext ??
    vLoading._context
  );
}

function getBindingValue<K extends keyof LoadingOptions>(
  binding: DirectiveBinding<LoadingBinding>,
  key: K
): LoadingOptions[K] {
  return typeof binding.value === "object" && binding.value !== null
    ? binding.value[key]
    : undefined;
}

function getAttributeValue(el: HTMLElement, name: string) {
  return el.getAttribute(getAttributeName(name)) ?? undefined;
}

function resolveOptions(
  el: HTMLElement,
  binding: DirectiveBinding<LoadingBinding>
): LoadingOptions {
  const fullscreen = getBindingValue(binding, "fullscreen") ?? binding.modifiers.fullscreen;

  return {
    text: getBindingValue(binding, "text") ?? getAttributeValue(el, "text"),
    spinner: getBindingValue(binding, "spinner") ?? getAttributeValue(el, "spinner"),
    svg: getBindingValue(binding, "svg") ?? getAttributeValue(el, "svg"),
    svgViewBox: getBindingValue(binding, "svgViewBox") ?? getAttributeValue(el, "svgViewBox"),
    background: getBindingValue(binding, "background") ?? getAttributeValue(el, "background"),
    customClass: getBindingValue(binding, "customClass") ?? getAttributeValue(el, "customClass"),
    target: getBindingValue(binding, "target") ?? (fullscreen ? undefined : el),
    body: getBindingValue(binding, "body") ?? binding.modifiers.body,
    fullscreen,
    lock: getBindingValue(binding, "lock") ?? binding.modifiers.lock,
    visible: getBindingValue(binding, "visible") ?? true,
    delay: getBindingValue(binding, "delay"),
    minDuration: getBindingValue(binding, "minDuration"),
    groupKey: getBindingValue(binding, "groupKey"),
    beforeClose: getBindingValue(binding, "beforeClose"),
    closed: getBindingValue(binding, "closed")
  };
}

function shouldRecreate(prev: LoadingOptions, next: LoadingOptions) {
  return (
    prev.target !== next.target ||
    prev.body !== next.body ||
    prev.fullscreen !== next.fullscreen ||
    prev.lock !== next.lock
  );
}

function toUpdatableOptions(options: LoadingOptions): LoadingUpdatableOptions {
  return {
    text: options.text,
    spinner: options.spinner,
    svg: options.svg,
    svgViewBox: options.svgViewBox,
    background: options.background,
    customClass: options.customClass,
    delay: options.delay,
    minDuration: options.minDuration,
    beforeClose: options.beforeClose,
    closed: options.closed,
    visible: options.visible ?? true
  };
}

function createInstance(el: ElementLoading, binding: DirectiveBinding<LoadingBinding>) {
  const appContext = getAppContext(binding);
  const options = resolveOptions(el, binding);
  const instance = createDirectiveLoading(options, appContext);

  el[INSTANCE_KEY] = {
    appContext,
    instance,
    options
  };
}

type LoadingDirective = ObjectDirective<ElementLoading, LoadingBinding> & {
  _context: AppContext | null;
};

const vLoading = {
  mounted(el: ElementLoading, binding: DirectiveBinding<LoadingBinding>) {
    if (binding.value) {
      createInstance(el, binding);
    }
  },
  updated(el: ElementLoading, binding: DirectiveBinding<LoadingBinding>) {
    const record = el[INSTANCE_KEY];

    if (!binding.value) {
      record?.instance.close();
      el[INSTANCE_KEY] = null;
      return;
    }

    if (!record) {
      createInstance(el, binding);
      return;
    }

    const nextOptions = resolveOptions(el, binding);
    const appContext = getAppContext(binding);

    if (record.appContext !== appContext || shouldRecreate(record.options, nextOptions)) {
      record.instance.close();
      createInstance(el, binding);
      return;
    }

    record.instance.update(toUpdatableOptions(nextOptions));
    record.options = nextOptions;
  },
  unmounted(el: ElementLoading) {
    el[INSTANCE_KEY]?.instance.close();
    el[INSTANCE_KEY] = null;
  }
} as unknown as LoadingDirective;

vLoading._context = null;

export default vLoading;
