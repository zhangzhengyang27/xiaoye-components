import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { XyCharts, useChartsModules } from "@xiaoye/components";

const echartsCoreMock = vi.hoisted(() => {
  const chart = {
    setOption: vi.fn(),
    showLoading: vi.fn(),
    hideLoading: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn()
  };

  return {
    chart,
    init: vi.fn(() => chart),
    use: vi.fn()
  };
});

const echartsModuleTokens = vi.hoisted(() => ({
  LineChart: Symbol("LineChart"),
  BarChart: Symbol("BarChart"),
  PieChart: Symbol("PieChart"),
  ScatterChart: Symbol("ScatterChart"),
  RadarChart: Symbol("RadarChart"),
  GaugeChart: Symbol("GaugeChart"),
  FunnelChart: Symbol("FunnelChart"),
  AriaComponent: Symbol("AriaComponent"),
  AxisPointerComponent: Symbol("AxisPointerComponent"),
  DataZoomComponent: Symbol("DataZoomComponent"),
  DataZoomInsideComponent: Symbol("DataZoomInsideComponent"),
  DataZoomSliderComponent: Symbol("DataZoomSliderComponent"),
  DatasetComponent: Symbol("DatasetComponent"),
  GridComponent: Symbol("GridComponent"),
  LegendComponent: Symbol("LegendComponent"),
  MarkAreaComponent: Symbol("MarkAreaComponent"),
  MarkLineComponent: Symbol("MarkLineComponent"),
  MarkPointComponent: Symbol("MarkPointComponent"),
  PolarComponent: Symbol("PolarComponent"),
  RadarComponent: Symbol("RadarComponent"),
  TitleComponent: Symbol("TitleComponent"),
  ToolboxComponent: Symbol("ToolboxComponent"),
  TooltipComponent: Symbol("TooltipComponent"),
  TransformComponent: Symbol("TransformComponent"),
  LabelLayout: Symbol("LabelLayout"),
  UniversalTransition: Symbol("UniversalTransition"),
  CanvasRenderer: Symbol("CanvasRenderer"),
  SVGRenderer: Symbol("SVGRenderer")
}));

const resizeObserverMock = vi.hoisted(() => {
  const instances: Array<{
    callback: ResizeObserverCallback;
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    emit: (entries?: ResizeObserverEntry[]) => void;
  }> = [];

  class MockResizeObserver {
    callback: ResizeObserverCallback;
    observe = vi.fn(() => {
      this.callback([], this as unknown as ResizeObserver);
    });
    disconnect = vi.fn();

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
      instances.push({
        callback,
        observe: this.observe,
        disconnect: this.disconnect,
        emit: (entries = []) => {
          callback(entries, this as unknown as ResizeObserver);
        }
      });
    }
  }

  return {
    MockResizeObserver,
    instances
  };
});

vi.mock("echarts/core", () => ({
  init: echartsCoreMock.init,
  use: echartsCoreMock.use
}));

vi.mock("echarts/charts", () => ({
  LineChart: echartsModuleTokens.LineChart,
  BarChart: echartsModuleTokens.BarChart,
  PieChart: echartsModuleTokens.PieChart,
  ScatterChart: echartsModuleTokens.ScatterChart,
  RadarChart: echartsModuleTokens.RadarChart,
  GaugeChart: echartsModuleTokens.GaugeChart,
  FunnelChart: echartsModuleTokens.FunnelChart
}));

vi.mock("echarts/components", () => ({
  AriaComponent: echartsModuleTokens.AriaComponent,
  AxisPointerComponent: echartsModuleTokens.AxisPointerComponent,
  DataZoomComponent: echartsModuleTokens.DataZoomComponent,
  DataZoomInsideComponent: echartsModuleTokens.DataZoomInsideComponent,
  DataZoomSliderComponent: echartsModuleTokens.DataZoomSliderComponent,
  DatasetComponent: echartsModuleTokens.DatasetComponent,
  GridComponent: echartsModuleTokens.GridComponent,
  LegendComponent: echartsModuleTokens.LegendComponent,
  MarkAreaComponent: echartsModuleTokens.MarkAreaComponent,
  MarkLineComponent: echartsModuleTokens.MarkLineComponent,
  MarkPointComponent: echartsModuleTokens.MarkPointComponent,
  PolarComponent: echartsModuleTokens.PolarComponent,
  RadarComponent: echartsModuleTokens.RadarComponent,
  TitleComponent: echartsModuleTokens.TitleComponent,
  ToolboxComponent: echartsModuleTokens.ToolboxComponent,
  TooltipComponent: echartsModuleTokens.TooltipComponent,
  TransformComponent: echartsModuleTokens.TransformComponent
}));

vi.mock("echarts/features", () => ({
  LabelLayout: echartsModuleTokens.LabelLayout,
  UniversalTransition: echartsModuleTokens.UniversalTransition
}));

vi.mock("echarts/renderers", () => ({
  CanvasRenderer: echartsModuleTokens.CanvasRenderer,
  SVGRenderer: echartsModuleTokens.SVGRenderer
}));

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", resizeObserverMock.MockResizeObserver);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  echartsCoreMock.init.mockClear();
  echartsCoreMock.chart.setOption.mockClear();
  echartsCoreMock.chart.showLoading.mockClear();
  echartsCoreMock.chart.hideLoading.mockClear();
  echartsCoreMock.chart.resize.mockClear();
  echartsCoreMock.chart.dispose.mockClear();
  echartsCoreMock.chart.on.mockClear();
  resizeObserverMock.instances.length = 0;
});

describe("XyCharts", () => {
  it("默认注册常见图表模块，并允许继续补充模块", () => {
    expect(echartsCoreMock.use).toHaveBeenCalledWith([
      echartsModuleTokens.CanvasRenderer,
      echartsModuleTokens.SVGRenderer,
      echartsModuleTokens.LineChart,
      echartsModuleTokens.BarChart,
      echartsModuleTokens.PieChart,
      echartsModuleTokens.ScatterChart,
      echartsModuleTokens.RadarChart,
      echartsModuleTokens.GaugeChart,
      echartsModuleTokens.FunnelChart,
      echartsModuleTokens.GridComponent,
      echartsModuleTokens.PolarComponent,
      echartsModuleTokens.TooltipComponent,
      echartsModuleTokens.AxisPointerComponent,
      echartsModuleTokens.LegendComponent,
      echartsModuleTokens.TitleComponent,
      echartsModuleTokens.DatasetComponent,
      echartsModuleTokens.TransformComponent,
      echartsModuleTokens.DataZoomComponent,
      echartsModuleTokens.DataZoomInsideComponent,
      echartsModuleTokens.DataZoomSliderComponent,
      echartsModuleTokens.ToolboxComponent,
      echartsModuleTokens.RadarComponent,
      echartsModuleTokens.MarkPointComponent,
      echartsModuleTokens.MarkLineComponent,
      echartsModuleTokens.MarkAreaComponent,
      echartsModuleTokens.AriaComponent,
      echartsModuleTokens.LabelLayout,
      echartsModuleTokens.UniversalTransition
    ]);

    const extraModule = (registers: unknown) => {
      void registers;
    };
    useChartsModules([extraModule]);

    expect(echartsCoreMock.use).toHaveBeenLastCalledWith([extraModule]);
  });

  it("挂载时初始化图表并在 option 更新时同步 setOption", async () => {
    const wrapper = mount(XyCharts, {
      props: {
        option: {
          xAxis: {
            type: "category",
            data: ["一月"]
          }
        }
      }
    });

    await nextTick();

    expect(echartsCoreMock.init).toHaveBeenCalledTimes(1);
    expect(echartsCoreMock.chart.setOption).toHaveBeenCalledTimes(1);

    await wrapper.setProps({
      option: {
        series: [{ type: "line", data: [1] }]
      }
    });
    await nextTick();

    expect(echartsCoreMock.chart.setOption).toHaveBeenCalledTimes(2);
  });

  it("loading 和卸载会转发到图表实例", async () => {
    const wrapper = mount(XyCharts, {
      props: {
        loading: true
      }
    });

    await nextTick();

    expect(echartsCoreMock.chart.showLoading).toHaveBeenCalledTimes(1);

    await wrapper.setProps({
      loading: false
    });
    await nextTick();

    expect(echartsCoreMock.chart.hideLoading).toHaveBeenCalledTimes(1);

    wrapper.unmount();

    expect(echartsCoreMock.chart.dispose).toHaveBeenCalled();
  });

  it("自动尺寸监听会跳过首次 ResizeObserver 回调，仅在后续尺寸变化时 resize", async () => {
    mount(XyCharts, {
      props: {
        option: {
          xAxis: {
            type: "category",
            data: ["一月"]
          },
          yAxis: {
            type: "value"
          },
          series: [{ type: "line", data: [1] }]
        }
      }
    });

    await nextTick();

    expect(resizeObserverMock.instances).toHaveLength(1);
    expect(echartsCoreMock.chart.resize).not.toHaveBeenCalled();

    resizeObserverMock.instances[0].emit();

    expect(echartsCoreMock.chart.resize).toHaveBeenCalledTimes(1);
  });
});
