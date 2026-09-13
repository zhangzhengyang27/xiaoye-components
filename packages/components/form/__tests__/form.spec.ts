import { mount, flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick, reactive, ref } from "vue";
import { XyForm, XyFormItem, XyInput } from "@xiaoye/components";

describe("XyForm", () => {
  it("支持按字段校验和按字段重置", async () => {
    const model = reactive({
      name: ""
    });

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyInput
      },
      setup() {
        return {
          model,
          rules: {
            name: [{ required: true, message: "请输入名称", trigger: "blur" as const }]
          }
        };
      },
      template: `
        <xy-form ref="formRef" :model="model" :rules="rules">
          <xy-form-item label="名称" prop="name">
            <xy-input v-model="model.name" />
          </xy-form-item>
        </xy-form>
      `
    });

    const formRef = wrapper.findComponent(XyForm).vm as unknown as {
      validateField: (prop?: string | string[]) => Promise<boolean>;
      resetFields: (prop?: string | string[]) => void;
    };

    const invalid = await formRef.validateField("name");

    expect(invalid).toBe(false);
    expect(wrapper.text()).toContain("请输入名称");

    model.name = "Xiaoye";
    await nextTick();
    formRef.resetFields(["name"]);

    expect(model.name).toBe("");
  });

  it("rules 为 reactive 对象时深层修改会自动触发重新校验", async () => {
    const model = reactive({ name: "" });
    const rules = reactive<Record<string, Array<{ required: boolean; message: string }>>>({});

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyInput
      },
      setup() {
        return {
          model,
          rules
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="名称" prop="name">
            <xy-input v-model="model.name" />
          </xy-form-item>
        </xy-form>
      `
    });

    expect(wrapper.text()).not.toContain("请输入名称");

    rules.name = [{ required: true, message: "请输入名称" }];
    await flushPromises();
    await nextTick();

    expect(wrapper.text()).toContain("请输入名称");
  });

  it("rules 为普通对象时整体替换会自动触发重新校验", async () => {
    const model = reactive({ name: "" });
    const rules = ref<Record<string, Array<{ required: boolean; message: string }>>>({});

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyInput
      },
      setup() {
        return {
          model,
          rules
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="名称" prop="name">
            <xy-input v-model="model.name" />
          </xy-form-item>
        </xy-form>
      `
    });

    expect(wrapper.text()).not.toContain("请输入名称");

    rules.value = { name: [{ required: true, message: "请输入名称" }] };
    await flushPromises();
    await nextTick();

    expect(wrapper.text()).toContain("请输入名称");
  });
});

