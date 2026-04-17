import type { EChartsCoreOption, EChartsInitOpts, EChartsType, SetOptionOpts } from "./echarts";

export type ChartsECharts = EChartsType;
export type ChartsInitOptions = EChartsInitOpts;
export type ChartsSetOptionOptions = SetOptionOpts;
export type ChartsLoadingOptions = Record<string, unknown>;
export type ChartsInstanceHandler = (chart: NonNullable<ChartsInstance["chart"]>) => void;
export type ChartsClickHandler = (params: unknown) => void;

export interface ChartsProps {
  option?: EChartsCoreOption;
  theme?: string | object;
  width?: string | number;
  height?: string | number;
  initOptions?: ChartsInitOptions;
  loading?: boolean;
  loadingOptions?: ChartsLoadingOptions;
  autoresize?: boolean;
  setOptionOptions?: ChartsSetOptionOptions;
}

export interface ChartsInstance {
  chart: ChartsECharts | null;
  resize: () => void;
  setOption: (option: EChartsCoreOption, setOptionOptions?: ChartsSetOptionOptions) => void;
  showLoading: (loadingOptions?: ChartsLoadingOptions) => void;
  hideLoading: () => void;
}
