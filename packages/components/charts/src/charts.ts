import type { EChartsCoreOption } from "echarts";

export type ChartsECharts = unknown;
export type ChartsInitOptions = Record<string, unknown>;
export type ChartsSetOptionOptions = Record<string, unknown>;
export type ChartsLoadingOptions = Record<string, unknown>;

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
