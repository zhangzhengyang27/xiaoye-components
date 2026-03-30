<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { XyButton, XyDrawer, XySteps } from "@xiaoye/components";
import { XyProForm } from "../../pro-form";
import type { ProFormInstance } from "../../pro-form/src/pro-form";
import { cloneProValue } from "../../field-schema";
import type { StepsFormProps } from "./steps-form";

defineOptions({
  name: "XyStepsForm"
});

const props = withDefaults(defineProps<StepsFormProps>(), {
  steps: () => [],
  placement: "page",
  open: false,
  title: "",
  active: undefined,
  defaultActive: 0,
  loading: false,
  readonly: false,
  submitting: false,
  nextText: "下一步",
  prevText: "上一步",
  submitText: "提交",
  drawerProps: () => ({})
});

const emit = defineEmits<{
  "update:active": [value: number];
  "update:open": [value: boolean];
  "step-change": [value: number];
  next: [value: number];
  prev: [value: number];
  submit: [payload: Record<string, unknown>];
  cancel: [];
  closed: [];
}>();

const innerActive = ref(props.defaultActive);
const formRef = ref<ProFormInstance | null>(null);
const activeBridge = computed(() => props.active ?? innerActive.value);
const currentStep = computed(() => props.steps[activeBridge.value]);
const resolvedTitle = computed(() => props.title || "分步表单");

watch(
  () => props.active,
  (value) => {
    if (typeof value === "number") {
      innerActive.value = value;
    }
  }
);

function updateActive(nextValue: number) {
  if (props.active === undefined) {
    innerActive.value = nextValue;
  }

  emit("update:active", nextValue);
  emit("step-change", nextValue);
}

async function next() {
  const valid = await formRef.value?.validate();

  if (!valid || activeBridge.value >= props.steps.length - 1) {
    return;
  }

  const nextIndex = activeBridge.value + 1;
  updateActive(nextIndex);
  emit("next", nextIndex);
}

async function prev() {
  if (activeBridge.value <= 0) {
    return;
  }

  const nextIndex = activeBridge.value - 1;
  updateActive(nextIndex);
  emit("prev", nextIndex);
}

async function submit() {
  const valid = await formRef.value?.validate();

  if (!valid) {
    return;
  }

  emit("submit", cloneProValue(props.model));
}

function close() {
  emit("update:open", false);
}

function handleCancel() {
  emit("cancel");
  close();
}

defineExpose({
  next,
  prev,
  submit,
  close
});
</script>

<template>
  <xy-drawer
    v-if="props.placement === 'drawer'"
    v-bind="props.drawerProps"
    :model-value="props.open"
    :title="resolvedTitle"
    :size="props.drawerProps?.size ?? 680"
    class="xy-steps-form xy-steps-form--drawer"
    @update:model-value="emit('update:open', $event)"
    @closed="emit('closed')"
  >
    <div class="xy-steps-form__body">
      <xy-steps
        :active="activeBridge"
        :items="
          props.steps.map((step) => ({
            key: step.key,
            title: step.title,
            description: step.description
          }))
        "
      />

      <xy-pro-form
        ref="formRef"
        :model="props.model"
        :schema="currentStep?.schema ?? []"
        :loading="props.loading"
        :readonly="props.readonly"
        :submitting="props.submitting"
        :show-reset="false"
        :show-submit="false"
      >
        <template v-if="$slots.default" #default>
          <slot :step="currentStep" :active="activeBridge" />
        </template>
      </xy-pro-form>

      <div class="xy-steps-form__footer">
        <xy-button :disabled="activeBridge === 0" @click="prev">{{ props.prevText }}</xy-button>
        <xy-button
          v-if="activeBridge < props.steps.length - 1"
          type="primary"
          @click="next"
        >
          {{ props.nextText }}
        </xy-button>
        <xy-button v-else type="primary" :loading="props.submitting" @click="submit">
          {{ props.submitText }}
        </xy-button>
      </div>
    </div>

    <template #footer>
      <div class="xy-steps-form__drawer-footer">
        <slot name="footer">
          <xy-button @click="handleCancel">关闭</xy-button>
        </slot>
      </div>
    </template>
  </xy-drawer>

  <div v-else class="xy-steps-form">
    <xy-steps
      :active="activeBridge"
      :items="
        props.steps.map((step) => ({
          key: step.key,
          title: step.title,
          description: step.description
        }))
      "
    />

    <xy-pro-form
      ref="formRef"
      :model="props.model"
      :schema="currentStep?.schema ?? []"
      :loading="props.loading"
      :readonly="props.readonly"
      :submitting="props.submitting"
      :show-reset="false"
      :show-submit="false"
    >
      <template v-if="$slots.default" #default>
        <slot :step="currentStep" :active="activeBridge" />
      </template>
    </xy-pro-form>

    <div class="xy-steps-form__footer">
      <xy-button :disabled="activeBridge === 0" @click="prev">{{ props.prevText }}</xy-button>
      <xy-button
        v-if="activeBridge < props.steps.length - 1"
        type="primary"
        @click="next"
      >
        {{ props.nextText }}
      </xy-button>
      <xy-button v-else type="primary" :loading="props.submitting" @click="submit">
        {{ props.submitText }}
      </xy-button>
    </div>
  </div>
</template>
