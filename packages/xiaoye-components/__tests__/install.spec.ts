import { createApp, defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import XiaoyeComponents from "../index";

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

    expect(app.component("xy-button")).toBeTruthy();
    expect(app.component("xy-image")).toBeTruthy();
    expect(app.component("xy-progress")).toBeTruthy();
    expect(app.component("xy-skeleton")).toBeTruthy();
    expect(app.component("xy-skeleton-item")).toBeTruthy();
    expect(app.component("xy-result")).toBeTruthy();
    expect(app.component("xy-radio-group")).toBeTruthy();
    expect(
      warnSpy.mock.calls.some((args) =>
        String(args[0]).includes("already been registered in target app")
      )
    ).toBe(false);

    warnSpy.mockRestore();
  });
});
