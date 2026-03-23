<script setup lang="ts">
import { ref } from "vue"

type ScrollToConfig = {
  top?: number
  left?: number
  behavior?: "auto" | "instant" | "smooth"
}

const scrollbarRef = ref<{
  setScrollTop: (value: number) => void
  scrollTo: (options: ScrollToConfig) => void
} | null>(null)

const scrollTop = ref(0)
const reached = ref("未触底")

function handleScroll(payload: { scrollTop: number }) {
  scrollTop.value = Math.round(payload.scrollTop)
}

function handleEndReached(direction: string) {
  reached.value = `已触发 ${direction}`
}
</script>

<template>
  <div class="demo-scroll-methods">
    <xy-space wrap>
      <xy-button plain @click="scrollbarRef?.scrollTo({ top: 0, behavior: 'smooth' })">回到顶部</xy-button>
      <xy-button type="primary" @click="scrollbarRef?.scrollTo({ top: 320, behavior: 'smooth' })">
        滚到中段
      </xy-button>
    </xy-space>

    <xy-space wrap>
      <xy-tag status="primary">scrollTop：{{ scrollTop }}</xy-tag>
      <xy-tag :status="reached === '未触底' ? 'neutral' : 'success'">{{ reached }}</xy-tag>
    </xy-space>

    <xy-scrollbar
      ref="scrollbarRef"
      height="200px"
      :distance="12"
      @scroll="handleScroll"
      @end-reached="handleEndReached"
    >
      <div class="demo-scroll-methods__content">
        <div v-for="item in 12" :key="item" class="demo-scroll-methods__row">
          第 {{ item }} 条说明：用于演示 `scroll` 事件、`endReached` 触发和方法控制。
        </div>
      </div>
    </xy-scrollbar>
  </div>
</template>

<style scoped>
.demo-scroll-methods {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-scroll-methods__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 8px;
}

.demo-scroll-methods__row {
  padding: 14px 16px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 74%, white);
  color: var(--xy-text-color-secondary);
}
</style>
