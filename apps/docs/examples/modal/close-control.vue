<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const compactOpen = ref(false);
const guardEnabled = ref(true);

function beforeClose(done: (cancel?: boolean) => void) {
  if (guardEnabled.value) {
    done(true);
    return;
  }

  done();
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="open = true">带关闭拦截</xy-button>
      <xy-button plain @click="compactOpen = true">无头部弹窗</xy-button>
      <xy-switch v-model="guardEnabled" />
      <xy-tag :status="guardEnabled ? 'warning' : 'success'">
        {{ guardEnabled ? "已开启 beforeClose 拦截" : "允许关闭" }}
      </xy-tag>
    </xy-space>

    <xy-modal
      v-model="open"
      title="严格确认"
      :before-close="beforeClose"
      :lock-scroll="false"
    >
      <p>当 `before-close` 返回取消时，右上角关闭按钮和遮罩关闭都会被拦截。</p>
      <template #footer>
        <xy-space>
          <xy-button plain @click="guardEnabled = false">解除拦截</xy-button>
          <xy-button type="primary" @click="open = false">业务确认后关闭</xy-button>
        </xy-space>
      </template>
    </xy-modal>

    <xy-modal v-model="compactOpen" title="简化结构" :with-header="false" :show-close="false">
      <div class="xy-doc-stack">
        <strong>这个弹窗隐藏了默认头部和关闭按钮。</strong>
        <span>适合把头部结构完全交给内容区自己排版的强提示场景。</span>
      </div>

      <template #footer>
        <xy-button type="primary" @click="compactOpen = false">关闭</xy-button>
      </template>
    </xy-modal>
  </div>
</template>
