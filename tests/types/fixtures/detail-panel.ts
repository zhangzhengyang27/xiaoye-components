import type { DetailPanelInstance, DetailPanelProps } from "@xiaoye/pro-components";

const props: DetailPanelProps = {
  open: true,
  container: "dialog",
  title: "详情面板",
  model: {
    owner: "小叶",
    status: "approved"
  },
  schema: [
    {
      prop: "owner",
      label: "负责人"
    },
    {
      prop: "status",
      label: "状态",
      valueType: "tag",
      options: [
        {
          label: "已通过",
          value: "approved",
          status: "success"
        }
      ]
    }
  ],
  descriptionsProps: {
    column: 2,
    border: true
  }
};

declare const instance: DetailPanelInstance;

void props;
void instance.close;
