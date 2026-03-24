import type { ComponentSize } from "@xiaoye/utils";
import type { StyleValue } from "vue";

export type PaginationLayoutKey =
  | "prev"
  | "pager"
  | "next"
  | "jumper"
  | "->"
  | "total"
  | "sizes"
  | "slot";

export interface PaginationProps {
  currentPage?: number;
  defaultCurrentPage?: number;
  pageSize?: number;
  defaultPageSize?: number;
  total?: number;
  pageCount?: number;
  pagerCount?: number;
  layout?: string;
  pageSizes?: number[];
  prevText?: string;
  nextText?: string;
  size?: ComponentSize;
  small?: boolean;
  teleported?: boolean;
  appendSizeTo?: string | HTMLElement;
  popperClass?: string;
  popperStyle?: StyleValue;
  disabled?: boolean;
  background?: boolean;
  hideOnSinglePage?: boolean;
}

export function clampPage(page: number, pageCount: number) {
  if (page < 1) {
    return 1;
  }

  if (page > pageCount) {
    return pageCount;
  }

  return page;
}

export function normalizePagerCount(value: number | undefined) {
  const fallback = 7;
  const input = Number.isInteger(value) ? Number(value) : fallback;
  const limited = Math.min(21, Math.max(5, input));
  return limited % 2 === 0 ? limited - 1 : limited;
}

export function buildPagerItems(
  currentPage: number,
  pageCount: number,
  pagerCount: number
): Array<number | "prev-more" | "next-more"> {
  if (pageCount <= pagerCount) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const halfPagerCount = (pagerCount - 1) / 2;
  const showPrevMore = currentPage > pagerCount - halfPagerCount;
  const showNextMore = currentPage < pageCount - halfPagerCount;
  const items: Array<number | "prev-more" | "next-more"> = [1];

  if (!showPrevMore && showNextMore) {
    for (let page = 2; page < pagerCount; page += 1) {
      items.push(page);
    }

    items.push("next-more", pageCount);
    return items;
  }

  if (showPrevMore && !showNextMore) {
    items.push("prev-more");

    const startPage = pageCount - (pagerCount - 2);
    for (let page = startPage; page <= pageCount; page += 1) {
      items.push(page);
    }

    return items;
  }

  if (showPrevMore && showNextMore) {
    items.push("prev-more");

    const offset = Math.floor(pagerCount / 2) - 1;
    for (let page = currentPage - offset; page <= currentPage + offset; page += 1) {
      items.push(page);
    }

    items.push("next-more", pageCount);
    return items;
  }

  return items;
}
