import NoticeCenter from "./src/notice-center.vue";
import type {
  NoticeCenterAction,
  NoticeCenterItem,
  NoticeCenterProps,
  NoticeCenterTab
} from "./src/notice-center";
import { withInstall } from "@xiaoye/utils";

export type {
  NoticeCenterAction,
  NoticeCenterItem,
  NoticeCenterProps,
  NoticeCenterTab
};

export const XyNoticeCenter = withInstall(NoticeCenter, "xy-notice-center");
export default XyNoticeCenter;
