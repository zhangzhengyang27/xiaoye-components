<script setup lang="ts">
import { computed } from "vue";
import { XyInput } from "../../input";

const props = withDefaults(defineProps<{
  modelValue: string;
  message?: string;
  placeholder?: string;
  inputType?: "text" | "textarea" | "password";
  inputProps?: Record<string, unknown>;
  error?: string;
}>(), {
  message: "",
  placeholder: "",
  inputType: "text",
  inputProps: () => ({}),
  error: ""
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const mergedInputProps = computed(() => ({
  clearable: true,
  autofocus: true,
  ...props.inputProps
}));
</script>

<template>
  <div class="xy-dialog-service-prompt">
    <p v-if="props.message" class="xy-dialog-service-prompt__message">{{ props.message }}</p>
    <XyInput
      :model-value="props.modelValue"
      :type="props.inputType"
      :placeholder="props.placeholder"
      v-bind="mergedInputProps"
      @update:model-value="emit('update:modelValue', String($event ?? ''))"
    />
    <p v-if="props.error" class="xy-dialog-service-prompt__error">{{ props.error }}</p>
  </div>
</template>
