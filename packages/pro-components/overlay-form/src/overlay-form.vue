<script setup lang="ts">
import { computed, ref, toRaw, useSlots, watch } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyButton, XyDialog, XyDrawer, XyForm } from "@xiaoye/components";
import type {
  DialogCloseReason,
  DialogInstance,
  DrawerCloseReason,
  DrawerInstance,
  FormProp
} from "@xiaoye/components";
import { XyProForm } from "../../pro-form";
import type { OverlayFormProps, OverlayFormSubmitPayload } from "./overlay-form";

defineOptions({
  name: "XyOverlayForm"
});

type FormExpose = {
  validate: () => Promise<boolean>;
  reset?: (prop?: FormProp | FormProp[]) => void;
  resetFields?: (prop?: FormProp | FormProp[]) => void;
  clearValidate?: (prop?: FormProp | FormProp[]) => void;
};

const props = withDefaults(defineProps<OverlayFormProps>(), {
  open: false,
  container: "drawer",
  mode: "create",
  title: "",
  schema: () => [],
  rules: () => ({}),
  labelWidth: "112px",
  labelPosition: "top",
  size: "md",
  loading: false,
  submitting: false,
  readonly: false,
  submitText: "",
  cancelText: "",
  resetOnClose: false,
  destroyOnClose: false,
  drawerProps: () => ({}),
  dialogProps: () => ({})
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  submit: [payload: OverlayFormSubmitPayload];
  cancel: [payload: OverlayFormSubmitPayload];
  closed: [];
}>();

const slots = useSlots() as Record<string, ((payload?: unknown) => unknown) | undefined>;
const ns = useNamespace("overlay-form");
const drawerRef = ref<DrawerInstance | null>(null);
const dialogRef = ref<DialogInstance | null>(null);
const formRef = ref<FormExpose | null>(null);
const contentVisible = ref(props.open || !props.destroyOnClose);

const modeTextMap = {
  create: "新建",
  edit: "编辑",
  view: "查看"
} as const;

const submitTextMap = {
  create: "创建",
  edit: "保存",
  view: ""
} as const;

const isReadonly = computed(() => props.readonly || props.mode === "view");
const resolvedTitle = computed(() => props.title || `${modeTextMap[props.mode]}内容`);
const resolvedCancelText = computed(() => props.cancelText || (isReadonly.value ? "关闭" : "取消"));
const resolvedSubmitText = computed(() => props.submitText || submitTextMap[props.mode]);
const contentDisabled = computed(() => isReadonly.value || props.submitting);
const showSubmitAction = computed(() => !isReadonly.value && resolvedSubmitText.value !== "");
const hasSchema = computed(() => (props.schema?.length ?? 0) > 0);
const formSlots = computed<Record<string, ((payload?: unknown) => unknown) | undefined>>(() => {
  const { actions: _actions, ...rest } = slots;
  return rest;
});

function cloneModelValue(value: Record<string, unknown>) {
  const rawValue = toRaw(value);

  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(rawValue);
  }

  return JSON.parse(JSON.stringify(rawValue)) as Record<string, unknown>;
}

function buildPayload(): OverlayFormSubmitPayload {
  return {
    mode: props.mode,
    model: cloneModelValue(props.model)
  };
}

function requestClose(reason: DrawerCloseReason | DialogCloseReason = "programmatic") {
  if (props.container === "drawer" && drawerRef.value) {
    drawerRef.value.handleClose(reason as DrawerCloseReason);
    return;
  }

  if (props.container === "modal" && dialogRef.value) {
    dialogRef.value.handleClose(reason as DialogCloseReason);
    return;
  }

  emit("update:open", false);
}

async function validate() {
  return formRef.value?.validate() ?? false;
}

async function submit() {
  if (props.loading || props.submitting || isReadonly.value) {
    return false;
  }

  const valid = await validate();

  if (!valid) {
    return false;
  }

  emit("submit", buildPayload());
  return true;
}

function handleCancel() {
  emit("cancel", buildPayload());
  requestClose("programmatic");
}

function resetFormState() {
  if (!props.resetOnClose) {
    return;
  }

  formRef.value?.reset?.();
  formRef.value?.resetFields?.();
  formRef.value?.clearValidate?.();
}

function handleClosed() {
  resetFormState();
  if (props.destroyOnClose) {
    contentVisible.value = false;
  }
  emit("closed");
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      contentVisible.value = true;
    }
  }
);

watch(
  () => props.destroyOnClose,
  (value) => {
    if (!value) {
      contentVisible.value = true;
      return;
    }

    if (!props.open) {
      contentVisible.value = false;
    }
  }
);

defineExpose({
  validate,
  submit,
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
    :size="props.drawerProps?.size ?? 560"
    class="xy-overlay-form xy-overlay-form--drawer"
    @update:model-value="emit('update:open', $event)"
    @closed="handleClosed"
  >
    <div :class="[ns.base.value, ns.is('loading', props.loading)]">
      <template v-if="contentVisible">
        <div v-if="props.loading" class="xy-overlay-form__loading">
          <strong>正在准备表单内容</strong>
          <span>基础数据就绪后会恢复编辑区。</span>
        </div>
        <xy-pro-form
          v-else-if="hasSchema"
          ref="formRef"
          v-slots="formSlots"
          :model="props.model"
          :schema="props.schema"
          :rules="props.rules"
          :label-width="props.labelWidth"
          :label-position="props.labelPosition"
          :size="props.size"
          :readonly="contentDisabled"
          :show-submit="false"
          :show-reset="false"
          class="xy-overlay-form__form"
        />
        <xy-form
          v-else
          ref="formRef"
          :model="props.model"
          :rules="props.rules"
          :label-width="props.labelWidth"
          :label-position="props.labelPosition"
          :size="props.size"
          :disabled="contentDisabled"
          class="xy-overlay-form__form"
        >
          <div class="xy-overlay-form__content">
            <slot :model="props.model" :mode="props.mode" :readonly="isReadonly" />
          </div>
        </xy-form>
      </template>
    </div>

    <template #footer>
      <div class="xy-overlay-form__footer">
        <slot
          name="actions"
          :model="props.model"
          :mode="props.mode"
          :readonly="isReadonly"
          :submitting="props.submitting"
          :submit="submit"
          :cancel="handleCancel"
          :close="requestClose"
        >
          <xy-button @click="handleCancel">
            {{ resolvedCancelText }}
          </xy-button>
          <xy-button
            v-if="showSubmitAction"
            type="primary"
            :loading="props.submitting"
            :disabled="props.loading"
            @click="submit"
          >
            {{ resolvedSubmitText }}
          </xy-button>
        </slot>
      </div>
    </template>
  </xy-drawer>

  <xy-dialog
    v-else
    ref="dialogRef"
    v-bind="props.dialogProps"
    :model-value="props.open"
    :title="resolvedTitle"
    :width="props.dialogProps?.width ?? 720"
    class="xy-overlay-form xy-overlay-form--modal"
    @update:model-value="emit('update:open', $event)"
    @closed="handleClosed"
  >
    <xy-pro-form
      v-if="contentVisible"
      ref="formRef"
      :model="props.model"
      :schema="props.schema"
      :rules="props.rules"
      :label-width="props.labelWidth"
      :label-position="props.labelPosition"
      :size="props.size"
      :loading="props.loading"
      :readonly="isReadonly"
      :submitting="props.submitting"
      :show-reset="false"
      :show-submit="false"
    >
      <slot v-if="$slots.default" :model="props.model" :readonly="isReadonly" />
    </xy-pro-form>

    <template #footer>
      <div class="xy-overlay-form__footer">
        <slot
          name="actions"
          :model="props.model"
          :submit="submit"
          :cancel="handleCancel"
          :readonly="isReadonly"
        >
          <xy-button @click="handleCancel">{{ resolvedCancelText }}</xy-button>
          <xy-button
            v-if="showSubmitAction"
            type="primary"
            :loading="props.submitting"
            @click="submit"
          >
            {{ resolvedSubmitText }}
          </xy-button>
        </slot>
      </div>
    </template>
  </xy-dialog>
</template>
