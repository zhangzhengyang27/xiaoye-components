import type { StepsFormInstance, StepsFormProps, StepsFormStep } from "@xiaoye/pro-components";

const steps: StepsFormStep[] = [
  {
    key: "basic",
    title: "基础信息"
  },
  {
    key: "confirm",
    title: "确认信息"
  }
];

const props: StepsFormProps = {
  model: {
    name: "小叶"
  },
  steps
};

type StepsFormExpose = Pick<StepsFormInstance, "next" | "prev" | "submit">;

declare const stepsFormExpose: StepsFormExpose;

void steps;
void props;
void stepsFormExpose;
