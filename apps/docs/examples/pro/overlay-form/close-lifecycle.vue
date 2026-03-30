<script setup lang="ts">
import { defineComponent, h, onMounted, onUnmounted, reactive, ref } from "vue";

const resetOpen = ref(false);
const destroyOpen = ref(false);

const resetModel = reactive({
  remark: ""
});

const destroyModel = reactive({
  remark: ""
});

const resetStats = reactive({
  mounted: 0,
  unmounted: 0
});

const destroyStats = reactive({
  mounted: 0,
  unmounted: 0
});

function createLifecycleProbe(stats: { mounted: number; unmounted: number }) {
  return defineComponent({
    name: "OverlayFormLifecycleProbe",
    setup() {
      onMounted(() => {
        stats.mounted += 1;
      });

      onUnmounted(() => {
        stats.unmounted += 1;
      });

      return () =>
        h(
          "p",
          {
            style: "margin: 0; color: var(--xy-text-secondary); font-size: 13px;"
          },
          `内容已挂载 ${stats.mounted} 次，已卸载 ${stats.unmounted} 次`
        );
    }
  });
}

const ResetProbe = createLifecycleProbe(resetStats);
const DestroyProbe = createLifecycleProbe(destroyStats);
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="关闭生命周期对照">
      <p>`resetOnClose` 只负责重置字段与校验态，不卸载内容节点。</p>
      <p>`destroyOnClose` 会在关闭后卸载内容，下次打开重新挂载。</p>
    </xy-card>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
      "
    >
      <xy-card header="仅 resetOnClose">
        <xy-space direction="vertical" fill>
          <xy-button type="primary" @click="resetOpen = true">打开重置型表单</xy-button>
          <xy-text type="secondary">
            挂载 {{ resetStats.mounted }} 次，卸载 {{ resetStats.unmounted }} 次
          </xy-text>
        </xy-space>
      </xy-card>

      <xy-card header="resetOnClose + destroyOnClose">
        <xy-space direction="vertical" fill>
          <xy-button type="primary" @click="destroyOpen = true">打开卸载型表单</xy-button>
          <xy-text type="secondary">
            挂载 {{ destroyStats.mounted }} 次，卸载 {{ destroyStats.unmounted }} 次
          </xy-text>
        </xy-space>
      </xy-card>
    </div>

    <xy-overlay-form
      v-model:open="resetOpen"
      title="关闭后仅重置"
      :model="resetModel"
      reset-on-close
    >
      <xy-form-item label="补充说明" prop="remark">
        <xy-input v-model="resetModel.remark" type="textarea" placeholder="输入后关闭再打开观察行为" />
      </xy-form-item>
      <reset-probe />
    </xy-overlay-form>

    <xy-overlay-form
      v-model:open="destroyOpen"
      title="关闭后卸载并重建"
      :model="destroyModel"
      reset-on-close
      destroy-on-close
    >
      <xy-form-item label="补充说明" prop="remark">
        <xy-input
          v-model="destroyModel.remark"
          type="textarea"
          placeholder="关闭后再次打开会重新挂载内容"
        />
      </xy-form-item>
      <destroy-probe />
    </xy-overlay-form>
  </div>
</template>
