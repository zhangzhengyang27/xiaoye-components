import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { computed, createApp, defineComponent, h, nextTick, ref } from "vue";
import { DEFAULT_NAMESPACE, configProviderKey } from "../../config-provider/src/context";
import { XyLoading, XyLoadingService } from "../index";
import type { LoadingBinding } from "../index";

enableAutoUnmount(afterEach);

async function flushLoading() {
  await nextTick();
  await nextTick();
}

async function resetLoadingDom() {
  vi.runAllTimers();
  await flushLoading();

  document.body.innerHTML = "";
  document.body.removeAttribute("aria-busy");
  document.body.classList.remove("xy-loading-parent--relative", "xy-loading-parent--hidden");
  document.body.removeAttribute("data-xy-loading-count");
  document.body.removeAttribute("data-xy-loading-busy-count");
  document.body.removeAttribute("data-xy-loading-relative-count");
  document.body.removeAttribute("data-xy-loading-hidden-count");
}

afterEach(async () => {
  vi.useFakeTimers();
  await resetLoadingDom();
  vi.useRealTimers();
});

describe("XyLoading", () => {
  it("directive 支持基础创建、更新和卸载清理", async () => {
    vi.useFakeTimers();

    const loading = ref(true);
    const options = ref<LoadingBinding>({
      text: "首屏加载",
      customClass: "custom-loading-mask"
    });
    const show = ref(true);

    mount(
      defineComponent({
        setup() {
          return {
            loading,
            options,
            show
          };
        },
        template: `
          <div v-if="show" class="loading-host" v-loading="loading ? options : false"></div>
        `
      }),
      {
        attachTo: document.body,
        global: {
          plugins: [XyLoading]
        }
      }
    );

    await flushLoading();

    expect(document.body.querySelector(".xy-loading-mask")).not.toBeNull();
    expect(document.body.querySelector(".xy-loading-text")?.textContent).toContain("首屏加载");
    expect(document.body.querySelector(".custom-loading-mask")).not.toBeNull();
    expect(document.body.querySelector(".loading-host")?.getAttribute("aria-busy")).toBe("true");

    options.value = {
      text: "二次加载",
      background: "rgba(15, 23, 42, 0.35)"
    };
    await flushLoading();

    expect(document.body.querySelector(".xy-loading-text")?.textContent).toContain("二次加载");
    expect(document.body.querySelector(".xy-loading-mask")?.getAttribute("style")).toContain(
      "background-color: rgba(15, 23, 42, 0.35)"
    );

    loading.value = false;
    await flushLoading();
    vi.runAllTimers();
    await flushLoading();

    expect(document.body.querySelector(".xy-loading-mask")).toBeNull();
    expect(document.body.querySelector(".loading-host")?.hasAttribute("aria-busy")).toBe(false);

    show.value = false;
    await flushLoading();
  });

  it("directive 读取 xy-loading-* 属性", async () => {
    mount(
      defineComponent({
        setup() {
          return {
            loading: true
          };
        },
        template: `
          <div
            class="loading-host"
            v-loading="loading"
            xy-loading-text="同步中"
            xy-loading-custom-class="loading-mask--custom"
            xy-loading-background="rgba(255, 255, 255, 0.75)"
            xy-loading-svg="<path class='loading-path' d='M 20 10 L 30 40' />"
          />
        `
      }),
      {
        attachTo: document.body,
        global: {
          plugins: [XyLoading]
        }
      }
    );

    await flushLoading();

    expect(document.body.querySelector(".xy-loading-text")?.textContent).toContain("同步中");
    expect(document.body.querySelector(".loading-mask--custom")).not.toBeNull();
    expect(document.body.querySelector(".loading-path")).not.toBeNull();
    expect(document.body.querySelector(".xy-loading-mask")?.getAttribute("style")).toContain(
      "background-color: rgba(255, 255, 255, 0.75)"
    );
  });

  it("directive 支持 body 修饰符", async () => {
    vi.useFakeTimers();

    const loading = ref(true);

    mount(
      defineComponent({
        setup() {
          return {
            loading
          };
        },
        template: `
          <div class="loading-host" v-loading.body="loading" />
        `
      }),
      {
        attachTo: document.body,
        global: {
          plugins: [XyLoading]
        }
      }
    );

    await flushLoading();

    const mask = document.body.querySelector(".xy-loading-mask");
    expect(mask?.parentElement).toBe(document.body);
    expect(mask?.classList.contains("is-fullscreen")).toBe(false);

    loading.value = false;
    await flushLoading();
    vi.runAllTimers();
    await flushLoading();
  });

  it("directive 支持 fullscreen 和 lock 修饰符", async () => {
    vi.useFakeTimers();

    const loading = ref(true);

    mount(
      defineComponent({
        setup() {
          return {
            loading
          };
        },
        template: `
          <div class="loading-host" v-loading.fullscreen.lock="loading" />
        `
      }),
      {
        attachTo: document.body,
        global: {
          plugins: [XyLoading]
        }
      }
    );

    await flushLoading();

    const mask = document.body.querySelector(".xy-loading-mask");
    expect(mask?.parentElement).toBe(document.body);
    expect(mask?.classList.contains("is-fullscreen")).toBe(true);
    expect(document.body.classList.contains("xy-loading-parent--hidden")).toBe(true);

    loading.value = false;
    await flushLoading();
    vi.runAllTimers();
    await flushLoading();
  });

  it("service 默认创建 fullscreen loading", async () => {
    vi.useFakeTimers();

    const instance = XyLoadingService();

    await flushLoading();

    const mask = document.body.querySelector(".xy-loading-mask");
    expect(mask).not.toBeNull();
    expect(mask?.classList.contains("is-fullscreen")).toBe(true);
    expect(mask?.parentElement).toBe(document.body);

    instance.close();
    vi.runAllTimers();
    await flushLoading();
  });

  it("service 的 fullscreen 保持单例", async () => {
    vi.useFakeTimers();

    const first = XyLoadingService({
      fullscreen: true
    });
    const second = XyLoadingService({
      fullscreen: true
    });

    await flushLoading();

    expect(first).toBe(second);
    expect(document.body.querySelectorAll(".xy-loading-mask")).toHaveLength(1);

    second.close();
    vi.runAllTimers();
    await flushLoading();
  });

  it("service 支持 selector 和 HTMLElement target", async () => {
    vi.useFakeTimers();

    document.body.innerHTML = `<div class="loading-target"></div>`;
    const target = document.createElement("div");
    target.className = "loading-target-element";
    document.body.appendChild(target);

    const selectorInstance = XyLoadingService({
      target: ".loading-target",
      text: "Selector"
    });
    const elementInstance = XyLoadingService({
      target,
      text: "Element"
    });

    await flushLoading();

    expect(document.querySelector(".loading-target .xy-loading-mask")).not.toBeNull();
    expect(target.querySelector(".xy-loading-mask")).not.toBeNull();

    selectorInstance.close();
    elementInstance.close();
    vi.runAllTimers();
    await flushLoading();
  });

  it("service 支持 body 挂载到 document.body", async () => {
    vi.useFakeTimers();

    document.body.innerHTML = `<div class="loading-target" style="margin-top: 8px; width: 120px; height: 60px;"></div>`;

    const instance = XyLoadingService({
      target: ".loading-target",
      body: true,
      text: "Body"
    });

    await flushLoading();

    const mask = document.body.querySelector(".xy-loading-mask");
    expect(mask?.parentElement).toBe(document.body);
    expect(mask?.classList.contains("is-fullscreen")).toBe(false);
    expect(document.querySelector(".loading-target")?.getAttribute("aria-busy")).toBe("true");

    instance.close();
    vi.runAllTimers();
    await flushLoading();
    expect(document.querySelector(".loading-target")?.hasAttribute("aria-busy")).toBe(false);
  });

  it("service close 会触发 beforeClose 拦截和 closed 回调", async () => {
    vi.useFakeTimers();

    const beforeClose = vi.fn(() => false);
    const closed = vi.fn();
    const instance = XyLoadingService({
      beforeClose,
      closed
    });

    await flushLoading();
    instance.close();
    vi.runAllTimers();
    await flushLoading();

    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(closed).not.toHaveBeenCalled();
    expect(document.body.querySelector(".xy-loading-mask")).not.toBeNull();

    instance.update({
      beforeClose: () => true
    });
    instance.close();
    vi.runAllTimers();
    await flushLoading();

    expect(closed).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector(".xy-loading-mask")).toBeNull();
  });

  it("service 支持 delay，并会在显示前关闭时取消挂载", async () => {
    vi.useFakeTimers();

    const delayed = XyLoadingService({
      delay: 120,
      text: "延迟显示"
    });

    await flushLoading();
    expect(document.body.querySelector(".xy-loading-mask")).toBeNull();

    delayed.close();
    vi.advanceTimersByTime(400);
    await flushLoading();
    expect(document.body.querySelector(".xy-loading-mask")).toBeNull();

    const visibleDelayed = XyLoadingService({
      delay: 120,
      text: "延迟显示"
    });

    vi.advanceTimersByTime(120);
    await flushLoading();

    expect(document.body.querySelector(".xy-loading-text")?.textContent).toContain("延迟显示");

    visibleDelayed.close();
    vi.runAllTimers();
    await flushLoading();
  });

  it("service 支持 minDuration 防闪烁", async () => {
    vi.useFakeTimers();

    const instance = XyLoadingService({
      minDuration: 120,
      text: "最短可见"
    });

    await flushLoading();
    instance.close();
    vi.advanceTimersByTime(100);
    await flushLoading();

    expect(document.body.querySelector(".xy-loading-mask")).not.toBeNull();

    vi.runAllTimers();
    await flushLoading();

    expect(document.body.querySelector(".xy-loading-mask")).toBeNull();
  });

  it("groupKey 会复用现有实例并合并可更新字段", async () => {
    vi.useFakeTimers();

    const first = XyLoadingService({
      groupKey: "publish-task",
      text: "发布中"
    });
    const second = XyLoadingService({
      groupKey: "publish-task",
      text: "发布已更新",
      background: "rgba(15, 23, 42, 0.3)"
    });

    await flushLoading();

    expect(first).toBe(second);
    expect(document.body.querySelectorAll(".xy-loading-mask")).toHaveLength(1);
    expect(document.body.querySelector(".xy-loading-text")?.textContent).toContain("发布已更新");
    expect(document.body.querySelector(".xy-loading-mask")?.getAttribute("style")).toContain(
      "background-color: rgba(15, 23, 42, 0.3)"
    );

    first.close();
    vi.runAllTimers();
    await flushLoading();
  });

  it("closeAll 会关闭当前所有 service loading", async () => {
    vi.useFakeTimers();

    const firstTarget = document.createElement("div");
    const secondTarget = document.createElement("div");
    document.body.append(firstTarget, secondTarget);

    XyLoadingService({
      target: firstTarget,
      text: "A"
    });
    XyLoadingService({
      target: secondTarget,
      text: "B"
    });

    await flushLoading();
    expect(document.body.querySelectorAll(".xy-loading-mask")).toHaveLength(2);

    XyLoadingService.closeAll();
    vi.runAllTimers();
    await flushLoading();

    expect(document.body.querySelector(".xy-loading-mask")).toBeNull();
  });

  it("with() 在成功时会自动关闭 loading 并返回结果", async () => {
    vi.useFakeTimers();

    const task = new Promise<string>((resolve) => {
      window.setTimeout(() => resolve("done"), 60);
    });
    const resultPromise = XyLoadingService.with(task, {
      text: "执行中"
    });

    await flushLoading();
    expect(document.body.querySelector(".xy-loading-text")?.textContent).toContain("执行中");

    vi.advanceTimersByTime(60);
    await expect(resultPromise).resolves.toBe("done");

    vi.runAllTimers();
    await flushLoading();
    expect(document.body.querySelector(".xy-loading-mask")).toBeNull();
  });

  it("with() 在失败时会自动关闭 loading 并继续抛错", async () => {
    vi.useFakeTimers();

    const task = new Promise<string>((_, reject) => {
      window.setTimeout(() => reject(new Error("fail")), 60);
    });
    const resultPromise = XyLoadingService.with(task, {
      text: "执行中"
    });

    await flushLoading();
    expect(document.body.querySelector(".xy-loading-mask")).not.toBeNull();

    vi.advanceTimersByTime(60);
    await expect(resultPromise).rejects.toThrow("fail");

    vi.runAllTimers();
    await flushLoading();
    expect(document.body.querySelector(".xy-loading-mask")).toBeNull();
  });

  it("service 支持 setText 更新文案", async () => {
    vi.useFakeTimers();

    const instance = XyLoadingService({
      text: "初始文案"
    });

    await flushLoading();
    instance.setText("更新后的文案");
    await flushLoading();

    expect(document.body.querySelector(".xy-loading-text")?.textContent).toContain("更新后的文案");

    instance.close();
    vi.runAllTimers();
    await flushLoading();
  });

  it("多个 loading 共享父节点时不会过早移除 relative class", async () => {
    vi.useFakeTimers();

    const target = document.createElement("div");
    target.style.width = "160px";
    target.style.height = "80px";
    document.body.appendChild(target);

    const first = XyLoadingService({
      target
    });
    const second = XyLoadingService({
      target
    });

    await flushLoading();

    expect(target.classList.contains("xy-loading-parent--relative")).toBe(true);

    first.close();
    vi.runAllTimers();
    await flushLoading();

    expect(target.classList.contains("xy-loading-parent--relative")).toBe(true);

    second.close();
    vi.runAllTimers();
    await flushLoading();

    expect(target.classList.contains("xy-loading-parent--relative")).toBe(false);
  });

  it("body 模式会跟随目标位置和尺寸变化，并在关闭后清理 observer", async () => {
    vi.useFakeTimers();

    const originalResizeObserver = globalThis.ResizeObserver;
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    const originalCancelAnimationFrame = window.cancelAnimationFrame;
    let triggerResize = () => {};
    let observerDisconnected = false;
    let rect = {
      top: 10,
      left: 20,
      width: 120,
      height: 60
    };

    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        triggerResize = () => callback([], this as unknown as ResizeObserver);
      }

      observe() {}

      disconnect() {
        observerDisconnected = true;
      }
    }

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(0), 0)) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = ((handle: number) =>
      window.clearTimeout(handle)) as typeof window.cancelAnimationFrame;

    const target = document.createElement("div");
    target.getBoundingClientRect = vi.fn(() => rect as DOMRect);
    document.body.appendChild(target);

    const instance = XyLoadingService({
      target,
      body: true
    });

    await flushLoading();
    vi.runAllTimers();
    await flushLoading();

    expect(instance.$el.style.top).toBe("10px");
    expect(instance.$el.style.left).toBe("20px");
    expect(instance.$el.style.width).toBe("120px");
    expect(instance.$el.style.height).toBe("60px");

    rect = {
      top: 48,
      left: 36,
      width: 180,
      height: 90
    };
    window.dispatchEvent(new Event("resize"));
    vi.runAllTimers();
    await flushLoading();

    expect(instance.$el.style.top).toBe("48px");
    expect(instance.$el.style.left).toBe("36px");

    rect = {
      top: 72,
      left: 30,
      width: 200,
      height: 96
    };
    triggerResize();
    vi.runAllTimers();
    await flushLoading();

    expect(instance.$el.style.width).toBe("200px");
    expect(instance.$el.style.height).toBe("96px");

    instance.close();
    vi.runAllTimers();
    await flushLoading();

    expect(observerDisconnected).toBe(true);

    if (originalResizeObserver) {
      vi.stubGlobal("ResizeObserver", originalResizeObserver);
    } else {
      vi.unstubAllGlobals();
    }

    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it("service 支持继承 app context 中的 zIndex", async () => {
    vi.useFakeTimers();

    const app = createApp(
      defineComponent({
        render() {
          return h("div");
        }
      })
    );

    app.provide(configProviderKey, {
      namespace: computed(() => DEFAULT_NAMESPACE),
      locale: computed(() => ({})),
      zIndex: computed(() => 4096),
      size: computed(() => "md" as const),
      dialog: computed(() => ({})),
      loading: computed(() => ({
        text: "全局加载中",
        background: "rgba(15, 23, 42, 0.24)",
        delay: 40
      })),
      message: computed(() => ({})),
      notification: computed(() => ({}))
    });
    app.use(XyLoading);

    const instance = app.config.globalProperties.$loading!();
    await flushLoading();
    expect(document.body.querySelector(".xy-loading-mask")).toBeNull();

    vi.advanceTimersByTime(40);
    await flushLoading();

    expect(Number(instance.$el.style.zIndex)).toBeGreaterThanOrEqual(4097);
    expect(document.body.querySelector(".xy-loading-text")?.textContent).toContain("全局加载中");
    expect(document.body.querySelector(".xy-loading-mask")?.getAttribute("style")).toContain(
      "background-color: rgba(15, 23, 42, 0.24)"
    );
    instance.close();
    vi.runAllTimers();
    await flushLoading();
  });
});
