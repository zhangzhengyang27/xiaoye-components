<script setup lang="ts">
import { computed, ref } from "vue";

const heroDialogOpen = ref(false);
const commandOpen = ref(false);
const pricingCycle = ref("monthly");
const workspace = ref<string | number | null>("brand");

const pricingTabs = [
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" }
];

const workspaceOptions = [
  { label: "Brand Site", value: "brand" },
  { label: "Product Landing", value: "landing" },
  { label: "Account Workspace", value: "account" }
];
const quickActions = [
  { key: "duplicate", label: "复制页面草稿", command: "duplicate" },
  { key: "share", label: "共享预览链接", command: "share" },
  { key: "archive", label: "归档这一版实验线", command: "archive", danger: true }
];
const commandItems = [
  {
    key: "overview",
    label: "打开实验线总览",
    description: "回到单组件试点页看各能力边界",
    group: "Documentation",
    icon: "mdi:book-open-page-variant-outline",
    shortcut: "G O",
    keywords: ["overview", "docs"]
  },
  {
    key: "pricing",
    label: "跳到定价区",
    description: "直接看 tabs / popover / action 的页面节奏",
    group: "Pages",
    icon: "mdi:credit-card-outline",
    shortcut: "G P",
    keywords: ["pricing", "section"]
  },
  {
    key: "account",
    label: "跳到账户区",
    description: "继续看 select / input / card 的组合密度",
    group: "Pages",
    icon: "mdi:account-circle-outline",
    shortcut: "G A",
    keywords: ["account", "workspace"]
  }
];
const searchItems = [
  { key: "hero", label: "Hero Header", description: "主标题、说明和 CTA 区域", group: "Landing" },
  {
    key: "pricing",
    label: "Pricing Capture",
    description: "输入 + CTA + Dropdown 的组合入口",
    group: "Pricing"
  },
  {
    key: "account",
    label: "Account Decision",
    description: "Select、Input 和结论区",
    group: "Account"
  }
];

const priceCopy = computed(() =>
  pricingCycle.value === "monthly"
    ? {
        price: "$24",
        note: "适合先验证视觉系统、页面模块和轻交互表达。"
      }
    : {
        price: "$228",
        note: "适合已经决定把前台体验纳入正式产品线的团队。"
      }
);
</script>

<template>
  <div class="frontline-page xy-frontline-theme">
    <section class="frontline-page__hero">
      <div class="frontline-page__hero-copy">
        <span class="frontline-page__eyebrow">Frontline Experiment</span>
        <h2 class="frontline-page__hero-title">把前台视觉表达、组件状态和页面节奏放回同一条试验线里。</h2>
        <p class="frontline-page__hero-description">
          这一页不是在证明“换皮能不能做”，而是在验证：如果以后要真的开一条前台产品线，按钮、弹层、标签页、提示层和选择器是否需要更清晰的
          anatomy 和状态约定。
        </p>
        <div class="frontline-page__hero-actions">
          <xy-front-button leading-icon="mdi:rocket-launch-outline" @click="heroDialogOpen = true">
            开始体验
          </xy-front-button>
          <xy-front-button variant="soft" leading-icon="mdi:magnify" @click="commandOpen = true">
            打开 Command
          </xy-front-button>
          <xy-front-button as-child variant="outline">
            <a href="/frontline/overview">查看实验线总览</a>
          </xy-front-button>
          <xy-front-popover title="为什么先做页面样板" surface="highlight">
            <template #trigger>
              <xy-front-button variant="ghost" tone="neutral">为什么要先看整页</xy-front-button>
            </template>
            <template #content>
              <p>
                因为单组件看起来成立，不代表放回同一页后仍然成立。页面样板能更快暴露节奏、密度和风格上的问题。
              </p>
            </template>
          </xy-front-popover>
        </div>
      </div>

      <div class="frontline-page__hero-panel">
        <xy-front-card eyebrow="Status" title="11 个前台试点组件" surface="glass" interactive>
          <template #content>
            Button / Dialog / Tabs / Popover / Select / Input / Card / Dropdown / Menu / Command /
            SearchPanel
          </template>
        </xy-front-card>
        <xy-front-card eyebrow="Scene" title="3 个验证场景" surface="default">
          <template #content>Landing / Pricing / Account</template>
        </xy-front-card>
        <xy-front-card eyebrow="Signal" title="当前结论标准" surface="highlight">
          <template #content>不是能不能做，而是能不能自然地组合成一页。</template>
        </xy-front-card>
      </div>
    </section>

    <section class="frontline-page__section">
      <div class="frontline-page__section-head">
        <span>Pricing</span>
        <h3 class="frontline-page__section-title">用 `FrontTabs + FrontPopover + FrontButton` 验证定价页节奏。</h3>
      </div>

      <div class="frontline-pricing">
        <xy-front-card
          eyebrow="Capture"
          title="把 CTA、输入和快捷动作放进同一个价格入口"
          description="如果 Input、Dropdown 和 Card 加进来以后页面还成立，说明这条实验线已经不只是五个孤立试点。"
          surface="glass"
        >
          <template #content>
            <div class="frontline-pricing__capture">
              <xy-front-input
                placeholder="输入你的工作邮箱"
                leading-icon="mdi:email-fast-outline"
                variant="soft"
              />
              <xy-front-button>预约试用</xy-front-button>
              <xy-front-dropdown :items="quickActions">
                <template #trigger>
                  <xy-front-button
                    variant="outline"
                    tone="neutral"
                    trailing-icon="mdi:chevron-down"
                  >
                    更多动作
                  </xy-front-button>
                </template>
              </xy-front-dropdown>
            </div>
          </template>
        </xy-front-card>

        <xy-front-search-panel
          title="Search Panel"
          description="先用轻量搜索面板承接页面模块查找，再决定要不要走更重的 command 体系。"
          :items="searchItems"
        />

        <xy-front-tabs v-model="pricingCycle" :items="pricingTabs" variant="segmented">
          <template #monthly>
            <div class="frontline-pricing__panel">
              <div>
                <span class="frontline-pricing__label">Starter</span>
                <h4 class="frontline-pricing__price">
                  {{ priceCopy.price }}<small class="frontline-pricing__price-unit">/ month</small>
                </h4>
                <p class="frontline-pricing__note">{{ priceCopy.note }}</p>
              </div>
              <xy-front-popover
                title="Starter 适合谁"
                content="更适合还在验证前台视觉、组件密度和内容节奏的团队，不建议一开始就拿它承接复杂业务表单。"
              >
                <template #trigger>
                  <xy-front-button variant="ghost" tone="neutral">适用范围</xy-front-button>
                </template>
              </xy-front-popover>
            </div>
          </template>
          <template #yearly>
            <div class="frontline-pricing__panel">
              <div>
                <span class="frontline-pricing__label">Growth</span>
                <h4 class="frontline-pricing__price">
                  {{ priceCopy.price }}<small class="frontline-pricing__price-unit">/ year</small>
                </h4>
                <p class="frontline-pricing__note">{{ priceCopy.note }}</p>
              </div>
              <xy-front-popover
                title="Growth 适合谁"
                content="更适合已经决定把这条试验线沉淀成正式产品方向，并准备开始做主题、模板和组件规约的团队。"
                surface="highlight"
              >
                <template #trigger>
                  <xy-front-button variant="ghost" tone="neutral">方案说明</xy-front-button>
                </template>
              </xy-front-popover>
            </div>
          </template>
        </xy-front-tabs>

        <div class="frontline-pricing__actions">
          <xy-front-button>开始试用</xy-front-button>
          <xy-front-button variant="outline">预约评审</xy-front-button>
        </div>
      </div>
    </section>

    <section class="frontline-page__section">
      <div class="frontline-page__section-head">
        <span>Account</span>
        <h3 class="frontline-page__section-title">用 `FrontSelect` 把这条实验线放回真实账户工作区。</h3>
      </div>

      <div class="frontline-account">
        <xy-front-card
          title="Workspace Preference"
          description="先选这条实验线应该优先服务哪种页面，再决定下一批要补的组件。"
          surface="glass"
        >
          <template #content>
            <xy-front-select
              v-model="workspace"
              :options="workspaceOptions"
              searchable
              clearable
              variant="soft"
              placeholder="选择一个工作区方向"
            >
              <template #header>
                <div class="frontline-account__select-header">Suggested workspace focus</div>
              </template>
              <template #footer>
                <div class="frontline-account__select-footer">
                  优先级越清楚，实验线越不容易变形。
                </div>
              </template>
            </xy-front-select>
          </template>
        </xy-front-card>

        <xy-front-card
          title="Decision Rule"
          description="用 Card 承接说明区，再把 Dropdown 和次级输入动作放进去，看整页密度是否仍然稳定。"
          surface="default"
        >
          <template #content>
            <p class="frontline-account__copy">
              如果这一页看起来仍然成立，说明这 5
              个组件至少在“同页组合”层面没有跑偏；如果已经开始互相打架，那就不能继续铺组件数量，应该先收
              API 和状态模型。
            </p>
            <div class="frontline-account__field">
              <xy-front-input
                placeholder="给这一轮实验线写一个结论标题"
                trailing-icon="mdi:form-textbox"
              />
            </div>
            <div class="frontline-account__actions">
              <xy-front-button variant="soft">保存偏好</xy-front-button>
              <xy-front-button variant="ghost" tone="neutral">仅记录结论</xy-front-button>
            </div>
          </template>
        </xy-front-card>
      </div>
    </section>

    <xy-front-dialog
      v-model="heroDialogOpen"
      title="把这条实验线推进到下一轮"
      description="如果你觉得这页的整体节奏、信息密度和视觉统一性已经明显区别于后台主线，下一步就值得开始补 `command / menu / search panel`。"
    >
      <template #content>
        <p>
          当前这轮的意义不在于“功能够不够全”，而在于先证明一件事：这条前台试验线能不能形成自己的页面语言，而不是把现有基础层简单换个圆角和阴影。
        </p>
      </template>
      <template #footer="{ close }">
        <xy-front-button variant="ghost" tone="neutral" @click="close()">继续观察</xy-front-button>
        <xy-front-button @click="close()">进入下一轮</xy-front-button>
      </template>
    </xy-front-dialog>

    <xy-front-command
      v-model="commandOpen"
      :items="commandItems"
      title="Search The Experiment"
      description="把文档入口、页面区块和轻命令收进同一个前台面板，再看这条实验线是否开始具备真正的命令入口。"
    />
  </div>
</template>

<style scoped>
.frontline-page {
  display: grid;
  gap: 28px;
}

.frontline-page__hero,
.frontline-page__section {
  border: 1px solid
    color-mix(in srgb, var(--xy-frontline-neutral-2) 18%, var(--xy-border-color-subtle));
  border-radius: 36px;
  background: color-mix(in srgb, var(--xy-surface-raised) 96%, white);
  box-shadow: var(--xy-frontline-shadow-md);
}

.frontline-page__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.8fr);
  gap: 28px;
  padding: 34px;
}

.frontline-page__hero-title {
  margin: 14px 0 0;
  font-size: clamp(34px, 4vw, 54px);
  line-height: 1.02;
  letter-spacing: -0.05em;
}

.frontline-page__hero-description {
  margin: 18px 0 0;
  max-width: 720px;
  color: var(--xy-frontline-neutral-2);
  font-size: 16px;
  line-height: 1.85;
}

.frontline-page__eyebrow,
.frontline-page__section-head span,
.frontline-pricing__label {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--xy-frontline-brand-1) 10%, white);
  color: var(--xy-frontline-brand-1);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.frontline-page__hero-actions,
.frontline-account__actions,
.frontline-pricing__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.frontline-page__hero-actions {
  margin-top: 24px;
}

.frontline-page__hero-panel {
  display: grid;
  gap: 14px;
  align-content: start;
}

.frontline-pricing__capture {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 12px;
  align-items: center;
}

.frontline-account__copy,
.frontline-pricing__price {
  color: var(--xy-frontline-neutral-3);
  line-height: 1.75;
}

.frontline-page__section {
  padding: 28px;
}

.frontline-page__section-title {
  margin: 10px 0 0;
  font-size: clamp(24px, 2.6vw, 34px);
  line-height: 1.12;
  letter-spacing: -0.04em;
}

.frontline-pricing,
.frontline-account {
  margin-top: 20px;
}

.frontline-pricing {
  display: grid;
  gap: 18px;
}

.frontline-pricing__panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.frontline-pricing__price {
  margin: 14px 0 0;
  font-size: clamp(32px, 4vw, 52px);
  letter-spacing: -0.05em;
}

.frontline-pricing__price-unit {
  margin-left: 8px;
  font-size: 16px;
  color: var(--xy-frontline-neutral-3);
}

.frontline-pricing__note {
  margin: 0;
  color: var(--xy-frontline-neutral-3);
  line-height: 1.75;
}

.frontline-account {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.frontline-account__field {
  margin-top: 16px;
}

.frontline-account__select-header,
.frontline-account__select-footer {
  color: var(--xy-frontline-neutral-3);
  font-size: 13px;
}

.frontline-account__actions {
  margin-top: 18px;
}

@media (max-width: 960px) {
  .frontline-page__hero,
  .frontline-account {
    grid-template-columns: 1fr;
  }

  .frontline-pricing__capture {
    grid-template-columns: 1fr;
  }

  .frontline-page__hero {
    padding: 24px;
  }

  .frontline-page__section {
    padding: 22px;
  }
}
</style>
