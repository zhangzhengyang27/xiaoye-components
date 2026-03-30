<script setup lang="ts">
import { computed } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyIcon, XySkeleton } from "@xiaoye/components";
import type { StatCardProps, StatTrend } from "./stat-card";

defineOptions({
  name: "XyStatCard"
});

const props = withDefaults(defineProps<StatCardProps>(), {
  title: "",
  value: "",
  description: "",
  icon: "",
  trend: "flat",
  trendText: "",
  loading: false
});

const ns = useNamespace("stat-card");
const trendIconMap: Record<StatTrend, string> = {
  up: "mdi:trending-up",
  down: "mdi:trending-down",
  flat: "mdi:minus"
};
const rootClasses = computed(() => [ns.base.value, `is-${props.trend}`]);
</script>

<template>
  <article :class="rootClasses">
    <template v-if="props.loading">
      <xy-skeleton animated :rows="3" class="xy-stat-card__skeleton" />
    </template>
    <template v-else>
      <div class="xy-stat-card__header">
        <div>
          <small v-if="props.title" class="xy-stat-card__title">{{ props.title }}</small>
          <strong class="xy-stat-card__value">{{ props.value }}</strong>
        </div>
        <div v-if="props.icon" class="xy-stat-card__icon">
          <xy-icon :icon="props.icon" :size="20" />
        </div>
      </div>

      <p v-if="props.description" class="xy-stat-card__description">{{ props.description }}</p>

      <div v-if="props.trendText" class="xy-stat-card__trend">
        <xy-icon :icon="trendIconMap[props.trend]" :size="16" />
        <span>{{ props.trendText }}</span>
      </div>
    </template>
  </article>
</template>
