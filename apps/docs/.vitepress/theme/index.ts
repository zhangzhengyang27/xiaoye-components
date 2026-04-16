import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import XiaoyeComponents, {
  configProviderKey,
  createConfigProviderContext
} from "xiaoye-components";
import XiaoyeProComponents from "xiaoye-pro-components";
import XiaoyeFrontline from "@xiaoye/frontline";
import Demo from "./components/Demo.vue";
import HomeProductLineDemo from "./components/HomeProductLineDemo.vue";
import ProjectIconGallery from "./components/ProjectIconGallery.vue";
import SchedulerPlaygroundFrame from "./components/SchedulerPlaygroundFrame.vue";
import "xiaoye-components/style.css";
import "xiaoye-pro-components/style.css";
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
    app.use(XiaoyeProComponents);
    app.use(XiaoyeFrontline);
    app.component("Demo", Demo);
    app.component("HomeProductLineDemo", HomeProductLineDemo);
    app.component("ProjectIconGallery", ProjectIconGallery);
    app.component("SchedulerPlaygroundFrame", SchedulerPlaygroundFrame);
  }
};

export default theme;
