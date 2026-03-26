import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { XyAffix } from "../index";

enableAutoUnmount(afterEach);

function createRect({
  top,
  bottom,
  left = 24,
  width = 160,
  height = 40
}: {
  top: number;
  bottom: number;
  left?: number;
  width?: number;
  height?: number;
}) {
  return {
    x: left,
    y: top,
    top,
    bottom,
    left,
    right: left + width,
    width,
    height,
    toJSON: () => ({})
  } as DOMRect;
}

async function triggerWindowScroll(top: number) {
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

describe("XyAffix", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("保留默认插槽内容", async () => {
    const wrapper = mount(XyAffix, {
      slots: {
        default: "<button class='affix-slot'>操作按钮</button>"
      }
    });

    await nextTick();

    expect(wrapper.classes()).toContain("xy-affix");
    expect(wrapper.find(".affix-slot").exists()).toBe(true);
    expect(wrapper.text()).toContain("操作按钮");
  });

  it("支持顶部 offset 固定和滚动事件", async () => {
    const wrapper = mount(XyAffix, {
      attachTo: document.body,
      props: {
        offset: 30
      },
      slots: {
        default: "顶部固钉"
      }
    });

    const rootRect = vi
      .spyOn(wrapper.find(".xy-affix").element, "getBoundingClientRect")
      .mockReturnValue(createRect({ top: -100, bottom: -60 }));

    await triggerWindowScroll(200);

    const fixedNode = wrapper.find(".xy-affix--fixed");
    expect(fixedNode.exists()).toBe(true);
    expect(fixedNode.attributes("style")).toContain("top: 30px;");
    expect(wrapper.emitted("change")?.[0]).toEqual([true]);
    expect(wrapper.emitted("scroll")?.at(-1)?.[0]).toEqual({
      scrollTop: 200,
      fixed: true
    });

    rootRect.mockRestore();
  });

  it("支持底部固定与 zIndex 样式", async () => {
    const wrapper = mount(XyAffix, {
      attachTo: document.body,
      props: {
        position: "bottom",
        offset: 20,
        zIndex: 1200
      },
      slots: {
        default: "底部固钉"
      }
    });

    const rootRect = vi
      .spyOn(wrapper.find(".xy-affix").element, "getBoundingClientRect")
      .mockReturnValue(createRect({ top: 1200, bottom: 1240 }));

    await triggerWindowScroll(0);

    const fixedNode = wrapper.find(".xy-affix--fixed");
    expect(fixedNode.exists()).toBe(true);
    expect(fixedNode.attributes("style")).toContain("bottom: 20px;");
    expect(fixedNode.attributes("style")).toContain("z-index: 1200;");

    rootRect.mockRestore();
  });

  it("支持 target 边界和 transform 退让", async () => {
    const wrapper = mount(
      {
        components: { XyAffix },
        template: `
          <div class="target-zone">
            <xy-affix target=".target-zone" :offset="20">容器边界</xy-affix>
          </div>
        `
      },
      {
        attachTo: document.body
      }
    );

    const affix = wrapper.findComponent(XyAffix);
    const rootRect = vi
      .spyOn(affix.find(".xy-affix").element, "getBoundingClientRect")
      .mockReturnValue(createRect({ top: -100, bottom: -60 }));
    const targetRect = vi
      .spyOn(wrapper.find(".target-zone").element, "getBoundingClientRect")
      .mockReturnValue(createRect({ top: -80, bottom: 40, width: 400, height: 120 }));

    await triggerWindowScroll(100);

    expect(affix.find(".xy-affix--fixed").exists()).toBe(true);
    expect(affix.find(".xy-affix--fixed").attributes("style")).toContain("translateY(-20px)");

    targetRect.mockReturnValue(createRect({ top: -200, bottom: -10, width: 400, height: 120 }));
    await triggerWindowScroll(260);

    expect(affix.find(".xy-affix--fixed").exists()).toBe(false);
    expect(affix.emitted("change")?.at(-1)).toEqual([false]);

    rootRect.mockRestore();
    targetRect.mockRestore();
  });

  it("支持 teleported 和 appendTo", async () => {
    document.body.innerHTML = `<div class="teleport-host"></div>`;

    const wrapper = mount(XyAffix, {
      attachTo: document.body,
      props: {
        teleported: true,
        appendTo: ".teleport-host"
      },
      slots: {
        default: "<span class='teleported-content'>传送固钉</span>"
      }
    });

    const rootRect = vi
      .spyOn(wrapper.find(".xy-affix").element, "getBoundingClientRect")
      .mockReturnValue(createRect({ top: -100, bottom: -60 }));

    expect(wrapper.find(".teleported-content").exists()).toBe(true);
    expect(document.querySelector(".teleport-host .xy-affix--fixed")).toBeNull();

    await triggerWindowScroll(180);

    expect(wrapper.find(".teleported-content").exists()).toBe(false);
    expect(document.querySelector(".teleport-host .xy-affix--fixed")).not.toBeNull();

    rootRect.mockRestore();
  });

  it("暴露 update 与 updateRoot", async () => {
    const wrapper = mount(XyAffix, {
      attachTo: document.body,
      props: {
        offset: 24
      },
      slots: {
        default: "手动刷新"
      }
    });

    const api = wrapper.vm as {
      update: () => void;
      updateRoot: () => Promise<void>;
    };
    const rootRect = vi
      .spyOn(wrapper.find(".xy-affix").element, "getBoundingClientRect")
      .mockReturnValue(createRect({ top: -120, bottom: -80, width: 160, height: 40 }));

    api.update();
    await nextTick();

    expect(wrapper.find(".xy-affix--fixed").attributes("style")).toContain("width: 160px;");

    rootRect.mockReturnValue(createRect({ top: -140, bottom: -100, width: 220, height: 40 }));
    await api.updateRoot();
    await nextTick();

    expect(wrapper.find(".xy-affix--fixed").attributes("style")).toContain("width: 220px;");

    rootRect.mockRestore();
  });

  it("target 不存在时直接抛错", () => {
    expect(() =>
      mount(XyAffix, {
        props: {
          target: ".missing-target"
        }
      })
    ).toThrow("[XyAffix] target does not exist: .missing-target");
  });
});
