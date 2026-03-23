<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";

const props = defineProps<{
  sources: string;
  path: string;
  description: string;
}>();

const storageKey = "xy-docs-demo-lang";
const expanded = ref(false);
const copied = ref(false);
const activeLang = ref("TS");
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

const { theme } = useData();

const decodedDescription = computed(() => decodeURIComponent(props.description));
const sourceItems = computed(() => {
  const parsed = JSON.parse(decodeURIComponent(props.sources)) as Array<{
    label: string;
    raw: string;
    rendered: string;
  }>;

  return parsed.filter((item) => item.raw.trim().length > 0);
});
const currentSource = computed(
  () => sourceItems.value.find((item) => item.label === activeLang.value) ?? sourceItems.value[0]
);
const codeLink = computed(() => {
  const repo = theme.value.repo as string | undefined;
  const docsBranch = (theme.value.docsBranch as string | undefined) ?? "main";
  const docsDir = (theme.value.docsDir as string | undefined) ?? "apps/docs";

  if (!repo) {
    return "";
  }

  return `https://github.com/${repo}/blob/${docsBranch}/${docsDir}/examples/${props.path}.vue`;
});

async function copySource() {
  if (!currentSource.value || typeof navigator === "undefined" || !navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(currentSource.value.raw);
  copied.value = true;

  if (copiedTimer) {
    clearTimeout(copiedTimer);
  }

  copiedTimer = setTimeout(() => {
    copied.value = false;
  }, 1200);
}

onMounted(() => {
  if (typeof localStorage === "undefined") {
    return;
  }

  const cached = localStorage.getItem(storageKey);

  if (cached && sourceItems.value.some((item) => item.label === cached)) {
    activeLang.value = cached;
  }
});

watch(activeLang, (value) => {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(storageKey, value);
});
</script>

<template>
  <div class="vp-demo-block" v-html="decodedDescription" />

  <div class="vp-demo">
    <div class="vp-demo__showcase">
      <slot name="source" />
    </div>

    <div class="vp-demo__toolbar">
      <div class="vp-demo__tabs">
        <button
          v-for="item in sourceItems"
          :key="item.label"
          class="vp-demo__tab"
          :class="{ 'is-active': item.label === activeLang }"
          type="button"
          @click="activeLang = item.label"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="vp-demo__actions">
        <a
          v-if="codeLink"
          class="vp-demo__icon-btn"
          :href="codeLink"
          target="_blank"
          rel="noreferrer"
          aria-label="查看源码"
        >
          <xy-icon icon="mdi:github" />
        </a>

        <button class="vp-demo__icon-btn" type="button" aria-label="复制代码" @click="copySource">
          <xy-icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" />
        </button>

        <button
          class="vp-demo__icon-btn"
          type="button"
          :aria-label="expanded ? '收起代码' : '查看代码'"
          @click="expanded = !expanded"
        >
          <xy-icon :icon="expanded ? 'mdi:chevron-up' : 'mdi:code-tags'" />
        </button>
      </div>
    </div>

    <div v-if="expanded && currentSource" class="vp-demo__source">
      <div class="vp-demo__source-inner" v-html="currentSource.rendered" />
    </div>
  </div>
</template>

<style scoped>
.vp-demo-block {
  margin: 16px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.75;
}

.vp-demo {
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.08);
}

.vp-demo__showcase {
  padding: 24px;
  overflow: auto;
}

.vp-demo__toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(248, 250, 252, 0.92);
}

.vp-demo__tabs {
  display: flex;
  gap: 8px;
  align-items: center;
}

.vp-demo__tab,
.vp-demo__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
}

.vp-demo__tab {
  min-width: 40px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.vp-demo__tab.is-active {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.vp-demo__actions {
  display: flex;
  gap: 2px;
  align-items: center;
}

.vp-demo__icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  color: var(--vp-c-text-3);
  opacity: 0.86;
}

.vp-demo__icon-btn:hover {
  background: rgba(148, 163, 184, 0.08);
  color: var(--vp-c-text-2);
  opacity: 1;
}

.vp-demo__icon-btn :deep(svg) {
  width: 15px !important;
  height: 15px !important;
}

.vp-demo__source {
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  background: var(--vp-code-block-bg);
}

.vp-demo__source-inner :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0;
  background: var(--vp-code-block-bg);
}

.vp-demo__source-inner :deep(pre) {
  margin: 0;
  padding: 18px 20px 22px;
  color: var(--vp-c-text-1);
  background: transparent;
}

.vp-demo__source-inner :deep(code) {
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.75;
}

.vp-demo__source-inner :deep(.line) {
  color: var(--vp-c-text-1);
}

.vp-demo__source-inner :deep(.copy),
.vp-demo__source-inner :deep(.lang) {
  display: none;
}

@media (max-width: 640px) {
  .vp-demo__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .vp-demo__tabs,
  .vp-demo__actions {
    justify-content: space-between;
  }
}
</style>
