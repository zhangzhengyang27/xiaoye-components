import type {
  DialogFormInstance,
  DialogFormProps,
  DialogFormSubmitPayload
} from "xiaoye-pro-components";

const dialogFormProps: DialogFormProps = {
  open: true,
  mode: "edit",
  title: "编辑成员",
  model: {
    name: "成员台账"
  },
  dialogProps: {
    width: 720
  }
};

void dialogFormProps;

const dialogFormPayload: DialogFormSubmitPayload = {
  mode: "edit",
  model: {
    name: "成员台账"
  }
};

void dialogFormPayload;

declare const dialogFormInstance: DialogFormInstance;

void dialogFormInstance.validate;
void dialogFormInstance.submit;
void dialogFormInstance.close;
