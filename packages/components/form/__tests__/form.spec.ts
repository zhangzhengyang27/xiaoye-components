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

  it("支持嵌套 prop 的校验与 resetFields 还原", async () => {
    const model = reactive({
      profile: {
        email: "init@xiaoye.dev"
      }
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
            "profile.email": [{ required: true, message: "请输入邮箱", trigger: "blur" as const }]
          }
        };
      },
      template: `
        <xy-form ref="formRef" :model="model" :rules="rules">
          <xy-form-item label="邮箱" prop="profile.email">
            <xy-input v-model="model.profile.email" />
          </xy-form-item>
          <xy-form-item label="邮箱数组写法" :prop="['profile', 'email']">
            <xy-input v-model="model.profile.email" />
          </xy-form-item>
        </xy-form>
      `
    });

    const formRef = wrapper.findComponent(XyForm).vm as unknown as {
      validateField: (prop?: string | string[], trigger?: string) => Promise<boolean>;
      resetFields: (prop?: string | string[]) => void;
    };

    model.profile.email = "";
    await nextTick();

    // 字符串路径与数组路径应命中同一个字段
    expect(await formRef.validateField("profile.email", "blur")).toBe(false);
    expect(wrapper.text()).toContain("请输入邮箱");

    model.profile.email = "real@xiaoye.dev";
    await nextTick();
    expect(await formRef.validateField(["profile", "email"], "blur")).toBe(true);

    formRef.resetFields("profile.email");
    expect(model.profile.email).toBe("init@xiaoye.dev");
  });

  it("异步校验器会等待 Promise 完成后再给出结果", async () => {
    const model = reactive({ username: "taken" });
    let rejectNow: ((reason: Error) => void) | undefined;

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
            username: [
              {
                validator: () =>
                  new Promise((_resolve, reject) => {
                    rejectNow = reject;
                  })
              }
            ]
          }
        };
      },
      template: `
        <xy-form ref="formRef" :model="model" :rules="rules">
          <xy-form-item label="用户名" prop="username">
            <xy-input v-model="model.username" />
          </xy-form-item>
        </xy-form>
      `
    });

    const formRef = wrapper.findComponent(XyForm).vm as unknown as {
      validateField: (prop?: string | string[]) => Promise<boolean>;
    };

    const pending = formRef.validateField("username");
    // 校验器未 resolve 前不落地结果
    await flushPromises();
    expect(wrapper.text()).not.toContain("用户名已被占用");

    rejectNow?.(new Error("用户名已被占用"));
    expect(await pending).toBe(false);
    await nextTick();
    expect(wrapper.text()).toContain("用户名已被占用");
  });

  it("validateField 按 trigger 过滤规则", async () => {
    const model = reactive({ name: "" });

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
      validateField: (prop?: string | string[], trigger?: string) => Promise<boolean>;
      clearValidate: (prop?: string | string[]) => void;
    };

    // blur 规则不应被 change 触发
    expect(await formRef.validateField("name", "change")).toBe(true);
    expect(wrapper.text()).not.toContain("请输入名称");

    expect(await formRef.validateField("name", "blur")).toBe(false);
    expect(wrapper.text()).toContain("请输入名称");

    formRef.clearValidate("name");
    await nextTick();
    expect(wrapper.text()).not.toContain("请输入名称");
  });

  it("validate 整体校验返回聚合结果", async () => {
    const model = reactive({
      name: "",
      remark: ""
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
            name: [{ required: true, message: "请输入名称" }],
            remark: [{ required: true, message: "请输入备注" }]
          }
        };
      },
      template: `
        <xy-form ref="formRef" :model="model" :rules="rules">
          <xy-form-item label="名称" prop="name">
            <xy-input v-model="model.name" />
          </xy-form-item>
          <xy-form-item label="备注" prop="remark">
            <xy-input v-model="model.remark" />
          </xy-form-item>
        </xy-form>
      `
    });

    const formRef = wrapper.findComponent(XyForm).vm as unknown as {
      validate: () => Promise<boolean>;
    };

    expect(await formRef.validate()).toBe(false);

    model.name = "Xiaoye";
    model.remark = "备注内容";
    await nextTick();
    expect(await formRef.validate()).toBe(true);
  });

  it("form 级与 form-item 级规则会合并生效", async () => {
    const model = reactive({ name: "x" });

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
            name: [{ required: true, message: "请输入名称" }]
          }
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="名称" prop="name" :rules="[{ min: 2, message: '至少 2 个字符' }]">
            <xy-input v-model="model.name" />
          </xy-form-item>
        </xy-form>
      `
    });

    // 满足 form 级 required 但违反 item 级 min
    const formRef = wrapper.findComponent(XyForm).vm as unknown as {
      validateField: (prop?: string | string[]) => Promise<boolean>;
    };

    expect(await formRef.validateField("name")).toBe(false);
    expect(wrapper.text()).toContain("至少 2 个字符");
  });
});

