<script setup lang="ts">
function compactFormatter(value: number | string) {
  if (typeof value !== "number") {
    return value;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value;
}
</script>

<template>
  <div class="statistic-scene">
    <xy-card class="statistic-scene__main" shadow="always">
      <xy-statistic :value="12604580.36" prefix="¥" suffix="/ 月" :precision="2" title="月度经常性收入" />
      <p>金额类指标保留两位小数，并通过前后缀补齐业务语义。</p>
    </xy-card>

    <xy-card class="statistic-scene__main" shadow="hover" variant="muted">
      <xy-statistic :value="89302" :formatter="compactFormatter">
        <template #title>
          <div class="statistic-scene__title">
            活跃用户
            <span>最近 7 天</span>
          </div>
        </template>
        <template #prefix>
          <span class="statistic-scene__prefix">≈</span>
        </template>
        <template #suffix>
          <span class="statistic-scene__suffix">人</span>
        </template>
      </xy-statistic>
      <p>当默认千分位不够贴近业务时，可以直接用 formatter 和插槽重组展示结构。</p>
    </xy-card>
  </div>
</template>

<style scoped>
.statistic-scene {
  display: grid;
  gap: 16px;
}

.statistic-scene__main p {
  margin: 12px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.statistic-scene__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.statistic-scene__title span,
.statistic-scene__prefix,
.statistic-scene__suffix {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}
</style>
