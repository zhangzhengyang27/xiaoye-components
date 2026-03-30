import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyDescriptions, XyDescriptionsItem } from "@xiaoye/components";

describe("XyDescriptions", () => {
  it("支持基础渲染和标题额外区", () => {
    const wrapper = mount({
      components: {
        XyDescriptions,
        XyDescriptionsItem
      },
      template: `
        <xy-descriptions title="成员信息" extra="只读">
          <xy-descriptions-item label="姓名">小叶</xy-descriptions-item>
          <xy-descriptions-item label="角色">管理员</xy-descriptions-item>
        </xy-descriptions>
      `
    });

    expect(wrapper.text()).toContain("成员信息");
    expect(wrapper.text()).toContain("只读");
    expect(wrapper.text()).toContain("小叶");
  });

  it("支持 span、border 和 vertical 方向", () => {
    const wrapper = mount({
      components: {
        XyDescriptions,
        XyDescriptionsItem
      },
      template: `
        <xy-descriptions border direction="vertical" :column="2">
          <xy-descriptions-item label="摘要" :span="2">完整描述</xy-descriptions-item>
        </xy-descriptions>
      `
    });

    expect(wrapper.find(".xy-descriptions").classes()).toContain("is-bordered");
    expect(wrapper.find(".xy-descriptions-item").attributes("style")).toContain("span 2");
    expect(wrapper.find(".xy-descriptions-item").classes()).toContain("is-vertical");
  });
});
