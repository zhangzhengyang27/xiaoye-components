import type { ChartsInstance, ChartsProps } from "xiaoye-components";
import { XyCharts } from "xiaoye-components";

const props: ChartsProps = {
  height: 320,
  option: {
    xAxis: {
      type: "category",
      data: ["一月", "二月"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        type: "line",
        data: [2, 5]
      }
    ]
  },
  loading: false
};

declare const instance: ChartsInstance;

instance.resize();
instance.setOption({
  series: [
    {
      type: "bar",
      data: [1, 2]
    }
  ]
});
instance.showLoading();
instance.hideLoading();

void props;
void XyCharts;
