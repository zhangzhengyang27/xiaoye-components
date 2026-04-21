import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
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

  it("items 写法支持 icon、tag、link 和动态插槽", () => {
    const wrapper = mount({
      components: {
        XyDescriptions
      },
      template: `
        <xy-descriptions :items="items">
          <template #owner-label="{ item }">
            <span class="owner-label">{{ item.label }}</span>
          </template>
          <template #owner-value="{ item }">
            <strong class="owner-value">{{ item.value }}</strong>
          </template>
        </xy-descriptions>
      `,
      data() {
        return {
          items: [
            {
              label: "负责人",
              value: "小叶",
              icon: "mdi:account",
              labelSlot: "owner-label",
              defaultSlot: "owner-value"
            },
            {
              label: "状态",
              value: "启用",
              tag: {
                text: "启用",
                props: {
                  status: "success"
                }
              }
            },
            {
              label: "文档",
              value: "查看详情",
              link: {
                href: "/detail",
                target: "_blank"
              }
            }
          ]
        };
      }
    });

    expect(wrapper.find(".owner-label").exists()).toBe(true);
    expect(wrapper.find(".owner-value").text()).toBe("小叶");
    expect(wrapper.find(".xy-tag").exists()).toBe(true);
    expect(wrapper.find(".xy-link").exists()).toBe(true);
  });

  it("collapse 开启后支持收起与展开内容区", async () => {
    const wrapper = mount(XyDescriptions, {
      props: {
        title: "审核信息",
        collapse: true,
        items: [
          {
            label: "状态",
            value: "已通过"
          }
        ]
      }
    });

    expect(wrapper.find(".xy-descriptions__toggle-icon").classes()).toContain("is-collapsed");

    await wrapper.get(".xy-descriptions__toggle").trigger("click");
    await nextTick();
    expect(wrapper.find(".xy-descriptions__toggle-icon").classes()).not.toContain("is-collapsed");
  });

  it("items 写法支持 valueType、formatter、render、renderHTML 和 emptyValue", () => {
    const wrapper = mount(XyDescriptions, {
      props: {
        items: [
          {
            label: "状态",
            value: "enabled",
            valueType: "select",
            options: [
              {
                label: "启用",
                value: "enabled",
                status: "success"
              }
            ]
          },
          {
            label: "预算",
            value: 128000.5,
            valueType: "money"
          },
          {
            label: "更新时间",
            value: "2026-04-18T14:30:00+08:00",
            valueType: "datetime"
          },
          {
            label: "空值",
            value: null,
            emptyValue: "暂无备注"
          },
          {
            label: "格式化",
            value: "小叶",
            formatter: (_row, _column, value) => `负责人：${String(value ?? "-")}`
          },
          {
            label: "render",
            value: "稳定",
            render: (value) => h("strong", { class: "desc-render" }, String(value ?? "-"))
          },
          {
            label: "html",
            value: "可信 <strong class='desc-html'>HTML</strong>",
            renderHTML: (value) => `<span>${String(value ?? "")}</span>`
          },
          {
            label: "复制",
            value: "workspace-token",
            valueType: "copy"
          }
        ]
      }
    });

    expect(wrapper.text()).toContain("启用");
    expect(wrapper.find(".xy-display-value__status-dot.is-success").exists()).toBe(true);
    expect(wrapper.text()).toContain("¥128,000.50");
    expect(wrapper.text()).toContain("2026/04/18");
    expect(wrapper.text()).toContain("暂无备注");
    expect(wrapper.text()).toContain("负责人：小叶");
    expect(wrapper.find(".desc-render").exists()).toBe(true);
    expect(wrapper.find(".desc-html").exists()).toBe(true);
    expect(wrapper.find(".xy-text__action").exists()).toBe(true);
  });
});
