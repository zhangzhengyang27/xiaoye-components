import { createApp, defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import XiaoyeComponents from "../index";
import { installCheckEntries } from "../../components/component-manifest";
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

    installCheckEntries.forEach((entry) => {
      if (entry.kind === "component") {
        expect(app.component(entry.name)).toBeTruthy();
        return;
      }

      if (entry.kind === "directive") {
        expect(app.directive(entry.name)).toBeTruthy();
        return;
      }

      expect(app.config.globalProperties[entry.name]).toBeTruthy();
    });

    expect(app.config.globalProperties.$loading).toBe(XyLoadingService);
    expect(
      warnSpy.mock.calls.some((args) =>
        String(args[0]).includes("already been registered in target app")
      )
    ).toBe(false);

    warnSpy.mockRestore();
  });
});
