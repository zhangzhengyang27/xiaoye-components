<script setup lang="ts">
import { provide } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { FormFieldContext, FormProps, FormTrigger } from "./context";
import { formKey } from "./context";

const props = withDefaults(defineProps<FormProps>(), {
  rules: () => ({}),
  labelWidth: "112px",
  labelPosition: "left",
  size: "md"
});

const ns = useNamespace("form");
const fields: FormFieldContext[] = [];

function normalizeProps(props?: string | string[]) {
  if (!props) {
    return fields;
  }

  const targets = Array.isArray(props) ? props : [props];
  return fields.filter((field) => field.prop && targets.includes(field.prop));
}

function addField(field: FormFieldContext) {
  if (!fields.includes(field)) {
    fields.push(field);
  }
}

function removeField(field: FormFieldContext) {
  const index = fields.indexOf(field);

  if (index >= 0) {
    fields.splice(index, 1);
  }
}

async function validate() {
  const results = await Promise.all(fields.map((field) => field.validate()));
  return results.every(Boolean);
}

async function validateField(props?: string | string[], trigger?: FormTrigger) {
  const targets = normalizeProps(props);
  const results = await Promise.all(targets.map((field) => field.validate(trigger)));
  return results.every(Boolean);
}

function resetFields(props?: string | string[]) {
  normalizeProps(props).forEach((field) => field.resetField());
}

function clearValidate(props?: string | string[]) {
  normalizeProps(props).forEach((field) => field.clearValidate());
}

provide(formKey, {
  props,
  addField,
  removeField
});

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate
});
</script>

<template>
  <form :class="[ns.base.value, `${ns.base.value}--${props.labelPosition}`]" @submit.prevent>
    <slot />
  </form>
</template>
