import { describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, ref } from "vue";
import type { Ref } from "vue";

// scroll-lock 的 lockCount 是模块级状态，每个用例重新加载模块以隔离计数。
// use-overlay-dialog 的传递依赖（use-overlay-stack 的全局栈）也会随之拿到全新实例。
async function loadUseOverlayDialog() {
  vi.resetModules();
  const module = await import("../src/composables/use-overlay-dialog");
  return module.useOverlayDialog;
}

interface HostRefs {
  modelValue: Ref<boolean>;
  lockScroll: Ref<boolean | undefined>;
}

// createApp host 模式：composable 内部使用 watch/onBeforeUnmount，
// 必须挂在真实组件 setup 上下文中，并保留手动卸载入口以覆盖卸载兜底分支。
function mountHost(
  useOverlayDialog: typeof import("../src/composables/use-overlay-dialog").useOverlayDialog,
  refs: HostRefs
) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const app = createApp(
    defineComponent({
      setup() {
        useOverlayDialog({
          modelValue: () => refs.modelValue.value,
          lockScroll: () => refs.lockScroll.value
        });

        return () => h("div");
      }
    })
  );
  app.mount(container);

  return () => {
    app.unmount();
    container.remove();
  };
}

describe("useOverlayDialog lockScroll 配对式消费", () => {
  it("lockScroll=true 打开时锁定 body 滚动，关闭后还原", async () => {
    const useOverlayDialog = await loadUseOverlayDialog();
    const modelValue = ref(false);
    const lockScroll = ref<boolean | undefined>(true);

    const unmount = mountHost(useOverlayDialog, { modelValue, lockScroll });

    expect(document.body.style.overflow).toBe("");

    modelValue.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    modelValue.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe("");

    unmount();
  });

  it("lockScroll=false 打开与关闭都不锁定 body 滚动", async () => {
    const useOverlayDialog = await loadUseOverlayDialog();
    const modelValue = ref(false);
    const lockScroll = ref<boolean | undefined>(false);

    const unmount = mountHost(useOverlayDialog, { modelValue, lockScroll });

    modelValue.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("");

    modelValue.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe("");

    unmount();
  });

  it("两个浮层同开只锁一次，全关才还原", async () => {
    const useOverlayDialog = await loadUseOverlayDialog();
    const firstModelValue = ref(false);
    const secondModelValue = ref(false);
    const lockScroll = ref<boolean | undefined>(true);

    const unmountFirst = mountHost(useOverlayDialog, {
      modelValue: firstModelValue,
      lockScroll
    });
    const unmountSecond = mountHost(useOverlayDialog, {
      modelValue: secondModelValue,
      lockScroll
    });

    firstModelValue.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    secondModelValue.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    firstModelValue.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    secondModelValue.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe("");

    unmountFirst();
    unmountSecond();
  });

  it("打开状态下动态关闭 lockScroll 立即解锁，再次开启恢复锁定", async () => {
    const useOverlayDialog = await loadUseOverlayDialog();
    const modelValue = ref(false);
    const lockScroll = ref<boolean | undefined>(true);

    const unmount = mountHost(useOverlayDialog, { modelValue, lockScroll });

    modelValue.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    lockScroll.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe("");

    lockScroll.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
  });

  it("打开状态下直接卸载，兜底逻辑偿还本实例的锁", async () => {
    const useOverlayDialog = await loadUseOverlayDialog();
    const modelValue = ref(false);
    const lockScroll = ref<boolean | undefined>(true);

    const unmount = mountHost(useOverlayDialog, { modelValue, lockScroll });

    modelValue.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("混合配置回归：lockScroll=false 的浮层不得释放 lockScroll=true 浮层的锁", async () => {
    const useOverlayDialog = await loadUseOverlayDialog();
    const lockedModelValue = ref(false);
    const unlockedModelValue = ref(false);
    const lockedScroll = ref<boolean | undefined>(true);
    const unlockedScroll = ref<boolean | undefined>(false);

    const unmountLocked = mountHost(useOverlayDialog, {
      modelValue: lockedModelValue,
      lockScroll: lockedScroll
    });

    lockedModelValue.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    // B 挂载并打开：watch immediate 初始 locked=false，
    // 若无 bodyScrollLocked 配对标记会误调 unlockBodyScroll，把 A 的锁减掉
    const unmountUnlocked = mountHost(useOverlayDialog, {
      modelValue: unlockedModelValue,
      lockScroll: unlockedScroll
    });

    unlockedModelValue.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe("hidden");

    // B 卸载：B 从未持有锁，兜底逻辑也不得释放 A 的锁
    unmountUnlocked();
    expect(document.body.style.overflow).toBe("hidden");

    // A 关闭后才真正还原
    lockedModelValue.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe("");

    unmountLocked();
  });
});
