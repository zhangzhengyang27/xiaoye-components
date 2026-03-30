<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyButton, XyForm, XyFormItem } from "@xiaoye/components";
import type { FormProp } from "@xiaoye/components";
import {
  cloneProValue,
  resolveProFieldComponent,
  resolveProFieldDisabled,
  resolveProFieldHidden,
  resolveProFieldProps,
  resolveProFieldSpan,
  updateProModelValue
} from "../../field-schema";
import type { ProFormProps } from "./pro-form";

defineOptions({
  name: "XyProForm"
});

type FormExpose = {
  validate: () => Promise<boolean>;
  resetFields: (prop?: FormProp | FormProp[]) => void;
  clearValidate: (prop?: FormProp | FormProp[]) => void;
};

const props = withDefaults(defineProps<ProFormProps>(), {
  title: "",
  description: "",
  schema: () => [],
  rules: () => ({}),
  labelWidth: "112px",
  labelPosition: "top",
  size: "md",
  columns: 2,
  loading: false,
  readonly: false,
  submitting: false,
  submitText: "保存",
  resetText: "重置",
  showSubmit: true,
  showReset: true
});

const emit = defineEmits<{
  submit: [payload: Record<string, unknown>];
  reset: [payload: Record<string, unknown>];
}>();

const slots = useSlots() as Record<string, ((payload?: unknown) => unknown) | undefined>;
const ns = useNamespace("pro-form");
const formRef = ref<FormExpose | null>(null);

const normalizedColumns = computed(() => Math.max(1, Math.floor(props.columns)));
const visibleSchema = computed(() =>
  props.schema.filter((field) => !resolveProFieldHidden(field, props.model))
);
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${normalizedColumns.value}, minmax(0, 1fr))`
}));
const hasHeader = computed(() =>
  Boolean(props.title) || Boolean(props.description) || Boolean(slots.header)
);
const hasSchemaFields = computed(() => visibleSchema.value.length > 0);

async function submit() {
  const valid = await formRef.value?.validate();

  if (!valid) {
    return false;
  }

  emit("submit", cloneProValue(props.model));
  return true;
}

function reset(prop?: FormProp | FormProp[]) {
  formRef.value?.resetFields(prop);
  formRef.value?.clearValidate(prop);
  emit("reset", cloneProValue(props.model));
}

defineExpose({
  validate: () => formRef.value?.validate() ?? Promise.resolve(true),
  submit,
  reset,
  clearValidate: (prop?: FormProp | FormProp[]) => formRef.value?.clearValidate(prop)
});
</script>

<template>
  <div :class="[ns.base.value, ns.is('loading', props.loading)]">
    <div v-if="hasHeader" class="xy-pro-form__header">
      <slot name="header">
        <div class="xy-pro-form__heading">
          <h3 v-if="props.title" class="xy-pro-form__title">{{ props.title }}</h3>
          <p v-if="props.description" class="xy-pro-form__description">{{ props.description }}</p>
        </div>
      </slot>
      <div v-if="$slots.meta" class="xy-pro-form__meta">
        <slot name="meta" />
      </div>
    </div>

    <div v-if="props.loading" class="xy-pro-form__loading">
      <strong>正在准备表单</strong>
      <span>字段和默认值就绪后会恢复编辑。</span>
    </div>

    <xy-form
      v-else
      ref="formRef"
      :model="props.model"
      :rules="props.rules"
      :label-width="props.labelWidth"
      :label-position="props.labelPosition"
      :size="props.size"
      :disabled="props.readonly || props.submitting"
      class="xy-pro-form__body"
    >
      <slot v-if="!hasSchemaFields" :model="props.model" :readonly="props.readonly" />
      <div v-else class="xy-pro-form__grid" :style="gridStyle">
        <div
          v-for="field in visibleSchema"
          :key="field.prop"
          class="xy-pro-form__field"
          :style="{ gridColumn: `span ${resolveProFieldSpan(field, normalizedColumns)}` }"
        >
          <xy-form-item
            :label="field.label"
            :prop="field.prop"
            :required="field.required"
            :help="field.help"
          >
            <slot
              v-if="field.slot && slots[field.slot]"
              :name="field.slot"
              :field="field"
              :model="props.model"
            />
            <component
              :is="resolveProFieldComponent(field)"
              v-else
              v-bind="{
                ...resolveProFieldProps(field),
                modelValue: props.model[field.prop],
                disabled: resolveProFieldDisabled(field, props.model),
                'onUpdate:modelValue': (value: unknown) =>
                  updateProModelValue(props.model, field.prop, value)
              }"
            />
          </xy-form-item>
        </div>
      </div>
    </xy-form>

    <div v-if="props.showReset || props.showSubmit || $slots.actions" class="xy-pro-form__footer">
      <slot
        name="actions"
        :model="props.model"
        :submit="submit"
        :reset="reset"
        :submitting="props.submitting"
      >
        <xy-button v-if="props.showReset && !props.readonly" @click="reset()">
          {{ props.resetText }}
        </xy-button>
        <xy-button
          v-if="props.showSubmit && !props.readonly"
          type="primary"
          :loading="props.submitting"
          @click="submit"
        >
          {{ props.submitText }}
        </xy-button>
      </slot>
    </div>
  </div>
</template>
