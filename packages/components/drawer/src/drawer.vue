<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, useAttrs, watch } from "vue"
import type { StyleValue } from "vue"
import {
  useDismissibleLayer,
  useFocusTrap,
  useNamespace,
  useOverlayDialog
} from "@xiaoye/composables"
import { warnOnce } from "@xiaoye/utils"
import { XyIcon } from "../../icon"
import { useResizable } from "./use-resizable"
import type {
  DrawerCloseReason,
  DrawerDirection,
  DrawerPlacement,
  DrawerProps,
  DrawerTransition
} from "./drawer"

defineOptions({
  inheritAttrs: false
})

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
  closeDelay: 0,
  resizable: false,
  customClass: "",
  headerClass: "",
  bodyClass: "",
  footerClass: "",
  zIndex: undefined,
  headerAriaLevel: 2,
  modalFade: true,
  closeIcon: "mdi:close",
  fullscreen: false,
  transition: undefined
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  open: []
  opened: []
  close: []
  closed: []
  "open-auto-focus": []
  "close-auto-focus": []
  "resize-start": [evt: MouseEvent, size: number]
  resize: [evt: MouseEvent, size: number]
  "resize-end": [evt: MouseEvent, size: number]
}>()

const slots = defineSlots<{
  header?: (props: { close: () => void; titleId: string; titleClass: string }) => unknown
  title?: (props: { titleId: string; titleClass: string }) => unknown
  default?: () => unknown
  footer?: () => unknown
}>()

const attrs = useAttrs()
const instance = getCurrentInstance()
const ns = useNamespace("drawer")
const panelRef = ref<HTMLElement | null>(null)
const titleId = `xy-drawer-title-${Math.random().toString(36).slice(2, 10)}`
const bodyId = `xy-drawer-body-${Math.random().toString(36).slice(2, 10)}`
const titleClass = `${ns.base.value}__title`
const headerTitlePresent = ref(false)
const downOnOverlay = ref(false)
const closing = ref(false)
const closeRequested = ref(false)
let isClosingByBeforeClose = false

function mergeTransitionHooks(
  transition: DrawerTransition | undefined,
  defaultName: string,
  hooks: {
    onAfterEnter: () => void
    onAfterLeave: () => void
  }
) {
  const callHook = (
    hook: ((element: Element) => void) | Array<(element: Element) => void> | undefined,
    element: Element
  ) => {
    if (!hook) {
      return
    }

    if (Array.isArray(hook)) {
      hook.forEach((entry) => {
        entry(element)
      })
      return
    }

    hook(element)
  }

  if (!transition) {
    return {
      name: defaultName,
      ...hooks
    }
  }

  if (typeof transition === "string") {
    return {
      name: transition,
      ...hooks
    }
  }

  return {
    ...transition,
    name: transition.name ?? defaultName,
    onAfterEnter: (element: Element) => {
      callHook(transition.onAfterEnter, element)
      hooks.onAfterEnter()
    },
    onAfterLeave: (element: Element) => {
      callHook(transition.onAfterLeave, element)
      hooks.onAfterLeave()
    }
  }
}

const directionMap: Record<DrawerDirection, DrawerPlacement> = {
  ltr: "left",
  rtl: "right",
  ttb: "top",
  btt: "bottom"
}
const placementMap: Record<DrawerPlacement, DrawerDirection> = {
  left: "ltr",
  right: "rtl",
  top: "ttb",
  bottom: "btt"
}

const resolvedDirection = computed(() => props.direction ?? placementMap[props.placement])
const resolvedPlacement = computed(() => directionMap[resolvedDirection.value])
const closeOnClickModalPassed = computed(() => {
  const vnodeProps = instance?.vnode.props ?? {}
  return "closeOnClickModal" in vnodeProps || "close-on-click-modal" in vnodeProps
})
const closeOnPressEscapePassed = computed(() => {
  const vnodeProps = instance?.vnode.props ?? {}
  return "closeOnPressEscape" in vnodeProps || "close-on-press-escape" in vnodeProps
})
const customClassPassed = computed(() => {
  const vnodeProps = instance?.vnode.props ?? {}
  return "customClass" in vnodeProps || "custom-class" in vnodeProps
})
const allowEscClose = computed(() =>
  closeOnPressEscapePassed.value ? props.closeOnPressEscape : props.closeOnEsc
)

const {
  appendTo,
  contentRendered,
  handleAfterEnter,
  handleAfterLeave,
  isTopMost,
  rendered,
  showModal,
  teleportDisabled,
  visible,
  zIndex
} = useOverlayDialog(props, {
  destroyStrategy: "content",
  onOpen: () => {
    closing.value = false
    closeRequested.value = false
    emit("open")
    void nextTick(() => {
      if (!panelRef.value) {
        return
      }

      panelRef.value.scrollTop = 0
      panelRef.value.scrollLeft = 0
      panelRef.value.scrollTo?.({
        top: 0,
        left: 0
      })
    })
  },
  onClose: () => {
    closing.value = true
    emit("close")
  },
  onOpened: () => {
    closing.value = false
    emit("opened")
  },
  onClosed: () => {
    closing.value = false
    closeRequested.value = false
    emit("closed")
  }
})

const isPenetrable = computed(() => Boolean(props.modalPenetrable) && !showModal.value)
const allowOverlayClose = computed(() =>
  showModal.value &&
  (closeOnClickModalPassed.value ? props.closeOnClickModal : props.closeOnOverlay)
)
const drawerRootStyle = computed(() => ({
  zIndex: `${zIndex.value}`
}))
const transitionConfig = computed(() =>
  mergeTransitionHooks(props.transition, "xy-drawer-fade", {
    onAfterEnter: handleAfterEnter,
    onAfterLeave: handleAfterLeave
  })
)

const { isResizing, resolvedSize, handleDragStart } = useResizable(
  panelRef,
  () => resolvedDirection.value,
  () => props.size,
  () => props.resizable && !props.fullscreen,
  (event, evt, size) => {
    if (event === "resize-start") {
      emit("resize-start", evt, size)
      return
    }

    if (event === "resize-end") {
      emit("resize-end", evt, size)
      return
    }

    emit("resize", evt, size)
  }
)

const panelSizeStyle = computed(() => {
  if (props.fullscreen) {
    return {
      width: "100%",
      height: "100%"
    }
  }

  const isVertical = resolvedPlacement.value === "left" || resolvedPlacement.value === "right"
  const dimension = resolvedSize.value ?? (typeof props.size === "number" ? `${props.size}px` : props.size)

  return {
    width: isVertical ? dimension : "100%",
    height: isVertical ? "100%" : dimension
  }
})

const panelAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const panelClasses = computed(() => [
  `${ns.base.value}__panel`,
  resolvedDirection.value,
  ns.is("fullscreen", props.fullscreen),
  props.customClass,
  attrs.class,
  ns.is("dragging", isResizing.value)
])

const panelStyle = computed<StyleValue>(() => [panelSizeStyle.value, attrs.style as StyleValue])
const overlayClasses = computed(() => [`${ns.base.value}__overlay`, props.modalClass])
const headerClasses = computed(() => [`${ns.base.value}__header`, props.headerClass])
const bodyClasses = computed(() => [
  `${ns.base.value}__body`,
  props.bodyClass,
  props.withHeader ? "" : "is-without-header"
])
const footerClasses = computed(() => [`${ns.base.value}__footer`, props.footerClass])

const ariaLabelledby = computed(() =>
  props.withHeader && (Boolean(props.title) || headerTitlePresent.value) ? titleId : undefined
)
const ariaLabel = computed(() => ariaLabelledby.value ? undefined : props.title || undefined)

function emitClose() {
  closeRequested.value = true
  emit("update:modelValue", false)
  void nextTick(() => {
    if (!props.modelValue && !closing.value) {
      return
    }

    if (visible.value && !closing.value) {
      closeRequested.value = false
    }
  })
}

function handleClose(reason: DrawerCloseReason = "programmatic") {
  if (isClosingByBeforeClose || closing.value || closeRequested.value) {
    return
  }

  if (!props.beforeClose) {
    emitClose()
    return
  }

  isClosingByBeforeClose = true
  let doneCalled = false
  const done = (cancel?: boolean) => {
    if (doneCalled) {
      return
    }

    doneCalled = true
    isClosingByBeforeClose = false

    if (cancel) {
      closeRequested.value = false
      return
    }

    emitClose()
  }

  try {
    const result = props.beforeClose(done, reason)
    if (result && typeof (result as Promise<void>).catch === "function") {
      void (result as Promise<void>).catch(() => {
        isClosingByBeforeClose = false
        closeRequested.value = false
      })
    }
  } catch {
    isClosingByBeforeClose = false
    closeRequested.value = false
  }
}

const focusTrap = useFocusTrap(panelRef, {
  active: () => visible.value,
  autoFocus: "first",
  restoreFocus: true,
  onAutoFocus: () => {
    emit("open-auto-focus")
  },
  onRestoreFocus: () => {
    emit("close-auto-focus")
  },
  onReleaseRequested: (event) => {
    if (!allowEscClose.value || !visible.value || !isTopMost.value) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    handleClose("escape")
  },
  onFocusoutPrevented: (event) => {
    if (event.detail.focusReason === "pointer") {
      event.preventDefault()
    }
  }
})

function handleOverlayMouseDown(event: MouseEvent) {
  downOnOverlay.value = showModal.value && event.target === event.currentTarget
}

function handleOverlayMouseUp(event: MouseEvent) {
  downOnOverlay.value = downOnOverlay.value && event.target === event.currentTarget
}

function handleOverlayClick(event: MouseEvent) {
  const canClose =
    showModal.value &&
    allowOverlayClose.value &&
    isTopMost.value &&
    downOnOverlay.value &&
    event.target === event.currentTarget

  downOnOverlay.value = false

  if (canClose) {
    handleClose("backdrop")
  }
}

useDismissibleLayer({
  enabled: () => visible.value,
  refs: [panelRef],
  closeOnEscape: () => allowEscClose.value,
  closeOnOutside: false,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    handleClose("escape")
  }
})

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      closeRequested.value = false
      return
    }

    downOnOverlay.value = false
  },
  {
    immediate: true
  }
)

watch(
  [visible, () => props.withHeader, () => props.title, () => Boolean(slots.header), () => Boolean(slots.title)],
  async () => {
    await nextTick()
    headerTitlePresent.value = Boolean(
      props.withHeader &&
      panelRef.value &&
      panelRef.value.querySelector(`#${titleId}`)
    )
  },
  {
    immediate: true,
    flush: "post"
  }
)

if (slots.title) {
  warnOnce("XyDrawer", "`title` 插槽已进入兼容模式，请优先改用 `header` 插槽。")
}

if (customClassPassed.value) {
  warnOnce("XyDrawer", "`custom-class` 已废弃，请改用组件原生 `class`。")
}

defineExpose({
  handleClose,
  afterEnter: handleAfterEnter,
  afterLeave: handleAfterLeave
})
</script>

<template>
  <teleport :to="appendTo" :disabled="teleportDisabled">
    <transition v-bind="transitionConfig">
      <div v-if="rendered" v-show="visible" :class="[
        ns.base.value,
        `${ns.base.value}--${resolvedPlacement}`,
        ns.is('fullscreen', props.fullscreen),
        !showModal ? 'is-without-mask' : '',
        isPenetrable ? 'is-penetrable' : '',
        !props.modalFade ? 'is-no-modal-fade' : ''
      ]" :style="drawerRootStyle">
        <div v-if="showModal" :class="overlayClasses" @click="handleOverlayClick" @mousedown="handleOverlayMouseDown"
          @mouseup="handleOverlayMouseUp" />
        <aside ref="panelRef" v-bind="panelAttrs" :class="panelClasses" :style="panelStyle" role="dialog"
          :aria-modal="showModal ? 'true' : 'false'" :aria-labelledby="ariaLabelledby" :aria-label="ariaLabel"
          :aria-describedby="bodyId" tabindex="-1" @click.stop @keydown.capture="focusTrap.handleKeydown">
          <header v-if="props.withHeader" :class="headerClasses">
            <template v-if="!slots.title">
              <slot name="header" :close="handleClose" :titleId="titleId" :titleClass="titleClass">
                <span v-if="props.title" :id="titleId" :class="titleClass" role="heading"
                  :aria-level="String(props.headerAriaLevel)">
                  {{ props.title }}
                </span>
              </slot>
            </template>
            <template v-else>
              <slot name="title" :titleId="titleId" :titleClass="titleClass" />
            </template>
            <button v-if="props.showClose" type="button" class="xy-drawer__close" aria-label="close"
              @click="handleClose('close')">
              <XyIcon :icon="props.closeIcon" :size="18" />
            </button>
          </header>
          <template v-if="contentRendered">
            <div :id="bodyId" :class="bodyClasses">
              <slot />
            </div>
            <footer v-if="slots.footer" :class="footerClasses">
              <slot name="footer" />
            </footer>
          </template>
          <div v-if="props.resizable && !props.fullscreen" class="xy-drawer__dragger" @mousedown="handleDragStart" />
        </aside>
      </div>
    </transition>
  </teleport>
</template>