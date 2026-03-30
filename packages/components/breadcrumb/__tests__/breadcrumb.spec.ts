import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyBreadcrumb, XyBreadcrumbItem } from "../index";

vi.mock("@iconify/vue", () => ({
  Icon: defineComponent({
    name: "MockIconifyIcon",
    inheritAttrs: false,
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    setup(props, { attrs }) {
      return () => h("svg", { ...attrs, "data-icon": props.icon });
    }
  })
}));

function createWrapper(
  render: () => ReturnType<typeof h>,
  router?: Record<string, unknown>
) {
  return mount(render, {
    global: {
      config: {
        globalProperties: {
          $loading: undefined,
          $router: router as never,
          $route: {} as never
        }
      }
    }
  });
}

describe("XyBreadcrumb", () => {
  it("静态 Item 导出可用", () => {
    expect(XyBreadcrumb.Item).toBe(XyBreadcrumbItem);
  });

  it("支持默认字符分隔符和最后一项当前页语义", async () => {
    const wrapper = createWrapper(() =>
      h(XyBreadcrumb, null, () => [
        h(XyBreadcrumbItem, null, () => "订单中心"),
        h(XyBreadcrumbItem, null, () => "退款详情")
      ])
    );

    await nextTick();

    expect(wrapper.classes()).toContain("xy-breadcrumb");
    expect(wrapper.findAll(".xy-breadcrumb__separator")).toHaveLength(1);
    expect(wrapper.get(".xy-breadcrumb__separator").text()).toBe("/");

    const items = wrapper.findAll(".xy-breadcrumb__item");
    expect(items[1]?.attributes("aria-current")).toBe("page");
  });

  it("separatorIcon 会覆盖字符分隔符", async () => {
    const wrapper = createWrapper(() =>
      h(XyBreadcrumb, { separator: "?", separatorIcon: "mdi:chevron-right" }, () => [
        h(XyBreadcrumbItem, null, () => "订单中心"),
        h(XyBreadcrumbItem, null, () => "退款详情")
      ])
    );

    await nextTick();

    expect(wrapper.find(".xy-breadcrumb__separator").text()).toBe("");
    expect(wrapper.find('[data-icon="mdi:chevron-right"]').exists()).toBe(true);
  });

  it("href 与 target 会在非末项上正常透传", async () => {
    const wrapper = createWrapper(() =>
      h(XyBreadcrumb, null, () => [
        h(
          XyBreadcrumbItem,
          {
            href: "https://example.com/orders",
            target: "_blank"
          },
          () => "订单中心"
        ),
        h(XyBreadcrumbItem, null, () => "退款详情")
      ])
    );

    await nextTick();

    const link = wrapper.get("a.xy-breadcrumb__inner");

    expect(link.attributes("href")).toBe("https://example.com/orders");
    expect(link.attributes("target")).toBe("_blank");
    expect(link.classes()).toContain("is-link");
  });

  it("to 会在 router 存在时命中 push 和 replace", async () => {
    const push = vi.fn();
    const replace = vi.fn();

    const pushWrapper = createWrapper(
      () =>
        h(XyBreadcrumb, null, () => [
          h(XyBreadcrumbItem, { to: "/orders" }, () => "订单中心"),
          h(XyBreadcrumbItem, null, () => "退款详情")
        ]),
      {
        push,
        replace
      }
    );

    await nextTick();

    await pushWrapper.get(".xy-breadcrumb__inner").trigger("click");
    expect(push).toHaveBeenCalledWith("/orders");

    const replaceWrapper = createWrapper(
      () =>
        h(XyBreadcrumb, null, () => [
          h(XyBreadcrumbItem, { to: "/orders", replace: true }, () => "订单中心"),
          h(XyBreadcrumbItem, null, () => "退款详情")
        ]),
      {
        push,
        replace
      }
    );

    await nextTick();

    await replaceWrapper.get(".xy-breadcrumb__inner").trigger("click");
    expect(replace).toHaveBeenCalledWith("/orders");
  });

  it("纯 to 场景在无 href 时支持 Enter 键触发", async () => {
    const push = vi.fn();
    const replace = vi.fn();

    const wrapper = createWrapper(
      () =>
        h(XyBreadcrumb, null, () => [
          h(XyBreadcrumbItem, { to: "/orders" }, () => "订单中心"),
          h(XyBreadcrumbItem, null, () => "退款详情")
        ]),
      {
        push,
        replace
      }
    );

    await nextTick();

    const inner = wrapper.get(".xy-breadcrumb__inner");

    expect(inner.attributes("role")).toBe("link");
    expect(inner.attributes("tabindex")).toBe("0");

    await inner.trigger("keydown", { key: "Enter" });

    expect(push).toHaveBeenCalledWith("/orders");
  });

  it("无 router 时 to 不抛错且不会导航", async () => {
    const wrapper = createWrapper(() =>
      h(XyBreadcrumb, null, () => [
        h(XyBreadcrumbItem, { to: "/orders" }, () => "订单中心"),
        h(XyBreadcrumbItem, null, () => "退款详情")
      ])
    );

    await nextTick();

    const inner = wrapper.get(".xy-breadcrumb__inner");

    expect(inner.attributes("role")).toBeUndefined();
    expect(inner.attributes("tabindex")).toBeUndefined();

    await inner.trigger("click");
    await inner.trigger("keydown", { key: "Enter" });
  });

  it("disabled 和最后一项都不会触发导航", async () => {
    const push = vi.fn();
    const replace = vi.fn();

    const wrapper = createWrapper(
      () =>
        h(XyBreadcrumb, null, () => [
          h(
            XyBreadcrumbItem,
            {
              href: "https://example.com/orders",
              disabled: true
            },
            () => "订单中心"
          ),
          h(
            XyBreadcrumbItem,
            {
              to: "/orders/detail"
            },
            () => "退款详情"
          )
        ]),
      {
        push,
        replace
      }
    );

    await nextTick();

    const items = wrapper.findAll(".xy-breadcrumb__inner");

    expect(items[0]?.attributes("href")).toBeUndefined();
    expect(items[0]?.attributes("aria-disabled")).toBe("true");
    await items[0]?.trigger("click");

    expect(items[1]?.attributes("role")).toBeUndefined();
    await items[1]?.trigger("click");

    expect(push).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("items 写法支持声明式渲染", async () => {
    const wrapper = createWrapper(() =>
      h(XyBreadcrumb, {
        items: [
          { label: "工作台", href: "/workspace" },
          { label: "成员中心", to: "/members" },
          { label: "详情页" }
        ]
      })
    );

    await nextTick();

    expect(wrapper.findAll(".xy-breadcrumb__item")).toHaveLength(3);
    expect(wrapper.text()).toContain("成员中心");
  });

  it("items 显式传入 undefined 时会回退到默认插槽渲染", async () => {
    const wrapper = createWrapper(() =>
      h(XyBreadcrumb, { items: undefined }, () => [
        h(XyBreadcrumbItem, null, () => "工作台"),
        h(XyBreadcrumbItem, null, () => "详情页")
      ])
    );

    await nextTick();

    expect(wrapper.findAll(".xy-breadcrumb__item")).toHaveLength(2);
    expect(wrapper.text()).toContain("工作台");
    expect(wrapper.text()).toContain("详情页");
  });
});
