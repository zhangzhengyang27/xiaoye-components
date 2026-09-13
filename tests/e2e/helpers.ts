import type { Locator } from "@playwright/test";

/**
 * 文档站 demo 区点击存在两类遮挡：吸顶导航（.VPNav）会拦截视口顶部元素；
 * 表格右侧固定列是 DOM 镜像，会拦截主区按钮的 hit-target。
 * 先把目标滚动到视口中央，再 force 点击（与镜像按钮语义等价）。
 */
export async function clickInViewCenter(locator: Locator) {
  await locator.evaluate((element) => {
    element.scrollIntoView({ block: "center", inline: "nearest" });
  });
  await locator.click({ force: true });
}
