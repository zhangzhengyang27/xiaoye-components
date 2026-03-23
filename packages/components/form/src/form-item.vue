<script setup lang="ts">
import AsyncValidator from "async-validator";
import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type {
  FormFieldContext,
  FormTrigger,
  ValidateState,
  XyFormRule
} from "./context";
import { formItemKey, formKey } from "./context";

export interface FormItemProps {
  label?: string;
  prop?: string;
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
const inputId = `xy-field-${Math.random().toString(36).slice(2, 10)}`;
const messageId = `xy-message-${Math.random().toString(36).slice(2, 10)}`;

function cloneValue<T>(value: T): T {
  if (value === undefined || value === null || typeof value !== "object") {
    return value;
  }

  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

const initialValue = ref(
  props.prop && form ? cloneValue(form.props.model[props.prop]) : undefined
);

const mergedRules = computed<XyFormRule[]>(() => {
  const rules = [
    ...(props.prop && form?.props.rules?.[props.prop] ? form.props.rules[props.prop] : []),
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
  if (!form || !props.prop) {
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
    [props.prop]: normalizedRules
  });

  try {
    await validator.validate({
      [props.prop]: form.props.model[props.prop]
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

  form.props.model[props.prop] = cloneValue(initialValue.value);
  clearValidate();
}

const fieldContext: FormFieldContext = {
  prop: props.prop,
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
  validate,
  clearValidate
});

onMounted(() => {
  form?.addField(fieldContext);
});

onBeforeUnmount(() => {
  form?.removeField(fieldContext);
});
</script>

<template>
  <div
    :class="[
      ns.base.value,
      validateState === 'error' ? 'is-error' : '',
      validateState === 'success' ? 'is-success' : ''
    ]"
  >
    <label
      v-if="props.label"
      class="xy-form-item__label"
      :for="inputId"
      :style="{ width: form?.props.labelWidth ? `${form.props.labelWidth}` : undefined }"
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
