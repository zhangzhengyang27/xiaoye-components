import { nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyAlertService } from "../index";

function getActiveServiceText() {
  return document.body.querySelector(".xy-alert-service__item")?.textContent ?? "";
}

function getServiceHost() {
  return document.body.querySelector(".xy-alert-service-host");
}

function getServiceHostParent() {
  return getServiceHost()?.parentElement ?? null;
}

afterEach(async () => {
  XyAlertService.closeAll();
  await nextTick();
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("XyAlertService", () => {
  it("open 会创建顶部横幅服务容器", async () => {
    XyAlertService.open({
      title: "服务提示"
    });

    await nextTick();

    expect(getServiceHost()).not.toBeNull();
    expect(document.body.querySelector(".xy-alert-service")).not.toBeNull();
    expect(getActiveServiceText()).toContain("服务提示");
  });

  it("支持通过 appendTo 指定服务宿主挂载点", async () => {
    document.body.innerHTML = `<div id="alert-service-target"></div>`;

    XyAlertService.open({
      title: "定向挂载",
      appendTo: "#alert-service-target"
    });

    await nextTick();

    expect(document.getElementById("alert-service-target")?.querySelector(".xy-alert-service-host")).not.toBeNull();
  });

  it("支持通过 HTMLElement 指定服务宿主挂载点", async () => {
    const target = document.createElement("div");
    target.id = "alert-service-element-target";
    document.body.appendChild(target);

    XyAlertService.open({
      title: "元素挂载",
      appendTo: target
    });

    await nextTick();

    expect(target.querySelector(".xy-alert-service-host")).not.toBeNull();
  });

  it("无效 appendTo 会回退到 body 挂载", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    XyAlertService.open({
      title: "回退挂载",
      appendTo: "##invalid-selector["
    });

    await nextTick();

    expect(getServiceHostParent()).toBe(document.body);
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });

  it("多次 open 会按 FIFO 队列依次展示", async () => {
    const first = XyAlertService.open({
      title: "第一条"
    });
    XyAlertService.open({
      title: "第二条"
    });

    await nextTick();
    expect(getActiveServiceText()).toContain("第一条");
    expect(getActiveServiceText()).not.toContain("第二条");

    first.close();
    await nextTick();

    expect(getActiveServiceText()).toContain("第二条");
  });

  it("closeAll 会清空当前项和等待队列", async () => {
    XyAlertService.open({
      title: "当前项"
    });
    XyAlertService.open({
      title: "等待项"
    });

    await nextTick();
    XyAlertService.closeAll();
    await nextTick();

    expect(getActiveServiceText()).toBe("");
    expect(getServiceHost()).toBeNull();
  });

  it("最后一条关闭后会自动销毁服务宿主", async () => {
    const handle = XyAlertService.open({
      title: "最后一条"
    });

    await nextTick();
    expect(getServiceHost()).not.toBeNull();

    handle.close();
    await nextTick();

    expect(getActiveServiceText()).toBe("");
    expect(getServiceHost()).toBeNull();
  });

  it("服务句柄 close 会走 beforeClose 拦截", async () => {
    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => done(true));
    const handle = XyAlertService.open({
      title: "待拦截",
      beforeClose
    });

    await nextTick();
    handle.close();
    await nextTick();

    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(getActiveServiceText()).toContain("待拦截");
  });

  it("手动关闭时会通过 onClosed 收到 manual 原因", async () => {
    const onClosed = vi.fn();
    const handle = XyAlertService.open({
      title: "手动关闭回调",
      onClosed
    });

    await nextTick();
    handle.close();
    await nextTick();

    expect(onClosed).toHaveBeenCalledWith("manual");
  });

  it("服务句柄 close 支持异步放行", async () => {
    vi.useFakeTimers();

    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => {
      window.setTimeout(() => done(), 80);
    });
    const handle = XyAlertService.open({
      title: "异步服务关闭",
      beforeClose
    });

    await nextTick();
    handle.close();
    expect(getActiveServiceText()).toContain("异步服务关闭");

    vi.advanceTimersByTime(80);
    await nextTick();

    expect(getActiveServiceText()).not.toContain("异步服务关闭");
  });

  it("服务句柄 update 可更新当前项和排队项", async () => {
    const first = XyAlertService.open({
      title: "当前提示",
      type: "info"
    });
    const second = XyAlertService.open({
      title: "排队提示"
    });

    await nextTick();
    first.update({
      title: "已更新当前提示",
      type: "warning"
    });
    second.update({
      title: "已更新排队提示"
    });
    await nextTick();

    expect(getActiveServiceText()).toContain("已更新当前提示");
    expect(document.body.querySelector(".xy-alert--warning")).not.toBeNull();

    first.close();
    await nextTick();

    expect(getActiveServiceText()).toContain("已更新排队提示");
  });

  it("相同 groupKey 命中当前项时会复用句柄并合并更新", async () => {
    vi.useFakeTimers();

    const first = XyAlertService.open({
      title: "同步任务进行中",
      duration: 120,
      groupKey: "sync-task"
    });

    await nextTick();
    vi.advanceTimersByTime(60);

    const merged = XyAlertService.open({
      title: "同步任务已刷新",
      type: "success",
      duration: 120,
      groupKey: "sync-task"
    });

    await nextTick();

    expect(merged.id).toBe(first.id);
    expect(getActiveServiceText()).toContain("同步任务已刷新");
    expect(document.body.querySelector(".xy-alert--success")).not.toBeNull();

    vi.advanceTimersByTime(70);
    await nextTick();

    expect(getActiveServiceText()).toContain("同步任务已刷新");

    vi.advanceTimersByTime(50);
    await nextTick();

    expect(getActiveServiceText()).toBe("");
  });

  it("相同 groupKey 命中当前项且未显式传 duration 时不会重置剩余计时", async () => {
    vi.useFakeTimers();

    XyAlertService.open({
      title: "同步中",
      duration: 120,
      groupKey: "sync-task"
    });

    await nextTick();
    vi.advanceTimersByTime(60);

    XyAlertService.open({
      title: "同步状态已更新",
      type: "warning",
      groupKey: "sync-task"
    });

    await nextTick();
    expect(getActiveServiceText()).toContain("同步状态已更新");

    vi.advanceTimersByTime(59);
    await nextTick();
    expect(getActiveServiceText()).toContain("同步状态已更新");

    vi.advanceTimersByTime(2);
    await nextTick();

    expect(getActiveServiceText()).toBe("");
  });

  it("相同 groupKey 命中排队项时不会重复入队，而是更新等待项", async () => {
    const first = XyAlertService.open({
      title: "当前任务",
      groupKey: "current"
    });
    const second = XyAlertService.open({
      title: "等待任务",
      groupKey: "queue"
    });

    await nextTick();

    const merged = XyAlertService.open({
      title: "等待任务已更新",
      type: "warning",
      groupKey: "queue"
    });

    expect(merged.id).toBe(second.id);

    first.close();
    await nextTick();

    expect(getActiveServiceText()).toContain("等待任务已更新");
    expect(document.body.querySelector(".xy-alert--warning")).not.toBeNull();
  });

  it("队列切换到带 appendTo 的下一项时会移动服务宿主", async () => {
    document.body.innerHTML = `
      <div id="alert-service-first-target"></div>
      <div id="alert-service-second-target"></div>
    `;

    const first = XyAlertService.open({
      title: "第一条",
      appendTo: "#alert-service-first-target"
    });
    XyAlertService.open({
      title: "第二条",
      appendTo: "#alert-service-second-target"
    });

    await nextTick();

    expect(getServiceHostParent()?.id).toBe("alert-service-first-target");

    first.close();
    await nextTick();

    expect(getServiceHostParent()?.id).toBe("alert-service-second-target");
    expect(getActiveServiceText()).toContain("第二条");
  });

  it("未传 groupKey 时仍保持原有 FIFO 入队行为", async () => {
    const first = XyAlertService.open({
      title: "重复提示"
    });
    const second = XyAlertService.open({
      title: "重复提示"
    });

    await nextTick();

    expect(second.id).not.toBe(first.id);
    expect(getActiveServiceText()).toContain("重复提示");

    first.close();
    await nextTick();

    expect(getActiveServiceText()).toContain("重复提示");
  });

  it("服务项自动关闭后会推进下一条", async () => {
    vi.useFakeTimers();

    XyAlertService.open({
      title: "自动关闭提示",
      duration: 120
    });
    XyAlertService.open({
      title: "下一条提示"
    });

    await nextTick();
    vi.advanceTimersByTime(120);
    await nextTick();

    expect(getActiveServiceText()).toContain("下一条提示");
  });

  it("自动关闭时会通过 onClosed 收到 auto 原因", async () => {
    vi.useFakeTimers();

    const onClosed = vi.fn();

    XyAlertService.open({
      title: "自动关闭回调",
      duration: 120,
      onClosed
    });

    await nextTick();
    vi.advanceTimersByTime(120);
    await nextTick();

    expect(onClosed).toHaveBeenCalledWith("auto");
  });

  it("closeAll 时会给当前项和排队项发出 close-all 原因", async () => {
    const currentClosed = vi.fn();
    const queuedClosed = vi.fn();

    XyAlertService.open({
      title: "当前项",
      onClosed: currentClosed
    });
    XyAlertService.open({
      title: "排队项",
      onClosed: queuedClosed
    });

    await nextTick();
    XyAlertService.closeAll();
    await nextTick();

    expect(currentClosed).toHaveBeenCalledWith("close-all");
    expect(queuedClosed).toHaveBeenCalledWith("close-all");
  });

  it("maxQueue=0 且 overflowStrategy=drop-newest 时会直接丢弃新项", async () => {
    const droppedClosed = vi.fn();

    XyAlertService.open({
      title: "当前提示"
    });
    const dropped = XyAlertService.open({
      title: "被丢弃的新提示",
      maxQueue: 0,
      overflowStrategy: "drop-newest",
      onClosed: droppedClosed
    });

    await nextTick();

    expect(getActiveServiceText()).toContain("当前提示");
    expect(getActiveServiceText()).not.toContain("被丢弃的新提示");
    expect(XyAlertService.getState().queueLength).toBe(0);
    expect(droppedClosed).toHaveBeenCalledWith("overflow");

    dropped.update({
      title: "不会生效"
    });

    expect(getActiveServiceText()).toContain("当前提示");
  });

  it("maxQueue 命中 drop-newest 时会保留已有等待项", async () => {
    const droppedClosed = vi.fn();
    const first = XyAlertService.open({
      title: "当前项"
    });

    XyAlertService.open({
      title: "等待项 A",
      maxQueue: 1,
      overflowStrategy: "drop-newest"
    });
    XyAlertService.open({
      title: "等待项 B",
      maxQueue: 1,
      overflowStrategy: "drop-newest",
      onClosed: droppedClosed
    });

    await nextTick();

    expect(XyAlertService.getState().queueLength).toBe(1);
    expect(droppedClosed).toHaveBeenCalledWith("overflow");

    first.close();
    await nextTick();

    expect(getActiveServiceText()).toContain("等待项 A");
    expect(getActiveServiceText()).not.toContain("等待项 B");
  });

  it("maxQueue 命中 drop-oldest 时会淘汰最早等待项", async () => {
    const evictedClosed = vi.fn();
    const first = XyAlertService.open({
      title: "当前项"
    });

    XyAlertService.open({
      title: "等待项 A",
      maxQueue: 1,
      overflowStrategy: "drop-oldest",
      onClosed: evictedClosed
    });
    XyAlertService.open({
      title: "等待项 B",
      maxQueue: 1,
      overflowStrategy: "drop-oldest"
    });

    await nextTick();

    expect(XyAlertService.getState().queueLength).toBe(1);
    expect(evictedClosed).toHaveBeenCalledWith("overflow");

    first.close();
    await nextTick();

    expect(getActiveServiceText()).toContain("等待项 B");
    expect(getActiveServiceText()).not.toContain("等待项 A");
  });

  it("getState 会返回只读快照，而不是内部响应式对象", async () => {
    XyAlertService.open({
      title: "当前项",
      groupKey: "current"
    });
    XyAlertService.open({
      title: "排队项",
      groupKey: "queued"
    });

    await nextTick();

    const snapshot = XyAlertService.getState();

    expect(snapshot.current?.title).toBe("当前项");
    expect(snapshot.queueLength).toBe(1);
    expect(snapshot.total).toBe(2);
    expect("renderKey" in (snapshot.current ?? {})).toBe(false);

    if (snapshot.current) {
      snapshot.current.title = "已修改快照";
    }

    expect(XyAlertService.getState().current?.title).toBe("当前项");
  });
});
