<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("当前激活：dashboard");

function handleSelect(index: string, indexPath: string[]) {
  feedback.value = `当前激活：${index} / ${indexPath.join(" > ")}`;
}
</script>

<template>
  <div class="demo-menu-basic">
    <section class="demo-menu-basic__hero">
      <header class="demo-menu-basic__header">
        <div class="demo-menu-basic__title">
          <strong>运营工作台导航</strong>
          <p>把横向菜单放进一个真实产品头部语境里，强调品牌区、导航区和右侧操作区的节奏，而不只是平铺一个导航条。</p>
        </div>

        <xy-space wrap>
          <xy-tag status="primary" round>{{ feedback }}</xy-tag>
          <xy-tag round>hover 打开协作空间</xy-tag>
        </xy-space>
      </header>

      <div class="demo-menu-basic__nav-shell">
        <div class="demo-menu-basic__meta">
          <span class="demo-menu-basic__env">Workspace Live</span>
          <span class="demo-menu-basic__meta-note">最后同步于 09:42</span>
        </div>

        <div class="demo-menu-basic__mainbar">
          <div class="demo-menu-basic__brand">
            <span class="demo-menu-basic__brand-mark">XO</span>
            <div>
              <strong>Xiaoye Ops</strong>
              <small>导航主骨架示意</small>
            </div>
          </div>

          <xy-menu
            class="demo-menu-basic__menu"
            mode="horizontal"
            default-active="dashboard"
            background-color="#0f172a"
            text-color="rgba(226, 232, 240, 0.76)"
            active-text-color="#f8fafc"
            popper-effect="dark"
            popper-class="demo-menu-basic__popup"
            @select="handleSelect"
          >
            <xy-menu-item index="dashboard">工作台</xy-menu-item>

            <xy-sub-menu index="workspace">
              <template #title>协作空间</template>
              <xy-menu-item index="workspace-files">文件</xy-menu-item>
              <xy-menu-item index="workspace-members">成员</xy-menu-item>
              <xy-sub-menu index="workspace-audit">
                <template #title>审计中心</template>
                <xy-menu-item index="workspace-audit-log">日志</xy-menu-item>
                <xy-menu-item index="workspace-audit-policy">策略</xy-menu-item>
              </xy-sub-menu>
            </xy-sub-menu>

            <xy-menu-item index="orders">订单</xy-menu-item>
            <xy-menu-item index="disabled" disabled>停用入口</xy-menu-item>
            <xy-menu-item index="settings">设置</xy-menu-item>
          </xy-menu>

          <div class="demo-menu-basic__actions">
            <xy-button circle plain icon="mdi:bell-outline" aria-label="通知中心" />
            <xy-button plain>搜索</xy-button>
            <xy-button type="primary">新建任务</xy-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-menu-basic {
  width: 100%;
}

.demo-menu-basic__hero {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--xy-color-primary) 14%, white), transparent 34%),
    radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.08), transparent 30%),
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color) 96%, white), var(--xy-bg-color));
}

.demo-menu-basic__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.demo-menu-basic__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-menu-basic__title strong {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-basic__title p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-basic__nav-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.9)),
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.28), transparent 36%);
  box-shadow: 0 22px 42px rgba(15, 23, 42, 0.12);
}

.demo-menu-basic__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: rgba(226, 232, 240, 0.66);
  font-size: 12px;
}

.demo-menu-basic__env {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.16);
  color: rgba(248, 250, 252, 0.9);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-menu-basic__mainbar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
    rgba(15, 23, 42, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 -1px 0 rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(18px);
}

.demo-menu-basic__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
}

.demo-menu-basic__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--xy-color-primary), #0ea5e9);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.demo-menu-basic__brand strong {
  display: block;
  color: rgba(248, 250, 252, 0.96);
}

.demo-menu-basic__brand small {
  color: rgba(226, 232, 240, 0.58);
}

.demo-menu-basic__actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.demo-menu-basic__menu :deep(.xy-menu--horizontal) {
  min-height: 48px;
  padding: 6px;
  border: none;
  border-radius: 16px;
  background: transparent;
  box-shadow: none;
}

.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-menu-item),
.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-sub-menu),
.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-menu__more) {
  margin: 0;
}

.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-menu-item),
.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-sub-menu > .xy-sub-menu__title),
.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-menu__more > .xy-menu__more-button) {
  min-height: 42px;
  align-items: center;
  margin: 0;
  padding-inline: 14px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: inset 0 0 0 1px transparent;
}

.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-menu-item:hover),
.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-sub-menu > .xy-sub-menu__title:hover),
.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-menu__more > .xy-menu__more-button:hover),
.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-sub-menu.is-opened > .xy-sub-menu__title) {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(248, 250, 252, 0.96);
  box-shadow:
    inset 0 0 0 1px rgba(148, 163, 184, 0.18),
    0 8px 20px rgba(15, 23, 42, 0.18);
}

.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-menu-item.is-active),
.demo-menu-basic__menu :deep(.xy-menu--horizontal > .xy-sub-menu.is-active > .xy-sub-menu__title) {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.88), rgba(14, 165, 233, 0.86));
  color: #fff;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.14),
    0 12px 24px rgba(37, 99, 235, 0.24);
}

:global(.xy-menu__popup.demo-menu-basic__popup) {
  min-width: 224px;
  padding: 10px;
  border-color: rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 38%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.95));
  box-shadow:
    0 24px 48px rgba(15, 23, 42, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

:global(.xy-menu__popup.demo-menu-basic__popup .xy-menu-item),
:global(.xy-menu__popup.demo-menu-basic__popup .xy-sub-menu__title) {
  min-height: 40px;
  padding-inline: 14px;
  border-radius: 13px;
  color: rgba(241, 245, 249, 0.92);
  font-weight: 600;
}

:global(.xy-menu__popup.demo-menu-basic__popup .xy-menu-item-group__title) {
  padding: 8px 14px 10px;
  color: rgba(148, 163, 184, 0.78);
  letter-spacing: 0.08em;
}

:global(.xy-menu__popup.demo-menu-basic__popup .xy-menu-item:hover),
:global(.xy-menu__popup.demo-menu-basic__popup .xy-sub-menu__title:hover) {
  background: rgba(59, 130, 246, 0.18);
  box-shadow:
    inset 0 0 0 1px rgba(96, 165, 250, 0.16),
    0 10px 18px rgba(15, 23, 42, 0.16);
}

:global(.xy-menu__popup.demo-menu-basic__popup .xy-menu-item.is-active),
:global(.xy-menu__popup.demo-menu-basic__popup .xy-sub-menu.is-active > .xy-sub-menu__title) {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.28), rgba(14, 165, 233, 0.18));
  color: #fff;
}

@media (max-width: 860px) {
  .demo-menu-basic__header,
  .demo-menu-basic__mainbar {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .demo-menu-basic__actions {
    justify-content: flex-end;
  }

  .demo-menu-basic__meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
