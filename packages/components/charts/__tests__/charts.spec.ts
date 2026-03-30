import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyCharts } from "@xiaoye/components";

const echartsMock = vi.hoisted(() => {
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
    init: vi.fn(() => chart)
  };
});

vi.mock("echarts", () => ({
  init: echartsMock.init
}));

describe("XyCharts", () => {
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

    expect(echartsMock.init).toHaveBeenCalledTimes(1);
    expect(echartsMock.chart.setOption).toHaveBeenCalledTimes(1);

    await wrapper.setProps({
      option: {
        series: [{ type: "line", data: [1] }]
      }
    });
    await nextTick();

    expect(echartsMock.chart.setOption).toHaveBeenCalledTimes(2);
  });

  it("loading 和卸载会转发到图表实例", async () => {
    const wrapper = mount(XyCharts, {
      props: {
        loading: true
      }
    });

    await nextTick();

    expect(echartsMock.chart.showLoading).toHaveBeenCalledTimes(1);

    await wrapper.setProps({
      loading: false
    });
    await nextTick();

    expect(echartsMock.chart.hideLoading).toHaveBeenCalledTimes(1);

    wrapper.unmount();

    expect(echartsMock.chart.dispose).toHaveBeenCalled();
  });
});
