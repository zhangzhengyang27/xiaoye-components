import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { XyBacktop } from "../index";

enableAutoUnmount(afterEach);

async function setWindowScrollTop(top: number) {
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
}

describe("XyBacktop", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("超过阈值后显示并应用 right / bottom 样式", async () => {
    const wrapper = mount(XyBacktop, {
      attachTo: document.body,
      props: {
        visibilityHeight: 200,
        right: 100,
        bottom: 120
      }
    });

    expect(wrapper.find(".xy-backtop").exists()).toBe(false);

    await setWindowScrollTop(260);

    const button = wrapper.get(".xy-backtop");
    expect(button.attributes("style")).toContain("right: 100px;");
    expect(button.attributes("style")).toContain("bottom: 120px;");
    expect(button.find(".xy-icon").exists()).toBe(true);
  });

  it("visibilityHeight 为 0 时初始直接显示", async () => {
    const wrapper = mount(XyBacktop, {
      props: {
        visibilityHeight: 0
      }
    });

    await nextTick();

    expect(wrapper.find(".xy-backtop").exists()).toBe(true);
  });

  it("支持 target 容器滚动、点击回顶和自定义插槽", async () => {
    document.body.innerHTML = `<div class="scroll-target"></div>`;
    const target = document.querySelector(".scroll-target") as HTMLDivElement;
    target.scrollTo = vi.fn() as typeof target.scrollTo;

    const wrapper = mount(XyBacktop, {
      attachTo: document.body,
      props: {
        target: ".scroll-target",
        visibilityHeight: 120
      },
      slots: {
        default: "<span class='custom-slot'>TOP</span>"
      }
    });

    expect(wrapper.find(".xy-backtop").exists()).toBe(false);

    target.scrollTop = 160;
    target.dispatchEvent(new Event("scroll"));
    await nextTick();

    expect(wrapper.find(".xy-backtop").exists()).toBe(true);
    expect(wrapper.find(".custom-slot").exists()).toBe(true);

    await wrapper.get(".xy-backtop").trigger("click");

    expect(target.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth"
    });
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("未传 target 时点击会调用 window.scrollTo", async () => {
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    const wrapper = mount(XyBacktop, {
      props: {
        visibilityHeight: 0
      }
    });

    await nextTick();
    await wrapper.get(".xy-backtop").trigger("click");

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth"
    });
  });

  it("target 不存在时直接抛错", () => {
    expect(() =>
      mount(XyBacktop, {
        props: {
          target: ".missing-target"
        }
      })
    ).toThrow("[XyBacktop] target does not exist: .missing-target");
  });
});
