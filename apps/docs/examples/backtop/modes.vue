<script setup lang="ts">
import { ref, watch } from "vue";

type BacktopMode = "page" | "target";

const mode = ref<BacktopMode>("page");
const clickCount = ref(0);

const modeOptions = [
  { label: "整页滚动", value: "page" },
  { label: "目标容器", value: "target" }
] as const;

function handleClick() {
  clickCount.value += 1;
}

watch(mode, (value) => {
  if (value === "target") {
    clickCount.value = 0;
  }
});
</script>

<template>
  <section class="demo-backtop-modes">
    <xy-card class="demo-backtop-modes__shell" shadow="always">
      <div class="demo-backtop-modes__toolbar">
        <div class="demo-backtop-modes__title">
          <strong>Backtop 模式切换</strong>
          <p>为了避免文档页同时出现两个回顶按钮，这里只会按当前模式挂载一个 `xy-backtop`。</p>
        </div>

        <xy-radio-group
          v-model="mode"
          type="button"
          fill="#1d4ed8"
          text-color="#f8fafc"
          :options="modeOptions"
        />
      </div>

      <xy-space wrap>
        <xy-tag status="primary" round>当前模式：{{ mode === "page" ? "整页" : "容器" }}</xy-tag>
        <xy-tag v-if="mode === 'target'" round>click 次数：{{ clickCount }}</xy-tag>
        <xy-tag round>
          {{ mode === "page" ? "请继续滚动整个文档页" : "请滚动下面这个局部面板" }}
        </xy-tag>
      </xy-space>

      <template v-if="mode === 'page'">
        <xy-backtop :right="56" :bottom="64" />

        <xy-card class="demo-backtop-modes__lead" shadow="hover">
          <h4>整页回顶提示</h4>
          <p>继续往下阅读当前文档页，右下角会出现默认回顶按钮。这种模式适合长表单、指标看板和文档详情页。</p>
        </xy-card>

        <div class="demo-backtop-modes__list">
          <xy-card
            v-for="item in 6"
            :key="`page-${item}`"
            class="demo-backtop-modes__card"
            shadow="hover"
          >
            <h4>长页面内容块 {{ item }}</h4>
            <p>回顶按钮通常和整页长内容一起出现，用来缩短从底部返回顶部的路径。</p>
          </xy-card>
        </div>
      </template>

      <template v-else>
        <xy-card class="demo-backtop-modes__lead" shadow="hover">
          <h4>局部容器回顶提示</h4>
          <p>这个模式只监听下方规则面板的滚动，按钮仍固定在视口角落，但点击后只会把该容器滚回顶部。</p>
        </xy-card>

        <xy-card class="demo-backtop-modes__target-shell" shadow="hover">
          <div class="demo-backtop-modes__target-head">
            <strong>侧栏规则面板</strong>
            <p>模拟抽屉或侧边规则区。滚动面板到中段后，右下角会出现自定义 `TOP` 按钮。</p>
          </div>

          <div class="demo-backtop-modes__target-panel">
            <article
              v-for="item in 12"
              :key="`target-${item}`"
              class="demo-backtop-modes__target-block"
            >
              <strong>规则项 {{ item }}</strong>
              <p>这是局部滚动容器场景。点击回顶按钮后，只会把这个面板滚回顶部。</p>
            </article>
          </div>
        </xy-card>

        <xy-backtop
          target=".demo-backtop-modes__target-panel"
          :visibility-height="120"
          :right="72"
          :bottom="128"
          @click="handleClick"
        >
          <span class="demo-backtop-modes__slot">TOP</span>
        </xy-backtop>
      </template>
    </xy-card>
  </section>
</template>

<style scoped>
.demo-backtop-modes {
  width: 100%;
}

.demo-backtop-modes__shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-backtop-modes__toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.demo-backtop-modes__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-backtop-modes__title strong {
  color: var(--xy-text-color);
}

.demo-backtop-modes__title p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-backtop-modes__lead h4,
.demo-backtop-modes__card h4,
.demo-backtop-modes__target-head strong,
.demo-backtop-modes__target-block strong {
  display: block;
  margin: 0 0 8px;
}

.demo-backtop-modes__lead p,
.demo-backtop-modes__card p,
.demo-backtop-modes__target-head p,
.demo-backtop-modes__target-block p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-backtop-modes__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-backtop-modes__target-shell {
  max-width: 520px;
}

.demo-backtop-modes__target-head {
  margin-bottom: 16px;
}

.demo-backtop-modes__target-panel {
  height: 280px;
  overflow: auto;
  padding-right: 8px;
}

.demo-backtop-modes__target-block {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  background: color-mix(in srgb, var(--xy-bg-color-muted) 76%, white);
}

.demo-backtop-modes__target-block + .demo-backtop-modes__target-block {
  margin-top: 12px;
}

.demo-backtop-modes__slot {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

@media (max-width: 760px) {
  .demo-backtop-modes__toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
