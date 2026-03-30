<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyAvatar, XyButton, XyEmpty, XyIcon, XyTag, XyTabs } from "@xiaoye/components";
import type { NoticeCenterAction, NoticeCenterProps } from "./notice-center";

defineOptions({
  name: "XyNoticeCenter"
});

const props = withDefaults(defineProps<NoticeCenterProps>(), {
  tabs: () => [],
  actions: () => [],
  maxHeight: 360,
  emptyText: "暂无消息",
  defaultTab: ""
});

const emit = defineEmits<{
  tabChange: [value: string];
  itemClick: [tabKey: string, itemKey: string];
  actionClick: [action: NoticeCenterAction];
}>();

const ns = useNamespace("notice-center");
const activeKey = ref(props.defaultTab || props.tabs[0]?.key || "");

const tabItems = computed(() =>
  props.tabs.map((tab) => ({
    key: tab.key,
    label: tab.label
  }))
);
const activeTab = computed(() => props.tabs.find((tab) => tab.key === activeKey.value) ?? props.tabs[0]);
const bodyStyle = computed(() => ({
  maxHeight: typeof props.maxHeight === "number" ? `${props.maxHeight}px` : props.maxHeight
}));

watch(
  () => props.defaultTab,
  (value) => {
    if (value) {
      activeKey.value = value;
    }
  }
);

watch(
  () => props.tabs,
  (tabs) => {
    if (!tabs.some((tab) => tab.key === activeKey.value)) {
      activeKey.value = props.defaultTab || tabs[0]?.key || "";
    }
  },
  {
    deep: true
  }
);

function handleTabChange(value: string) {
  activeKey.value = value;
  emit("tabChange", value);
}
</script>

<template>
  <section :class="ns.base.value">
    <xy-tabs
      :model-value="activeKey"
      :items="tabItems"
      type="card"
      @update:model-value="handleTabChange"
    />

    <div class="xy-notice-center__body" :style="bodyStyle">
      <ul v-if="activeTab?.items.length" class="xy-notice-center__list">
        <li
          v-for="item in activeTab.items"
          :key="item.key"
          :class="['xy-notice-center__item', item.read ? 'is-read' : '']"
          @click="emit('itemClick', activeTab.key, item.key)"
        >
          <xy-avatar v-if="item.avatar" :src="item.avatar" size="sm" class="xy-notice-center__avatar" />
          <div class="xy-notice-center__item-main">
            <div class="xy-notice-center__item-head">
              <strong>{{ item.title }}</strong>
              <xy-tag v-if="item.tag" :status="item.tagStatus ?? 'neutral'" size="sm">
                {{ item.tag }}
              </xy-tag>
            </div>
            <p v-if="item.content" class="xy-notice-center__item-content">{{ item.content }}</p>
            <small v-if="item.time" class="xy-notice-center__item-time">{{ item.time }}</small>
          </div>
        </li>
      </ul>
      <xy-empty v-else :description="props.emptyText" />
    </div>

    <div v-if="props.actions.length" class="xy-notice-center__footer">
      <xy-button
        v-for="action in props.actions"
        :key="action.key"
        text
        @click="emit('actionClick', action)"
      >
        <xy-icon v-if="action.icon" :icon="action.icon" />
        {{ action.label }}
      </xy-button>
    </div>
  </section>
</template>
