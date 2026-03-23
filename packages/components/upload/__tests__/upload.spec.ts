import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it } from "vitest";
import { XyUpload } from "@xiaoye/components";

describe("XyUpload", () => {
  it("支持添加文件并派发更新事件", async () => {
    const wrapper = mount(XyUpload, {
      props: {
        tip: "支持 png / jpg"
      }
    });

    const input = wrapper.find('input[type="file"]');
    const file = new File(["hello"], "avatar.png", { type: "image/png" });

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [file]
    });

    await input.trigger("change");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toHaveLength(1);
    expect(wrapper.text()).toContain("avatar.png");
  });

  it("支持移除文件和超过数量限制提示", async () => {
    const wrapper = mount(XyUpload, {
      props: {
        maxCount: 1
      }
    });

    const input = wrapper.find('input[type="file"]');
    const first = new File(["a"], "a.txt", { type: "text/plain" });
    const second = new File(["b"], "b.txt", { type: "text/plain" });

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [first]
    });
    await input.trigger("change");
    await nextTick();

    Object.defineProperty(input.element, "files", {
      configurable: true,
      value: [second]
    });
    await input.trigger("change");
    await nextTick();

    expect(wrapper.emitted("exceed")).toBeTruthy();

    await wrapper.find('.xy-upload__item button').trigger("click");

    expect(wrapper.emitted("remove")).toBeTruthy();
  });
});

