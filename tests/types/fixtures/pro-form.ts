import type { ProFormInstance, ProFormProps } from "@xiaoye/pro-components";

const props: ProFormProps = {
  title: "成员信息",
  model: {
    name: "小叶"
  },
  columns: 2,
  showSubmit: true
};

type ProFormExpose = Pick<ProFormInstance, "validate" | "submit" | "reset" | "clearValidate">;

declare const proFormExpose: ProFormExpose;

void props;
void proFormExpose;
