import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import XiaoyeComponents from "xiaoye-components";
import Demo from "./components/Demo.vue";
import "../../../../packages/xiaoye-components/style.css";
import "./style.css";

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(XiaoyeComponents);
    app.component("Demo", Demo);
  }
};

export default theme;
