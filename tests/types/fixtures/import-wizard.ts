import type { ImportWizardProps, ImportWizardStep } from "@xiaoye/pro-components";

const steps: ImportWizardStep[] = [
  {
    key: "upload",
    title: "上传文件"
  },
  {
    key: "confirm",
    title: "确认导入"
  }
];

const props: ImportWizardProps = {
  title: "导入向导",
  steps,
  defaultActive: 0
};

void steps;
void props;
