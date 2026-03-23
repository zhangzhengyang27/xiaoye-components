<script setup lang="ts">
import { computed, reactive } from "vue";

const model = reactive({
  scene: ""
});

const rules = {
  scene: [{ required: true, message: "请选择发布环境", trigger: "change" as const }]
};

const sceneMeta = computed(() => {
  switch (model.scene) {
    case "dev":
      return {
        title: "开发环境",
        hint: "适合功能联调、接口验证和临时回归。",
        status: "neutral"
      };
    case "staging":
      return {
        title: "预发环境",
        hint: "适合灰度验证、联调演练和准生产验收。",
        status: "warning"
      };
    case "prod":
      return {
        title: "生产环境",
        hint: "适合正式发布，需要更严格的审批和回滚策略。",
        status: "success"
      };
    default:
      return {
        title: "尚未选择",
        hint: "切换选项后会立即触发 change 校验，并同步右侧摘要。",
        status: "neutral"
      };
  }
});
</script>

<template>
  <div class="demo-radio-form">
    <div class="demo-radio-form__panel">
      <header class="demo-radio-form__header">
        <div class="demo-radio-form__title">
          <xy-text tag="strong">Release Target</xy-text>
          <xy-text size="sm" type="info">
            这里展示 `xy-radio-group` 在表单里的使用方式，切换后会触发 `change` 校验。
          </xy-text>
        </div>
        <xy-tag size="sm" round>Form Linked</xy-tag>
      </header>

      <div class="demo-radio-form__content">
        <xy-form :model="model" :rules="rules" label-position="top">
          <xy-form-item
            label="发布环境"
            prop="scene"
            help="请选择本次版本准备发布到哪个环境。"
          >
            <xy-radio-group v-model="model.scene">
              <xy-radio value="dev">开发环境</xy-radio>
              <xy-radio value="staging">预发环境</xy-radio>
              <xy-radio value="prod">生产环境</xy-radio>
            </xy-radio-group>
          </xy-form-item>
        </xy-form>

        <aside class="demo-radio-form__aside">
          <span class="demo-radio-form__aside-kicker">Environment</span>
          <strong>{{ sceneMeta.title }}</strong>
          <p>{{ sceneMeta.hint }}</p>
          <xy-tag size="sm" :status="sceneMeta.status as 'neutral' | 'warning' | 'success'" round>
            {{ sceneMeta.title }}
          </xy-tag>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-radio-form {
  width: 100%;
}

.demo-radio-form__panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 22px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color-muted) 70%, white), transparent 24%),
    var(--xy-bg-color);
}

.demo-radio-form__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.demo-radio-form__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-radio-form__content {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
  gap: 16px;
  align-items: stretch;
}

.demo-radio-form__aside {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 18px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 74%, white);
}

.demo-radio-form__aside-kicker {
  color: var(--xy-text-color-muted);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-radio-form__aside strong {
  color: var(--xy-text-color);
  font-size: 18px;
  line-height: 1.2;
}

.demo-radio-form__aside p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 760px) {
  .demo-radio-form__header,
  .demo-radio-form__content {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
