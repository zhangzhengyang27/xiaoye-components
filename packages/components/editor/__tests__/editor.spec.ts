import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyEditor } from "@xiaoye/components";

const editorMock = vi.hoisted(() => ({
  setValue: vi.fn(),
  destroy: vi.fn(),
  disabled: vi.fn(),
  enable: vi.fn(),
  focus: vi.fn(),
  getValue: vi.fn(() => "初始值"),
  constructor: vi.fn(function MockVditor(
    _element: HTMLElement,
    options: Record<string, unknown> & {
      after?: () => void;
    }
  ) {
    options.after?.();
    return {
      setValue: editorMock.setValue,
      destroy: editorMock.destroy,
      disabled: editorMock.disabled,
      enable: editorMock.enable,
      focus: editorMock.focus,
      getValue: editorMock.getValue
    };
  })
}));

vi.mock("vditor", () => ({
  default: editorMock.constructor
}));

describe("XyEditor", () => {
  it("挂载时初始化实例并派发 init / ready", async () => {
    const wrapper = mount(XyEditor, {
      props: {
        modelValue: "文档内容"
      }
    });

    await nextTick();
    await Promise.resolve();

    expect(editorMock.constructor).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("init")).toHaveLength(1);
    expect(wrapper.emitted("ready")).toHaveLength(1);
  });

  it("modelValue 和 disabled 变化会同步到实例，卸载时销毁实例", async () => {
    const wrapper = mount(XyEditor, {
      props: {
        modelValue: "旧值",
        disabled: false
      }
    });

    editorMock.getValue.mockReturnValueOnce("其他值");

    await wrapper.setProps({
      modelValue: "新值",
      disabled: true
    });

    expect(editorMock.setValue).toHaveBeenCalledWith("新值", true);
    expect(editorMock.disabled).toHaveBeenCalled();

    await wrapper.setProps({
      disabled: false
    });

    expect(editorMock.enable).toHaveBeenCalled();

    wrapper.unmount();

    expect(editorMock.destroy).toHaveBeenCalled();
  });
});
