<script setup lang="ts">
import { ref } from "vue";
import type { ChartsInstance } from "@xiaoye/components";

const chartRef = ref<ChartsInstance | null>(null);
const loading = ref(false);
const activeMode = ref<"week" | "month">("week");
const lastClick = ref("点击柱状项后会显示这里");

const weeklyData = [18, 24, 21, 27, 30, 26, 33];
const monthlyData = [120, 132, 141, 154, 190, 230, 210];
const labels = ["一", "二", "三", "四", "五", "六", "日"];

function buildOption(data: number[]) {
  return {
    tooltip: {
      trigger: "axis"
    },
    xAxis: {
      type: "category",
      data: labels
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        type: "bar",
        data
      }
    ]
  };
}

const option = ref(buildOption(weeklyData));

function simulateLoad(mode: "week" | "month") {
  activeMode.value = mode;
  loading.value = true;

  window.setTimeout(() => {
    option.value = buildOption(mode === "week" ? weeklyData : monthlyData);
    loading.value = false;
  }, 600);
}

function handleClick(params: { name?: string; value?: number }) {
  lastClick.value = `${params.name ?? "未知"}: ${params.value ?? "-"}`;
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-space>
      <xy-button
        :type="activeMode === 'week' ? 'primary' : 'default'"
        @click="simulateLoad('week')"
      >
        周趋势
      </xy-button>
      <xy-button
        :type="activeMode === 'month' ? 'primary' : 'default'"
        @click="simulateLoad('month')"
      >
        月趋势
      </xy-button>
      <xy-button plain @click="chartRef?.resize()">手动 resize</xy-button>
    </xy-space>

    <xy-text type="secondary">最近点击的数据点：{{ lastClick }}</xy-text>

    <xy-charts
      ref="chartRef"
      :option="option"
      :loading="loading"
      :height="320"
      @click="handleClick"
    />
  </div>
</template>
