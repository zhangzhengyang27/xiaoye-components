import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import XiaoyeComponents from "xiaoye-components";
import "../../../../packages/xiaoye-components/style.css";
import "./style.css";

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(XiaoyeComponents);
  }
};

export default theme;
