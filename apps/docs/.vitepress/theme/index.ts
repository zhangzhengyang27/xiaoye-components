import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import { computed } from "vue";
import XiaoyeComponents from "xiaoye-components";
import {
  DEFAULT_NAMESPACE,
  configProviderKey
} from "../../../../packages/components/config-provider/src/context";
import Demo from "./components/Demo.vue";
import ProjectIconGallery from "./components/ProjectIconGallery.vue";
import SchedulerPlaygroundFrame from "./components/SchedulerPlaygroundFrame.vue";
import "../../../../packages/xiaoye-components/style.css";
import "./style.css";

const DOCS_OVERLAY_Z_INDEX = 2100;

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.provide(configProviderKey, {
      namespace: computed(() => DEFAULT_NAMESPACE),
      locale: computed(() => ({})),
      zIndex: computed(() => DOCS_OVERLAY_Z_INDEX),
      size: computed(() => "md"),
      dialog: computed(() => ({})),
      loading: computed(() => ({})),
      message: computed(() => ({})),
      notification: computed(() => ({}))
    });
    app.use(XiaoyeComponents);
    app.component("Demo", Demo);
    app.component("ProjectIconGallery", ProjectIconGallery);
    app.component("SchedulerPlaygroundFrame", SchedulerPlaygroundFrame);
  }
};

export default theme;
