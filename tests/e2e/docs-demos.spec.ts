import { expect, type Locator, test } from "@playwright/test";

function demoByHeading(heading: Locator) {
  return heading.locator(
    'xpath=following-sibling::*[contains(@class,"vp-demo-block")][1]/following-sibling::*[contains(@class,"vp-demo")][1]'
  );
}

test("Menu 文档页的横向溢出示例可以打开更多菜单", async ({ page }) => {
  await page.goto("/components/menu");

  const heading = page.getByRole("heading", { name: "横向溢出与 Popper Offset" });
  await expect(heading).toBeVisible();

  const demo = demoByHeading(heading);
  const moreButton = demo.getByRole("button", { name: "更多菜单" });

  await expect(moreButton).toBeVisible();
  await moreButton.click();

  const popup = page.locator(".demo-menu-overflow__popup").last();
  await expect(popup).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "团队协作" })).toBeVisible();
});

test("Table 文档页的 auto fixed summary 组合示例可以稳定渲染并保留汇总", async ({ page }) => {
  await page.goto("/components/table");

  const heading = page.getByRole("heading", { name: "Auto、固定列与汇总组合" });
  await expect(heading).toBeVisible();

  const demo = demoByHeading(heading);
  await expect(demo.getByText("总览", { exact: true }).first()).toBeVisible();
  await expect(demo.getByText("482,000", { exact: true })).toBeVisible();
  await expect(demo.getByText("36,400", { exact: true })).toBeVisible();
  await expect(demo.getByText("242 万", { exact: true }).last()).toBeVisible();

  const bodyWrapper = demo.locator(".xy-table__body-wrapper").first();
  await bodyWrapper.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
    element.dispatchEvent(new Event("scroll"));
  });

  await expect(demo.getByText("会员增长季 Campaign A").first()).toBeVisible();
  await expect(demo.getByText("86 万", { exact: true }).last()).toBeVisible();
});

test("Watermark 文档页的全屏与目标容器示例同时覆盖 target 和 fullscreen", async ({ page }) => {
  await page.goto("/components/watermark");

  const heading = page.getByRole("heading", { name: "全屏与目标容器" });
  await expect(heading).toBeVisible();

  const demo = demoByHeading(heading);
  const targetHost = demo.locator(".xy-doc-watermark-target-host");

  await expect(targetHost.locator(".xy-watermark__layer")).toBeVisible();

  await demo.getByText("开启全屏水印").click();

  await page.waitForFunction(() => {
    const layers = Array.from(document.body.querySelectorAll<HTMLElement>(".xy-watermark__layer"));
    return layers.some((layer) => getComputedStyle(layer).position === "fixed");
  });

  await expect(demo.getByText("已覆盖 body")).toBeVisible();
});
