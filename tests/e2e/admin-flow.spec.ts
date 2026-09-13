import { expect, test } from "@playwright/test";
import { clickInViewCenter } from "./helpers";

test("管理后台闭环示例覆盖筛选、详情、编辑、批量和历史记录", async ({ page }) => {
  await page.goto("/examples/admin");

  await expect(page.getByText("增强层闭环已接通")).toBeVisible();

  await clickInViewCenter(page.getByRole("tab", { name: /账单链路/ }));
  await expect(page.getByText("当前视图：账单链路")).toBeVisible();
  await page.getByPlaceholder("按任务名称、负责人搜索").fill("供应商");
  await clickInViewCenter(page.getByRole("button", { name: "查询" }));

  await expect(page.getByText("供应商账单核对")).toBeVisible();

  // 操作列固定在右侧，可点击的按钮是固定列镜像层里的那份
  const viewButton = page
    .locator(".xy-table__fixed-panel--body.is-right")
    .getByRole("button", { name: "查看" })
    .first();
  await clickInViewCenter(viewButton);
  await expect(page.getByText("事项概览")).toBeVisible();
  await expect(page.getByText("操作记录")).toBeVisible();

  await page.getByRole("button", { name: "编辑当前项" }).click({ force: true });
  await page.getByPlaceholder("请输入事项名称").fill("供应商账单核对-已更新");
  await clickInViewCenter(page.getByRole("button", { name: "保存" }));

  await expect(page.locator(".xy-table").getByText("供应商账单核对-已更新").first()).toBeVisible();

  await page
    .getByRole("checkbox", { name: "选择当前行" })
    .first()
    .evaluate((element) => {
      (element as HTMLInputElement).click();
    });
  await expect(page.getByText("批量完成")).toBeVisible();
  await clickInViewCenter(page.getByRole("button", { name: "批量完成" }));

  await clickInViewCenter(viewButton);
  await expect(page.getByText("批量完成")).toBeVisible();
});
