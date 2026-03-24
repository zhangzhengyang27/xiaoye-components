import type { PaginationLayoutKey, PaginationProps } from "xiaoye-components";

const layout: PaginationLayoutKey = "pager";

const paginationProps: PaginationProps = {
  currentPage: 2,
  defaultCurrentPage: 1,
  pageSize: 20,
  defaultPageSize: 10,
  total: 300,
  pageCount: 15,
  pagerCount: 9,
  layout: `prev, ${layout}, next, jumper, ->, total`,
  pageSizes: [10, 20, 50],
  prevText: "上一页",
  nextText: "下一页",
  size: "lg",
  small: false,
  teleported: true,
  appendSizeTo: "body",
  popperClass: "custom-pagination-popper",
  popperStyle: {
    minWidth: "120px"
  },
  disabled: false,
  background: true,
  hideOnSinglePage: false
};

void paginationProps;

const invalidPaginationProps: PaginationProps = {
  // @ts-expect-error invalid background type should be rejected
  background: "yes"
};

void invalidPaginationProps;
