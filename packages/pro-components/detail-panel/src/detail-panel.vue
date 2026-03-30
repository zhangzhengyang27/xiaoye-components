<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyDialog, XyDrawer } from "@xiaoye/components";
import type {
  DialogCloseReason,
  DialogInstance,
  DrawerCloseReason,
  DrawerInstance
} from "@xiaoye/components";
import type { DetailPanelProps } from "./detail-panel";

defineOptions({
  name: "XyDetailPanel"
});

const props = withDefaults(defineProps<DetailPanelProps>(), {
  open: false,
  title: "详情信息",
  description: "",
  loading: false,
  container: "drawer",
  drawerProps: () => ({}),
  dialogProps: () => ({})
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  closed: [];
}>();

const slots = useSlots() as Record<string, ((payload?: unknown) => unknown) | undefined>;
const ns = useNamespace("detail-panel");
const drawerRef = ref<DrawerInstance | null>(null);
const dialogRef = ref<DialogInstance | null>(null);

const resolvedTitle = computed(() => props.title || "详情信息");
const hasDescription = computed(() => Boolean(props.description) || Boolean(slots.description));
const hasTimeline = computed(() => Boolean(slots.timeline));
const hasActions = computed(() => Boolean(slots.actions));

function requestClose(reason: DrawerCloseReason | DialogCloseReason = "programmatic") {
  if (props.container === "drawer" && drawerRef.value) {
    drawerRef.value.handleClose(reason as DrawerCloseReason);
    return;
  }

  if (props.container === "dialog" && dialogRef.value) {
    dialogRef.value.handleClose(reason as DialogCloseReason);
    return;
  }

  emit("update:open", false);
}

defineExpose({
  close: () => requestClose("programmatic")
});
</script>

<template>
  <xy-drawer
    v-if="props.container === 'drawer'"
    ref="drawerRef"
    v-bind="props.drawerProps"
    :model-value="props.open"
    :title="resolvedTitle"
    :size="props.drawerProps?.size ?? 520"
    class="xy-detail-panel xy-detail-panel--drawer"
    @update:model-value="emit('update:open', $event)"
    @closed="emit('closed')"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="xy-detail-panel__header">
        <div class="xy-detail-panel__heading">
          <h3 :id="titleId" :class="[titleClass, 'xy-detail-panel__title']">
            {{ resolvedTitle }}
          </h3>
          <div v-if="hasDescription" class="xy-detail-panel__description">
            <slot name="description">
              {{ props.description }}
            </slot>
          </div>
        </div>
        <div v-if="slots.meta" class="xy-detail-panel__meta">
          <slot name="meta" :close="close" />
        </div>
      </div>
    </template>

    <div :class="ns.base.value">
      <div v-if="props.loading" class="xy-detail-panel__loading">
        <strong>正在装载详情内容</strong>
        <span>数据返回后会展示信息卡片与历史记录。</span>
      </div>

      <template v-else>
        <div class="xy-detail-panel__content">
          <slot />
        </div>

        <div v-if="hasTimeline" class="xy-detail-panel__timeline">
          <slot name="timeline" />
        </div>
      </template>
    </div>

    <template v-if="hasActions" #footer>
      <div class="xy-detail-panel__footer">
        <slot name="actions" :close="requestClose" />
      </div>
    </template>
  </xy-drawer>

  <xy-dialog
    v-else
    ref="dialogRef"
    v-bind="props.dialogProps"
    :model-value="props.open"
    :title="props.title"
    :width="props.dialogProps?.width ?? 760"
    class="xy-detail-panel xy-detail-panel--dialog"
    @update:model-value="emit('update:open', $event)"
    @closed="emit('closed')"
  >
    <div class="xy-detail-panel__body">
      <p v-if="props.description" class="xy-detail-panel__description">{{ props.description }}</p>
      <div v-if="props.loading" class="xy-detail-panel__loading">正在加载详情内容</div>
      <template v-else>
        <div class="xy-detail-panel__body-content">
          <div v-if="$slots.default" class="xy-detail-panel__content">
            <slot />
          </div>
          <div v-if="$slots.timeline" class="xy-detail-panel__timeline">
            <slot name="timeline" />
          </div>
        </div>
      </template>
    </div>
    <template v-if="$slots.actions" #footer>
      <div class="xy-detail-panel__footer">
        <slot name="actions" :close="requestClose" />
      </div>
    </template>
  </xy-dialog>
</template>
