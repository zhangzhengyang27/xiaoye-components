import CrudPage from "./src/crud-page.vue";
import type { CrudPageProps } from "./src/crud-page";
import { withInstall } from "@xiaoye/utils";

export type { CrudPageProps };

export const XyCrudPage = withInstall(CrudPage, "xy-crud-page");

export default XyCrudPage;
