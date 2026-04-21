import type {
  DrawerFormInstance,
  DrawerFormProps,
  DrawerFormSubmitPayload
} from "xiaoye-pro-components";

const drawerFormProps: DrawerFormProps = {
  open: true,
  mode: "create",
  title: "新建成员",
  model: {
    name: ""
  },
  drawerProps: {
    size: 640
  }
};

void drawerFormProps;

const drawerFormPayload: DrawerFormSubmitPayload = {
  mode: "create",
  model: {
    name: "成员台账"
  }
};

void drawerFormPayload;

declare const drawerFormInstance: DrawerFormInstance;

void drawerFormInstance.validate;
void drawerFormInstance.submit;
void drawerFormInstance.close;
