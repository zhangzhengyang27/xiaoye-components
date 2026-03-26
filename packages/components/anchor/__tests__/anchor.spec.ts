import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { XyAffix } from "../../affix";
import { XyAnchor, XyAnchorLink } from "../index";

enableAutoUnmount(afterEach);

let windowScrollTop = 0;
let rafTime = 0;

function createRect({
  top,
  left = 0,
  width = 120,
  height = 28
}: {
  top: number;
  left?: number;
  width?: number;
  height?: number;
}) {
  return {
    x: left,
    y: top,
    top,
    left,
    width,
    height,
    bottom: top + height,
    right: left + width,
    toJSON: () => ({})
  } as DOMRect;
}

function mockWindowTarget(selector: string, absoluteTop: number, height = 120) {
  const element = document.createElement("section");
  element.id = selector.replace(/^#/, "");
  document.body.appendChild(element);

  vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => {
    return createRect({
      top: absoluteTop - windowScrollTop,
      width: 640,
      height
    });
  });

  return element;
}

function createScrollContainer(selector = ".anchor-scroll-container") {
  const element = document.createElement("div");
  element.className = selector.replace(/^\./, "");
  element.style.overflow = "auto";

  let scrollTop = 0;

  Object.defineProperty(element, "clientHeight", {
    configurable: true,
    get: () => 240
  });
  Object.defineProperty(element, "scrollHeight", {
    configurable: true,
    get: () => 1280
  });
  Object.defineProperty(element, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = value;
    }
  });

  vi.spyOn(element, "getBoundingClientRect").mockReturnValue(
    createRect({
      top: 120,
      left: 0,
      width: 420,
      height: 240
    })
  );

  element.scrollTo = vi.fn((arg1?: number | ScrollToOptions, arg2?: number) => {
    if (typeof arg1 === "object") {
      scrollTop = Number(arg1?.top ?? scrollTop);
    } else if (typeof arg1 === "number") {
      scrollTop = typeof arg2 === "number" ? arg2 : scrollTop;
    }
  }) as typeof element.scrollTo;

  document.body.appendChild(element);

  return element;
}

function mockContainerTarget(
  container: HTMLElement,
  selector: string,
  offsetTop: number,
  height = 120
) {
  const element = document.createElement("section");
  element.id = selector.replace(/^#/, "");
  container.appendChild(element);

  vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => {
    const containerRect = container.getBoundingClientRect();

    return createRect({
      top: containerRect.top + offsetTop - container.scrollTop,
      left: containerRect.left,
      width: containerRect.width,
      height
    });
  });

  return element;
}

async function triggerWindowScroll(top: number) {
  windowScrollTop = top;
  Object.defineProperty(window, "pageYOffset", {
    configurable: true,
    value: top
  });
  Object.defineProperty(document.documentElement, "scrollTop", {
    configurable: true,
    value: top
  });

  window.dispatchEvent(new Event("scroll"));
  await nextTick();
  await nextTick();
}

async function triggerContainerScroll(container: HTMLElement, top: number) {
  container.scrollTop = top;
  container.dispatchEvent(new Event("scroll"));
  await nextTick();
  await nextTick();
}

async function flushTicks(count = 4) {
  for (let index = 0; index < count; index += 1) {
    await nextTick();
  }
}

beforeEach(() => {
  document.body.innerHTML = "";
  windowScrollTop = 0;
  rafTime = 0;

  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    rafTime += 16;
    callback(rafTime);
    return rafTime;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());

  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: 720
  });

  window.scrollTo = vi.fn((arg?: number | ScrollToOptions, y?: number) => {
    if (typeof arg === "object") {
      windowScrollTop = Number(arg.top ?? windowScrollTop);
    } else if (typeof arg === "number") {
      windowScrollTop = typeof y === "number" ? y : windowScrollTop;
    }

    Object.defineProperty(window, "pageYOffset", {
      configurable: true,
      value: windowScrollTop
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      configurable: true,
      value: windowScrollTop
    });
  }) as typeof window.scrollTo;

  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
  window.history.replaceState({}, "", "/");
});

describe("XyAnchor", () => {
  it("默认渲染 vertical 模式和 marker", async () => {
    mockWindowTarget("#anchor-basic-intro", 120);
    mockWindowTarget("#anchor-basic-api", 420);

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        syncHash: false,
        duration: 0
      },
      slots: {
        default: `
          <xy-anchor-link title="介绍" href="#anchor-basic-intro" />
          <xy-anchor-link title="API" href="#anchor-basic-api" />
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    await nextTick();

    expect(wrapper.classes()).toContain("xy-anchor");
    expect(wrapper.classes()).toContain("xy-anchor--vertical");
    expect(wrapper.find(".xy-anchor__marker").exists()).toBe(true);
    expect(wrapper.findAll(".xy-anchor__link")).toHaveLength(2);
  });

  it("horizontal 模式会更新横向 marker 样式", async () => {
    mockWindowTarget("#anchor-horizontal-intro", 120);
    mockWindowTarget("#anchor-horizontal-api", 420);

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        direction: "horizontal",
        syncHash: false,
        duration: 0
      },
      slots: {
        default: `
          <xy-anchor-link title="介绍" href="#anchor-horizontal-intro" />
          <xy-anchor-link title="API" href="#anchor-horizontal-api" />
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    const rootRect = vi
      .spyOn(wrapper.element as HTMLElement, "getBoundingClientRect")
      .mockReturnValue(createRect({ top: 0, left: 0, width: 320, height: 48 }));
    const markerRect = vi
      .spyOn(wrapper.find(".xy-anchor__marker").element, "getBoundingClientRect")
      .mockReturnValue(createRect({ top: 0, left: 0, width: 40, height: 3 }));
    const links = wrapper.findAll(".xy-anchor__link");

    vi.spyOn(links[0]!.element, "getBoundingClientRect").mockReturnValue(
      createRect({ top: 10, left: 0, width: 56, height: 24 })
    );
    vi.spyOn(links[1]!.element, "getBoundingClientRect").mockReturnValue(
      createRect({ top: 10, left: 92, width: 72, height: 24 })
    );

    await (wrapper.vm as { scrollTo: (href?: string) => void }).scrollTo("#anchor-horizontal-api");
    await flushTicks();

    expect(wrapper.classes()).toContain("xy-anchor--horizontal");
    expect(wrapper.find(".xy-anchor__marker").attributes("style")).toContain("left: 92px;");
    expect(wrapper.find(".xy-anchor__marker").attributes("style")).toContain("width: 72px;");

    rootRect.mockRestore();
    markerRect.mockRestore();
  });

  it("scrollTo expose 会驱动 window 滚动并高亮目标 link", async () => {
    mockWindowTarget("#anchor-scroll-intro", 120);
    mockWindowTarget("#anchor-scroll-api", 520);

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        syncHash: false,
        duration: 0,
        offset: 24
      },
      slots: {
        default: `
          <xy-anchor-link title="介绍" href="#anchor-scroll-intro" />
          <xy-anchor-link title="API" href="#anchor-scroll-api" />
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    (wrapper.vm as { scrollTo: (href?: string) => void }).scrollTo("#anchor-scroll-api");
    await nextTick();

    expect(window.scrollTo).toHaveBeenCalled();
    expect(wrapper.findAll(".xy-anchor__link")[1]?.classes()).toContain("is-active");
  });

  it("支持 selector 形式的自定义滚动容器", async () => {
    const container = createScrollContainer(".anchor-demo-scroll");

    mockContainerTarget(container, "#anchor-scroll-1", 80);
    mockContainerTarget(container, "#anchor-scroll-2", 360);

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        container: ".anchor-demo-scroll",
        syncHash: false,
        duration: 0,
        bound: 0
      },
      slots: {
        default: `
          <xy-anchor-link title="介绍" href="#anchor-scroll-1" />
          <xy-anchor-link title="用法" href="#anchor-scroll-2" />
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    await triggerContainerScroll(container, 380);

    expect(wrapper.findAll(".xy-anchor__link")[1]?.classes()).toContain("is-active");
  });

  it("支持 HTMLElement 形式的自定义滚动容器", async () => {
    const container = createScrollContainer(".anchor-demo-scroll-element");

    mockContainerTarget(container, "#anchor-element-1", 80);
    mockContainerTarget(container, "#anchor-element-2", 420);

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        container,
        syncHash: false,
        duration: 0,
        offset: 12
      },
      slots: {
        default: `
          <xy-anchor-link title="介绍" href="#anchor-element-1" />
          <xy-anchor-link title="详情" href="#anchor-element-2" />
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    (wrapper.vm as { scrollTo: (href?: string) => void }).scrollTo("#anchor-element-2");
    await nextTick();

    expect(container.scrollTo).toHaveBeenCalled();
    expect(wrapper.findAll(".xy-anchor__link")[1]?.classes()).toContain("is-active");
  });

  it("点击 link 会派发 click/change，并用 replaceState 同步 hash", async () => {
    mockWindowTarget("#anchor-click-1", 100);
    mockWindowTarget("#anchor-click-2", 400);

    const replaceSpy = vi.spyOn(window.history, "replaceState");

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        duration: 0,
        syncHash: true
      },
      slots: {
        default: `
          <xy-anchor-link title="介绍" href="#anchor-click-1" />
          <xy-anchor-link title="详情" href="#anchor-click-2" />
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true
    });

    wrapper.findAll(".xy-anchor__link")[1]?.element.dispatchEvent(event);
    await nextTick();

    expect(event.defaultPrevented).toBe(true);
    expect(replaceSpy).toHaveBeenCalled();
    expect(wrapper.emitted("click")?.[0]?.[1]).toBe("#anchor-click-2");
    expect(wrapper.emitted("change")?.at(-1)?.[0]).toBe("#anchor-click-2");
  });

  it("挂载时会读取初始 hash 并高亮对应 link", async () => {
    mockWindowTarget("#anchor-hash-1", 100);
    mockWindowTarget("#anchor-hash-2", 420);
    window.history.replaceState({}, "", "/guide#anchor-hash-2");

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        duration: 0,
        syncHash: true
      },
      slots: {
        default: `
          <xy-anchor-link title="介绍" href="#anchor-hash-1" />
          <xy-anchor-link title="详情" href="#anchor-hash-2" />
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    await flushTicks();

    expect(wrapper.findAll(".xy-anchor__link")[1]?.classes()).toContain("is-active");
  });

  it("syncHash=false 时不读写 URL", async () => {
    mockWindowTarget("#anchor-sync-1", 100);
    mockWindowTarget("#anchor-sync-2", 420);
    window.history.replaceState({}, "", "/guide#anchor-sync-2");

    const replaceSpy = vi.spyOn(window.history, "replaceState");

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        duration: 0,
        syncHash: false
      },
      slots: {
        default: `
          <xy-anchor-link title="介绍" href="#anchor-sync-1" />
          <xy-anchor-link title="详情" href="#anchor-sync-2" />
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    await flushTicks();

    wrapper.findAll(".xy-anchor__link")[1]?.element.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true
      })
    );
    await flushTicks();

    expect(replaceSpy).not.toHaveBeenCalled();
    expect(window.location.hash).toBe("#anchor-sync-2");
  });

  it("href 变更后会注销旧值并注册新值", async () => {
    mockWindowTarget("#anchor-dynamic-1", 100);
    mockWindowTarget("#anchor-dynamic-2", 420);

    const Demo = defineComponent({
      components: {
        XyAnchor,
        XyAnchorLink
      },
      setup() {
        const href = ref("#anchor-dynamic-1");
        return {
          href
        };
      },
      template: `
        <xy-anchor :sync-hash="false" :duration="0">
          <xy-anchor-link title="动态链接" :href="href" />
        </xy-anchor>
      `
    });

    const wrapper = mount(Demo, {
      attachTo: document.body
    });

    await nextTick();

    await wrapper.setData?.({});
    (wrapper.vm as unknown as { href: string }).href = "#anchor-dynamic-2";
    await nextTick();
    await triggerWindowScroll(0);

    expect(wrapper.find(".xy-anchor__link").attributes("href")).toBe("#anchor-dynamic-2");
    expect(wrapper.find(".xy-anchor__link").classes()).toContain("is-active");
  });

  it("vertical 模式支持复合嵌套并命中子级 active", async () => {
    mockWindowTarget("#anchor-parent", 100);
    mockWindowTarget("#anchor-child", 420);

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        syncHash: false,
        duration: 0
      },
      slots: {
        default: `
          <xy-anchor-link title="父级" href="#anchor-parent">
            <xy-anchor-link title="子级" href="#anchor-child" />
          </xy-anchor-link>
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    await triggerWindowScroll(430);

    expect(wrapper.find(".xy-anchor__list--nested").exists()).toBe(true);
    expect(wrapper.findAll(".xy-anchor__link")[1]?.classes()).toContain("is-active");
  });

  it("horizontal 模式允许嵌套声明，视觉保持扁平并仍可命中子级 active", async () => {
    mockWindowTarget("#anchor-horizontal-parent", 100);
    mockWindowTarget("#anchor-horizontal-child", 420);

    const wrapper = mount(XyAnchor, {
      attachTo: document.body,
      props: {
        direction: "horizontal",
        syncHash: false,
        duration: 0
      },
      slots: {
        default: `
          <xy-anchor-link title="父级" href="#anchor-horizontal-parent">
            <xy-anchor-link title="子级" href="#anchor-horizontal-child" />
          </xy-anchor-link>
        `
      },
      global: {
        components: {
          XyAnchorLink
        }
      }
    });

    await triggerWindowScroll(430);

    expect(wrapper.classes()).toContain("xy-anchor--horizontal");
    expect(wrapper.find(".xy-anchor__list--horizontal").exists()).toBe(true);
    expect(wrapper.findAll(".xy-anchor__link")[1]?.classes()).toContain("is-active");
  });

  it("可以与 Affix 组合渲染", async () => {
    mockWindowTarget("#anchor-affix-1", 100);
    mockWindowTarget("#anchor-affix-2", 420);

    const wrapper = mount(
      {
        components: {
          XyAffix,
          XyAnchor,
          XyAnchorLink
        },
        template: `
          <xy-affix :offset="12">
            <xy-anchor :sync-hash="false" :duration="0">
              <xy-anchor-link title="介绍" href="#anchor-affix-1" />
              <xy-anchor-link title="详情" href="#anchor-affix-2" />
            </xy-anchor>
          </xy-affix>
        `
      },
      {
        attachTo: document.body
      }
    );

    await nextTick();

    expect(wrapper.find(".xy-affix").exists()).toBe(true);
    expect(wrapper.find(".xy-anchor").exists()).toBe(true);
  });
});
