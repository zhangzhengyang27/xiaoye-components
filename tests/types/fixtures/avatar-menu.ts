import { h } from "vue";
import {
  XyAvatarMenu,
  type AvatarMenuCommand,
  type AvatarMenuItem,
  type AvatarMenuProps
} from "@xiaoye/pro-components";

const command: AvatarMenuCommand = "logout";

const items: AvatarMenuItem[] = [
  {
    key: "profile",
    label: "个人中心",
    command: "profile"
  },
  {
    key: "logout",
    label: "退出登录",
    command
  }
];

const props: AvatarMenuProps = {
  username: "小叶",
  description: "超级管理员",
  items
};

const vnode = h(XyAvatarMenu, props);

void command;
void items;
void props;
void vnode;
