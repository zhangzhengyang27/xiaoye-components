<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import type { EChartsCoreOption } from "echarts";

type ChartsExpose = {
  resize: () => void;
  setOption: (option: EChartsCoreOption, setOptionOptions?: Record<string, unknown>) => void;
  showLoading: (loadingOptions?: Record<string, unknown>) => void;
  hideLoading: () => void;
} | null;

const chartRef = ref<ChartsExpose>(null);
const loading = ref(false);
const activeMetric = ref("成交额");
const selectedPoint = ref("尚未点击");
let timer: number | null = null;

const metricMap: Record<string, number[]> = {
  成交额: [18, 24, 21, 29, 34, 38],
  工单量: [12, 16, 18, 17, 21, 25],
  转化率: [8, 9, 11, 10, 12, 13]
};

const option = ref<EChartsCoreOption>({
  tooltip: {
    trigger: "axis"
  },
  grid: {
    left: 24,
    right: 16,
    top: 32,
    bottom: 24
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六"],
    boundaryGap: false
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: activeMetric.value,
      type: "line",
      smooth: true,
      areaStyle: {},
      data: metricMap[activeMetric.value]
    }
  ]
});

function replaceMetric(metric: keyof typeof metricMap) {
  if (timer !== null) {
    window.clearTimeout(timer);
  }

  activeMetric.value = metric;
  loading.value = true;
  chartRef.value?.showLoading({
    text: "正在切换指标..."
  });

  timer = window.setTimeout(() => {
    chartRef.value?.setOption({
      series: [
        {
          name: metric,
          type: "line",
          smooth: true,
          areaStyle: {},
          data: metricMap[metric]
        }
      ]
    });
    loading.value = false;
    chartRef.value?.hideLoading();
    timer = null;
  }, 500);
}

function handleClick(params: { name?: string; value?: number }) {
  selectedPoint.value = `${params.name ?? "未知"} / ${params.value ?? "--"}`;
}

onBeforeUnmount(() => {
  if (timer !== null) {
    window.clearTimeout(timer);
  }
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button
        v-for="metric in Object.keys(metricMap)"
        :key="metric"
        :type="activeMetric === metric ? 'primary' : 'default'"
        @click="replaceMetric(metric as keyof typeof metricMap)"
      >
        {{ metric }}
      </xy-button>
      <xy-button plain @click="chartRef?.resize()">手动重算尺寸</xy-button>
    </xy-space>

    <xy-charts
      ref="chartRef"
      :option="option"
      :loading="loading"
      :height="320"
      @click="handleClick"
    />

    <xy-space wrap>
      <xy-tag status="primary">当前指标：{{ activeMetric }}</xy-tag>
      <xy-tag status="neutral">最近点击：{{ selectedPoint }}</xy-tag>
    </xy-space>
  </div>
</template>
