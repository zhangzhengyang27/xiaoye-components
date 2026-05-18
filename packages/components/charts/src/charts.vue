<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue"
import type { EChartsCoreOption } from "./echarts"
import { init } from "./echarts"
import { useNamespace } from "@xiaoye/primitives"
import type { ChartsLoadingOptions, ChartsProps, ChartsSetOptionOptions } from "./charts"

defineOptions({
  name: "XyCharts"
})

const props = withDefaults(defineProps<ChartsProps>(), {
  option: undefined,
  theme: undefined,
  width: "100%",
  height: 360,
  initOptions: undefined,
  loading: false,
  loadingOptions: undefined,
  autoresize: true,
  setOptionOptions: undefined,
  type: undefined,
  data: () => [],
  xKey: '',
  yKeys: () => [],
  nameKey: '',
  valueKey: ''
})

const emit = defineEmits(["init", "ready", "click"])

const ns = useNamespace("charts")
const rootRef = ref<HTMLDivElement | null>(null)
const chartRef = shallowRef<any>(null)
let resizeObserver: ResizeObserver | null = null
let removeResizeListener: (() => void) | null = null

const rootStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  height: typeof props.height === "number" ? `${props.height}px` : props.height
}))

const computedOption = computed(() => {
  if (props.option) {
    return props.option
  }
  
  if (!props.type || !props.data.length) {
    return undefined
  }
  
  return generateOption(props.type, props.data, props.xKey, props.yKeys, props.nameKey, props.valueKey)
})

function generateOption(
  type: string,
  data: Record<string, unknown>[],
  xKey: string,
  yKeys: string[],
  nameKey: string,
  valueKey: string
): EChartsCoreOption {
  const option: EChartsCoreOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: yKeys.length ? yKeys : undefined
    }
  }
  
  switch (type) {
    case 'line':
      option.xAxis = {
        type: 'category',
        data: data.map(item => item[xKey])
      }
      option.yAxis = {
        type: 'value'
      }
      option.series = yKeys.map(key => ({
        name: key,
        type: 'line',
        data: data.map(item => item[key])
      }))
      break
      
    case 'bar':
      option.xAxis = {
        type: 'category',
        data: data.map(item => item[xKey])
      }
      option.yAxis = {
        type: 'value'
      }
      option.series = yKeys.map(key => ({
        name: key,
        type: 'bar',
        data: data.map(item => item[key])
      }))
      break
      
    case 'pie':
      option.series = [{
        type: 'pie',
        data: data.map(item => ({
          name: item[nameKey],
          value: item[valueKey]
        }))
      }]
      break
      
    case 'area':
      option.xAxis = {
        type: 'category',
        data: data.map(item => item[xKey])
      }
      option.yAxis = {
        type: 'value'
      }
      option.series = yKeys.map(key => ({
        name: key,
        type: 'line',
        areaStyle: {},
        data: data.map(item => item[key])
      }))
      break
      
    case 'radar':
      const indicators = yKeys.map(key => ({ name: key }))
      option.radar = {
        indicator: indicators
      }
      option.series = [{
        type: 'radar',
        data: data.map(item => ({
          value: yKeys.map(key => item[key]),
          name: item[nameKey]
        }))
      }]
      break
  }
  
  return option
}

function createChart() {
  if (!rootRef.value) {
    return
  }

  chartRef.value?.dispose()
  chartRef.value = init(rootRef.value, props.theme, props.initOptions)

  if (computedOption.value) {
    chartRef.value.setOption(computedOption.value, props.setOptionOptions)
  }

  if (props.loading) {
    chartRef.value.showLoading(props.loadingOptions)
  }

  chartRef.value.on("click", (params: unknown) => {
    emit("click", params)
  })

  emit("init", chartRef.value)
  emit("ready", chartRef.value)
}

function resize() {
  chartRef.value?.resize()
}

function setOption(option: EChartsCoreOption, setOptionOptions?: ChartsSetOptionOptions) {
  chartRef.value?.setOption(option, setOptionOptions ?? props.setOptionOptions)
}

function showLoading(loadingOptions?: ChartsLoadingOptions) {
  chartRef.value?.showLoading(loadingOptions ?? props.loadingOptions)
}

function hideLoading() {
  chartRef.value?.hideLoading()
}

function syncResizeListener() {
  resizeObserver?.disconnect()
  resizeObserver = null
  removeResizeListener?.()
  removeResizeListener = null

  if (!props.autoresize) {
    return
  }

  if (typeof ResizeObserver !== "undefined" && rootRef.value) {
    let isFirstObservation = true
    resizeObserver = new ResizeObserver(() => {
      if (isFirstObservation) {
        isFirstObservation = false
        return
      }
      resize()
    })
    resizeObserver.observe(rootRef.value)
    return
  }

  if (typeof window !== "undefined") {
    const handler = () => resize()
    window.addEventListener("resize", handler)
    removeResizeListener = () => window.removeEventListener("resize", handler)
  }
}

watch(
  () => computedOption.value,
  (option) => {
    if (!chartRef.value || !option) {
      return
    }

    chartRef.value.setOption(option, props.setOptionOptions)
  },
  {
    deep: true
  }
)

watch(
  () => props.loading,
  (loading) => {
    if (!chartRef.value) {
      return
    }

    if (loading) {
      showLoading()
      return
    }

    hideLoading()
  }
)

watch(
  () => props.loadingOptions,
  () => {
    if (props.loading) {
      showLoading()
    }
  },
  {
    deep: true
  }
)

watch(
  () => [props.theme, props.initOptions] as const,
  async () => {
    await nextTick()
    createChart()
    syncResizeListener()
  },
  {
    deep: true
  }
)

watch(
  () => props.autoresize,
  () => {
    syncResizeListener()
  }
)

onMounted(async () => {
  await nextTick()
  createChart()
  syncResizeListener()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  removeResizeListener?.()
  removeResizeListener = null
  chartRef.value?.dispose()
  chartRef.value = null
})

defineExpose({
  chart: chartRef,
  resize,
  setOption,
  showLoading,
  hideLoading
})
</script>

<template>
  <div :class="ns.base.value" :style="rootStyle">
    <div ref="rootRef" class="xy-charts__surface" />
  </div>
</template>
