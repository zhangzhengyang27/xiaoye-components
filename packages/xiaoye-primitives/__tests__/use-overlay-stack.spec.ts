import { afterEach, describe, expect, it } from "vitest";
import { createApp, defineComponent, h } from "vue";
import { useOverlayStack } from "../src/composables/use-overlay-stack";
import type { App } from "vue";

const mountedApps: App[] = [];

// useOverlayStack 内部注册 onBeforeUnmount，需要挂在真实组件实例上
function mountWithOverlayStack() {
  const host = document.createElement("div");
  document.body.appendChild(host);

  let entry: ReturnType<typeof useOverlayStack> | undefined;
  const Host = defineComponent({
    setup() {
      entry = useOverlayStack();
      return () => h("div");
    }
  });

  const app = createApp(Host);
  app.mount(host);
  mountedApps.push(app);

  return { entry: entry! };
}

afterEach(() => {
  for (const app of mountedApps.splice(0)) {
    app.unmount();
  }
  document.body.innerHTML = "";
});

describe("useOverlayStack zIndex 响应式", () => {
  it("打开前预读 -1，openLayer 后 computed 立即更新", () => {
    const { entry } = mountWithOverlayStack();

    expect(entry.zIndex.value).toBe(-1);

    entry.openLayer();
    expect(entry.zIndex.value).toBeGreaterThan(0);

    entry.closeLayer();
    expect(entry.zIndex.value).toBe(-1);
  });

  it("close 后 reopen 拿到更大的新 zIndex（computed 不残留旧缓存）", () => {
    const { entry } = mountWithOverlayStack();

    entry.openLayer();
    const firstZIndex = entry.zIndex.value;

    entry.closeLayer();
    entry.openLayer();

    expect(entry.zIndex.value).toBeGreaterThan(firstZIndex);
  });

  it("isTopMost 语义保持：只有已打开且位于栈顶的 entry 为 true", () => {
    const first = mountWithOverlayStack();
    const second = mountWithOverlayStack();

    // 未打开的 entry 恒为 false
    expect(first.entry.isTopMost()).toBe(false);
    expect(second.entry.isTopMost()).toBe(false);

    first.entry.openLayer();
    expect(first.entry.isTopMost()).toBe(true);

    second.entry.openLayer();
    expect(first.entry.isTopMost()).toBe(false);
    expect(second.entry.isTopMost()).toBe(true);

    second.entry.closeLayer();
    expect(first.entry.isTopMost()).toBe(true);
    expect(second.entry.isTopMost()).toBe(false);

    first.entry.closeLayer();
    expect(first.entry.isTopMost()).toBe(false);
  });
});
