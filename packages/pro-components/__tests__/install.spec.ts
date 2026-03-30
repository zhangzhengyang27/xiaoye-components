import { createApp, defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import XiaoyeProComponents from "../index";
import { proInstallCheckEntries } from "../component-manifest";

describe("XiaoyeProComponents", () => {
  it("重复 install 到同一个 app 时保持幂等", () => {
    const app = createApp(
      defineComponent({
        render() {
          return h("div");
        }
      })
    );

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    XiaoyeProComponents.install(app);
    XiaoyeProComponents.install(app);

    proInstallCheckEntries.forEach((entry) => {
      if (entry.kind === "component") {
        expect(app.component(entry.name)).toBeTruthy();
      }
    });

    expect(
      warnSpy.mock.calls.some((args) =>
        String(args[0]).includes("already been registered in target app")
      )
    ).toBe(false);

    warnSpy.mockRestore();
  });
});
