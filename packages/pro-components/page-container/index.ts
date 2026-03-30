import PageContainer from "./src/page-container.vue";
import type { PageContainerProps } from "./src/page-container";
import { withInstall } from "@xiaoye/utils";

export type { PageContainerProps };

export const XyPageContainer = withInstall(PageContainer, "xy-page-container");
export default XyPageContainer;
