import { enableAutoUnmount, mount } from "@vue/test-utils";
import { computed, createApp, defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyConfigProvider } from "../../config-provider";
import { configProviderKey, DEFAULT_NAMESPACE } from "../../config-provider/src/context";
import { XyMessage } from "../index";

enableAutoUnmount(afterEach);

function getMessages() {
  return Array.from(document.body.querySelectorAll(".xy-message")) as HTMLElement[];
}

async function flushMessage() {
  await nextTick();
  await nextTick();
}

async function flushMessageClose() {
  if (vi.isFakeTimers()) {
    vi.runOnlyPendingTimers();
    await nextTick();
    vi.runOnlyPendingTimers();
  } else {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 320);
    });
  }

  await nextTick();
}

afterEach(async () => {
  XyMessage.closeAll();
  await flushMessageClose();
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("XyMessage", () => {
  it("支持字符串消息、句柄 id 和关闭原因回调", async () => {
    const onClose = vi.fn();
    const handle = XyMessage({
      message: "保存成功",
      duration: 0,
      onClose
    });

    await flushMessage();

    expect(handle.id).toMatch(/^xy-message-/);
    expect(getMessages()).toHaveLength(1);

    handle.close("manual");
    await flushMessageClose();

    expect(getMessages()).toHaveLength(0);
    expect(onClose).toHaveBeenCalledWith(
      expect.objectContaining({
        id: handle.id,
        reason: "manual",
        type: "info",
        placement: "top"
      })
    );
  });

  it("支持点击消息时触发 onClick，并可配置 closeOnClick", async () => {
    const onClick = vi.fn();

    XyMessage({
      message: "点击后关闭",
      duration: 0,
      closeOnClick: true,
      onClick
    });

    await flushMessage();

    getMessages()[0]?.click();
    await flushMessageClose();

    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "click"
      })
    );
    expect(getMessages()).toHaveLength(0);
  });

  it("支持 beforeClose 拦截程序化关闭", async () => {
    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => done(true));
    const handle = XyMessage({
      message: "待拦截消息",
      duration: 0,
      beforeClose
    });

    await flushMessage();

    handle.close();
    await flushMessage();

    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(getMessages()).toHaveLength(1);
  });

  it("支持 groupKey + render 合并富内容消息", async () => {
    const first = XyMessage({
      render: () => h("strong", { class: "render-node" }, "同步进行中"),
      groupKey: "sync-task",
      grouping: true,
      duration: 0
    });

    await flushMessage();

    const second = XyMessage({
      render: () => h("strong", { class: "render-node" }, "同步完成"),
      groupKey: "sync-task",
      grouping: true,
      type: "success",
      duration: 0
    });

    await flushMessage();

    expect(second).toBe(first);
    expect(getMessages()).toHaveLength(1);
    expect(document.body.querySelector(".render-node")?.textContent).toBe("同步完成");
    expect(document.body.querySelector(".xy-message__badge")?.textContent).toBe("2");
    expect(document.body.querySelector(".xy-message--success")).not.toBeNull();
  });

  it("支持 pauseOnFocus 暂停自动关闭", async () => {
    vi.useFakeTimers();

    XyMessage({
      message: "聚焦暂停",
      duration: 120,
      showClose: true,
      pauseOnFocus: true
    });

    await flushMessage();
    vi.advanceTimersByTime(60);

    const closeButton = document.body.querySelector(".xy-message__close") as HTMLButtonElement;
    closeButton.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    vi.advanceTimersByTime(100);
    await flushMessage();

    expect(getMessages()).toHaveLength(1);

    closeButton.dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        relatedTarget: document.body
      })
    );

    vi.advanceTimersByTime(80);
    await flushMessageClose();

    expect(getMessages()).toHaveLength(0);
  });

  it("支持通过过滤条件读取状态并批量关闭", async () => {
    XyMessage.success({
      message: "成功消息",
      duration: 0,
      placement: "top-right"
    });
    XyMessage.warning({
      message: "警告消息",
      duration: 0,
      placement: "bottom-right",
      groupKey: "warn"
    });
    XyMessage.error({
      message: "错误消息",
      duration: 0,
      placement: "bottom-right"
    });

    await flushMessage();

    const snapshot = XyMessage.getState({
      placement: "bottom-right"
    });

    expect(snapshot.total).toBe(2);
    expect(snapshot.placements["bottom-right"]).toHaveLength(2);

    XyMessage.closeAll({
      placement: "bottom-right",
      groupKey: "warn"
    });
    await flushMessageClose();

    expect(getMessages()).toHaveLength(2);
    expect(getMessages().some((message) => message.textContent?.includes("警告消息"))).toBe(false);
  });

  it("handle.update 支持更新文案、类型、图标和位置", async () => {
    const handle = XyMessage({
      message: "待更新消息",
      duration: 0,
      showIcon: false
    });

    await flushMessage();

    handle.update({
      message: "消息已更新",
      type: "warning",
      placement: "bottom-right",
      showClose: true,
      showIcon: true,
      icon: "mdi:bell-ring-outline"
    });

    await flushMessage();

    const message = getMessages()[0];

    expect(message?.textContent).toContain("消息已更新");
    expect(message?.classList.contains("xy-message--warning")).toBe(true);
    expect(message?.classList.contains("is-right")).toBe(true);
    expect(message?.classList.contains("is-bottom")).toBe(true);
    expect(message?.style.bottom).toBe("16px");
    expect(message?.querySelector(".xy-message__close")).not.toBeNull();
    expect(message?.querySelector(".xy-message__icon")).not.toBeNull();
  });

  it("update 迁移 placement 时会遵守 max 约束", async () => {
    XyMessage({
      message: "顶部唯一消息",
      duration: 0,
      placement: "top-right",
      max: 1
    });
    const handle = XyMessage({
      message: "底部消息",
      duration: 0,
      placement: "bottom-right"
    });

    await flushMessage();

    handle.update({
      placement: "top-right",
      max: 1
    });

    await flushMessage();

    const texts = getMessages().map((message) => message.textContent ?? "");

    expect(texts.some((text) => text.includes("顶部唯一消息"))).toBe(true);
    expect(texts.some((text) => text.includes("底部消息"))).toBe(true);
    expect(
      getMessages()
        .find((message) => message.textContent?.includes("底部消息"))
        ?.classList.contains("is-bottom")
    ).toBe(true);
  });

  it("支持继承 ConfigProvider.message 默认配置和按位置独立上限", async () => {
    const wrapper = mount(XyConfigProvider, {
      props: {
        message: {
          duration: 0,
          showClose: true,
          placement: "top-right",
          grouping: true,
          maxByPlacement: {
            "top-right": 1
          }
        }
      }
    });

    XyMessage("第一条消息");
    XyMessage("第二条消息");
    await flushMessage();

    const message = getMessages()[0];

    expect(getMessages()).toHaveLength(1);
    expect(message?.classList.contains("is-right")).toBe(true);
    expect(message?.querySelector(".xy-message__close")).not.toBeNull();
    expect(message?.textContent).toContain("第一条消息");

    wrapper.unmount();
  });

  it("插件注入的 $message 在单个 ConfigProvider.message 下会继承默认配置", async () => {
    const TriggerMessage = defineComponent({
      mounted() {
        (this as { $message: typeof XyMessage }).$message({
          message: "来自插件注入的消息"
        });
      },
      render() {
        return h("div");
      }
    });

    const wrapper = mount(XyConfigProvider, {
      props: {
        message: {
          duration: 0,
          showClose: true,
          placement: "bottom-right"
        }
      },
      slots: {
        default: () => h(TriggerMessage)
      },
      global: {
        plugins: [XyMessage]
      },
      attachTo: document.body
    });

    await flushMessage();

    const message = getMessages().find((item) => item.textContent?.includes("来自插件注入的消息"));

    expect(message?.classList.contains("is-right")).toBe(true);
    expect(message?.classList.contains("is-bottom")).toBe(true);
    expect(message?.querySelector(".xy-message__close")).not.toBeNull();

    wrapper.unmount();
  });

  it("不同 app 的 $message 会继承各自的上下文配置", async () => {
    const createMessageApp = (placement: "top-left" | "bottom-right", label: string) => {
      const app = createApp(
        defineComponent({
          render() {
            return h("div");
          }
        })
      );

      app.provide(configProviderKey, {
        namespace: computed(() => DEFAULT_NAMESPACE),
        locale: computed(() => ({})),
        zIndex: computed(() => 2000),
        size: computed(() => "md" as const),
        dialog: computed(() => ({})),
        loading: computed(() => ({})),
        notification: computed(() => ({})),
        message: computed(
          () =>
            ({
              placement,
              duration: 0,
              showClose: true
            }) as const
        )
      });
      app.use(XyMessage);

      return {
        app,
        open() {
          (
            app.config.globalProperties as {
              $message: typeof XyMessage;
            }
          ).$message(label);
        }
      };
    };

    const app1 = createMessageApp("top-left", "来自 app1");
    const app2 = createMessageApp("bottom-right", "来自 app2");

    expect(app1.app.config.globalProperties.$message).not.toBe(
      app2.app.config.globalProperties.$message
    );

    app1.open();
    app2.open();
    await flushMessage();

    const app1Message = getMessages().find((message) => message.textContent?.includes("来自 app1"));
    const app2Message = getMessages().find((message) => message.textContent?.includes("来自 app2"));

    expect(app1Message?.classList.contains("is-left")).toBe(true);
    expect(app1Message?.classList.contains("is-bottom")).toBe(false);
    expect(app2Message?.classList.contains("is-right")).toBe(true);
    expect(app2Message?.classList.contains("is-bottom")).toBe(true);
  });

  it("本地调用支持通过 appContext 显式继承不同上下文", async () => {
    const createContextApp = (placement: "top-left" | "bottom-right") => {
      const app = createApp(
        defineComponent({
          render() {
            return h("div");
          }
        })
      );

      app.provide(configProviderKey, {
        namespace: computed(() => DEFAULT_NAMESPACE),
        locale: computed(() => ({})),
        zIndex: computed(() => 2000),
        size: computed(() => "md" as const),
        dialog: computed(() => ({})),
        loading: computed(() => ({})),
        notification: computed(() => ({})),
        message: computed(
          () =>
            ({
              placement,
              duration: 0
            }) as const
        )
      });

      return app;
    };

    const app1 = createContextApp("top-left");
    const app2 = createContextApp("bottom-right");

    XyMessage("上下文 A", app1._context);
    XyMessage("上下文 B", app2._context);
    await flushMessage();

    const messageA = getMessages().find((message) => message.textContent?.includes("上下文 A"));
    const messageB = getMessages().find((message) => message.textContent?.includes("上下文 B"));

    expect(messageA?.classList.contains("is-left")).toBe(true);
    expect(messageA?.classList.contains("is-bottom")).toBe(false);
    expect(messageB?.classList.contains("is-right")).toBe(true);
    expect(messageB?.classList.contains("is-bottom")).toBe(true);
  });

  it("withContext(appContext) 会返回绑定上下文的消息 API", async () => {
    const app = createApp(
      defineComponent({
        render() {
          return h("div");
        }
      })
    );

    app.provide(configProviderKey, {
      namespace: computed(() => DEFAULT_NAMESPACE),
      locale: computed(() => ({})),
      zIndex: computed(() => 2000),
      size: computed(() => "md" as const),
      dialog: computed(() => ({})),
      loading: computed(() => ({})),
      notification: computed(() => ({})),
      message: computed(
        () =>
          ({
            placement: "bottom-right",
            duration: 0,
            showClose: true
          }) as const
      )
    });

    const scopedMessage = XyMessage.withContext(app._context);

    scopedMessage.success("绑定上下文消息");
    await flushMessage();

    const message = getMessages().find((item) => item.textContent?.includes("绑定上下文消息"));

    expect(message?.classList.contains("is-right")).toBe(true);
    expect(message?.classList.contains("is-bottom")).toBe(true);
    expect(message?.querySelector(".xy-message__close")).not.toBeNull();
  });

  it("多个 ConfigProvider.message 并存时，无上下文调用会回退到默认配置并告警", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const first = mount(XyConfigProvider, {
      props: {
        message: {
          placement: "top-left",
          duration: 0
        }
      }
    });
    const second = mount(XyConfigProvider, {
      props: {
        message: {
          placement: "bottom-right",
          duration: 0
        }
      }
    });

    XyMessage("未传上下文的消息");
    await flushMessage();

    const message = getMessages()[0];

    expect(message?.classList.contains("is-left")).toBe(false);
    expect(message?.classList.contains("is-right")).toBe(false);
    expect(message?.classList.contains("is-bottom")).toBe(false);
    expect(
      warnSpy.mock.calls.some((args) => String(args[0]).includes("多个 ConfigProvider.message"))
    ).toBe(true);

    first.unmount();
    second.unmount();
    warnSpy.mockRestore();
  });

  it("$message.withContext() 在不传参数时默认继承当前 app 上下文", async () => {
    const app = createApp(
      defineComponent({
        render() {
          return h("div");
        }
      })
    );

    app.provide(configProviderKey, {
      namespace: computed(() => DEFAULT_NAMESPACE),
      locale: computed(() => ({})),
      zIndex: computed(() => 2000),
      size: computed(() => "md" as const),
      dialog: computed(() => ({})),
      loading: computed(() => ({})),
      notification: computed(() => ({})),
      message: computed(
        () =>
          ({
            placement: "bottom-right",
            duration: 0,
            showClose: true
          }) as const
      )
    });
    app.use(XyMessage);

    const scopedMessage = (
      app.config.globalProperties as {
        $message: typeof XyMessage;
      }
    ).$message.withContext();

    scopedMessage.info("默认继承当前 app");
    await flushMessage();

    const message = getMessages().find((item) => item.textContent?.includes("默认继承当前 app"));

    expect(message?.classList.contains("is-right")).toBe(true);
    expect(message?.classList.contains("is-bottom")).toBe(true);
    expect(message?.querySelector(".xy-message__close")).not.toBeNull();
  });
});
