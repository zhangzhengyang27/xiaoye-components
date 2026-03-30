<script setup lang="ts">
import { onMounted, ref } from "vue";
import { XyProForm } from "../../pro-form";
import { XyAsyncStateContainer } from "../../async-state-container";
import type { ProFormInstance } from "../../pro-form/src/pro-form";
import { createProRequestContext } from "../../request-utils";
import type { RequestFormProps } from "./request-form";

defineOptions({
  name: "XyRequestForm"
});

const props = withDefaults(defineProps<RequestFormProps>(), {
  title: "",
  description: "",
  schema: () => [],
  rules: () => ({}),
  labelWidth: "112px",
  labelPosition: "top",
  size: "md",
  immediate: true,
  initialRequest: undefined,
  submitRequest: undefined
});

const emit = defineEmits<{
  "request-success": [payload: Record<string, unknown>];
  "request-error": [error: unknown];
  "submit-success": [payload: unknown];
  "submit-error": [error: unknown];
}>();

const model = props.model as Record<string, unknown>;
const formRef = ref<ProFormInstance | null>(null);
const loading = ref(false);
const submitting = ref(false);
const error = ref<string | null>(null);
const initialSnapshot = ref<Record<string, unknown>>({});

async function load(action = "load") {
  if (!props.initialRequest) {
    initialSnapshot.value = { ...model };
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const result = await props.initialRequest(
      createProRequestContext(action, {}, 1, 1)
    );

    Object.assign(model, result);
    initialSnapshot.value = { ...result };
    emit("request-success", result);
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : "加载失败";
    emit("request-error", requestError);
  } finally {
    loading.value = false;
  }
}

async function submit() {
  const valid = await formRef.value?.validate();

  if (!valid) {
    return false;
  }

  if (!props.submitRequest) {
    return true;
  }

  submitting.value = true;

  try {
    const result = await props.submitRequest({
      ...createProRequestContext("submit", { ...props.model }, 1, 1),
      model: { ...model }
    });
    emit("submit-success", result);
    return true;
  } catch (submitError) {
    emit("submit-error", submitError);
    return false;
  } finally {
    submitting.value = false;
  }
}

async function reset() {
  Object.assign(model, initialSnapshot.value);
  await load("reset");
}

onMounted(() => {
  if (props.immediate) {
    void load("initial");
  } else {
    initialSnapshot.value = { ...model };
  }
});

defineExpose({
  reload: () => load("reload"),
  refresh: () => load("refresh"),
  reset,
  submit
});
</script>

<template>
  <xy-async-state-container
    :loading="loading"
    :error="error"
    @retry="load('retry')"
  >
    <xy-pro-form
      ref="formRef"
      :title="props.title"
      :description="props.description"
      :model="model"
      :schema="props.schema"
      :rules="props.rules"
      :label-width="props.labelWidth"
      :label-position="props.labelPosition"
      :size="props.size"
      :submitting="submitting"
      @submit="submit"
    >
      <slot v-if="$slots.default" :model="model" />
    </xy-pro-form>
  </xy-async-state-container>
</template>
