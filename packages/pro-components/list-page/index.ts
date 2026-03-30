import ListPage from "./src/list-page.vue";
import type {
  ListPageBatchAction,
  ListPageActionRef,
  ListPageProps
} from "./src/list-page";
import { withInstall } from "@xiaoye/utils";

export type { ListPageBatchAction, ListPageActionRef, ListPageProps };

export const XyListPage = withInstall(ListPage, "xy-list-page");

export default XyListPage;
