<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";

const props = defineProps<{
  sources: string;
  path: string;
  description: string;
  sandbox?: boolean;
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
const isTableDemo = computed(() => props.path.startsWith("table/"));
const needsSandbox = computed(() => props.sandbox ?? false);
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

  <div class="vp-demo" :class="{ 'vp-demo--table': isTableDemo }">
    <div class="vp-demo__showcase">
      <div v-if="needsSandbox" class="xy-doc-sandbox">
        <slot name="source" />
      </div>
      <slot v-else name="source" />
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
  color: var(--xy-text-color-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.vp-demo {
  overflow: hidden;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 20px;
  background: var(--xy-surface-raised);
  box-shadow: var(--xy-shadow-card);
}

.vp-demo__showcase {
  padding: 24px;
  overflow: auto;
  color: var(--xy-text-color);
  font-size: var(--xy-font-size-md);
  line-height: 1.5;
}

.vp-demo__toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-top: 1px solid var(--xy-border-color-subtle);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 94%, white);
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
  color: var(--xy-text-color-secondary);
  font: inherit;
  transition:
    color 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

.vp-demo__tab {
  min-width: 40px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.vp-demo__tab.is-active {
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-weight: 600;
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
  color: var(--xy-text-color-subtle);
  opacity: 0.86;
}

.vp-demo__tab:hover,
.vp-demo__icon-btn:hover {
  background: var(--xy-bg-color-subtle);
  color: var(--xy-text-color);
  opacity: 1;
}

.vp-demo__tab:focus-visible,
.vp-demo__icon-btn:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--xy-color-primary) 58%, white);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--xy-focus-ring-color);
}

.vp-demo__icon-btn :deep(svg) {
  width: 15px !important;
  height: 15px !important;
}

.vp-demo__source {
  border-top: 1px solid var(--xy-border-color-subtle);
  background: var(--xy-doc-code-bg);
}

.vp-demo__source-inner :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0;
  background: var(--xy-doc-code-bg);
}

.vp-demo__source-inner :deep(pre) {
  margin: 0;
  padding: 18px 20px 22px;
  color: var(--xy-text-color);
  background: transparent;
}

.vp-demo__showcase :deep(table) {
  margin: 0;
  max-width: none;
  display: table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: transparent;
}

.vp-demo__showcase :deep(tr) {
  display: table-row;
  background: transparent;
  border-top: 0;
}

.vp-demo__showcase :deep(th),
.vp-demo__showcase :deep(td) {
  display: table-cell;
  border: 0;
  padding: 0;
  background: transparent;
}

.vp-demo__showcase :deep(
    :where(
      p:not([class]),
      h1:not([class]),
      h2:not([class]),
      h3:not([class]),
      h4:not([class]),
      h5:not([class]),
      h6:not([class]),
      blockquote:not([class])
    )
  ) {
  margin: 0;
  color: inherit;
  font: inherit;
  line-height: inherit;
}

.vp-demo__showcase :deep(ul),
.vp-demo__showcase :deep(ol) {
  margin: 0;
  padding-left: 1.25em;
  color: inherit;
}

.vp-demo__showcase :deep(li) {
  margin: 0;
}

.vp-demo__showcase :deep(pre),
.vp-demo__showcase :deep(code) {
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}

.vp-demo__showcase :deep(pre) {
  white-space: pre-wrap;
}

.vp-demo--table {
  border-color: var(--xy-border-color-subtle);
  border-radius: 0;
  box-shadow: none;
}

.vp-demo--table .vp-demo__showcase {
  padding: 18px 18px 16px;
  background: var(--xy-bg-color);
}

.vp-demo--table .vp-demo__toolbar {
  padding: 8px 12px;
  border-top-color: var(--xy-border-color-subtle);
  background: var(--xy-bg-color);
}

.vp-demo--table .vp-demo__tab {
  padding: 6px 8px;
  border-radius: 0;
}

.vp-demo--table .vp-demo__tab.is-active {
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
}

.vp-demo--table .vp-demo__icon-btn {
  border-radius: 0;
}

.vp-demo--table .vp-demo__source {
  border-top-color: var(--xy-border-color-subtle);
}

.vp-demo__source-inner :deep(code) {
  color: var(--xy-text-color);
  font-size: 13px;
  line-height: 1.75;
}

.vp-demo__source-inner :deep(.line) {
  color: var(--xy-text-color);
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
