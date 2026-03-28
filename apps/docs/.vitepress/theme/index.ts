import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import XiaoyeComponents, {
  configProviderKey,
  createConfigProviderContext
} from "xiaoye-components";
import Demo from "./components/Demo.vue";
import ProjectIconGallery from "./components/ProjectIconGallery.vue";
import SchedulerPlaygroundFrame from "./components/SchedulerPlaygroundFrame.vue";
import "../../../../packages/xiaoye-components/style.css";
import "./style.css";

const DOCS_OVERLAY_Z_INDEX = 2100;

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.provide(
      configProviderKey,
      createConfigProviderContext({
        zIndex: DOCS_OVERLAY_Z_INDEX
      })
    );
    app.use(XiaoyeComponents);
    app.component("Demo", Demo);
    app.component("ProjectIconGallery", ProjectIconGallery);
    app.component("SchedulerPlaygroundFrame", SchedulerPlaygroundFrame);
  }
};

export default theme;
