import SearchForm from "./src/search-form.vue";
import type {
  SearchFormField,
  SearchFormInstance,
  SearchFormProps
} from "./src/search-form";
import { withInstall } from "@xiaoye/utils";

export type {
  SearchFormField,
  SearchFormInstance,
  SearchFormProps
};

export const XySearchForm = withInstall(SearchForm, "xy-search-form");

export default XySearchForm;
