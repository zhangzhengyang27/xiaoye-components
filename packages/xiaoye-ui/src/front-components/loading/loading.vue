<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    type?: "spinner" | "dot" | "ring" | "wave";
    size?: "sm" | "md" | "lg";
    color?: string;
    text?: string;
    fullscreen?: boolean;
  }>(),
  {
    type: "ring",
    size: "md",
    fullscreen: false
  }
);

const ns = "xyu-loading";
</script>

<template>
  <div
    :class="[ns, props.fullscreen ? 'is-fullscreen' : '']"
    :style="props.color ? { color: props.color } : {}"
  >
    <div :class="[`${ns}__${props.type}`, `${ns}__${props.type}--${props.size}`]">
      <!-- ring -->
      <template v-if="props.type === 'ring'">
        <div :class="`${ns}__ring`">
          <div v-for="i in 12" :key="i" :class="`${ns}__ring-item`" />
        </div>
      </template>
      <!-- dot -->
      <template v-else-if="props.type === 'dot'">
        <div :class="`${ns}__dot`">
          <span v-for="i in 3" :key="i" :class="`${ns}__dot-item`" />
        </div>
      </template>
      <!-- wave -->
      <template v-else-if="props.type === 'wave'">
        <div :class="`${ns}__wave`">
          <span v-for="i in 5" :key="i" :class="`${ns}__wave-item`" />
        </div>
      </template>
      <!-- spinner (default) -->
      <template v-else>
        <div :class="`${ns}__spinner`" />
      </template>
    </div>
    <p v-if="props.text" :class="`${ns}__text`">{{ props.text }}</p>
  </div>
</template>
