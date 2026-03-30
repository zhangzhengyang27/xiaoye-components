<script setup lang="ts">
import { provide, watch } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { FormFieldContext, FormProps, FormTrigger } from "./context";
import { formKey } from "./context";
import type { FormProp } from "./utils";
import { normalizeFormProp } from "./utils";

const props = withDefaults(defineProps<FormProps>(), {
  rules: () => ({}),
  labelWidth: "112px",
  labelPosition: "left",
  size: "md",
  inline: false,
  disabled: false,
  scrollToError: false,
  validateOnRuleChange: true
});

const ns = useNamespace("form");
const fields: FormFieldContext[] = [];

function normalizeProps(prop?: FormProp | FormProp[]) {
  if (!prop) {
    return fields;
  }

  let normalized: string[];

  if (typeof prop === "string") {
    normalized = [normalizeFormProp(prop)];
  } else if (prop.every((item) => typeof item === "string")) {
    const pathSegments = prop as string[];
    const normalizedPath = normalizeFormProp(pathSegments);

    if (normalizedPath && fields.some((field) => field.propKey === normalizedPath)) {
      normalized = [normalizedPath];
    } else {
      normalized = pathSegments.map((item) => normalizeFormProp(item));
    }
  } else {
    normalized = (prop as FormProp[]).map((item) => normalizeFormProp(item));
  }

  const targets = normalized.filter(Boolean);
  return fields.filter((field) => field.propKey && targets.includes(field.propKey));
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
  const valid = results.every(Boolean);

  if (!valid && props.scrollToError) {
    fields.find((field, index) => !results[index])?.element?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  return valid;
}

async function validateField(prop?: FormProp | FormProp[], trigger?: FormTrigger) {
  const targets = normalizeProps(prop);
  const results = await Promise.all(targets.map((field) => field.validate(trigger)));
  return results.every(Boolean);
}

function resetFields(prop?: FormProp | FormProp[]) {
  normalizeProps(prop).forEach((field) => field.resetField());
}

function clearValidate(prop?: FormProp | FormProp[]) {
  normalizeProps(prop).forEach((field) => field.clearValidate());
}

watch(
  () => props.rules,
  async () => {
    if (!props.validateOnRuleChange || fields.length === 0) {
      return;
    }

    await validateField();
  },
  {
    deep: true
  }
);

provide(formKey, {
  props,
  addField,
  removeField,
  resetFields
});

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate
});
</script>

<template>
  <form
    :class="[
      ns.base.value,
      `${ns.base.value}--${props.labelPosition}`,
      props.inline ? 'is-inline' : ''
    ]"
    @submit.prevent
  >
    <slot />
  </form>
</template>
