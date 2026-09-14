import { describe, expect, it } from "vitest";
import { useFloatingVisibility } from "../src/composables/use-floating-visibility";

describe("useFloatingVisibility isLeaveAnimating 守卫", () => {
  it("关闭动画期间（isLeaveAnimating 为 true）toggle 不应重新打开面板", () => {
    const floating = useFloatingVisibility({
      isLeaveAnimating: () => true
    });

    floating.open();
    expect(floating.visible.value).toBe(true);

    // 模拟真实浏览器：关闭后离开动画尚未结束
    floating.close();
    expect(floating.visible.value).toBe(false);

    floating.toggle();
    expect(floating.visible.value).toBe(false);
  });

  it("无动画环境（isLeaveAnimating 未提供/返回 false）toggle 行为保持不变", () => {
    const floating = useFloatingVisibility({
      isLeaveAnimating: () => false
    });

    floating.open();
    expect(floating.visible.value).toBe(true);
    floating.close();
    expect(floating.visible.value).toBe(false);

    floating.toggle();
    expect(floating.visible.value).toBe(true);

    floating.toggle();
    expect(floating.visible.value).toBe(false);
  });
});
