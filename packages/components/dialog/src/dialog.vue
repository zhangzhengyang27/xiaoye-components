<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, useSlots, watch } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { resolveLoadingVisualConfig } from "../../loading/src/shared";
import DialogContent from "./dialog-content.vue";
import { dialogProps } from "./dialog";
import { useDialog } from "./use-dialog";
import type { DialogProps } from "./dialog";
import type { DialogContentInstance } from "./dialog-content";

defineOptions({
  name: "XyDialog",
  inheritAttrs: false
});

const props = defineProps(dialogProps) as DialogProps;

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "update:fullscreen": [value: boolean];
  open: [];
  opened: [];
  close: [];
  closed: [];
  openAutoFocus: [];
  closeAutoFocus: [];
  maximize: [];
  restore: [];
  "resize-start": [event: MouseEvent, width: number, height: number];
  resize: [event: MouseEvent, width: number, height: number];
  "resize-end": [event: MouseEvent, width: number, height: number];
}>();

const slots = useSlots();
const ns = useNamespace("dialog");
const { loading: globalLoading } = useConfig();
const instance = getCurrentInstance();
const overlayRef = ref<HTMLElement | null>(null);
const dialogContentRef = ref<DialogContentInstance | null>(null);
const labelledTitlePresent = ref(false);
const hasLoadingTextProp = computed(() => {
  const vnodeProps = instance?.vnode.props ?? {};

  return "loadingText" in vnodeProps || "loading-text" in vnodeProps;
});
const resolvedLoading = computed(() =>
  resolveLoadingVisualConfig(globalLoading.value, "", hasLoadingTextProp.value, props.loadingText)
);

const {
  ariaLabel,
  ariaLabelledby,
  bodyId,
  closing,
  focusTrap,
  handleClose,
  handleOverlayClick,
  handleOverlayMouseDown,
  handleOverlayMouseUp,
  handleResizeStart,
  handleToggleFullscreen,
  isPenetrable,
  isResizing,
  overlay,
  panelStyle,
  resolvedAlignCenter,
  resolvedDraggable,
  resolvedFullscreen,
  resolvedMaximizable,
  resolvedOverflow,
  resolvedResizable,
  resolvedStickyFooter,
  resolvedStickyHeader,
  rootStyle,
  titleId,
  transitionConfig
} = useDialog(props, {
  emitUpdateModelValue: (value) => {
    emit("update:modelValue", value);
  },
  emitUpdateFullscreen: (value) => {
    emit("update:fullscreen", value);
  },
  emitOpen: () => {
    emit("open");
  },
  emitOpened: () => {
    emit("opened");
  },
  emitClose: () => {
    emit("close");
  },
  emitClosed: () => {
    emit("closed");
  },
  emitOpenAutoFocus: () => {
    emit("openAutoFocus");
  },
  emitCloseAutoFocus: () => {
    emit("closeAutoFocus");
  },
  emitMaximize: () => {
    emit("maximize");
  },
  emitRestore: () => {
    emit("restore");
  },
  emitResizeStart: (event, width, height) => {
    emit("resize-start", event, width, height);
  },
  emitResize: (event, width, height) => {
    emit("resize", event, width, height);
  },
  emitResizeEnd: (event, width, height) => {
    emit("resize-end", event, width, height);
  },
  hasLabelledTitle: () => labelledTitlePresent.value,
  dialogContentRef,
  overlayRef
});

watch(
  [overlay.visible, () => props.title, () => Boolean(slots.header), () => Boolean(slots.title)],
  async () => {
    await nextTick();
    labelledTitlePresent.value = Boolean(
      titleId && dialogContentRef.value?.dialogRef?.querySelector(`#${titleId}`)
    );
  },
  {
    immediate: true,
    flush: "post"
  }
);

function resetPosition() {
  dialogContentRef.value?.resetPosition();
}

defineExpose({
  visible: overlay.visible,
  dialogContentRef,
  resetPosition,
  handleClose
});
</script>

<template>
  <teleport :to="overlay.appendTo.value" :disabled="overlay.teleportDisabled.value">
    <transition v-bind="transitionConfig">
      <div
        v-if="overlay.rendered.value"
        v-show="overlay.visible.value"
        ref="overlayRef"
        :class="[
          ns.base.value,
          ns.is('closing', closing),
          ns.is('align-center', resolvedAlignCenter),
          ns.is('fullscreen', resolvedFullscreen),
          isPenetrable ? ns.is('penetrable', true) : ''
        ]"
        :style="rootStyle"
        @click="handleOverlayClick"
        @mousedown="handleOverlayMouseDown"
        @mouseup="handleOverlayMouseUp"
      >
        <div
          v-if="overlay.showModal.value"
          :class="[`${ns.base.value}__overlay`, props.modalClass]"
        />
        <DialogContent
          ref="dialogContentRef"
          v-bind="$attrs"
          :title="props.title"
          :title-id="titleId"
          :body-id="bodyId"
          :aria-label="ariaLabel"
          :aria-labelledby="ariaLabelledby"
          :aria-level="props.headerAriaLevel"
          :center="props.center"
          :align-center="resolvedAlignCenter"
          :close-icon="props.closeIcon"
          :draggable="resolvedDraggable"
          :overflow="resolvedOverflow"
          :fullscreen="resolvedFullscreen"
          :maximizable="resolvedMaximizable"
          :sticky-header="resolvedStickyHeader"
          :sticky-footer="resolvedStickyFooter"
          :body-max-height="props.bodyMaxHeight"
          :loading="props.loading"
          :loading-text="resolvedLoading.text"
          :loading-spinner="resolvedLoading.spinner"
          :loading-svg="resolvedLoading.svg"
          :loading-svg-view-box="resolvedLoading.svgViewBox"
          :loading-background="resolvedLoading.background"
          :resizable="resolvedResizable"
          :is-resizing="isResizing"
          :header-class="props.headerClass"
          :body-class="props.bodyClass"
          :footer-class="props.footerClass"
          :panel-class="props.panelClass"
          :show-close="props.showClose"
          :style="panelStyle"
          :modal="overlay.showModal.value"
          :handle-focus-trap-keydown="focusTrap.handleKeydown"
          :handle-resize-start="handleResizeStart"
          @close="handleClose"
          @toggle-fullscreen="handleToggleFullscreen"
        >
          <template #header>
            <slot
              v-if="$slots.header"
              name="header"
              :close="handleClose"
              :title-id="titleId"
              :title-class="`${ns.base.value}__title`"
            />
            <slot
              v-else-if="$slots.title"
              name="title"
              :title-id="titleId"
              :title-class="`${ns.base.value}__title`"
            />
          </template>
          <slot />
          <template v-if="$slots.footer" #footer>
            <slot name="footer" />
          </template>
        </DialogContent>
      </div>
    </transition>
  </teleport>
</template>
