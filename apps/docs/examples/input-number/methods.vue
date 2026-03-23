<script setup lang="ts">
import { ref } from "vue";

const amount = ref(12);
const inputRef = ref<{
  focus: () => void;
  blur: () => void;
  increase: () => void;
  decrease: () => void;
} | null>(null);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="inputRef?.focus()">focus()</xy-button>
      <xy-button plain @click="inputRef?.blur()">blur()</xy-button>
      <xy-button type="primary" @click="inputRef?.increase()">increase()</xy-button>
      <xy-button plain @click="inputRef?.decrease()">decrease()</xy-button>
    </xy-space>

    <xy-input-number ref="inputRef" v-model="amount" controls-position="right" :min="0" :max="20">
      <template #decrease-icon>
        <xy-icon icon="mdi:minus-thick" :size="12" />
      </template>
      <template #increase-icon>
        <xy-icon icon="mdi:plus-thick" :size="12" />
      </template>
    </xy-input-number>

    <xy-tag status="primary">当前值：{{ amount }}</xy-tag>
  </div>
</template>
