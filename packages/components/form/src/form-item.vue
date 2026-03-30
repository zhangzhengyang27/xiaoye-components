<script setup lang="ts">
import AsyncValidator from "async-validator";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  toRaw
} from "vue";
import { useNamespace } from "@xiaoye/composables";
import type {
  FormFieldContext,
  FormTrigger,
  ValidateState,
  XyFormRule
} from "./context";
import { formItemKey, formKey } from "./context";
import type { FormProp } from "./utils";
import { getPathValue, normalizeFormProp, setPathValue } from "./utils";

export interface FormItemProps {
  label?: string;
  prop?: FormProp;
  rules?: XyFormRule[];
  required?: boolean;
  help?: string;
}

const props = withDefaults(defineProps<FormItemProps>(), {
  label: "",
  prop: "",
  rules: () => [],
  required: false,
  help: ""
});

const form = inject(formKey, null);
const ns = useNamespace("form-item");
const validateState = ref<ValidateState>("idle");
const validateMessage = ref("");
const rootRef = ref<HTMLElement | null>(null);
const inputId = `xy-field-${Math.random().toString(36).slice(2, 10)}`;
const messageId = `xy-message-${Math.random().toString(36).slice(2, 10)}`;
const propKey = computed(() => normalizeFormProp(props.prop));

function cloneValue<T>(value: T): T {
  if (value === undefined || value === null || typeof value !== "object") {
    return value;
  }

  const rawValue = toRaw(value);

  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(rawValue);
  }

  return JSON.parse(JSON.stringify(rawValue)) as T;
}

const initialValue = ref(
  props.prop && form ? cloneValue(getPathValue(form.props.model, props.prop) as never) : undefined
);

const mergedRules = computed<XyFormRule[]>(() => {
  const rules = [
    ...(propKey.value && form?.props.rules?.[propKey.value] ? form.props.rules[propKey.value] : []),
    ...props.rules
  ];

  if (props.required && !rules.some((rule) => rule.required)) {
    rules.unshift({
      required: true,
      message: props.label ? `请填写${props.label}` : "请填写必填项"
    });
  }

  return rules;
});

const isRequired = computed(
  () => props.required || mergedRules.value.some((rule) => rule.required)
);
const displayMessage = computed(() => validateMessage.value || props.help || "");

async function validate(trigger?: FormTrigger) {
  if (!form || !props.prop || !propKey.value) {
    return true;
  }

  const filtered = mergedRules.value.filter((rule) => {
    if (!trigger || !rule.trigger) {
      return true;
    }

    return Array.isArray(rule.trigger) ? rule.trigger.includes(trigger) : rule.trigger === trigger;
  });

  const normalizedRules = filtered.map((rule) => {
    const { trigger: _trigger, ...validatorRule } = rule;
    return validatorRule;
  });

  if (!normalizedRules.length) {
    validateState.value = "idle";
    validateMessage.value = "";
    return true;
  }

  validateState.value = "validating";
  const validator = new AsyncValidator({
    [propKey.value]: normalizedRules
  });

  try {
    await validator.validate({
      [propKey.value]: getPathValue(form.props.model, props.prop)
    });
    validateState.value = "success";
    validateMessage.value = "";
    return true;
  } catch (error) {
    const first = (error as { errors?: Array<{ message?: string }> }).errors?.[0];
    validateState.value = "error";
    validateMessage.value = first?.message ?? "校验失败";
    return false;
  }
}

function clearValidate() {
  validateState.value = "idle";
  validateMessage.value = "";
}

function resetField() {
  if (!form || !props.prop) {
    return;
  }

  setPathValue(form.props.model, props.prop, cloneValue(initialValue.value));
  clearValidate();
}

const fieldContext: FormFieldContext = {
  prop: props.prop as string | undefined,
  propKey: propKey.value,
  element: rootRef.value,
  validate,
  clearValidate,
  resetField
};

provide(formItemKey, {
  prop: props.prop,
  inputId,
  messageId,
  message: displayMessage,
  validateState,
  disabled: computed(() => Boolean(form?.props.disabled)),
  validate,
  clearValidate
});

onMounted(() => {
  fieldContext.element = rootRef.value;
  form?.addField(fieldContext);
});

onBeforeUnmount(() => {
  form?.removeField(fieldContext);
});
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      ns.base.value,
      validateState === 'error' ? 'is-error' : '',
      validateState === 'success' ? 'is-success' : '',
      form?.props.inline ? 'is-inline' : '',
      form?.props.disabled ? 'is-disabled' : ''
    ]"
  >
    <label
      v-if="props.label"
      class="xy-form-item__label"
      :for="inputId"
      :style="{
        width:
          !form?.props.inline && form?.props.labelWidth ? `${form.props.labelWidth}` : undefined
      }"
    >
      <span v-if="isRequired" class="xy-form-item__required">*</span>
      {{ props.label }}
    </label>
    <div class="xy-form-item__content">
      <slot />
      <p v-if="displayMessage" :id="messageId" class="xy-form-item__message">
        {{ displayMessage }}
      </p>
    </div>
  </div>
</template>
