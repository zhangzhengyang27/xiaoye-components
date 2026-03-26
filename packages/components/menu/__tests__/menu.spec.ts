import "@xiaoye/theme";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import {
  XyMenu,
  XyMenuItem,
  XyMenuItemGroup,
  XySubMenu
} from "../index";

enableAutoUnmount(afterEach);

const menuCssText = readFileSync(
  resolve(process.cwd(), "packages/theme/src/components/menu.css"),
  "utf8"
);

function mountMenu(template: string, options: Record<string, unknown> = {}) {
  const { globalProperties, ...componentOptions } = options as {
    globalProperties?: Record<string, unknown>;
  };

  return mount(
    {
      components: {
        XyMenu,
        XyMenuItem,
        XyMenuItemGroup,
        XySubMenu
      },
      template,
      ...componentOptions
    },
    {
      attachTo: document.body,
      global: {
        config: {
          globalProperties: {
            $loading: undefined,
            $route: {} as never,
            $router: undefined as never,
            ...(globalProperties ?? {})
          }
        }
      }
    }
  );
}

describe("XyMenu", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("支持菜单项激活切换", async () => {
    const wrapper = mountMenu(`
      <xy-menu>
        <xy-menu-item index="1" ref="item1">处理中心</xy-menu-item>
        <xy-menu-item index="2" ref="item2">订单管理</xy-menu-item>
      </xy-menu>
    `);

    const item1 = wrapper.getComponent({ ref: "item1" });
    const item2 = wrapper.getComponent({ ref: "item2" });

    await item1.trigger("click");
    await nextTick();
    expect(item1.classes()).toContain("is-active");

    await item2.trigger("click");
    await nextTick();
    expect(item2.classes()).toContain("is-active");
  });

  it("支持默认激活项和祖先子菜单自动展开", async () => {
    const wrapper = mountMenu(`
      <xy-menu default-active="2-2">
        <xy-menu-item index="1">工作台</xy-menu-item>
        <xy-sub-menu index="2" ref="submenu">
          <template #title>我的空间</template>
          <xy-menu-item index="2-1">选项一</xy-menu-item>
          <xy-menu-item index="2-2" ref="submenuItem">选项二</xy-menu-item>
        </xy-sub-menu>
      </xy-menu>
    `);

    await nextTick();

    expect(wrapper.getComponent({ ref: "submenuItem" }).classes()).toContain("is-active");
    expect(wrapper.getComponent({ ref: "submenu" }).classes()).toContain("is-opened");
  });

  it("支持 defaultOpeneds 与 uniqueOpened", async () => {
    const wrapper = mountMenu(`
      <xy-menu :default-openeds="['2']" unique-opened>
        <xy-sub-menu index="2" ref="submenu1">
          <template #title>空间</template>
          <xy-menu-item index="2-1">文件</xy-menu-item>
        </xy-sub-menu>
        <xy-sub-menu index="3" ref="submenu2">
          <template #title>设置</template>
          <xy-menu-item index="3-1">角色</xy-menu-item>
        </xy-sub-menu>
      </xy-menu>
    `);

    await nextTick();
    expect(wrapper.getComponent({ ref: "submenu1" }).classes()).toContain("is-opened");

    await wrapper.getComponent({ ref: "submenu2" }).get(".xy-sub-menu__title").trigger("click");
    await nextTick();

    expect(wrapper.getComponent({ ref: "submenu2" }).classes()).toContain("is-opened");
    expect(wrapper.getComponent({ ref: "submenu1" }).classes()).not.toContain("is-opened");
  });

  it("支持禁用菜单项和分组标题", async () => {
    const wrapper = mountMenu(`
      <xy-menu default-active="2">
        <xy-menu-item-group title="分组一" ref="group">
          <xy-menu-item index="1" ref="disabledItem" disabled>禁用项</xy-menu-item>
          <xy-menu-item index="2">可用项</xy-menu-item>
        </xy-menu-item-group>
      </xy-menu>
    `);

    await wrapper.getComponent({ ref: "disabledItem" }).trigger("click");
    await nextTick();

    expect(wrapper.getComponent({ ref: "disabledItem" }).classes()).not.toContain("is-active");
    expect(wrapper.getComponent({ ref: "group" }).text()).toContain("分组一");
  });

  it("支持 exposes 的 open/close/updateActiveIndex", async () => {
    const wrapper = mountMenu(`
      <xy-menu ref="menu">
        <xy-sub-menu index="2" ref="submenu">
          <template #title>空间</template>
          <xy-menu-item index="2-1">文件</xy-menu-item>
        </xy-sub-menu>
      </xy-menu>
    `);

    const api = wrapper.getComponent({ ref: "menu" }).vm as {
      open: (index: string) => void;
      close: (index: string) => void;
      updateActiveIndex: (index: string) => void;
    };

    api.open("2");
    await nextTick();
    expect(wrapper.getComponent({ ref: "submenu" }).classes()).toContain("is-opened");

    api.close("2");
    await nextTick();
    expect(wrapper.getComponent({ ref: "submenu" }).classes()).not.toContain("is-opened");

    api.updateActiveIndex("2-1");
    await nextTick();
    expect(wrapper.text()).toContain("文件");
  });

  it("支持 horizontal hover 打开子菜单和 closeOnClickOutside", async () => {
    vi.useFakeTimers();

    const wrapper = mountMenu(
      `
        <xy-menu mode="horizontal" close-on-click-outside>
          <xy-sub-menu index="2" ref="submenu">
            <template #title>协作空间</template>
            <xy-menu-item index="2-1">文件</xy-menu-item>
          </xy-sub-menu>
        </xy-menu>
      `
    );

    await wrapper.getComponent({ ref: "submenu" }).trigger("mouseenter");
    vi.runAllTimers();
    await nextTick();

    expect(document.body.querySelector(".xy-menu__popup")).not.toBeNull();

    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await nextTick();
    vi.runAllTimers();
    await nextTick();

    expect((document.body.querySelector(".xy-menu__popup") as HTMLElement | null)?.style.display).toBe("none");
    vi.useRealTimers();
  });

  it("支持 collapse 后通过弹出层展示子菜单", async () => {
    const wrapper = mountMenu(`
      <xy-menu collapse>
        <xy-sub-menu index="ops" ref="submenu">
          <template #title>运维</template>
          <xy-menu-item index="alerts">告警</xy-menu-item>
        </xy-sub-menu>
      </xy-menu>
    `);

    await wrapper.getComponent({ ref: "submenu" }).get(".xy-sub-menu__title").trigger("click");
    await nextTick();

    expect(document.body.querySelector(".xy-menu__popup")).not.toBeNull();
  });

  it("支持 router 模式与无 router 降级", async () => {
    const push = vi.fn().mockResolvedValue(undefined);

    const wrapper = mountMenu(
      `
        <xy-menu router ref="menu">
          <xy-menu-item index="/dashboard" :route="{ path: '/dashboard' }" ref="item">
            工作台
          </xy-menu-item>
        </xy-menu>
      `,
      {
        globalProperties: {
          $router: { push }
        }
      }
    );

    await wrapper.getComponent({ ref: "item" }).trigger("click");
    await Promise.resolve();

    expect(push).toHaveBeenCalledWith({ path: "/dashboard" });
    expect(wrapper.getComponent({ ref: "menu" }).emitted("select")?.[0]?.[3]).toBeInstanceOf(Promise);

    const fallbackWrapper = mountMenu(`
      <xy-menu router>
        <xy-menu-item index="orders" ref="item">订单</xy-menu-item>
      </xy-menu>
    `);

    await fallbackWrapper.getComponent({ ref: "item" }).trigger("click");
    await nextTick();

    expect(fallbackWrapper.getComponent({ ref: "item" }).classes()).toContain("is-active");
  });

  it("支持横向溢出收纳更多菜单", async () => {
    const wrapper = mountMenu(`
      <xy-menu mode="horizontal" ellipsis ref="menu">
        <xy-menu-item index="1">一</xy-menu-item>
        <xy-menu-item index="2">二</xy-menu-item>
        <xy-menu-item index="3">三</xy-menu-item>
      </xy-menu>
    `);

    const menuEl = wrapper.get(".xy-menu").element as HTMLElement;
    Object.defineProperty(menuEl, "clientWidth", {
      configurable: true,
      get: () => 180
    });

    [...menuEl.children].forEach((child) => {
      Object.defineProperty(child, "offsetWidth", {
        configurable: true,
        get: () => 80
      });
    });

    const api = wrapper.getComponent({ ref: "menu" }).vm as {
      handleResize: () => void;
    };

    api.handleResize();
    await nextTick();
    await nextTick();

    expect(wrapper.find(".xy-menu__more").exists()).toBe(true);
  });

  it("折叠态一级菜单项的 title 插槽会以 Tooltip 展示，并继承 popper 配置", async () => {
    vi.useFakeTimers();

    const wrapper = mountMenu(`
      <xy-menu collapse popper-effect="light" popper-class="menu-tooltip-proxy" :popper-style="{ width: '180px' }" persistent>
        <xy-menu-item index="release">
          <span class="menu-icon-trigger">R</span>
          <template #title>发布中心</template>
        </xy-menu-item>
        <xy-sub-menu index="ops">
          <template #title>运维</template>
          <xy-menu-item index="alerts">
            <span>A</span>
            <template #title>告警</template>
          </xy-menu-item>
        </xy-sub-menu>
      </xy-menu>
    `);

    const tooltipTrigger = wrapper.get(".xy-tooltip");
    await tooltipTrigger.trigger("mouseenter");
    vi.advanceTimersByTime(100);
    await nextTick();

    const tooltipContent = document.body.querySelector(".xy-tooltip__content") as HTMLElement | null;
    expect(tooltipContent).not.toBeNull();
    expect(tooltipContent?.className).toContain("menu-tooltip-proxy");
    expect(tooltipContent?.className).toContain("xy-menu__collapsed-tooltip--light");
    expect(tooltipContent?.style.width).toBe("180px");
    expect(tooltipContent?.textContent).toContain("发布中心");

    await tooltipTrigger.trigger("mouseleave");
    vi.advanceTimersByTime(80);
    await nextTick();

    expect(document.body.querySelector(".xy-tooltip__content")).not.toBeNull();
    expect(wrapper.findAll(".xy-tooltip")).toHaveLength(1);
    vi.useRealTimers();
  });

  it("支持通过 --xy-menu-horizontal-height 自定义横向菜单高度", async () => {
    const wrapper = mountMenu(`
      <xy-menu mode="horizontal" style="--xy-menu-horizontal-height: 72px;">
        <xy-menu-item index="dashboard" ref="item">工作台</xy-menu-item>
      </xy-menu>
    `);

    await nextTick();

    const rootElement = wrapper.element as HTMLElement;

    expect(rootElement.style.getPropertyValue("--xy-menu-horizontal-height")).toBe("72px");
    expect(menuCssText).toContain("min-height: var(--xy-menu-horizontal-height);");
    expect(menuCssText).toContain("min-height: calc(var(--xy-menu-horizontal-height) - 16px);");
  });

  it("支持 activeIndex/openedMenus 受控优先级与 update:* 同步", async () => {
    const wrapper = mountMenu(
      `
        <xy-menu
          ref="menu"
          :active-index="activeIndex"
          :opened-menus="openedMenus"
          unique-opened
          default-active="wrong-active"
          :default-openeds="['wrong-opened']"
          @update:activeIndex="activeIndex = $event"
          @update:openedMenus="openedMenus = $event"
        >
          <xy-sub-menu index="analysis" ref="analysis">
            <template #title>分析</template>
            <xy-menu-item index="analysis-overview" ref="overview">概览</xy-menu-item>
          </xy-sub-menu>
          <xy-sub-menu index="ops" ref="ops">
            <template #title>运维</template>
            <xy-menu-item index="ops-logs" ref="logs">日志</xy-menu-item>
          </xy-sub-menu>
        </xy-menu>
      `,
      {
        setup() {
          return {
            activeIndex: ref("analysis-overview"),
            openedMenus: ref(["analysis"])
          };
        }
      }
    );

    await nextTick();

    expect(wrapper.getComponent({ ref: "overview" }).classes()).toContain("is-active");
    expect(wrapper.getComponent({ ref: "analysis" }).classes()).toContain("is-opened");
    expect(wrapper.getComponent({ ref: "ops" }).classes()).not.toContain("is-opened");

    await wrapper.getComponent({ ref: "logs" }).trigger("click");
    await nextTick();

    expect(wrapper.getComponent({ ref: "logs" }).classes()).toContain("is-active");
    expect(wrapper.getComponent({ ref: "ops" }).classes()).toContain("is-opened");
    expect(wrapper.getComponent({ ref: "menu" }).emitted("update:activeIndex")?.at(-1)).toEqual(["ops-logs"]);
    expect(wrapper.getComponent({ ref: "menu" }).emitted("update:openedMenus")?.at(-1)).toEqual([["ops"]]);
  });

  it("受控模式下 exposes 会通过 update:* 对外同步", async () => {
    const wrapper = mountMenu(
      `
        <xy-menu
          ref="menu"
          :active-index="activeIndex"
          :opened-menus="openedMenus"
          @update:activeIndex="activeIndex = $event"
          @update:openedMenus="openedMenus = $event"
        >
          <xy-sub-menu index="analysis" ref="analysis">
            <template #title>分析</template>
            <xy-menu-item index="analysis-overview">概览</xy-menu-item>
          </xy-sub-menu>
        </xy-menu>
      `,
      {
        setup() {
          return {
            activeIndex: ref(""),
            openedMenus: ref<string[]>([])
          };
        }
      }
    );

    const api = wrapper.getComponent({ ref: "menu" }).vm as {
      open: (index: string) => void;
      close: (index: string) => void;
      updateActiveIndex: (index: string) => void;
    };

    api.open("analysis");
    await nextTick();
    expect(wrapper.getComponent({ ref: "analysis" }).classes()).toContain("is-opened");
    expect(wrapper.getComponent({ ref: "menu" }).emitted("update:openedMenus")?.at(-1)).toEqual([["analysis"]]);

    api.updateActiveIndex("analysis-overview");
    await nextTick();
    expect(wrapper.getComponent({ ref: "menu" }).emitted("update:activeIndex")?.at(-1)).toEqual(["analysis-overview"]);

    api.close("analysis");
    await nextTick();
    expect(wrapper.getComponent({ ref: "analysis" }).classes()).not.toContain("is-opened");
    expect(wrapper.getComponent({ ref: "menu" }).emitted("update:openedMenus")?.at(-1)).toEqual([[]]);
  });

  it("支持 items 数据驱动、权限裁剪和插槽优先 warning", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const wrapper = mountMenu(
      `
        <xy-menu ref="menu" :items="items" :permission-checker="permissionChecker">
          <xy-menu-item index="slot-entry">插槽优先</xy-menu-item>
        </xy-menu>
      `,
      {
        setup() {
          const allowSystem = ref(false);
          const items = [
            {
              index: "analysis",
              label: "分析中心",
              type: "submenu",
              children: [
                {
                  index: "analysis-group",
                  label: "经营指标",
                  type: "group",
                  children: [
                    {
                      index: "analysis-overview",
                      label: "概览",
                      badge: "12",
                      extraText: "2 分钟前"
                    }
                  ]
                }
              ]
            },
            {
              index: "system",
              label: "系统设置",
              type: "submenu",
              permission: "ops:manage",
              children: [
                {
                  index: "system-users",
                  label: "用户"
                }
              ]
            },
            {
              index: "hidden-entry",
              label: "隐藏入口",
              hidden: true
            }
          ];

          const permissionChecker = (permission: string | string[] | undefined) => {
            if (!permission) {
              return true;
            }

            return allowSystem.value;
          };

          return {
            allowSystem,
            items,
            permissionChecker
          };
        }
      }
    );

    await nextTick();

    expect(wrapper.text()).toContain("插槽优先");
    expect(wrapper.text()).not.toContain("分析中心");
    expect(warnSpy).toHaveBeenCalledWith(
      "[XyMenu] items 与默认插槽不能同时使用，已优先渲染默认插槽。"
    );

    const itemsOnlyWrapper = mountMenu(
      `
        <xy-menu :items="items" :permission-checker="permissionChecker" />
      `,
      {
        setup() {
          const allowSystem = ref(false);
          const items = [
            {
              index: "analysis",
              label: "分析中心",
              type: "submenu",
              children: [
                {
                  index: "analysis-group",
                  label: "经营指标",
                  type: "group",
                  children: [
                    {
                      index: "analysis-overview",
                      label: "概览",
                      badge: "12",
                      extraText: "2 分钟前"
                    }
                  ]
                }
              ]
            },
            {
              index: "system",
              label: "系统设置",
              type: "submenu",
              permission: "ops:manage",
              children: [
                {
                  index: "system-users",
                  label: "用户"
                }
              ]
            },
            {
              index: "hidden-entry",
              label: "隐藏入口",
              hidden: true
            }
          ];

          const permissionChecker = (permission: string | string[] | undefined) => {
            if (!permission) {
              return true;
            }

            return allowSystem.value;
          };

          return {
            items,
            permissionChecker
          };
        }
      }
    );

    await nextTick();

    expect(itemsOnlyWrapper.text()).toContain("分析中心");
    expect(itemsOnlyWrapper.text()).not.toContain("系统设置");
    expect(itemsOnlyWrapper.text()).not.toContain("隐藏入口");
    expect(itemsOnlyWrapper.text()).toContain("12");
    expect(itemsOnlyWrapper.text()).toContain("2 分钟前");

    warnSpy.mockRestore();
  });

  it("items 模式下横向一级项隐藏 extraText，但 popup 项会展示", async () => {
    vi.useFakeTimers();

    const wrapper = mountMenu(
      `
        <xy-menu mode="horizontal" :items="items" :show-timeout="0" :hide-timeout="0" />
      `,
      {
        setup() {
          return {
            items: [
              {
                index: "workspace",
                label: "协作空间",
                type: "submenu",
                extraText: "同步中",
                children: [
                  {
                    index: "workspace-files",
                    label: "文件中心",
                    extraText: "12 条"
                  }
                ]
              }
            ]
          };
        }
      }
    );

    await nextTick();

    expect(wrapper.find(".xy-menu__item-extra").exists()).toBe(false);

    await wrapper.get(".xy-sub-menu").trigger("mouseenter");
    vi.runAllTimers();
    await nextTick();

    const popupExtra = [...document.body.querySelectorAll(".xy-menu__item-extra")].find(
      (node) => node.textContent?.includes("12 条")
    ) as HTMLElement | undefined;

    expect(popupExtra).toBeDefined();
    expect(getComputedStyle(popupExtra as HTMLElement).display).not.toBe("none");
    vi.useRealTimers();
  });

  it("items 模式支持 router 联动和横向 ellipsis", async () => {
    const push = vi.fn().mockResolvedValue(undefined);
    const wrapper = mountMenu(
      `
        <xy-menu mode="horizontal" router ellipsis ref="menu" :items="items" />
      `,
      {
        globalProperties: {
          $router: { push }
        },
        setup() {
          return {
            items: [
              {
                index: "/ops",
                label: "运维看板",
                route: { path: "/ops" }
              },
              {
                index: "/workspace",
                label: "团队协作"
              },
              {
                index: "/orders",
                label: "订单履约"
              }
            ]
          };
        }
      }
    );

    const menuEl = wrapper.get(".xy-menu").element as HTMLElement;
    Object.defineProperty(menuEl, "clientWidth", {
      configurable: true,
      get: () => 180
    });

    [...menuEl.children].forEach((child) => {
      Object.defineProperty(child, "offsetWidth", {
        configurable: true,
        get: () => 80
      });
    });

    const api = wrapper.getComponent({ ref: "menu" }).vm as {
      handleResize: () => void;
    };

    api.handleResize();
    await nextTick();
    await nextTick();

    expect(wrapper.find(".xy-menu__more").exists()).toBe(true);

    await wrapper.find('[data-index="/ops"]').trigger("click");
    await Promise.resolve();

    expect(push).toHaveBeenCalledWith({ path: "/ops" });
  });
});
