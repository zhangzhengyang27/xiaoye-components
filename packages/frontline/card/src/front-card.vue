<script setup lang="ts">
import { computed, useSlots, watchEffect } from "vue";
import { XyCard } from "@xiaoye/components";
import { isDev, warnOnce } from "@xiaoye/utils";
import type { FrontCardProps } from "./card";

const props = withDefaults(defineProps<FrontCardProps>(), {
  title: "",
  description: "",
  eyebrow: "",
  surface: "default",
  interactive: false
});
const slots = useSlots();

const cardClass = computed(() => [
  "xy-frontline-theme",
  "xy-frontline-card",
  `xy-frontline-card--${props.surface}`,
  props.interactive ? "is-interactive" : ""
]);

if (isDev()) {
  watchEffect(() => {
    if (slots.default && slots.content) {
      warnOnce("XyFrontCard", "`content` slot 与默认 slot 同时存在时，默认 slot 会被忽略。后续请统一改用 `content`。");
    }
  });
}
</script>

<template>
  <XyCard
    :class="cardClass"
    :header-divider="false"
    :footer-divider="false"
    shadow="never"
    :data-slot="'root'"
    :data-state="props.interactive ? 'interactive' : 'idle'"
    :data-surface="props.surface"
  >
    <template #header>
      <slot name="header" :surface="props.surface" :state="props.interactive ? 'interactive' : 'idle'">
        <div class="xy-frontline-card__header" data-slot="header">
          <span v-if="props.eyebrow" class="xy-frontline-card__eyebrow" data-slot="eyebrow">
            {{ props.eyebrow }}
          </span>
          <div class="xy-frontline-card__headline">
            <h3 v-if="props.title" class="xy-frontline-card__title" data-slot="title">{{ props.title }}</h3>
            <p
              v-if="props.description"
              class="xy-frontline-card__description"
              data-slot="description"
            >
              {{ props.description }}
            </p>
          </div>
          <div v-if="$slots.actions" class="xy-frontline-card__actions" data-slot="actions">
            <slot name="actions" />
          </div>
        </div>
      </slot>
    </template>

    <div class="xy-frontline-card__body" data-slot="body">
      <slot name="content" :surface="props.surface" :state="props.interactive ? 'interactive' : 'idle'">
        <slot :surface="props.surface" :state="props.interactive ? 'interactive' : 'idle'" />
      </slot>
    </div>

    <template v-if="$slots.footer" #footer>
      <div class="xy-frontline-card__footer" data-slot="footer">
        <slot name="footer" :surface="props.surface" :state="props.interactive ? 'interactive' : 'idle'" />
      </div>
    </template>
  </XyCard>
</template>

<style scoped>
.xy-frontline-card:deep(.xy-card) {
  border-radius: 30px;
  border-color: rgba(148, 163, 184, 0.14);
  overflow: hidden;
  box-shadow: var(--xy-frontline-shadow-sm);
}

.xy-frontline-card.is-interactive:deep(.xy-card) {
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    border-color 0.24s ease;
}

.xy-frontline-card.is-interactive:hover:deep(.xy-card) {
  transform: translateY(-2px);
  border-color: rgba(20, 99, 255, 0.18);
  box-shadow: var(--xy-frontline-shadow-md);
}

.xy-frontline-card--default:deep(.xy-card) {
  background: rgba(255, 255, 255, 0.9);
}

.xy-frontline-card--glass:deep(.xy-card) {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(248, 250, 252, 0.72));
  backdrop-filter: blur(18px);
}

.xy-frontline-card--highlight:deep(.xy-card) {
  background:
    radial-gradient(circle at top left, rgba(20, 99, 255, 0.12), transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(232, 241, 255, 0.96));
}

.xy-frontline-card__header {
  display: grid;
  gap: 14px;
}

.xy-frontline-card__eyebrow {
  display: inline-flex;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(20, 99, 255, 0.1);
  color: var(--xy-frontline-brand-1);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.xy-frontline-card__headline {
  display: grid;
  gap: 8px;
}

.xy-frontline-card__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: var(--xy-frontline-neutral-1);
}

.xy-frontline-card__description {
  margin: 0;
  color: var(--xy-frontline-neutral-3);
  line-height: 1.7;
}

.xy-frontline-card__actions,
.xy-frontline-card__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.xy-frontline-card__body {
  color: var(--xy-frontline-neutral-2);
  line-height: 1.75;
}
</style>
