<script setup lang="ts">
import { XyEmpty, XyLink, XyTag, XyText, XyTimeline, XyTimelineItem } from "@xiaoye/components";
import type { ComponentStatus } from "@xiaoye/utils";
import type {
  AuditTimelineAttachment,
  AuditTimelineEntry,
  AuditTimelineProps,
  AuditTimelineStatus
} from "./audit-timeline";

defineOptions({
  name: "XyAuditTimeline"
});

const props = withDefaults(defineProps<AuditTimelineProps>(), {
  items: () => [],
  emptyText: "暂时还没有审计记录",
  compact: false
});

const statusConfigMap: Record<
  AuditTimelineStatus,
  {
    label: string;
    tagStatus: ComponentStatus;
    timelineType: "" | ComponentStatus;
    timelineState: "default" | "done" | "current" | "blocked" | "pending";
  }
> = {
  default: {
    label: "已记录",
    tagStatus: "neutral",
    timelineType: "neutral",
    timelineState: "default"
  },
  success: {
    label: "成功",
    tagStatus: "success",
    timelineType: "success",
    timelineState: "done"
  },
  warning: {
    label: "警告",
    tagStatus: "warning",
    timelineType: "warning",
    timelineState: "current"
  },
  danger: {
    label: "拒绝",
    tagStatus: "danger",
    timelineType: "danger",
    timelineState: "blocked"
  },
  processing: {
    label: "处理中",
    tagStatus: "primary",
    timelineType: "primary",
    timelineState: "pending"
  }
};

function resolveStatusConfig(status?: AuditTimelineStatus) {
  return statusConfigMap[status ?? "default"];
}

function hasAttachments(item: AuditTimelineEntry) {
  return Boolean(item.attachments && item.attachments.length > 0);
}

function attachmentKey(item: AuditTimelineEntry, attachment: AuditTimelineAttachment, index: number) {
  return `${item.id}-${attachment.label}-${index}`;
}
</script>

<template>
  <div class="xy-audit-timeline">
    <xy-empty
      v-if="props.items.length === 0"
      title="暂无记录"
      :description="props.emptyText"
    />

    <xy-timeline v-else :density="props.compact ? 'compact' : 'default'">
      <xy-timeline-item
        v-for="(item, index) in props.items"
        :key="item.id"
        :timestamp="item.timestamp"
        :type="resolveStatusConfig(item.status).timelineType"
        :state="resolveStatusConfig(item.status).timelineState"
      >
        <template #title>
          <slot name="title" :item="item" :index="index">
            <div class="xy-audit-timeline__title">{{ item.title }}</div>
          </slot>
        </template>

        <template #meta>
          <slot
            name="meta"
            :item="item"
            :index="index"
            :status-label="resolveStatusConfig(item.status).label"
          >
            <div class="xy-audit-timeline__meta">
              <xy-text
                v-if="item.operator"
                class="xy-audit-timeline__operator"
                type="default"
                size="sm"
              >
                {{ item.operator }}
              </xy-text>
              <xy-tag size="sm" :status="resolveStatusConfig(item.status).tagStatus">
                {{ resolveStatusConfig(item.status).label }}
              </xy-tag>
            </div>
          </slot>
        </template>

        <slot :item="item" :index="index">
          <div v-if="item.description || item.remark" class="xy-audit-timeline__content">
            <p v-if="item.description" class="xy-audit-timeline__description">
              {{ item.description }}
            </p>
            <div v-if="item.remark" class="xy-audit-timeline__remark">
              <span class="xy-audit-timeline__remark-label">备注</span>
              <p>{{ item.remark }}</p>
            </div>
          </div>
        </slot>

        <template #actions>
          <slot name="actions" :item="item" :index="index" />
        </template>

        <template #extra>
          <slot name="extra" :item="item" :index="index">
            <div v-if="hasAttachments(item)" class="xy-audit-timeline__extra">
              <div
                v-if="item.attachments && item.attachments.length > 0"
                class="xy-audit-timeline__attachments"
              >
                <span class="xy-audit-timeline__attachments-label">附件</span>
                <slot name="attachments" :item="item" :index="index">
                  <div class="xy-audit-timeline__attachments-list">
                    <template v-for="(attachment, attachmentIndex) in item.attachments" :key="attachmentKey(item, attachment, attachmentIndex)">
                      <xy-link
                        v-if="attachment.href"
                        type="primary"
                        underline="hover"
                        :href="attachment.href"
                        target="_blank"
                      >
                        {{ attachment.label }}
                      </xy-link>
                      <span v-else class="xy-audit-timeline__attachment-text">
                        {{ attachment.label }}
                      </span>
                    </template>
                  </div>
                </slot>
              </div>
            </div>
          </slot>
        </template>
      </xy-timeline-item>
    </xy-timeline>
  </div>
</template>
