import { h } from "vue";
import { XyStatCard, type StatCardProps, type StatTrend } from "@xiaoye/pro-components";

const trend: StatTrend = "up";

const props: StatCardProps = {
  title: "成交额",
  value: 128000,
  description: "较上周继续提升",
  icon: "mdi:cash-multiple",
  trend,
  trendText: "环比 +12%",
  loading: false
};

const vnode = h(XyStatCard, props);

void trend;
void props;
void vnode;
