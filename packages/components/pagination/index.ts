import Pagination from "./src/pagination.vue";
import type {
  PaginationChangeHandler,
  PaginationLayoutKey,
  PaginationPageHandler,
  PaginationProps
} from "./src/pagination";
import { withInstall } from "@xiaoye/primitives";

export type {
  PaginationChangeHandler,
  PaginationLayoutKey,
  PaginationPageHandler,
  PaginationProps
};

export const XyPagination = withInstall(Pagination, "xy-pagination");
export default XyPagination;
