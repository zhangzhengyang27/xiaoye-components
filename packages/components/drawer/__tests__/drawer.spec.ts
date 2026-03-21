import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { XyDrawer } from "@xiaoye/components";

describe("XyDrawer", () => {
  it("支持通过 overlay 关闭", async () => {
    const wrapper = mount(XyDrawer, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "侧边抽屉"
      }
    });

    const overlay = document.body.querySelector(".xy-drawer__overlay") as HTMLDivElement | null;
    overlay?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });
});

