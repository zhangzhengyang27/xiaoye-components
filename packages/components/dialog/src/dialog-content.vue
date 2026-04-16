<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyIcon } from "../../icon";
import { XyLoadingIndicator } from "../../loading/src/shared";
import { dialogContentPropsDefaults } from "./dialog-content";
import { useDialogDrag } from "./use-dialog-drag";
import type { DialogContentProps } from "./dialog-content";
import type { DialogCloseReason } from "./dialog";

defineOptions({
  name: "XyDialogContent"
});

const props = withDefaults(defineProps<DialogContentProps>(), dialogContentPropsDefaults);

defineEmits<{
  close: [reason?: DialogCloseReason];
  toggleFullscreen: [];
}>();

const slots = useSlots();
const ns = useNamespace("dialog");
const dialogRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);

function addUnit(value?: string | number) {
  if (value == null || value === "") {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

const { dragStyle, handlePointerDown, isDragging, resetPosition, updatePosition } = useDialogDrag(
  dialogRef,
  headerRef,
  () => Boolean(props.draggable),
  () => Boolean(props.overflow),
  () => Boolean(props.fullscreen)
);

const dialogKls = computed(() => [
  `${ns.base.value}__panel`,
  props.panelClass,
  ns.is("fullscreen", props.fullscreen),
  ns.is("draggable", props.draggable),
  ns.is("dragging", isDragging.value),
  ns.is("align-center", props.alignCenter),
  ns.is("resizable", props.resizable),
  ns.is("resizing", props.isResizing),
  props.center ? `${ns.base.value}__panel--center` : ""
]);

const headerKls = computed(() => [
  `${ns.base.value}__header`,
  props.headerClass,
  props.showClose || props.maximizable ? "show-close" : "",
  props.stickyHeader ? "is-sticky" : ""
]);

const footerKls = computed(() => [
  `${ns.base.value}__footer`,
  props.footerClass,
  props.stickyFooter ? "is-sticky" : ""
]);

const bodyKls = computed(() => [
  `${ns.base.value}__body`,
  props.bodyClass,
  props.loading ? "is-loading" : ""
]);

const bodyStyle = computed(() => ({
  maxHeight: props.fullscreen ? undefined : addUnit(props.bodyMaxHeight)
}));

const closeIconIsString = computed(() => typeof props.closeIcon === "string");
const maximizeIcon = computed(() =>
  props.fullscreen ? "mdi:window-restore" : "mdi:window-maximize"
);

defineExpose({
  dialogRef,
  headerRef,
  resetPosition,
  updatePosition
});
</script>

<template>
  <section
    ref="dialogRef"
    :class="dialogKls"
    :style="[props.style, dragStyle]"
    role="dialog"
    :aria-modal="props.modal ? 'true' : 'false'"
    :aria-labelledby="props.ariaLabelledby"
    :aria-label="props.ariaLabel"
    :aria-describedby="props.bodyId"
    :aria-busy="props.loading ? 'true' : undefined"
    tabindex="-1"
    @keydown.capture="props.handleFocusTrapKeydown"
  >
    <header
      v-if="$slots.header || props.title || props.showClose"
      ref="headerRef"
      :class="headerKls"
      @mousedown="handlePointerDown"
    >
      <slot name="header">
        <span
          v-if="props.title"
          :id="props.titleId"
          role="heading"
          :aria-level="props.ariaLevel"
          :class="`${ns.base.value}__title`"
        >
          {{ props.title }}
        </span>
      </slot>
      <button
        v-if="props.maximizable && props.showClose"
        type="button"
        :class="`${ns.base.value}__action`"
        aria-label="toggle fullscreen"
        data-no-dialog-drag
        @click="$emit('toggleFullscreen')"
      >
        <XyIcon :icon="maximizeIcon" :size="18" />
      </button>
      <button
        v-if="props.showClose"
        type="button"
        :class="`${ns.base.value}__close`"
        aria-label="close"
        data-no-dialog-drag
        @click="$emit('close', 'close')"
      >
        <XyIcon v-if="closeIconIsString" :icon="props.closeIcon as string" :size="18" />
        <component :is="props.closeIcon" v-else class="xy-dialog__icon-component" />
      </button>
    </header>
    <div :id="props.bodyId" :class="bodyKls" :style="bodyStyle">
      <slot />
      <div
        v-if="props.loading"
        :class="`${ns.base.value}__loading`"
        :style="props.loadingBackground ? { background: props.loadingBackground } : undefined"
      >
        <XyLoadingIndicator
          :text="props.loadingText"
          :spinner="props.loadingSpinner"
          :svg="props.loadingSvg"
          :svg-view-box="props.loadingSvgViewBox"
          layout="inline"
          size="md"
          surface
        />
      </div>
    </div>
    <footer v-if="slots.footer" :class="footerKls">
      <slot name="footer" />
    </footer>
    <div
      v-if="props.resizable"
      :class="`${ns.base.value}__resizer`"
      data-no-dialog-drag
      @mousedown="props.handleResizeStart"
    />
  </section>
</template>
