<script setup lang="ts">
import { XyAsyncStateContainer } from "../../async-state-container";
import { computed } from "vue";
import { XyAuditTimeline } from "../../audit-timeline";
import { XyBreadcrumb, XyBreadcrumbItem, XyButton, XyCard, XyLink, XyTag } from "@xiaoye/components";
import type { DetailPageProps } from "./detail-page";

defineOptions({
  name: "XyDetailPage"
});

const props = withDefaults(defineProps<DetailPageProps>(), {
  title: "",
  description: "",
  breadcrumbs: () => [],
  actions: () => [],
  loading: false,
  error: null,
  sections: () => [],
  attachments: () => [],
  changes: () => [],
  logs: () => []
});

const visibleChanges = computed(() =>
  props.changes.filter((item) => item.status !== "same")
);

function resolveDiffStatus(status?: string) {
  if (status === "added") return "success";
  if (status === "removed") return "danger";
  if (status === "changed") return "warning";
  return "primary";
}
</script>

<template>
  <div class="xy-detail-page">
    <div class="xy-detail-page__header">
      <div class="xy-detail-page__header-main">
        <xy-breadcrumb
          v-if="props.breadcrumbs.length > 0"
          class="xy-detail-page__header-breadcrumb"
        >
          <xy-breadcrumb-item
            v-for="item in props.breadcrumbs"
            :key="item.label"
            :href="item.href"
          >
            {{ item.label }}
          </xy-breadcrumb-item>
        </xy-breadcrumb>

        <div class="xy-detail-page__header-heading">
          <h2 v-if="props.title" class="xy-detail-page__header-title">{{ props.title }}</h2>
          <p v-if="props.description" class="xy-detail-page__header-description">
            {{ props.description }}
          </p>
        </div>

        <div v-if="$slots.meta" class="xy-detail-page__header-meta">
          <slot name="meta" />
        </div>
      </div>

      <div
        v-if="props.actions.length > 0 || $slots.actions"
        class="xy-detail-page__header-actions"
      >
        <slot name="actions">
          <xy-button
            v-for="action in props.actions"
            :key="action.key"
            :type="action.type"
            :plain="action.plain"
            :text="action.text"
            :link="action.link"
            :disabled="action.disabled"
            :loading="action.loading"
            :icon="action.icon"
          >
            {{ action.label }}
          </xy-button>
        </slot>
      </div>
    </div>

    <xy-async-state-container :loading="props.loading" :error="props.error">
      <div class="xy-detail-page__sections">
        <section
          v-for="section in props.sections"
          :key="section.key"
          class="xy-detail-page__section"
        >
          <div class="xy-detail-page__section-heading">
            <h3 class="xy-detail-page__section-title">{{ section.title }}</h3>
            <p v-if="section.description" class="xy-detail-page__section-description">
              {{ section.description }}
            </p>
          </div>
          <div class="xy-detail-page__section-body">
            <slot :name="section.key" :section="section" />
          </div>
        </section>
      </div>

      <xy-card
        v-if="props.attachments.length > 0"
        class="xy-detail-page__attachments"
        header="附件信息"
      >
        <div class="xy-detail-page__attachment-list">
          <div
            v-for="file in props.attachments"
            :key="file.id"
            class="xy-detail-page__attachment-item"
          >
            <div class="xy-detail-page__attachment-file">
              <xy-link
                type="primary"
                underline="hover"
                :href="file.url"
                :target="file.url ? '_blank' : undefined"
              >
                {{ file.name }}
              </xy-link>
              <span v-if="file.size" class="xy-detail-page__attachment-size">{{ file.size }}</span>
              <xy-tag v-if="file.status" size="sm" :status="file.status">{{ file.status }}</xy-tag>
            </div>
          </div>
        </div>
      </xy-card>

      <xy-card v-if="props.changes.length > 0" class="xy-detail-page__changes" header="变更对比">
        <div class="xy-detail-page__change-rows">
          <div
            v-for="item in visibleChanges"
            :key="item.key"
            class="xy-detail-page__change-row"
          >
            <div class="xy-detail-page__change-label">
              <span>{{ item.label }}</span>
              <xy-tag v-if="item.status" size="sm" :status="resolveDiffStatus(item.status)">
                {{ item.status }}
              </xy-tag>
            </div>
            <div class="xy-detail-page__change-value is-before">{{ item.before || "-" }}</div>
            <div class="xy-detail-page__change-value is-after">{{ item.after || "-" }}</div>
          </div>
        </div>
      </xy-card>

      <xy-card v-if="props.logs.length > 0" class="xy-detail-page__logs" header="操作日志">
        <xy-audit-timeline :items="props.logs" compact />
      </xy-card>
    </xy-async-state-container>
  </div>
</template>
