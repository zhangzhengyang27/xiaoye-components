import type {
  OverlayFormInstance,
  OverlayFormProps,
  OverlayFormSubmitPayload
} from "@xiaoye/pro-components";

const props: OverlayFormProps = {
  open: true,
  container: "drawer",
  mode: "view",
  resetOnClose: true,
  destroyOnClose: true,
  model: {
    name: "成员台账"
  },
  schema: [
    {
      prop: "name",
      label: "名称"
    }
  ]
};

const payload: OverlayFormSubmitPayload = {
  mode: "edit",
  model: {
    name: "成员台账"
  }
};

declare const instance: OverlayFormInstance;

void props;
void payload;
void instance.validate;
void instance.submit;
void instance.close;
