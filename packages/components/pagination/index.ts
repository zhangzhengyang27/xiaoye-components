import Pagination from "./src/pagination.vue";
import type { PaginationProps } from "./src/pagination.vue";
import { withInstall } from "@xiaoye/utils";

export type { PaginationProps };

export const XyPagination = withInstall(Pagination, "xy-pagination");
export default XyPagination;
