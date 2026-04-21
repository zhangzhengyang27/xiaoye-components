import { withInstall } from "xiaoye-primitives";
import Pagination from "./pagination.vue";
import Pager from "./pager.vue";
import type { PaginationProps, PaginationEmits, PaginationInstance, PagerInstance } from "./pagination";

export type { PaginationProps, PaginationEmits, PaginationInstance, PagerInstance };

export const XyuPagination = withInstall(Pagination, "XyuPagination");
export const XyuPager = withInstall(Pager, "XyuPager");

export default XyuPagination;
