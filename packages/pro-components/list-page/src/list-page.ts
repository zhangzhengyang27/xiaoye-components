import type { SearchFormField } from "../../search-form";
import type { ButtonType } from "@xiaoye/components";
import type { ProTableColumn } from "../../pro-table";
import type { ProActionRef, ProPageAction, ProRequestContext, ProRequestResult } from "../../core";

export interface ListPageBatchAction {
  key: string;
  label: string;
  type?: ButtonType;
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface ListPageProps<T = Record<string, unknown>> {
  title?: string;
  description?: string;
  searchModel?: Record<string, unknown>;
  searchFields?: SearchFormField[];
  data?: T[];
  columns: ProTableColumn<T>[];
  request?: (params: Record<string, unknown>, ctx: ProRequestContext) => Promise<ProRequestResult<T>>;
  toolbarActions?: ProPageAction[];
  batchActions?: ListPageBatchAction[];
  immediate?: boolean;
  pageSize?: number;
}

export interface ListPageActionRef extends ProActionRef {
  clearSelection: () => void;
}

/** @deprecated 请改用 ListPageBatchAction。 */
export type BatchActionBarAction = ListPageBatchAction;
