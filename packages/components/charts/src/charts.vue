<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { EChartsCoreOption } from "echarts";
import * as echarts from "echarts";
import { useNamespace } from "@xiaoye/composables";
import type {
  ChartsECharts,
  ChartsLoadingOptions,
  ChartsProps,
  ChartsSetOptionOptions
} from "./charts";

defineOptions({
  name: "XyCharts"
});

const props = withDefaults(defineProps<ChartsProps>(), {
  option: undefined,
  theme: undefined,
  width: "100%",
  height: 360,
  initOptions: undefined,
  loading: false,
  loadingOptions: undefined,
  autoresize: true,
  setOptionOptions: undefined
});

const emit = defineEmits(["init", "ready", "click"]);

const ns = useNamespace("charts");
const rootRef = ref<HTMLDivElement | null>(null);
const chartRef = ref<any>(null);
let resizeObserver: ResizeObserver | null = null;
let removeResizeListener: (() => void) | null = null;

const rootStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  height: typeof props.height === "number" ? `${props.height}px` : props.height
}));

function createChart() {
  if (!rootRef.value) {
    return;
  }

  chartRef.value?.dispose();
  chartRef.value = echarts.init(rootRef.value, props.theme, props.initOptions);

  if (props.option) {
    chartRef.value.setOption(props.option, props.setOptionOptions);
  }

  if (props.loading) {
    chartRef.value.showLoading(props.loadingOptions);
  }

  chartRef.value.on("click", (params: unknown) => {
    emit("click", params);
  });

  emit("init", chartRef.value);
  emit("ready", chartRef.value);
}

function resize() {
  chartRef.value?.resize();
}

function setOption(option: EChartsCoreOption, setOptionOptions?: ChartsSetOptionOptions) {
  chartRef.value?.setOption(option, setOptionOptions ?? props.setOptionOptions);
}

function showLoading(loadingOptions?: ChartsLoadingOptions) {
  chartRef.value?.showLoading(undefined, loadingOptions ?? props.loadingOptions);
}

function hideLoading() {
  chartRef.value?.hideLoading();
}

function syncResizeListener() {
  resizeObserver?.disconnect();
  resizeObserver = null;
  removeResizeListener?.();
  removeResizeListener = null;

  if (!props.autoresize) {
    return;
  }

  if (typeof ResizeObserver !== "undefined" && rootRef.value) {
    resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(rootRef.value);
    return;
  }

  if (typeof window !== "undefined") {
    const handler = () => resize();
    window.addEventListener("resize", handler);
    removeResizeListener = () => window.removeEventListener("resize", handler);
  }
}

watch(
  () => props.option,
  (option) => {
    if (!chartRef.value || !option) {
      return;
    }

    chartRef.value.setOption(option, props.setOptionOptions);
  },
  {
    deep: true
  }
);

watch(
  () => props.loading,
  (loading) => {
    if (!chartRef.value) {
      return;
    }

    if (loading) {
      showLoading();
      return;
    }

    hideLoading();
  }
);

watch(
  () => props.loadingOptions,
  () => {
    if (props.loading) {
      showLoading();
    }
  },
  {
    deep: true
  }
);

watch(
  () => [props.theme, props.initOptions] as const,
  async () => {
    await nextTick();
    createChart();
    syncResizeListener();
  },
  {
    deep: true
  }
);

watch(
  () => props.autoresize,
  () => {
    syncResizeListener();
  }
);

onMounted(async () => {
  await nextTick();
  createChart();
  syncResizeListener();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  removeResizeListener?.();
  removeResizeListener = null;
  chartRef.value?.dispose();
  chartRef.value = null;
});

defineExpose({
  chart: chartRef,
  resize,
  setOption,
  showLoading,
  hideLoading
});
</script>

<template>
  <div :class="ns.base.value" :style="rootStyle">
    <div ref="rootRef" class="xy-charts__surface" />
  </div>
</template>
