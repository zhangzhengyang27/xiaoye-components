import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, inject, nextTick } from "vue";
import { XyConfigProvider } from "../index";
import {
  configProviderKey,
  createConfigProviderContext,
  DEFAULT_NAMESPACE,
  DEFAULT_SIZE,
  DEFAULT_Z_INDEX,
  getGlobalLoadingConfig,
  getGlobalMessageConfig,
  getGlobalNotificationConfig
} from "../src/context";

enableAutoUnmount(afterEach);

describe("XyConfigProvider", () => {
  it("createConfigProviderContext 提供默认值", () => {
    const context = createConfigProviderContext();

    expect(context.namespace.value).toBe(DEFAULT_NAMESPACE);
    expect(context.zIndex.value).toBe(DEFAULT_Z_INDEX);
    expect(context.size.value).toBe(DEFAULT_SIZE);
    expect(context.locale.value).toEqual({});
    expect(context.message.value).toEqual({});
  });

  it("向子组件提供配置上下文", () => {
    const Probe = defineComponent({
      setup() {
        const context = inject(configProviderKey, null);

        return {
          context
        };
      },
      template: `
        <div class="probe">
          {{ context?.namespace.value }}|{{ context?.size.value }}|{{ context?.zIndex.value }}|{{ context?.message.value.placement }}
        </div>
      `
    });

    const wrapper = mount({
      components: {
        Probe,
        XyConfigProvider
      },
      template: `
        <xy-config-provider namespace="admin" size="lg" :z-index="3200" :message="{ placement: 'top-right' }">
          <Probe />
        </xy-config-provider>
      `
    });

    expect(wrapper.find(".probe").text()).toBe("admin|lg|3200|top-right");
  });

  it("同步注册、更新和清理全局配置", async () => {
    const wrapper = mount(XyConfigProvider, {
      props: {
        loading: {
          text: "加载中"
        },
        message: {
          placement: "top"
        },
        notification: {
          position: "bottom-right"
        }
      },
      slots: {
        default: "<div>content</div>"
      }
    });

    expect(getGlobalLoadingConfig().value.text).toBe("加载中");
    expect(getGlobalMessageConfig().value.placement).toBe("top");
    expect(getGlobalNotificationConfig().value.position).toBe("bottom-right");

    await wrapper.setProps({
      message: {
        placement: "top-right"
      }
    });
    await nextTick();

    expect(getGlobalMessageConfig().value.placement).toBe("top-right");

    wrapper.unmount();

    expect(getGlobalLoadingConfig().value).toEqual({});
    expect(getGlobalMessageConfig().value).toEqual({});
    expect(getGlobalNotificationConfig().value).toEqual({});
  });
});
