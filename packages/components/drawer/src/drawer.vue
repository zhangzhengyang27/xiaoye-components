<script setup lang="ts">
import { computed, ref } from "vue";
import { useDismissibleLayer, useFocusTrap, useNamespace } from "@xiaoye/composables";
import { useDialog } from "../../modal/src/use-dialog";

type DrawerDirection = "ltr" | "rtl" | "ttb" | "btt";

export interface DrawerProps {
  modelValue?: boolean;
  title?: string;
  size?: string | number;
  placement?: "left" | "right" | "top" | "bottom";
  direction?: DrawerDirection;
  closeOnOverlay?: boolean;
  closeOnClickModal?: boolean;
  closeOnEsc?: boolean;
  closeOnPressEscape?: boolean;
  destroyOnClose?: boolean;
  showClose?: boolean;
  lockScroll?: boolean;
  withHeader?: boolean;
  beforeClose?: (done: (cancel?: boolean) => void) => void | Promise<void>;
  appendToBody?: boolean;
  appendTo?: string | HTMLElement;
  modal?: boolean;
  modalClass?: string;
  modalPenetrable?: boolean;
  openDelay?: number;
  closeDelay?: number;
}

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  title: "",
  size: 420,
  placement: "right",
  closeOnOverlay: true,
  closeOnEsc: true,
  destroyOnClose: false,
  showClose: true,
  lockScroll: true,
  withHeader: true,
  appendToBody: true,
  appendTo: "body",
  modal: true,
  modalClass: "",
  modalPenetrable: false,
  openDelay: 0,
  closeDelay: 0
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  open: [];
  opened: [];
  close: [];
  closed: [];
}>();

const ns = useNamespace("drawer");
const panelRef = ref<HTMLElement | null>(null);
const titleId = `xy-drawer-title-${Math.random().toString(36).slice(2, 10)}`;
const bodyId = `xy-drawer-body-${Math.random().toString(36).slice(2, 10)}`;
let isClosing = false;
const directionMap: Record<DrawerDirection, DrawerProps["placement"]> = {
  ltr: "left",
  rtl: "right",
  ttb: "top",
  btt: "bottom"
};
const resolvedPlacement = computed(() => props.direction ? directionMap[props.direction] : props.placement);
const allowOverlayClose = computed(() => props.closeOnClickModal ?? props.closeOnOverlay);
const allowEscClose = computed(() => props.closeOnPressEscape ?? props.closeOnEsc);
const drawerRootStyle = computed(() => ({
  zIndex: `${zIndex.value}`
}));
const {
  appendTo,
  handleAfterEnter,
  handleAfterLeave,
  isPenetrable,
  isTopMost,
  rendered,
  showModal,
  teleportDisabled,
  visible,
  zIndex
} = useDialog(props, {
  onOpen: () => {
    emit("open");
  },
  onClose: () => {
    emit("close");
  },
  onOpened: () => {
    emit("opened");
  },
  onClosed: () => {
    emit("closed");
  }
});

const panelStyle = computed(() => {
  const dimension = typeof props.size === "number" ? `${props.size}px` : props.size;
  const isVertical = resolvedPlacement.value === "left" || resolvedPlacement.value === "right";

  return {
    width: isVertical ? dimension : "100%",
    height: isVertical ? "100%" : dimension
  };
});

function emitClose() {
  emit("update:modelValue", false);
}

function requestClose() {
  if (isClosing) {
    return;
  }

  if (!props.beforeClose) {
    emitClose();
    return;
  }

  isClosing = true;
  let doneCalled = false;
  const done = (cancel?: boolean) => {
    if (doneCalled) {
      return;
    }

    doneCalled = true;
    isClosing = false;

    if (cancel) {
      return;
    }

    emitClose();
  };

  try {
    const result = props.beforeClose(done);
    if (result && typeof (result as Promise<void>).catch === "function") {
      void (result as Promise<void>).catch(() => {
        isClosing = false;
      });
    }
  } catch {
    isClosing = false;
  }
}

useDismissibleLayer({
  enabled: () => visible.value,
  refs: [panelRef],
  closeOnEscape: allowEscClose.value,
  closeOnOutside: allowOverlayClose.value,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    requestClose();
  }
});
const focusTrap = useFocusTrap(panelRef, {
  active: () => visible.value,
  autoFocus: "first",
  restoreFocus: true
});
</script>

<template>
  <teleport :to="appendTo" :disabled="teleportDisabled">
    <transition name="xy-fade" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
      <div
        v-if="rendered"
        v-show="visible"
        :class="[
          ns.base.value,
          `${ns.base.value}--${resolvedPlacement}`,
          props.modalClass,
          !showModal ? 'is-without-mask' : '',
          isPenetrable ? 'is-penetrable' : ''
        ]"
        :style="drawerRootStyle"
      >
        <div v-if="showModal" class="xy-drawer__overlay" />
        <aside
          ref="panelRef"
          :class="`${ns.base.value}__panel`"
          :style="panelStyle"
          role="dialog"
          :aria-modal="showModal ? 'true' : 'false'"
          :aria-labelledby="props.withHeader && props.title ? titleId : undefined"
          :aria-label="!props.withHeader && props.title ? props.title : undefined"
          :aria-describedby="bodyId"
          tabindex="-1"
          @keydown.capture="focusTrap.handleKeydown"
        >
          <header v-if="props.withHeader" class="xy-drawer__header">
            <slot name="header">
              <h3 :id="titleId" class="xy-drawer__title">{{ props.title }}</h3>
            </slot>
            <button
              v-if="props.showClose"
              type="button"
              class="xy-drawer__close"
              aria-label="close"
              @click="requestClose"
            >
              ×
            </button>
          </header>
          <div :id="bodyId" :class="['xy-drawer__body', props.withHeader ? '' : 'is-without-header']">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="xy-drawer__footer">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </transition>
  </teleport>
</template>
