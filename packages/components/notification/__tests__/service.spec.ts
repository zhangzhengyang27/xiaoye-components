import { computed, createApp, defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyConfigProvider } from "../../config-provider";
import { configProviderKey, DEFAULT_NAMESPACE } from "../../config-provider/src/context";
import { XyNotificationService } from "../index";

function getHosts() {
  return Array.from(
    document.body.querySelectorAll(".xy-notification-service-host")
  ) as HTMLElement[];
}

function getNotifications() {
  return Array.from(document.body.querySelectorAll(".xy-notification")) as HTMLElement[];
}

async function flushNotifications() {
  await nextTick();
  await Promise.resolve();
  await nextTick();
}

afterEach(async () => {
  XyNotificationService.closeAll();
  await flushNotifications();
  document.body.innerHTML = "";
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("XyNotificationService", () => {
  it("open 会返回可关闭句柄并渲染通知", async () => {
    const handle = XyNotificationService.open("保存成功");

    await flushNotifications();

    expect(getNotifications()).toHaveLength(1);
    expect(getNotifications()[0]?.textContent).toContain("保存成功");

    handle.close();
    await flushNotifications();

    expect(getNotifications()).toHaveLength(0);
  });

  it("typed shortcuts 会写入对应类型 class", async () => {
    XyNotificationService.success({
      title: "同步成功",
      duration: 0
    });

    await flushNotifications();

    expect(document.body.querySelector(".xy-notification--success")).not.toBeNull();
  });

  it("四角位置会独立堆叠", async () => {
    XyNotificationService.open({
      title: "右上角",
      duration: 0,
      position: "top-right"
    });
    XyNotificationService.open({
      title: "左下角",
      duration: 0,
      position: "bottom-left"
    });

    await flushNotifications();

    expect(document.body.querySelector(".xy-notification-service-host--top-right")).not.toBeNull();
    expect(
      document.body.querySelector(".xy-notification-service-host--bottom-left")
    ).not.toBeNull();
  });

  it("同一桶内的通知会按垂直方向递增偏移", async () => {
    XyNotificationService.open({
      title: "第一条",
      duration: 0,
      position: "top-right"
    });
    XyNotificationService.open({
      title: "第二条",
      duration: 0,
      position: "top-right"
    });

    await flushNotifications();

    const tops = getHosts().map((host) => Number.parseFloat(host.style.top));

    expect(tops).toHaveLength(2);
    expect(tops[0]).toBeLessThan(tops[1]);
  });

  it("不同 appendTo 会各自维护独立堆叠桶", async () => {
    const left = document.createElement("div");
    const right = document.createElement("div");
    left.id = "notify-left";
    right.id = "notify-right";
    document.body.append(left, right);

    XyNotificationService.open({
      title: "左侧桶",
      appendTo: left,
      duration: 0
    });
    XyNotificationService.open({
      title: "右侧桶",
      appendTo: right,
      duration: 0
    });

    await flushNotifications();

    expect(left.querySelector(".xy-notification")).not.toBeNull();
    expect(right.querySelector(".xy-notification")).not.toBeNull();
  });

  it("updateOffsets 会在高度变化后重排同位置通知", async () => {
    XyNotificationService.open({
      title: "第一条",
      duration: 0
    });
    XyNotificationService.open({
      title: "第二条",
      duration: 0
    });

    await flushNotifications();

    const hosts = getHosts();
    const second = hosts[1];
    const originalTop = Number.parseFloat(second!.style.top);

    Object.defineProperty(hosts[0]!, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        ({
          height: 200
        }) as DOMRect
    });

    XyNotificationService.updateOffsets("top-right");
    await flushNotifications();

    expect(Number.parseFloat(second!.style.top)).toBeGreaterThan(originalTop);
  });

  it("相同 groupKey 会在同一桶内复用实例并更新内容", async () => {
    vi.useFakeTimers();

    const first = XyNotificationService.open({
      title: "同步进行中",
      duration: 120,
      groupKey: "sync-job"
    });

    await flushNotifications();
    vi.advanceTimersByTime(60);

    const second = XyNotificationService.open({
      title: "同步完成",
      type: "success",
      duration: 120,
      groupKey: "sync-job"
    });

    await flushNotifications();

    expect(second).toBe(first);
    expect(getNotifications()).toHaveLength(1);
    expect(getNotifications()[0]?.textContent).toContain("同步完成");
    expect(document.body.querySelector(".xy-notification--success")).not.toBeNull();

    vi.advanceTimersByTime(119);
    await flushNotifications();
    expect(getNotifications()).toHaveLength(1);

    vi.advanceTimersByTime(2);
    await flushNotifications();
    expect(getNotifications()).toHaveLength(0);
  });

  it("handle.update 支持更新标题、类型、位置与关闭按钮", async () => {
    const handle = XyNotificationService.open({
      title: "待更新通知",
      message: "原始内容",
      duration: 0
    });

    await flushNotifications();

    handle.update({
      title: "已更新通知",
      message: "新的内容",
      type: "warning",
      position: "bottom-right",
      showClose: false
    });

    await flushNotifications();

    const notification = getNotifications()[0];
    const host = getHosts()[0];

    expect(notification?.textContent).toContain("已更新通知");
    expect(notification?.textContent).toContain("新的内容");
    expect(notification?.classList.contains("xy-notification--warning")).toBe(true);
    expect(notification?.querySelector(".xy-notification__close")).toBeNull();
    expect(host?.classList.contains("xy-notification-service-host--bottom-right")).toBe(true);
  });

  it("handle.update 显式更新 duration 时会重置剩余计时", async () => {
    vi.useFakeTimers();

    const handle = XyNotificationService.open({
      title: "持续同步",
      duration: 120,
      groupKey: "sync-duration"
    });

    await flushNotifications();
    vi.advanceTimersByTime(60);

    handle.update({
      title: "持续同步已刷新",
      duration: 120
    });

    await flushNotifications();
    vi.advanceTimersByTime(70);
    await flushNotifications();

    expect(getNotifications()).toHaveLength(1);

    vi.advanceTimersByTime(60);
    await flushNotifications();

    expect(getNotifications()).toHaveLength(0);
  });

  it("handle.update 不显式更新 duration 时保持剩余计时", async () => {
    vi.useFakeTimers();

    const handle = XyNotificationService.open({
      title: "保持计时",
      duration: 120
    });

    await flushNotifications();
    vi.advanceTimersByTime(60);

    handle.update({
      title: "仅更新标题"
    });

    await flushNotifications();
    vi.advanceTimersByTime(59);
    await flushNotifications();

    expect(getNotifications()).toHaveLength(1);

    vi.advanceTimersByTime(2);
    await flushNotifications();

    expect(getNotifications()).toHaveLength(0);
  });

  it("groupKey 不会跨桶复用实例", async () => {
    XyNotificationService.open({
      title: "右上角同步",
      duration: 0,
      groupKey: "sync-job",
      position: "top-right"
    });
    XyNotificationService.open({
      title: "左下角同步",
      duration: 0,
      groupKey: "sync-job",
      position: "bottom-left"
    });

    await flushNotifications();

    expect(getNotifications()).toHaveLength(2);
  });

  it("max + drop-oldest 会移除最早实例并保留新实例", async () => {
    const reasons: string[] = [];

    XyNotificationService.open({
      title: "第一条",
      duration: 0,
      max: 2,
      onClosed: (reason) => reasons.push(reason)
    });
    XyNotificationService.open({
      title: "第二条",
      duration: 0,
      max: 2
    });
    XyNotificationService.open({
      title: "第三条",
      duration: 0,
      max: 2,
      overflowStrategy: "drop-oldest"
    });

    await flushNotifications();

    expect(getNotifications()).toHaveLength(2);
    expect(document.body.textContent).not.toContain("第一条");
    expect(document.body.textContent).toContain("第三条");
    expect(reasons).toContain("overflow");
  });

  it("max + drop-newest 会丢弃新实例", async () => {
    const onClosed = vi.fn();

    XyNotificationService.open({
      title: "第一条",
      duration: 0,
      max: 1
    });
    XyNotificationService.open({
      title: "第二条",
      duration: 0,
      max: 1,
      overflowStrategy: "drop-newest",
      onClosed
    });

    await flushNotifications();

    expect(getNotifications()).toHaveLength(1);
    expect(document.body.textContent).toContain("第一条");
    expect(document.body.textContent).not.toContain("第二条");
    expect(onClosed).toHaveBeenCalledWith("overflow");
  });

  it("update 迁移到超出 max 的目标桶时会忽略迁移并保留其他更新", async () => {
    XyNotificationService.open({
      title: "顶部唯一通知",
      duration: 0,
      position: "top-right",
      max: 1
    });
    const handle = XyNotificationService.open({
      title: "底部通知",
      message: "原始内容",
      duration: 0,
      position: "bottom-right"
    });

    await flushNotifications();

    handle.update({
      title: "已更新但不迁移",
      position: "top-right",
      max: 1
    });

    await flushNotifications();

    const updated = getNotifications().find((item) => item.textContent?.includes("已更新但不迁移"));
    const top = getNotifications().find((item) => item.textContent?.includes("顶部唯一通知"));

    expect(updated).not.toBeUndefined();
    expect(top).not.toBeUndefined();
    expect(
      updated
        ?.closest(".xy-notification-service-host")
        ?.classList.contains("xy-notification-service-host--bottom-right")
    ).toBe(true);
  });

  it("onClosed 会收到 manual、auto、close-all、overflow 原因", async () => {
    vi.useFakeTimers();
    const reasons: string[] = [];

    const handle = XyNotificationService.open({
      title: "手动关闭",
      duration: 0,
      onClosed: (reason) => reasons.push(reason)
    });
    await flushNotifications();
    handle.close();
    await flushNotifications();

    XyNotificationService.open({
      title: "自动关闭",
      duration: 100,
      onClosed: (reason) => reasons.push(reason)
    });
    await flushNotifications();
    vi.advanceTimersByTime(100);
    await flushNotifications();

    XyNotificationService.open({
      title: "closeAll 关闭",
      duration: 0,
      onClosed: (reason) => reasons.push(reason)
    });
    await flushNotifications();
    XyNotificationService.closeAll();
    await flushNotifications();

    XyNotificationService.open({
      title: "溢出基准",
      duration: 0,
      max: 1,
      onClosed: (reason) => reasons.push(reason)
    });
    XyNotificationService.open({
      title: "触发溢出",
      duration: 0,
      max: 1,
      overflowStrategy: "drop-oldest"
    });
    await flushNotifications();

    expect(reasons).toContain("programmatic");
    expect(reasons).toContain("auto");
    expect(reasons).toContain("close-all");
    expect(reasons).toContain("overflow");
  });

  it("closeAll(filter) 支持按 position、groupKey、type 和 target 过滤", async () => {
    const target = document.createElement("div");
    target.id = "notify-target";
    document.body.appendChild(target);

    XyNotificationService.warning({
      title: "右下警告",
      duration: 0,
      position: "bottom-right",
      groupKey: "warn"
    });
    XyNotificationService.warning({
      title: "目标警告",
      duration: 0,
      appendTo: target,
      groupKey: "warn"
    });
    XyNotificationService.success({
      title: "右下成功",
      duration: 0,
      position: "bottom-right"
    });

    await flushNotifications();

    XyNotificationService.closeAll({
      type: "warning",
      groupKey: "warn",
      target
    });
    await flushNotifications();

    expect(target.querySelector(".xy-notification")).toBeNull();
    expect(document.body.textContent).toContain("右下警告");
    expect(document.body.textContent).toContain("右下成功");
  });

  it("getState(filter) 会返回过滤后的只读快照", async () => {
    XyNotificationService.info({
      title: "顶部信息",
      duration: 0,
      position: "top-right",
      groupKey: "info"
    });
    XyNotificationService.warning({
      title: "底部警告",
      duration: 0,
      position: "bottom-left",
      groupKey: "warn"
    });

    await flushNotifications();

    const snapshot = XyNotificationService.getState({
      position: "bottom-left",
      groupKey: "warn"
    });

    expect(snapshot.total).toBe(1);
    expect(snapshot.positions["bottom-left"]).toHaveLength(1);
    expect(snapshot.positions["bottom-left"]?.[0]?.title).toBe("底部警告");

    snapshot.positions["bottom-left"] = [];

    expect(XyNotificationService.getState().positions["bottom-left"]).toHaveLength(1);
  });

  it("支持继承 ConfigProvider.notification 默认配置，显式传参可覆盖", async () => {
    const wrapper = mount(XyConfigProvider, {
      props: {
        notification: {
          duration: 0,
          position: "bottom-left",
          showClose: false,
          max: 1,
          appendTo: "#notify-provider-target"
        }
      },
      attachTo: document.body
    });

    const target = document.createElement("div");
    target.id = "notify-provider-target";
    document.body.appendChild(target);

    XyNotificationService.open({
      title: "继承默认配置"
    });
    await flushNotifications();

    const inherited = target.querySelector(".xy-notification");

    expect(inherited).not.toBeNull();
    expect(inherited?.querySelector(".xy-notification__close")).toBeNull();
    expect(
      inherited
        ?.closest(".xy-notification-service-host")
        ?.classList.contains("xy-notification-service-host--bottom-left")
    ).toBe(true);

    XyNotificationService.open({
      title: "显式覆盖",
      position: "top-right",
      appendTo: document.body,
      showClose: true
    });
    await flushNotifications();

    const overridden = getNotifications().find((item) => item.textContent?.includes("显式覆盖"));

    expect(overridden?.querySelector(".xy-notification__close")).not.toBeNull();
    expect(
      overridden
        ?.closest(".xy-notification-service-host")
        ?.classList.contains("xy-notification-service-host--top-right")
    ).toBe(true);

    wrapper.unmount();
  });

  it("$notify.withContext() 在单个 ConfigProvider.notification 下会继承默认配置", async () => {
    const TriggerNotify = defineComponent({
      mounted() {
        (this as { $notify: typeof XyNotificationService }).$notify.withContext().success({
          title: "来自 $notify.withContext()",
          duration: 0
        });
      },
      render() {
        return h("div");
      }
    });

    const wrapper = mount(XyConfigProvider, {
      props: {
        notification: {
          position: "bottom-left",
          duration: 0,
          showClose: true
        }
      },
      slots: {
        default: () => h(TriggerNotify)
      },
      global: {
        plugins: [XyNotificationService]
      },
      attachTo: document.body
    });

    await flushNotifications();

    const host = getHosts().find((item) =>
      item.textContent?.includes("来自 $notify.withContext()")
    );
    const notification = getNotifications().find((item) =>
      item.textContent?.includes("来自 $notify.withContext()")
    );

    expect(host?.classList.contains("xy-notification-service-host--bottom-left")).toBe(true);
    expect(notification?.querySelector(".xy-notification__close")).not.toBeNull();

    wrapper.unmount();
  });

  it("appendTo 未命中时会回退到 document.body", async () => {
    XyNotificationService.open({
      title: "回退挂载",
      appendTo: "#missing-notify-target",
      duration: 0
    });

    await flushNotifications();

    expect(document.body.querySelector(".xy-notification")).not.toBeNull();
  });

  it("不同 app 的 $notify 会继承各自的上下文配置", async () => {
    const createNotifyApp = (position: "top-left" | "bottom-right", label: string) => {
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
        message: computed(() => ({})),
        notification: computed(
          () =>
            ({
              position,
              duration: 0,
              showClose: true
            }) as const
        )
      });
      app.use(XyNotificationService);

      return {
        app,
        open() {
          (
            app.config.globalProperties as {
              $notify: typeof XyNotificationService;
            }
          ).$notify(label);
        }
      };
    };

    const app1 = createNotifyApp("top-left", "来自 notify app1");
    const app2 = createNotifyApp("bottom-right", "来自 notify app2");

    expect(app1.app.config.globalProperties.$notify).not.toBe(
      app2.app.config.globalProperties.$notify
    );

    app1.open();
    app2.open();
    await flushNotifications();

    const app1Host = getHosts().find((host) => host.textContent?.includes("来自 notify app1"));
    const app2Host = getHosts().find((host) => host.textContent?.includes("来自 notify app2"));

    expect(app1Host?.classList.contains("xy-notification-service-host--top-left")).toBe(true);
    expect(app2Host?.classList.contains("xy-notification-service-host--bottom-right")).toBe(true);
  });

  it("withContext(appContext) 会返回绑定上下文的通知 API", async () => {
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
      message: computed(() => ({})),
      notification: computed(
        () =>
          ({
            position: "bottom-right",
            duration: 0,
            showClose: true
          }) as const
      )
    });

    const scopedNotify = XyNotificationService.withContext(app._context);

    scopedNotify.success("绑定上下文通知");
    await flushNotifications();

    const host = getHosts().find((item) => item.textContent?.includes("绑定上下文通知"));

    expect(host?.classList.contains("xy-notification-service-host--bottom-right")).toBe(true);
  });

  it("多个 ConfigProvider.notification 并存时，无上下文调用会回退到默认配置并告警", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const first = mount(XyConfigProvider, {
      props: {
        notification: {
          position: "top-left",
          duration: 0
        }
      }
    });
    const second = mount(XyConfigProvider, {
      props: {
        notification: {
          position: "bottom-left",
          duration: 0
        }
      }
    });

    XyNotificationService.open({
      title: "未传通知上下文",
      duration: 0
    });
    await flushNotifications();

    const host = getHosts()[0];

    expect(host?.classList.contains("xy-notification-service-host--top-left")).toBe(false);
    expect(host?.classList.contains("xy-notification-service-host--bottom-left")).toBe(false);
    expect(host?.classList.contains("xy-notification-service-host--top-right")).toBe(true);
    expect(
      warnSpy.mock.calls.some((args) =>
        String(args[0]).includes("多个 ConfigProvider.notification")
      )
    ).toBe(true);

    first.unmount();
    second.unmount();
    warnSpy.mockRestore();
  });
});
