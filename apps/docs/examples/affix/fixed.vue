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
  <section class="demo-affix-fixed">
    <div class="demo-affix-fixed__panel">
      <xy-tag :status="fixed ? 'success' : 'warning'" round>
        当前状态：{{ fixed ? "已固定" : "未固定" }}
      </xy-tag>
      <xy-tag status="primary" round>change 次数：{{ changeCount }}</xy-tag>
      <xy-tag round>scrollTop：{{ scrollTop }}</xy-tag>
    </div>

    <div class="demo-affix-fixed__hint">向下滚动这组待处理工单，底部操作条会一直跟随视口。</div>

    <xy-affix position="bottom" :offset="24" @change="handleChange" @scroll="handleScroll">
      <div class="demo-affix-fixed__bar" :class="{ 'is-fixed': fixed }">
        <div>
          <strong>已选择 12 条待审批工单</strong>
          <p>底部固钉适合批量提交、确认支付和移动式操作条。</p>
        </div>
        <xy-space wrap>
          <xy-button plain>取消</xy-button>
          <xy-button type="primary">批量提交</xy-button>
        </xy-space>
      </div>
    </xy-affix>

    <div class="demo-affix-fixed__list">
      <xy-card
        v-for="item in 9"
        :key="item"
        class="demo-affix-fixed__card"
        shadow="always"
      >
        <h4>待处理工单 {{ item }}</h4>
        <p>用于演示长列表场景里的底部操作条，让关键动作不必滚回末尾才能看到。</p>
      </xy-card>
    </div>
  </section>
</template>

<style scoped>
.demo-affix-fixed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-affix-fixed__panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 84%, white);
}

.demo-affix-fixed__hint {
  padding: 10px 14px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--xy-color-success) 12%, white);
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.demo-affix-fixed__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-color-success) 22%, white);
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.1);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.demo-affix-fixed__bar.is-fixed {
  border-color: color-mix(in srgb, var(--xy-color-primary) 26%, white);
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.14);
  transform: translateY(-2px);
}

.demo-affix-fixed__bar strong {
  display: block;
  margin-bottom: 6px;
}

.demo-affix-fixed__bar p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.demo-affix-fixed__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-affix-fixed__card h4 {
  margin: 0 0 8px;
}

.demo-affix-fixed__card p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
