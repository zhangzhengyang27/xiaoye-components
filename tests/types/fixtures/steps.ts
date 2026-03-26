import { h } from "vue";
import {
  XyStep,
  XySteps,
  type StepProps,
  type StepStatus,
  type StepsDirection,
  type StepsProps,
  type StepsStatus
} from "xiaoye-components";

const direction: StepsDirection = "vertical";
const finishStatus: StepsStatus = "success";
const processStatus: StepsStatus = "error";
const stepStatus: StepStatus = "process";

const stepsProps: StepsProps = {
  active: 2,
  direction,
  alignCenter: true,
  simple: false,
  space: "33.33%",
  finishStatus,
  processStatus
};

const stepProps: StepProps = {
  title: "审批中",
  description: "等待运营确认",
  icon: "mdi:pencil",
  status: stepStatus
};

void stepsProps;
void stepProps;

const stepsVNode = h(
  XySteps,
  {
    active: 1,
    direction: "horizontal",
    finishStatus: "finish",
    processStatus: "process"
  },
  {
    default: () => [
      h(XyStep as never, { title: "提交申请" } as never),
      h(
        XySteps.Item as never,
        {
          title: "主管审批",
          status: "error"
        } as never,
        {
          description: () => "等待负责人处理"
        }
      ),
      h(XyStep as never, { title: "完成归档" } as never)
    ]
  }
);

void stepsVNode;

const invalidDirection: StepsProps = {
  // @ts-expect-error invalid direction
  direction: "row"
};

void invalidDirection;

const invalidFinishStatus: StepsProps = {
  // @ts-expect-error invalid finish status
  finishStatus: "done"
};

void invalidFinishStatus;

const invalidStepStatus: StepProps = {
  // @ts-expect-error invalid step status
  status: "pending"
};

void invalidStepStatus;
