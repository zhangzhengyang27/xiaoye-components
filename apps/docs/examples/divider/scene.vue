<template>
  <xy-card class="divider-scene-card" shadow="hover">
    <template #header>
      <div class="divider-scene-card__header">
        <div>
          <h4>版本发布摘要</h4>
          <p>用 Divider 把发布信息切成可扫读的小节，让风险、范围和动作都各归其位。</p>
        </div>
        <xy-tag status="success" round>发布中</xy-tag>
      </div>
    </template>

    <div class="divider-scene-card__meta">
      <span>版本号 v2.8.0</span>
      <xy-divider direction="vertical" />
      <span>负责人 李响</span>
      <xy-divider direction="vertical" border-style="dashed" />
      <span>窗口 20:00 - 21:00</span>
      <xy-divider direction="vertical" />
      <span>环境 生产灰度 20%</span>
    </div>

    <xy-divider content-position="left" status="primary">上线范围</xy-divider>

    <div class="divider-scene-card__list">
      <div>
        <strong>用户侧</strong>
        <p>统一消息入口、通知筛选与站内信聚合，减少重复跳转和入口分散。</p>
      </div>
      <div>
        <strong>管理端</strong>
        <p>审批列表筛选重构，补齐结果态和抽屉内联动作，统一后台操作节奏。</p>
      </div>
      <div>
        <strong>监控侧</strong>
        <p>新增发布后 30 分钟的异常聚合看板，重点追踪审批链路和消息去重命中率。</p>
      </div>
    </div>

    <xy-divider content-position="left" border-style="dashed" status="warning">风险提示</xy-divider>

    <div class="divider-scene-card__notice">
      <strong>灰度观察点</strong>
      <p>首批灰度用户集中在审批量较高的团队，若 10 分钟内错误率上升，需要回退消息聚合策略。</p>
    </div>

    <p class="divider-scene-card__risk">
      灰度期间建议保留旧入口兜底，并在客服后台同步常见问题口径，避免前台入口切换造成误判。
    </p>

    <xy-divider content-position="left">发布检查</xy-divider>

    <div class="divider-scene-card__checklist">
      <div class="divider-scene-card__check">
        <xy-tag status="success" round>已完成</xy-tag>
        <span>数据库变更脚本已在预发布环境回放通过。</span>
      </div>
      <div class="divider-scene-card__check">
        <xy-tag status="warning" round>待观察</xy-tag>
        <span>消息去重策略需盯 30 分钟，确认重复通知没有明显反弹。</span>
      </div>
      <div class="divider-scene-card__check">
        <xy-tag status="primary" round>已同步</xy-tag>
        <span>运营、客服和值班同学已收到发布窗口与回退预案。</span>
      </div>
    </div>

    <xy-divider content-position="right" status="success">后续动作</xy-divider>

    <div class="divider-scene-card__actions">
      <xy-button type="primary">查看发布单</xy-button>
      <xy-button plain>同步值班群</xy-button>
      <xy-button plain>导出检查项</xy-button>
    </div>
  </xy-card>
</template>

<style scoped>
.divider-scene-card {
  max-width: 760px;
}

.divider-scene-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.divider-scene-card__header h4,
.divider-scene-card__header p,
.divider-scene-card__notice p,
.divider-scene-card__risk,
.divider-scene-card__list p {
  margin: 0;
}

.divider-scene-card__header h4 {
  font-size: 16px;
  font-weight: 700;
  color: var(--xy-text-color);
}

.divider-scene-card__header p,
.divider-scene-card__meta,
.divider-scene-card__list p,
.divider-scene-card__notice p,
.divider-scene-card__risk {
  color: var(--xy-text-color-secondary);
}

.divider-scene-card__header p {
  margin-top: 6px;
}

.divider-scene-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  line-height: 1.7;
}

.divider-scene-card__list {
  display: grid;
  gap: 12px;
}

.divider-scene-card__notice {
  padding: 14px 16px;
  border: 1px dashed color-mix(in srgb, var(--xy-color-warning) 24%, white);
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-color-warning) 8%, white);
}

.divider-scene-card__notice strong {
  display: inline-block;
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--xy-color-warning);
}

.divider-scene-card__list strong {
  display: inline-block;
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--xy-text-color);
}

.divider-scene-card__checklist {
  display: grid;
  gap: 10px;
}

.divider-scene-card__check {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.divider-scene-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}
</style>
