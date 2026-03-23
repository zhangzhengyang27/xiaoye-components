<script setup lang="ts">
import { ref } from "vue";

const tags = ref(["Vue 3", "TypeScript", "Vite"]);

function removeTag(tag: string) {
  tags.value = tags.value.filter((item) => item !== tag);
}
</script>

<template>
  <xy-space wrap>
    <xy-tag round>圆角标签</xy-tag>
    <xy-tag
      v-for="tag in tags"
      :key="tag"
      closable
      status="primary"
      @close="removeTag(tag)"
    >
      {{ tag }}
    </xy-tag>
  </xy-space>
</template>
