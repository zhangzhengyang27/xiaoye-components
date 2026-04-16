import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XySearchForm } from "@xiaoye/pro-components";
import type { SearchFormField } from "@xiaoye/pro-components";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("XySearchForm", () => {
  it("支持按 schema 渲染字段、折叠扩展和查询重置", async () => {
    const model = reactive({
      keyword: "账单中心",
      owner: "小叶"
    });
    const fields: SearchFormField[] = [
      {
        prop: "keyword",
        label: "关键词",
        component: "input"
      },
      {
        prop: "owner",
        label: "负责人",
        component: "input",
        collapsible: true
      }
    ];

    const wrapper = mount(XySearchForm, {
      props: {
        model,
        fields,
        submitOnReset: false
      }
    });

    expect(wrapper.text()).not.toContain("负责人");

    await wrapper.get(".xy-search-form__toggle").trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("负责人");

    await wrapper.get(".xy-button--primary").trigger("click");

    expect(wrapper.emitted("search")?.[0]?.[0]).toEqual({
      keyword: "账单中心",
      owner: "小叶"
    });

    model.keyword = "已修改";
    await nextTick();
    await wrapper.findAll("button")[1]?.trigger("click");

    expect(model.keyword).toBe("账单中心");
    expect(wrapper.emitted("reset")?.[0]?.[0]).toEqual({
      keyword: "账单中心",
      owner: "小叶"
    });
  });

  it("支持自定义字段插槽和受控折叠状态", async () => {
    const model = reactive({
      scene: "待处理"
    });

    const wrapper = mount(XySearchForm, {
      props: {
        model,
        collapsed: false,
        fields: [
          {
            prop: "scene",
            label: "场景",
            slot: "scene"
          }
        ]
      },
      slots: {
        scene: ({ value, update }: { value: unknown; update: (value: unknown) => void }) =>
          h(
            "button",
            {
              class: "scene-trigger",
              onClick: () => update(value === "待处理" ? "已完成" : "待处理")
            },
            String(value)
          )
      }
    });

    await wrapper.get(".scene-trigger").trigger("click");

    expect(model.scene).toBe("已完成");
  });

  it("validateOnSearch 为 true 时会先校验，失败后不派发 search", async () => {
    const model = reactive({
      keyword: ""
    });

    const wrapper = mount(XySearchForm, {
      props: {
        model,
        validateOnSearch: true,
        fields: [
          {
            prop: "keyword",
            label: "关键词",
            component: "input",
            required: true,
            rules: [
              {
                required: true,
                message: "请输入关键词",
                trigger: "blur"
              }
            ]
          }
        ]
      }
    });

    await wrapper.get(".xy-button--primary").trigger("click");
    await nextTick();

    expect(wrapper.emitted("search")).toBeUndefined();
    expect(wrapper.text()).toContain("请输入关键词");

    await wrapper.get(".xy-input__inner").setValue("控制台");
    await wrapper.get(".xy-button--primary").trigger("click");
    await nextTick();

    expect(wrapper.emitted("search")?.[0]?.[0]).toEqual({
      keyword: "控制台"
    });
  });

  it("submitOnReset 为 true 时会在 reset 后再次派发 search", async () => {
    const model = reactive({
      keyword: "结算"
    });

    const wrapper = mount(XySearchForm, {
      props: {
        model,
        submitOnReset: true,
        fields: [
          {
            prop: "keyword",
            label: "关键词",
            component: "input"
          }
        ]
      }
    });

    await wrapper.findAll("button")[0]?.trigger("click");

    expect(wrapper.emitted("reset")?.[0]?.[0]).toEqual({
      keyword: "结算"
    });
    expect(wrapper.emitted("search")?.[0]?.[0]).toEqual({
      keyword: "结算"
    });
  });

  it("hidden 和 disabled 支持函数式计算并随 model 更新", async () => {
    const model = reactive({
      status: "draft",
      owner: ""
    });

    const wrapper = mount(XySearchForm, {
      props: {
        model,
        fields: [
          {
            prop: "status",
            label: "状态",
            component: "select",
            options: [
              { label: "草稿", value: "draft" },
              { label: "启用", value: "enabled" }
            ]
          },
          {
            prop: "owner",
            label: "负责人",
            component: "input",
            hidden: (currentModel) => currentModel.status === "draft",
            disabled: (currentModel) => currentModel.status === "enabled"
          }
        ]
      }
    });

    expect(wrapper.text()).not.toContain("负责人");

    model.status = "enabled";
    await nextTick();

    expect(wrapper.text()).toContain("负责人");
    expect(wrapper.get(".xy-input__inner").attributes("disabled")).toBeDefined();
  });

  it("field.placeholder 优先级高于 componentProps.placeholder，并在缺省时自动生成", () => {
    const model = reactive({
      keyword: "",
      owner: "",
      status: null
    });

    const wrapper = mount(XySearchForm, {
      attachTo: document.body,
      props: {
        model,
        fields: [
          {
            prop: "keyword",
            label: "关键词",
            component: "input",
            placeholder: "优先字段占位"
          },
          {
            prop: "owner",
            label: "负责人",
            component: "input",
            componentProps: {
              placeholder: "来自组件 props"
            }
          },
          {
            prop: "status",
            label: "状态",
            component: "select",
            options: [{ label: "全部", value: "all" }]
          }
        ]
      }
    });

    const inputs = wrapper.findAll(".xy-input__inner");

    expect(inputs[0]?.attributes("placeholder")).toBe("优先字段占位");
    expect(inputs[1]?.attributes("placeholder")).toBe("来自组件 props");
    expect(wrapper.text()).toContain("请选择状态");
  });

  it("select 字段会透传 options", async () => {
    const model = reactive({
      status: "all"
    });

    const wrapper = mount(XySearchForm, {
      attachTo: document.body,
      props: {
        model,
        fields: [
          {
            prop: "status",
            label: "状态",
            component: "select",
            options: [
              { label: "全部", value: "all" },
              { label: "启用", value: "enabled" }
            ]
          }
        ]
      }
    });

    await wrapper.get(".xy-select__trigger").trigger("click");
    await nextTick();

    expect(document.body.textContent).toContain("全部");
    expect(document.body.textContent).toContain("启用");
  });

  it("仅内置 input 且非 textarea 支持回车触发查询", async () => {
    const inputModel = reactive({
      keyword: "账单中心"
    });
    const inputWrapper = mount(XySearchForm, {
      props: {
        model: inputModel,
        fields: [
          {
            prop: "keyword",
            label: "关键词",
            component: "input"
          }
        ]
      }
    });

    await inputWrapper.get(".xy-input__inner").trigger("keydown", { key: "Enter" });
    await nextTick();

    expect(inputWrapper.emitted("search")?.[0]?.[0]).toEqual({
      keyword: "账单中心"
    });

    const textareaModel = reactive({
      keyword: "多行"
    });
    const textareaWrapper = mount(XySearchForm, {
      props: {
        model: textareaModel,
        fields: [
          {
            prop: "keyword",
            label: "关键词",
            component: "input",
            componentProps: {
              type: "textarea"
            }
          }
        ]
      }
    });

    await textareaWrapper.get(".xy-textarea__inner").trigger("keydown", { key: "Enter" });
    await nextTick();
    expect(textareaWrapper.emitted("search")).toBeUndefined();

    const selectModel = reactive({
      status: "all"
    });
    const selectWrapper = mount(XySearchForm, {
      props: {
        model: selectModel,
        fields: [
          {
            prop: "status",
            label: "状态",
            component: "select",
            options: [{ label: "全部", value: "all" }]
          }
        ]
      }
    });

    await selectWrapper.get(".xy-select__trigger").trigger("keydown", { key: "Enter" });
    await nextTick();
    expect(selectWrapper.emitted("search")).toBeUndefined();
  });

  it("受控 collapsed 仅派发事件，不直接修改渲染状态", async () => {
    const model = reactive({
      keyword: "",
      owner: ""
    });

    const wrapper = mount(XySearchForm, {
      props: {
        model,
        collapsed: true,
        fields: [
          {
            prop: "keyword",
            label: "关键词",
            component: "input"
          },
          {
            prop: "owner",
            label: "负责人",
            component: "input",
            collapsible: true
          }
        ]
      }
    });

    expect(wrapper.text()).not.toContain("负责人");

    await wrapper.get(".xy-search-form__toggle").trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:collapsed")?.[0]).toEqual([false]);
    expect(wrapper.emitted("collapse-change")?.[0]).toEqual([false]);
    expect(wrapper.text()).not.toContain("负责人");

    await wrapper.setProps({
      collapsed: false
    });
    await nextTick();

    expect(wrapper.text()).toContain("负责人");
  });
});
