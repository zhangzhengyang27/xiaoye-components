import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { XyModal } from "@xiaoye/components";

describe("XyModal", () => {
  it("支持通过 close 按钮关闭", async () => {
    const wrapper = mount(XyModal, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "测试弹窗"
      }
    });

    const closeButton = document.body.querySelector(".xy-modal__close") as HTMLButtonElement | null;

    closeButton?.click();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("关闭后恢复到触发元素，并补全标题 aria 关联", async () => {
    const Demo = defineComponent({
      components: {
        XyModal
      },
      setup() {
        const open = ref(false);
        return {
          open
        };
      },
      template: `
        <div>
          <button class="opener" type="button" @click="open = true">打开</button>
          <xy-modal v-model="open" title="成员弹窗">
            <button type="button">内部按钮</button>
          </xy-modal>
        </div>
      `
    });

    const wrapper = mount(Demo, {
      attachTo: document.body
    });

    const opener = wrapper.find(".opener");
    (opener.element as HTMLButtonElement).focus();
    await opener.trigger("click");
    await nextTick();
    await nextTick();

    const dialog = document.body.querySelector("[role='dialog']") as HTMLElement | null;
    expect(dialog?.getAttribute("aria-labelledby")).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    await nextTick();

    expect(document.activeElement).toBe(opener.element);
  });

  it("支持通过 Escape 关闭", async () => {
    const wrapper = mount(XyModal, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "测试弹窗"
      }
    });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });
});
