import { use, init } from "echarts/core";
import type { EChartsCoreOption, EChartsInitOpts, EChartsType, SetOptionOpts } from "echarts/core";
import { LineChart, BarChart, PieChart, ScatterChart, RadarChart, GaugeChart, FunnelChart } from "echarts/charts";
import {
  AriaComponent,
  AxisPointerComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  PolarComponent,
  RadarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

export const defaultChartsModules = [
  CanvasRenderer,
  SVGRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  FunnelChart,
  GridComponent,
  PolarComponent,
  TooltipComponent,
  AxisPointerComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  ToolboxComponent,
  RadarComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  AriaComponent,
  LabelLayout,
  UniversalTransition
];

use(defaultChartsModules);

export type ChartsModule = Parameters<typeof use>[0];
export type { EChartsCoreOption, EChartsInitOpts, EChartsType, SetOptionOpts };
export { init };

export function useChartsModules(modules: ChartsModule) {
  use(modules);
}
