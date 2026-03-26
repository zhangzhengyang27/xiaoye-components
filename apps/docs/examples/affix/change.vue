<script setup lang="ts">
import { ref } from "vue";

const fixed = ref(false);
const changeCount = ref(0);
const scrollTop = ref(0);

function handleChange(value: boolean) {
  fixed.value = value;
  changeCount.value += 1;
}

function handleScroll(payload: { scrollTop: number }) {
  scrollTop.value = Math.round(payload.scrollTop);
}
</script>

<template>
  <section class="demo-affix-change">
    <div class="demo-affix-change__panel">
      <xy-tag :status="fixed ? 'success' : 'warning'" round>
        当前状态：{{ fixed ? "已固定" : "未固定" }}
      </xy-tag>
      <xy-tag status="primary" round>change 次数：{{ changeCount }}</xy-tag>
      <xy-tag round>scrollTop：{{ scrollTop }}</xy-tag>
    </div>

    <xy-affix :offset="72" :z-index="2102" @change="handleChange" @scroll="handleScroll">
      <div class="demo-affix-change__bar" :class="{ 'is-fixed': fixed }">
        <div>
          <strong>事件联动示例</strong>
          <p>滚动后观察状态面板和这块摘要条，确认 `change` 是否已经触发。</p>
        </div>
        <xy-button type="primary">{{ fixed ? "当前已固定" : "继续向下滚动" }}</xy-button>
      </div>
    </xy-affix>

    <div class="demo-affix-change__list">
      <xy-card
        v-for="item in 8"
        :key="item"
        class="demo-affix-change__card"
        shadow="hover"
      >
        <h4>状态检查项 {{ item }}</h4>
        <p>如果顶部摘要条进入固定态，状态面板会立即从“未固定”切到“已固定”。</p>
      </xy-card>
    </div>
  </section>
</template>

<style scoped>
.demo-affix-change {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-affix-change__panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 84%, white);
}

.demo-affix-change__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 18%, white);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.demo-affix-change__bar.is-fixed {
  border-color: color-mix(in srgb, var(--xy-color-success) 28%, white);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
}

.demo-affix-change__bar strong {
  display: block;
  margin-bottom: 6px;
}

.demo-affix-change__bar p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.demo-affix-change__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-affix-change__card h4 {
  margin: 0 0 8px;
}

.demo-affix-change__card p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
