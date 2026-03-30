<script setup lang="ts">
import { ref, computed } from "vue";
import { XyButton, XyCard, XySteps } from "@xiaoye/components";
import type { ImportWizardProps } from "./import-wizard";

defineOptions({
  name: "XyImportWizard"
});

const props = withDefaults(defineProps<ImportWizardProps>(), {
  title: "导入向导",
  steps: () => [],
  active: undefined,
  defaultActive: 0
});

const emit = defineEmits<{
  "update:active": [value: number];
  next: [value: number];
  prev: [value: number];
  finish: [];
}>();

const innerActive = ref(props.defaultActive);
const activeBridge = computed(() => props.active ?? innerActive.value);
const currentStep = computed(() => props.steps[activeBridge.value]);

function updateActive(value: number) {
  if (props.active === undefined) {
    innerActive.value = value;
  }

  emit("update:active", value);
}
</script>

<template>
  <xy-card class="xy-import-wizard" :header="props.title">
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
    <div class="xy-import-wizard__body">
      <slot :step="currentStep" :active="activeBridge" />
    </div>
    <div class="xy-import-wizard__footer">
      <xy-button
        :disabled="activeBridge === 0"
        @click="
          () => {
            updateActive(activeBridge - 1);
            emit('prev', activeBridge - 1);
          }
        "
      >
        上一步
      </xy-button>
      <xy-button
        v-if="activeBridge < props.steps.length - 1"
        type="primary"
        @click="
          () => {
            const nextIndex = activeBridge + 1;
            updateActive(nextIndex);
            emit('next', nextIndex);
          }
        "
      >
        下一步
      </xy-button>
      <xy-button v-else type="primary" @click="emit('finish')">完成</xy-button>
    </div>
  </xy-card>
</template>
