import { createApp, defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import XiaoyeComponents from "xiaoye-components";
import XiaoyeProComponents from "xiaoye-pro-components";
import { proInstallCheckEntries } from "../../pro-components/component-manifest";
import { installCheckEntries } from "../../components/component-manifest";

describe("XiaoyeProComponents", () => {
  it("单独安装到同一个 app 时保持幂等", () => {
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

  it("和基础层组合安装时不会产生注册冲突", () => {
    const app = createApp(
      defineComponent({
        render() {
          return h("div");
        }
      })
    );
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    XiaoyeComponents.install(app);
    XiaoyeProComponents.install(app);
    XiaoyeComponents.install(app);
    XiaoyeProComponents.install(app);

    installCheckEntries.forEach((entry) => {
      if (entry.kind === "component") {
        expect(app.component(entry.name)).toBeTruthy();
      }
    });

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
