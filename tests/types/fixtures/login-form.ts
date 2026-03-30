import { h } from "vue";
import {
  XyLoginForm,
  type LoginFormInstance,
  type LoginFormModel,
  type LoginFormProps,
  type LoginFormThirdPartyItem
} from "@xiaoye/pro-components";

const model: LoginFormModel = {
  username: "xiaoye",
  password: "123456",
  remember: true
};

const thirdPartyItems: LoginFormThirdPartyItem[] = [
  {
    key: "wechat",
    label: "微信登录",
    icon: "mdi:wechat"
  }
];

const props: LoginFormProps = {
  model,
  title: "欢迎登录",
  description: "请输入账号信息继续访问控制台。",
  loading: false,
  disabled: false,
  submitText: "登录",
  showRemember: true,
  rememberLabel: "记住我",
  usernamePlaceholder: "请输入用户名",
  passwordPlaceholder: "请输入密码",
  thirdPartyItems
};

const vnode = h(XyLoginForm, props);

declare const instance: LoginFormInstance;

void model;
void thirdPartyItems;
void props;
void vnode;
void instance.validate;
void instance.submit;
void instance.focus;
