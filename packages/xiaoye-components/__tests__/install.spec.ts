import { createApp, defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import XiaoyeComponents from "../index";
import { XyLoadingService } from "../../components/loading";

describe("XiaoyeComponents", () => {
  it("重复 install 到同一个 app 时保持幂等", () => {
    const app = createApp(
      defineComponent({
        render() {
          return h("div");
        }
      })
    );

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    XiaoyeComponents.install(app);
    XiaoyeComponents.install(app);

    expect(app.component("xy-affix")).toBeTruthy();
    expect(app.component("xy-alert")).toBeTruthy();
    expect(typeof app.config.globalProperties.$message).toBe("function");
    expect(app.component("xy-notification")).toBeTruthy();
    expect(typeof app.config.globalProperties.$notify).toBe("function");
    expect(app.component("xy-backtop")).toBeTruthy();
    expect(app.component("xy-menu")).toBeTruthy();
    expect(app.component("xy-menu-item")).toBeTruthy();
    expect(app.component("xy-menu-item-group")).toBeTruthy();
    expect(app.component("xy-sub-menu")).toBeTruthy();
    expect(app.component("xy-button")).toBeTruthy();
    expect(app.component("xy-breadcrumb")).toBeTruthy();
    expect(app.component("xy-breadcrumb-item")).toBeTruthy();
    expect(app.component("xy-dropdown")).toBeTruthy();
    expect(app.component("xy-dropdown-menu")).toBeTruthy();
    expect(app.component("xy-dropdown-item")).toBeTruthy();
    expect(app.component("xy-dialog")).toBeTruthy();
    expect(app.component("xy-divider")).toBeTruthy();
    expect(app.component("xy-image")).toBeTruthy();
    expect(app.component("xy-popconfirm")).toBeTruthy();
    expect(app.component("xy-progress")).toBeTruthy();
    expect(app.component("xy-steps")).toBeTruthy();
    expect(app.component("xy-step")).toBeTruthy();
    expect(app.component("xy-statistic")).toBeTruthy();
    expect(app.component("xy-countdown")).toBeTruthy();
    expect(app.component("xy-skeleton")).toBeTruthy();
    expect(app.component("xy-skeleton-item")).toBeTruthy();
    expect(app.component("xy-timeline")).toBeTruthy();
    expect(app.component("xy-timeline-group")).toBeTruthy();
    expect(app.component("xy-timeline-item")).toBeTruthy();
    expect(app.component("xy-anchor")).toBeTruthy();
    expect(app.component("xy-anchor-link")).toBeTruthy();
    expect(app.component("xy-result")).toBeTruthy();
    expect(app.component("xy-table-column")).toBeTruthy();
    expect(app.component("xy-tree")).toBeTruthy();
    expect(app.component("xy-radio-group")).toBeTruthy();
    expect(app.directive("loading")).toBeTruthy();
    expect(app.config.globalProperties.$loading).toBe(XyLoadingService);
    expect(
      warnSpy.mock.calls.some((args) =>
        String(args[0]).includes("already been registered in target app")
      )
    ).toBe(false);

    warnSpy.mockRestore();
  });
});
