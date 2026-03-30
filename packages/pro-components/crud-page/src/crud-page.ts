import type { FormRules } from "@xiaoye/components";
import type { SearchFormField } from "../../search-form";
import type { ListPageBatchAction } from "../../list-page";
import type { ProFieldSchema, ProPageAction } from "../../core";
import type { ProTableColumn } from "../../pro-table";

export interface CrudPageProps<T = Record<string, unknown>> {
  title?: string;
  description?: string;
  searchModel?: Record<string, unknown>;
  searchFields?: SearchFormField[];
  data?: T[];
  columns: ProTableColumn<T>[];
  toolbarActions?: ProPageAction[];
  batchActions?: ListPageBatchAction[];
  formModel: Record<string, unknown>;
  formSchema?: ProFieldSchema[];
  formRules?: FormRules;
  formType?: "drawer" | "modal";
  detailType?: "drawer" | "dialog" | "none";
}
