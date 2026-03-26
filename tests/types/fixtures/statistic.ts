import { h } from "vue";
import {
  XyStatistic,
  type StatisticFormatter,
  type StatisticProps
} from "xiaoye-components";

const formatter: StatisticFormatter = (value) =>
  typeof value === "number" ? `≈ ${value}` : value;

const statisticProps: StatisticProps = {
  title: "累计成交额",
  value: 1250000.56,
  precision: 2,
  prefix: "¥",
  suffix: "元",
  formatter
};

void formatter;
void statisticProps;

const statisticVNode = h(XyStatistic, {
  value: 9800,
  groupSeparator: " ",
  decimalSeparator: ","
});

void statisticVNode;

const invalidStatisticProps: StatisticProps = {
  // @ts-expect-error invalid formatter return type should be rejected
  formatter: () => ({ text: "invalid" })
};

void invalidStatisticProps;
