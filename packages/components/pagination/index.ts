import Pagination from "./src/pagination.vue";
import type { PaginationLayoutKey, PaginationProps } from "./src/pagination";
import { withInstall } from "@xiaoye/utils";

export type { PaginationLayoutKey, PaginationProps };

export const XyPagination = withInstall(Pagination, "xy-pagination");
export default XyPagination;
