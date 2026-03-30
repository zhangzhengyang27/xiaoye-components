<script setup lang="ts">
import type { AuditTimelineEntry } from "@xiaoye/pro-components";

const items: AuditTimelineEntry[] = [
  {
    id: "a-1",
    title: "审批发起",
    operator: "小叶",
    timestamp: "2026-03-21 09:10",
    status: "success",
    description: "发起成员权限调整申请。"
  },
  {
    id: "a-2",
    title: "补充说明",
    operator: "法务复核",
    timestamp: "2026-03-21 11:26",
    status: "warning",
    description: "要求补充岗位授权范围。",
    remark: "只允许查看账单，不允许导出全量数据。"
  },
  {
    id: "a-3",
    title: "附件提交",
    operator: "小叶",
    timestamp: "2026-03-21 14:02",
    status: "processing",
    description: "补交角色申请单与审批截图。",
    attachments: [
      {
        label: "角色申请单.pdf",
        href: "https://example.com/role-request"
      },
      {
        label: "审批截图.png"
      }
    ]
  },
  {
    id: "a-4",
    title: "审批完成",
    operator: "管理员",
    timestamp: "2026-03-21 17:48",
    status: "success",
    description: "角色已更新并同步到生产环境。"
  }
];
</script>

<template>
  <xy-card header="成员权限审批记录">
    <xy-audit-timeline :items="items">
      <template #attachments="{ item }">
        <div class="xy-inline-stack">
          <xy-link
            v-for="attachment in item.attachments ?? []"
            :key="attachment.label"
            type="primary"
            underline="hover"
            :href="attachment.href"
            :target="attachment.href ? '_blank' : undefined"
          >
            {{ attachment.label }}
          </xy-link>
        </div>
      </template>
    </xy-audit-timeline>
  </xy-card>
</template>
