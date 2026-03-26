import dayjs from "dayjs";
import { h } from "vue";
import {
  XyCountdown,
  type CountdownProps
} from "xiaoye-components";

const countdownProps: CountdownProps = {
  title: "距离发布",
  value: dayjs().add(2, "hour"),
  format: "HH:mm:ss",
  suffix: "剩余"
};

void countdownProps;

const countdownVNode = h(XyCountdown, {
  value: new Date(),
  format: "DD [days] HH:mm:ss",
  onChange: (remainingMs: number) => remainingMs,
  onFinish: () => undefined
});

void countdownVNode;

const invalidCountdownProps: CountdownProps = {
  // @ts-expect-error invalid countdown value type should be rejected
  value: true
};

void invalidCountdownProps;
