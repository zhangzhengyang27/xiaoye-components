import { h } from "vue";
import {
  XyNoticeCenter,
  type NoticeCenterAction,
  type NoticeCenterItem,
  type NoticeCenterProps,
  type NoticeCenterTab
} from "@xiaoye/pro-components";

const items: NoticeCenterItem[] = [
  {
    key: "notice-1",
    title: "审批完成",
    content: "采购审批已通过",
    time: "10 分钟前",
    read: false
  }
];

const tabs: NoticeCenterTab[] = [
  {
    key: "notice",
    label: "通知",
    items
  }
];

const actions: NoticeCenterAction[] = [
  {
    key: "all-read",
    label: "全部已读"
  }
];

const props: NoticeCenterProps = {
  tabs,
  actions,
  emptyText: "暂无消息"
};

const vnode = h(XyNoticeCenter, props);

void items;
void tabs;
void actions;
void props;
void vnode;
