import "@xiaoye/theme";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyTimeline, XyTimelineGroup, XyTimelineItem } from "../index";

function getTimelineContentTexts(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll(".xy-timeline-item__content").map((node) => node.text().trim());
}

function normalizeCssValue(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

const timelineCssText = normalizeCssValue(
  readFileSync(resolve(process.cwd(), "packages/theme/src/components/timeline.css"), "utf8")
);

describe("XyTimeline", () => {
  it("支持默认内容渲染", async () => {
    const wrapper = mount(XyTimeline, {
      slots: {
        default: `
          <xy-timeline-item timestamp="2026-03-20">创建项目</xy-timeline-item>
          <xy-timeline-item timestamp="2026-03-22">开始联调</xy-timeline-item>
        `
      },
      global: {
        components: {
          XyTimelineItem
        }
      }
    });

    await nextTick();

    expect(getTimelineContentTexts(wrapper)).toEqual(["创建项目", "开始联调"]);
  });

  it("支持 mode 四种布局类", async () => {
    const wrapper = mount(XyTimeline, {
      slots: {
        default: () => [h(XyTimelineItem, null, () => "默认节点")]
      }
    });

    const modes = ["start", "alternate", "alternate-reverse", "end"] as const;

    for (const mode of modes) {
      await wrapper.setProps({ mode });
      expect(wrapper.classes()).toContain(`xy-timeline--${mode}`);
    }
  });

  it("mode='start' 时采用左侧两栏布局而不是中轴居中", async () => {
    const wrapper = mount(XyTimeline, {
      slots: {
        default: () => [h(XyTimelineItem, null, () => "默认节点")]
      }
    });

    await nextTick();

    expect(wrapper.get(".xy-timeline-item").classes()).toContain("xy-timeline-item--start");
    expect(timelineCssText).toContain(
      normalizeCssValue(
        ".xy-timeline-item--start { grid-template-columns: var(--xy-timeline-center-width) minmax(0, 1fr);"
      )
    );
    expect(timelineCssText).toContain(
      normalizeCssValue(".xy-timeline-item--start .xy-timeline-item__wrapper { grid-column: 2;")
    );
    expect(timelineCssText).toContain(
      normalizeCssValue(".xy-timeline-item--start .xy-timeline-item__node,")
    );
  });

  it("mode='end' 时采用右侧两栏布局", async () => {
    const wrapper = mount(XyTimeline, {
      props: {
        mode: "end"
      },
      slots: {
        default: () => [h(XyTimelineItem, null, () => "默认节点")]
      }
    });

    await nextTick();

    expect(wrapper.get(".xy-timeline-item").classes()).toContain("xy-timeline-item--end");
    expect(timelineCssText).toContain(
      normalizeCssValue(
        ".xy-timeline-item--end { grid-template-columns: minmax(0, 1fr) var(--xy-timeline-center-width);"
      )
    );
    expect(timelineCssText).toContain(
      normalizeCssValue(".xy-timeline-item--end .xy-timeline-item__wrapper { grid-column: 1;")
    );
    expect(timelineCssText).toContain(
      normalizeCssValue(".xy-timeline-item--end .xy-timeline-item__node,")
    );
  });

  it("density 会透传到 group 和 item", async () => {
    const wrapper = mount(XyTimeline, {
      props: {
        density: "compact"
      },
      slots: {
        default: `
          <xy-timeline-group title="今天">
            <xy-timeline-item>第一条</xy-timeline-item>
          </xy-timeline-group>
        `
      },
      global: {
        components: {
          XyTimelineGroup,
          XyTimelineItem
        }
      }
    });

    await nextTick();

    expect(wrapper.classes()).toContain("xy-timeline--compact");
    expect(wrapper.find(".xy-timeline-group").classes()).toContain("xy-timeline-group--compact");
    expect(wrapper.find(".xy-timeline-item").classes()).toContain("xy-timeline-item--compact");
  });

  it("start + group 时保持单侧布局，不会回到中轴样式", async () => {
    const wrapper = mount(XyTimeline, {
      slots: {
        default: `
          <xy-timeline-group title="今天">
            <xy-timeline-item>第一条</xy-timeline-item>
          </xy-timeline-group>
        `
      },
      global: {
        components: {
          XyTimelineGroup,
          XyTimelineItem
        }
      }
    });

    await nextTick();

    expect(wrapper.find(".xy-timeline-item").classes()).toContain("xy-timeline-item--start");
  });

  it("start + compact 仍然保持单侧布局", async () => {
    const wrapper = mount(XyTimeline, {
      props: {
        density: "compact"
      },
      slots: {
        default: () => [h(XyTimelineItem, null, () => "默认节点")]
      }
    });

    await nextTick();

    expect(wrapper.find(".xy-timeline-item").classes()).toContain("xy-timeline-item--start");
    expect(timelineCssText).toContain(
      normalizeCssValue(".xy-timeline-item--start { grid-template-columns:")
    );
  });

  it("reverse 在普通 children 下会真正反转顺序", async () => {
    const wrapper = mount(XyTimeline, {
      props: {
        reverse: true
      },
      slots: {
        default: `
          <xy-timeline-item timestamp="2026-03-20">步骤一</xy-timeline-item>
          <xy-timeline-item timestamp="2026-03-21">步骤二</xy-timeline-item>
          <xy-timeline-item timestamp="2026-03-22">步骤三</xy-timeline-item>
        `
      },
      global: {
        components: {
          XyTimelineItem
        }
      }
    });

    await nextTick();

    expect(getTimelineContentTexts(wrapper)).toEqual(["步骤三", "步骤二", "步骤一"]);
  });

  it("reverse 在手写 children 下也会反转顺序", async () => {
    const wrapper = mount(XyTimeline, {
      props: {
        reverse: true
      },
      slots: {
        default: () => [
          h(XyTimelineItem, { timestamp: "2026-03-20" }, () => "同步需求"),
          h(XyTimelineItem, { timestamp: "2026-03-22" }, () => "开始开发")
        ]
      }
    });

    await nextTick();

    expect(getTimelineContentTexts(wrapper)).toEqual(["开始开发", "同步需求"]);
  });

  it("默认插槽中的非 TimelineItem 子内容仍可渲染", async () => {
    const wrapper = mount(XyTimeline, {
      props: {
        reverse: true
      },
      slots: {
        default: `
          <xy-timeline-item timestamp="2026-03-20">节点一</xy-timeline-item>
          <div class="extra-node">额外说明</div>
          <xy-timeline-item timestamp="2026-03-21">节点二</xy-timeline-item>
        `
      },
      global: {
        components: {
          XyTimelineItem
        }
      }
    });

    await nextTick();

    const childTexts = Array.from(wrapper.element.children).map((node) =>
      (node as Element).textContent?.replace(/\s+/g, " ").trim()
    );

    expect(wrapper.find(".extra-node").exists()).toBe(true);
    expect(childTexts).toEqual(["节点二2026-03-21", "额外说明", "节点一2026-03-20"]);
  });

  it("reverse 遇到 group 时按组整体反转，组内顺序保持不变", async () => {
    const wrapper = mount(XyTimeline, {
      props: {
        reverse: true
      },
      slots: {
        default: `
          <xy-timeline-item>单独节点</xy-timeline-item>
          <xy-timeline-group title="分组标题">
            <xy-timeline-item>组内节点一</xy-timeline-item>
            <xy-timeline-item>组内节点二</xy-timeline-item>
          </xy-timeline-group>
          <div class="plain-node">普通节点</div>
        `
      },
      global: {
        components: {
          XyTimelineGroup,
          XyTimelineItem
        }
      }
    });

    await nextTick();

    const topLevelTexts = Array.from(wrapper.element.children).map((node) =>
      (node as Element).textContent?.replace(/\s+/g, " ").trim()
    );
    const groupedTexts = wrapper
      .find(".xy-timeline-group")
      .findAll(".xy-timeline-item__content")
      .map((node) => node.text());

    expect(topLevelTexts).toEqual(["普通节点", "分组标题组内节点一组内节点二", "单独节点"]);
    expect(groupedTexts).toEqual(["组内节点一", "组内节点二"]);
  });

  it("alternate 模式在跨组时保持连续编号", async () => {
    const wrapper = mount(XyTimeline, {
      props: {
        mode: "alternate"
      },
      slots: {
        default: `
          <xy-timeline-item>节点 A</xy-timeline-item>
          <xy-timeline-group title="第二组">
            <xy-timeline-item>节点 B</xy-timeline-item>
            <xy-timeline-item>节点 C</xy-timeline-item>
          </xy-timeline-group>
          <xy-timeline-item>节点 D</xy-timeline-item>
        `
      },
      global: {
        components: {
          XyTimelineGroup,
          XyTimelineItem
        }
      }
    });

    await nextTick();

    const sideClasses = wrapper.findAll(".xy-timeline-item").map((node) => {
      if (node.classes().includes("xy-timeline-item--side-start")) {
        return "start";
      }

      return "end";
    });

    expect(sideClasses).toEqual(["start", "end", "start", "end"]);
  });

  it("alternate 仍保留三栏中轴布局规则", () => {
    expect(timelineCssText).toContain(
      normalizeCssValue(
        ".xy-timeline-item { --xy-timeline-node-size: 14px; --xy-timeline-tail-color:"
      )
    );
    expect(timelineCssText).toContain(
      normalizeCssValue(
        "grid-template-columns: minmax(0, 1fr) var(--xy-timeline-center-width) minmax(0, 1fr);"
      )
    );
  });
});

describe("XyTimelineGroup", () => {
  it("支持默认标题、描述和 extra 插槽", async () => {
    const wrapper = mount(XyTimelineGroup, {
      props: {
        title: "今天",
        description: "3 条记录"
      },
      slots: {
        extra: () => h("span", { class: "group-extra" }, "已同步"),
        default: () => [h(XyTimelineItem, null, () => "组内记录")]
      }
    });

    await nextTick();

    expect(wrapper.find(".xy-timeline-group__title").text()).toBe("今天");
    expect(wrapper.find(".xy-timeline-group__description").text()).toBe("3 条记录");
    expect(wrapper.find(".group-extra").exists()).toBe(true);
  });

  it("title 插槽会覆盖默认标题区，组头不进入 item 左右布局", async () => {
    const wrapper = mount(XyTimelineGroup, {
      props: {
        title: "会被覆盖"
      },
      slots: {
        title: () => h("strong", { class: "custom-title" }, "自定义标题"),
        default: () => [h(XyTimelineItem, null, () => "组内记录")]
      }
    });

    await nextTick();

    expect(wrapper.find(".custom-title").exists()).toBe(true);
    expect(wrapper.find(".xy-timeline-group__header").exists()).toBe(true);
    expect(wrapper.find(".xy-timeline-group__header").classes()).not.toContain(
      "xy-timeline-item--side-start"
    );
  });

  it("divider=false 时会切到轻量组头样式", async () => {
    const wrapper = mount(XyTimelineGroup, {
      props: {
        title: "今天",
        divider: false
      },
      slots: {
        default: () => [h(XyTimelineItem, null, () => "组内记录")]
      }
    });

    await nextTick();

    expect(wrapper.classes()).toContain("is-dividerless");
  });
});

describe("XyTimelineItem", () => {
  it("placement='top' 时会先渲染时间戳", () => {
    const wrapper = mount(XyTimelineItem, {
      props: {
        timestamp: "2026-03-20 09:30",
        placement: "top"
      },
      slots: {
        default: () => "通过审批"
      }
    });

    const wrapperChildren = Array.from(
      wrapper.get(".xy-timeline-item__wrapper").element.children
    ) as HTMLElement[];

    expect(wrapperChildren[0]?.classList.contains("xy-timeline-item__timestamp")).toBe(true);
    expect(wrapperChildren[1]?.classList.contains("xy-timeline-item__main")).toBe(true);
    expect(wrapper.find(".xy-timeline-item__content").exists()).toBe(true);
  });

  it("hideTimestamp 会隐藏时间戳", () => {
    const wrapper = mount(XyTimelineItem, {
      props: {
        timestamp: "2026-03-20 09:30",
        hideTimestamp: true
      },
      slots: {
        default: () => "隐藏时间"
      }
    });

    expect(wrapper.find(".xy-timeline-item__timestamp").exists()).toBe(false);
  });

  it("center 在 start 模式下会回退为普通时间戳，不再走对侧展示", () => {
    const wrapper = mount(XyTimelineItem, {
      props: {
        timestamp: "2026-03-20 09:30",
        center: true
      },
      slots: {
        default: () => "居中对齐"
      }
    });

    expect(wrapper.classes()).toContain("is-center");
    expect(wrapper.find(".xy-timeline-item__timestamp-opposite").exists()).toBe(false);
    expect(wrapper.find(".xy-timeline-item__timestamp").exists()).toBe(true);
  });

  it("center 在 alternate 模式下会把时间戳切到对侧区域", async () => {
    const wrapper = mount(XyTimeline, {
      props: {
        mode: "alternate"
      },
      slots: {
        default: () => [
          h(
            XyTimelineItem,
            {
              timestamp: "2026-03-20 09:30",
              center: true
            },
            () => "居中对齐"
          )
        ]
      }
    });

    await nextTick();

    expect(wrapper.find(".xy-timeline-item__timestamp-opposite").exists()).toBe(true);
  });

  it("color 会写入内联样式变量", () => {
    const wrapper = mount(XyTimelineItem, {
      props: {
        color: "#0ea5e9"
      },
      slots: {
        default: () => "自定义颜色"
      }
    });

    expect(wrapper.attributes("style")).toContain("--xy-timeline-node-color: #0ea5e9");
  });

  it("type、size 和 hollow 会落到对应类名", () => {
    const wrapper = mount(XyTimelineItem, {
      props: {
        type: "success",
        size: "large",
        hollow: true
      },
      slots: {
        default: () => "语义节点"
      }
    });

    expect(wrapper.classes()).toContain("xy-timeline-item--success");
    expect(wrapper.classes()).toContain("xy-timeline-item--large");
    expect(wrapper.classes()).toContain("is-hollow");
  });

  it("state 会落到对应流程态类名，pending 默认空心", () => {
    const wrapper = mount(XyTimelineItem, {
      props: {
        type: "warning",
        state: "pending"
      },
      slots: {
        default: () => "待处理节点"
      }
    });

    expect(wrapper.classes()).toContain("xy-timeline-item--state-pending");
    expect(wrapper.classes()).toContain("is-hollow");
  });

  it("icon 字符串会交给 XyIcon 渲染", () => {
    const wrapper = mount(XyTimelineItem, {
      props: {
        icon: "mdi:check-circle"
      },
      slots: {
        default: () => "图标节点"
      }
    });

    expect(wrapper.find('[data-icon="mdi:check-circle"]').exists()).toBe(true);
  });

  it("dot slot 会替换默认节点", () => {
    const wrapper = mount(XyTimelineItem, {
      slots: {
        default: () => "自定义 dot",
        dot: () => h("span", { class: "custom-dot" }, "D")
      }
    });

    expect(wrapper.find(".xy-timeline-item__node").exists()).toBe(false);
    expect(wrapper.find(".custom-dot").exists()).toBe(true);
  });

  it("结构化插槽会按稳定顺序渲染", () => {
    const wrapper = mount(XyTimelineItem, {
      slots: {
        title: () => h("div", { class: "slot-title" }, "标题"),
        meta: () => h("div", { class: "slot-meta" }, "元信息"),
        actions: () => h("button", { class: "slot-actions" }, "操作"),
        default: () => h("div", { class: "slot-content" }, "正文"),
        extra: () => h("div", { class: "slot-extra" }, "扩展")
      }
    });

    const mainChildren = Array.from(wrapper.get(".xy-timeline-item__main").element.children).map(
      (node) => (node as Element).className
    );

    expect(mainChildren).toEqual([
      "xy-timeline-item__header",
      "xy-timeline-item__content",
      "xy-timeline-item__extra"
    ]);
    expect(wrapper.find(".slot-title").exists()).toBe(true);
    expect(wrapper.find(".slot-meta").exists()).toBe(true);
    expect(wrapper.find(".slot-actions").exists()).toBe(true);
  });

  it("缺省部分结构化插槽时不会生成空容器", () => {
    const wrapper = mount(XyTimelineItem, {
      slots: {
        default: () => "只有正文",
        extra: () => h("div", { class: "slot-extra" }, "补充")
      }
    });

    expect(wrapper.find(".xy-timeline-item__header").exists()).toBe(false);
    expect(wrapper.find(".xy-timeline-item__content").exists()).toBe(true);
    expect(wrapper.find(".xy-timeline-item__extra").exists()).toBe(true);
  });

  it("dot 与结构化插槽并存时只替换节点区", () => {
    const wrapper = mount(XyTimelineItem, {
      slots: {
        title: () => h("div", { class: "slot-title" }, "标题"),
        meta: () => h("div", { class: "slot-meta" }, "元信息"),
        actions: () => h("button", { class: "slot-actions" }, "操作"),
        default: () => "正文",
        extra: () => h("div", { class: "slot-extra" }, "扩展"),
        dot: () => h("span", { class: "custom-dot" }, "D")
      }
    });

    expect(wrapper.find(".xy-timeline-item__node").exists()).toBe(false);
    expect(wrapper.find(".custom-dot").exists()).toBe(true);
    expect(wrapper.find(".slot-title").exists()).toBe(true);
    expect(wrapper.find(".slot-meta").exists()).toBe(true);
    expect(wrapper.find(".slot-actions").exists()).toBe(true);
    expect(wrapper.find(".slot-extra").exists()).toBe(true);
  });
});
