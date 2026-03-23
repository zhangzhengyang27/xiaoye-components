import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import { XyCol, XyRow } from "@xiaoye/components";

describe("XyCol", () => {
  it("默认输出 24 栅格 class", () => {
    const wrapper = mount(XyCol);

    expect(wrapper.classes()).toContain("xy-col");
    expect(wrapper.classes()).toContain("xy-col-24");
  });

  it("支持基础布局 class", () => {
    const wrapper = mount(XyCol, {
      props: {
        span: 12,
        offset: 2,
        pull: 1,
        push: 3
      }
    });

    expect(wrapper.classes()).toContain("xy-col-12");
    expect(wrapper.classes()).toContain("xy-col-offset-2");
    expect(wrapper.classes()).toContain("xy-col-pull-1");
    expect(wrapper.classes()).toContain("xy-col-push-3");
  });

  it("支持响应式布局 class", () => {
    const wrapper = mount(XyCol, {
      props: {
        xs: 24,
        sm: {
          span: 12,
          offset: 2
        },
        md: 8,
        lg: {
          span: 6,
          offset: 3,
          pull: 1
        },
        xl: {
          span: 4,
          push: 2
        }
      }
    });

    expect(wrapper.classes()).toContain("xy-col-xs-24");
    expect(wrapper.classes()).toContain("xy-col-sm-12");
    expect(wrapper.classes()).toContain("xy-col-sm-offset-2");
    expect(wrapper.classes()).toContain("xy-col-md-8");
    expect(wrapper.classes()).toContain("xy-col-lg-6");
    expect(wrapper.classes()).toContain("xy-col-lg-offset-3");
    expect(wrapper.classes()).toContain("xy-col-lg-pull-1");
    expect(wrapper.classes()).toContain("xy-col-xl-4");
    expect(wrapper.classes()).toContain("xy-col-xl-push-2");
  });

  it("在 Row 内根据 gutter 生成内边距", () => {
    const wrapper = mount({
      components: {
        XyRow,
        XyCol
      },
      template: `
        <xy-row :gutter="20">
          <xy-col ref="col" :span="12" />
        </xy-row>
      `
    });

    const col = wrapper.findComponent({ ref: "col" });
    const element = col.element as HTMLElement;

    expect(col.classes()).toContain("is-guttered");
    expect(element.style.paddingLeft).toBe("10px");
    expect(element.style.paddingRight).toBe("10px");
  });

  it("在 gutter 变化时同步更新内边距", async () => {
    const gutter = ref(20);

    const wrapper = mount({
      components: {
        XyRow,
        XyCol
      },
      setup() {
        return {
          gutter
        };
      },
      template: `
        <xy-row :gutter="gutter">
          <xy-col ref="col" :span="12" />
        </xy-row>
      `
    });

    const col = wrapper.findComponent({ ref: "col" });
    const element = col.element as HTMLElement;

    expect(element.style.paddingLeft).toBe("10px");
    expect(element.style.paddingRight).toBe("10px");

    gutter.value = 40;
    await nextTick();

    expect(element.style.paddingLeft).toBe("20px");
    expect(element.style.paddingRight).toBe("20px");
  });

  it("脱离 Row 使用时不会注入内边距", () => {
    const wrapper = mount(XyCol, {
      props: {
        span: 12
      }
    });

    const style = (wrapper.element as HTMLElement).style;

    expect(style.paddingLeft).toBe("");
    expect(style.paddingRight).toBe("");
    expect(wrapper.classes()).not.toContain("is-guttered");
  });

  it("支持自定义根标签", () => {
    const wrapper = mount(XyCol, {
      props: {
        tag: "article",
        span: 12
      }
    });

    expect(wrapper.element.tagName).toBe("ARTICLE");
  });
});
