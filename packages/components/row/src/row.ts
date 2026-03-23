import type { ComputedRef, InjectionKey } from "vue";

export const rowJustifies = [
  "start",
  "center",
  "end",
  "space-around",
  "space-between",
  "space-evenly"
] as const;

export const rowAligns = ["top", "middle", "bottom"] as const;

export type RowJustify = (typeof rowJustifies)[number];
export type RowAlign = (typeof rowAligns)[number];

export interface RowProps {
  tag?: string;
  gutter?: number;
  justify?: RowJustify;
  align?: RowAlign;
}

export interface RowContext {
  gutter: ComputedRef<number>;
}

export const rowContextKey: InjectionKey<RowContext> = Symbol("xiaoye-row");
