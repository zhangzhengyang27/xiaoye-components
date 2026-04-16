import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyForm, XyFormItem, XyInputTag } from "@xiaoye/components";

describe("XyInputTag", () => {
  it("支持回车添加标签并同步 v-model", async () => {
    const wrapper = mount(XyInputTag, {
      props: {
        modelValue: []
      }
    });

    const input = wrapper.get("input");

    await input.setValue("Vue");
    await input.trigger("keydown", { key: "Enter", code: "Enter" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["Vue"]]);
    expect(wrapper.emitted("change")?.[0]).toEqual([["Vue"]]);
    expect(wrapper.emitted("add-tag")?.[0]).toEqual(["Vue"]);
  });

  it("支持 Space 作为触发键", async () => {
    const wrapper = mount(XyInputTag, {
      props: {
        modelValue: [],
        trigger: "Space"
      }
    });

    const input = wrapper.get("input");

    await input.setValue("Tag");
    await input.trigger("keydown", { key: " ", code: "Space" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["Tag"]]);
  });

  it("支持 delimiter 自动切分标签", async () => {
    const wrapper = mount(XyInputTag, {
      props: {
        modelValue: [],
        delimiter: ","
      }
    });

    const input = wrapper.get("input");

    await input.setValue("Vue,React,");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["Vue", "React"]]);
    expect(wrapper.emitted("add-tag")?.[0]).toEqual([["Vue", "React"]]);
    expect(wrapper.emitted("input")?.at(-1)).toEqual([""]);
  });

  it("delimiter 会保留最后一个未提交片段", async () => {
    const wrapper = mount(XyInputTag, {
      props: {
        modelValue: [],
        delimiter: ","
      }
    });

    const input = wrapper.get("input");

    await input.setValue("Vue,React");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["Vue"]]);
    expect((input.element as HTMLInputElement).value).toBe("React");
  });

  it("支持 max 和 backspace 删除最后一个标签", async () => {
    const wrapper = mount(XyInputTag, {
      props: {
        modelValue: ["Vue"],
        max: 1
      }
    });

    const input = wrapper.get("input");

    await input.setValue("React");
    await input.trigger("keydown", { key: "Enter", code: "Enter" });
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    await input.setValue("");
    await input.trigger("keydown", { key: "Backspace", code: "Backspace" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([undefined]);
    expect(wrapper.emitted("remove-tag")?.[0]).toEqual(["Vue", 0]);
  });

  it("支持拖拽排序", async () => {
    const wrapper = mount(XyInputTag, {
      attachTo: document.body,
      props: {
        modelValue: ["Vue", "React", "Svelte"],
        draggable: true
      }
    });

    const tags = wrapper.findAll(".xy-input-tag__tag");
    const [firstTag, secondTag] = tags;

    Object.defineProperty(secondTag.element, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        ({
          left: 100,
          right: 180,
          top: 10,
          bottom: 38,
          width: 80,
          height: 28
        }) as DOMRect
    });

    Object.defineProperty(wrapper.get(".xy-input-tag__inner").element, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        ({
          left: 0,
          right: 300,
          top: 0,
          bottom: 60,
          width: 300,
          height: 60
        }) as DOMRect
    });

    const dataTransfer = {
      effectAllowed: "",
      dropEffect: "",
      setData: vi.fn()
    } as unknown as DataTransfer;

    await firstTag.trigger("dragstart", { dataTransfer });
    await secondTag.trigger("dragover", { clientX: 170, dataTransfer });
    await secondTag.trigger("drop", { dataTransfer });
    await firstTag.trigger("dragend");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["React", "Vue", "Svelte"]]);
    expect(wrapper.emitted("drag-tag")?.[0]).toEqual([0, 1, "Vue"]);
  });

  it("拖到相邻标签的无效半区时不触发排序", async () => {
    const wrapper = mount(XyInputTag, {
      attachTo: document.body,
      props: {
        modelValue: ["Vue", "React", "Svelte"],
        draggable: true
      }
    });

    const tags = wrapper.findAll(".xy-input-tag__tag");
    const [firstTag, secondTag] = tags;

    Object.defineProperty(secondTag.element, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        ({
          left: 100,
          right: 180,
          top: 10,
          bottom: 38,
          width: 80,
          height: 28
        }) as DOMRect
    });

    Object.defineProperty(wrapper.get(".xy-input-tag__inner").element, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        ({
          left: 0,
          right: 300,
          top: 0,
          bottom: 60,
          width: 300,
          height: 60
        }) as DOMRect
    });

    const dataTransfer = {
      effectAllowed: "",
      dropEffect: "",
      setData: vi.fn()
    } as unknown as DataTransfer;

    await firstTag.trigger("dragstart", { dataTransfer });
    await secondTag.trigger("dragover", { clientX: 110, dataTransfer });
    await secondTag.trigger("drop", { dataTransfer });
    await firstTag.trigger("dragend");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("drag-tag")).toBeUndefined();
  });

  it("取消拖拽时不触发排序", async () => {
    const wrapper = mount(XyInputTag, {
      attachTo: document.body,
      props: {
        modelValue: ["Vue", "React", "Svelte"],
        draggable: true
      }
    });

    const tags = wrapper.findAll(".xy-input-tag__tag");
    const [firstTag, secondTag] = tags;

    Object.defineProperty(secondTag.element, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        ({
          left: 100,
          right: 180,
          top: 10,
          bottom: 38,
          width: 80,
          height: 28
        }) as DOMRect
    });

    Object.defineProperty(wrapper.get(".xy-input-tag__inner").element, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        ({
          left: 0,
          right: 300,
          top: 0,
          bottom: 60,
          width: 300,
          height: 60
        }) as DOMRect
    });

    const dataTransfer = {
      effectAllowed: "",
      dropEffect: "",
      setData: vi.fn()
    } as unknown as DataTransfer;

    await firstTag.trigger("dragstart", { dataTransfer });
    await secondTag.trigger("dragover", { clientX: 170, dataTransfer });
    await firstTag.trigger("dragend");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("drag-tag")).toBeUndefined();
  });

  it("支持 clearable 清空全部标签和输入", async () => {
    const wrapper = mount(XyInputTag, {
      props: {
        modelValue: ["Vue"],
        clearable: true
      }
    });

    const input = wrapper.get("input");

    await input.trigger("focus");
    await input.setValue("React");
    await wrapper.get(".xy-input-tag__clear").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([undefined]);
    expect(wrapper.emitted("change")?.[0]).toEqual([undefined]);
    expect(wrapper.emitted("clear")).toHaveLength(1);
  });

  it("支持 readonly 和 disabled", async () => {
    const readonlyWrapper = mount(XyInputTag, {
      props: {
        modelValue: ["Vue"],
        readonly: true
      }
    });

    expect(readonlyWrapper.find(".xy-tag__close").exists()).toBe(false);

    const disabledWrapper = mount(XyInputTag, {
      props: {
        modelValue: ["Vue"],
        disabled: true
      }
    });

    expect(disabledWrapper.get("input").attributes("disabled")).toBeDefined();
    expect(disabledWrapper.find(".xy-tag__close").exists()).toBe(false);
  });

  it("支持 saveOnBlur", async () => {
    const wrapper = mount(XyInputTag, {
      props: {
        modelValue: []
      }
    });

    const input = wrapper.get("input");

    await input.setValue("BlurTag");
    await input.trigger("blur");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["BlurTag"]]);
  });

  it("在表单中支持 change 校验，并在恢复有效值后清除错误", async () => {
    const model = reactive({
      tags: undefined as string[] | undefined
    });

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyInputTag
      },
      setup() {
        return {
          model,
          rules: {
            tags: [{ required: true, message: "请输入标签", trigger: "change" as const }]
          }
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="标签" prop="tags">
            <xy-input-tag v-model="model.tags" clearable />
          </xy-form-item>
        </xy-form>
      `
    });

    await wrapper.findComponent(XyInputTag).vm.$emit("update:modelValue", undefined);
    await wrapper.findComponent(XyInputTag).vm.$emit("change", undefined);
    await nextTick();

    const input = wrapper.get("input");
    await input.setValue("Vue");
    await input.trigger("keydown", { key: "Enter", code: "Enter" });
    await nextTick();

    expect(wrapper.text()).not.toContain("请输入标签");
  });

  it("在表单中支持 blur 校验，并在失焦保存后清除错误", async () => {
    const model = reactive({
      members: undefined as string[] | undefined
    });

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyInputTag
      },
      setup() {
        return {
          model,
          rules: {
            members: [{ required: true, message: "请输入成员标签", trigger: "blur" as const }]
          }
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="成员" prop="members">
            <xy-input-tag v-model="model.members" />
          </xy-form-item>
        </xy-form>
      `
    });

    const input = wrapper.get("input");

    await input.trigger("focus");
    await input.trigger("blur");
    await nextTick();
    expect(wrapper.text()).toContain("请输入成员标签");

    await input.trigger("focus");
    await input.setValue("Alice");
    await input.trigger("blur");
    await nextTick();

    expect(model.members).toEqual(["Alice"]);
    expect(wrapper.text()).not.toContain("请输入成员标签");
  });

  it("暴露 clear 方法", async () => {
    const wrapper = mount(XyInputTag, {
      props: {
        modelValue: ["Vue"]
      }
    });

    const api = wrapper.vm as unknown as {
      clear: () => Promise<void>;
    };

    await api.clear();

    expect(wrapper.emitted("clear")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([undefined]);
  });
});
