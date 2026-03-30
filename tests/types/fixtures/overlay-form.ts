import type {
  OverlayFormInstance,
  OverlayFormProps,
  OverlayFormSubmitPayload
} from "@xiaoye/pro-components";

const props: OverlayFormProps = {
  open: true,
  container: "drawer",
  resetOnClose: true,
  destroyOnClose: true,
  model: {
    name: "成员台账"
  }
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
