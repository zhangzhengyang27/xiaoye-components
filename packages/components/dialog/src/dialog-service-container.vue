<script setup lang="ts">
import { computed, defineComponent, provide, ref, watch } from "vue";
import type { DialogCloseReason } from "./dialog";
import type { PropType, VNodeChild } from "vue";
import { XyButton } from "../../button";
import Dialog from "./dialog.vue";
import DialogServicePrompt from "./dialog-service-prompt.vue";
import {
  DEFAULT_NAMESPACE,
  DEFAULT_SIZE,
  DEFAULT_Z_INDEX,
  configProviderKey,
  getGlobalDialogConfig,
  getGlobalLoadingConfig,
  getGlobalMessageConfig,
  getGlobalNotificationConfig
} from "../../config-provider/src/context";
import {
  dialogServiceState,
  finishDialogServiceEntry,
  requestCloseDialogServiceEntry,
  setDialogServiceEntryPendingAction
} from "./service-state";
import type {
  DialogServiceAction,
  DialogServiceActionContext,
  DialogServiceFooterContext
} from "./dialog-service";

const RenderVNode = defineComponent({
  name: "DialogServiceRenderVNode",
  props: {
    renderer: {
      type: Function as PropType<(() => VNodeChild) | undefined>,
      default: undefined
    }
  },
  setup(props) {
    return () => props.renderer?.() ?? null;
  }
});

const currentEntry = computed(() => dialogServiceState.current);
const globalDialogConfig = computed(() => getGlobalDialogConfig().value);
const globalLoadingConfig = computed(() => getGlobalLoadingConfig().value);
const globalMessageConfig = computed(() => getGlobalMessageConfig().value);
const globalNotificationConfig = computed(() => getGlobalNotificationConfig().value);
const dialogProps = computed(() => ({
  ...(globalDialogConfig.value ?? {}),
  ...(currentEntry.value?.dialogProps ?? {})
}));
const lastRenderedEntryId = ref<string | null>(null);

provide(configProviderKey, {
  namespace: computed(() => DEFAULT_NAMESPACE),
  locale: computed(() => ({})),
  zIndex: computed(() => DEFAULT_Z_INDEX),
  size: computed(() => DEFAULT_SIZE),
  dialog: globalDialogConfig,
  loading: globalLoadingConfig,
  message: globalMessageConfig,
  notification: globalNotificationConfig
});

watch(
  currentEntry,
  (entry) => {
    if (entry) {
      lastRenderedEntryId.value = entry.id;
    }
  },
  {
    immediate: true
  }
);

function closeCurrent(action: DialogServiceAction = "programmatic") {
  if (!currentEntry.value) {
    return;
  }

  requestCloseDialogServiceEntry(currentEntry.value.id, action);
}

function buildActionContext(action: DialogServiceAction): DialogServiceActionContext | null {
  if (!currentEntry.value) {
    return null;
  }

  return {
    id: currentEntry.value.id,
    action,
    value: currentEntry.value.promptValue,
    close: closeCurrent
  };
}

async function handleConfirm() {
  if (!currentEntry.value || currentEntry.value.confirming) {
    return;
  }

  currentEntry.value.confirming = true;
  currentEntry.value.promptError = "";

  try {
    if (currentEntry.value.mode === "prompt" && currentEntry.value.inputValidator) {
      const validation = await currentEntry.value.inputValidator(currentEntry.value.promptValue);

      if (typeof validation === "string" && validation) {
        currentEntry.value.promptError = validation;
        return;
      }
    }

    const context = buildActionContext("confirm");

    if (context && currentEntry.value.beforeConfirm) {
      await currentEntry.value.beforeConfirm(context);
    }

    closeCurrent("confirm");
  } finally {
    if (currentEntry.value) {
      currentEntry.value.confirming = false;
    }
  }
}

async function handleCancel() {
  if (!currentEntry.value || currentEntry.value.cancelling) {
    return;
  }

  currentEntry.value.cancelling = true;

  try {
    const context = buildActionContext("cancel");

    if (context && currentEntry.value.beforeCancel) {
      await currentEntry.value.beforeCancel(context);
    }

    closeCurrent("cancel");
  } finally {
    if (currentEntry.value) {
      currentEntry.value.cancelling = false;
    }
  }
}

function handlePromptValueUpdate(value: string) {
  if (!currentEntry.value) {
    return;
  }

  currentEntry.value.promptValue = value;
  currentEntry.value.promptError = "";
}

function handleClosed() {
  const entryId = currentEntry.value?.id ?? lastRenderedEntryId.value;

  if (!entryId) {
    return;
  }

  finishDialogServiceEntry(entryId);
}

const footerContext = computed<DialogServiceFooterContext | null>(() => {
  if (!currentEntry.value) {
    return null;
  }

  return {
    id: currentEntry.value.id,
    action: currentEntry.value.pendingAction,
    value: currentEntry.value.promptValue,
    close: closeCurrent,
    confirm: handleConfirm,
    cancel: handleCancel,
    confirming: currentEntry.value.confirming,
    cancelling: currentEntry.value.cancelling,
    promptError: currentEntry.value.promptError,
    setPromptValue: (value: string) => {
      if (!currentEntry.value) {
        return;
      }

      currentEntry.value.promptValue = value;
      currentEntry.value.promptError = "";
    }
  };
});

function handleBeforeClose(done: (cancel?: boolean) => void, reason?: string) {
  const entry = currentEntry.value;

  if (!entry) {
    done();
    return;
  }

  const closeReason = (reason ?? "close") as DialogCloseReason;

  setDialogServiceEntryPendingAction(entry, closeReason);

  const userBeforeClose = entry.dialogProps?.beforeClose;

  if (!userBeforeClose) {
    done();
    return;
  }

  userBeforeClose((cancel?: boolean) => {
    if (cancel) {
      entry.pendingAction = "programmatic";
    }
    done(cancel);
  }, closeReason);
}

const hasBodyRenderer = computed(() => Boolean(currentEntry.value?.render));
const hasFooterRenderer = computed(() =>
  Boolean(currentEntry.value?.footerRender && footerContext.value)
);

function bodyRenderer(): VNodeChild {
  return currentEntry.value?.render?.() ?? null;
}

function footerRenderer(): VNodeChild {
  const entry = currentEntry.value;
  const context = footerContext.value;

  if (!entry?.footerRender || !context) {
    return null;
  }

  return entry.footerRender(context);
}
</script>

<template>
  <Dialog
    v-if="currentEntry"
    :model-value="currentEntry.visible"
    v-bind="dialogProps"
    :title="currentEntry.title"
    :before-close="handleBeforeClose"
    @closed="handleClosed"
  >
    <DialogServicePrompt
      v-if="currentEntry.mode === 'prompt'"
      :model-value="currentEntry.promptValue"
      :message="currentEntry.message"
      :placeholder="currentEntry.inputPlaceholder"
      :input-type="currentEntry.inputType"
      :input-props="currentEntry.inputProps"
      :error="currentEntry.promptError"
      @update:model-value="handlePromptValueUpdate"
    />
    <component
      :is="currentEntry.component"
      v-else-if="currentEntry.component"
      v-bind="currentEntry.componentProps ?? {}"
    />
    <RenderVNode
      v-else-if="hasBodyRenderer"
      :renderer="bodyRenderer"
    />
    <template v-else>{{ currentEntry.message }}</template>

    <template #footer>
      <RenderVNode
        v-if="hasFooterRenderer"
        :renderer="footerRenderer"
      />
      <template v-if="!currentEntry.footerRender && footerContext">
        <xy-button
          v-if="currentEntry.showCancelButton"
          plain
          :loading="currentEntry.cancelling"
          v-bind="currentEntry.cancelButtonProps"
          @click="handleCancel"
        >
          {{ currentEntry.cancelButtonText }}
        </xy-button>
        <xy-button
          type="primary"
          :loading="currentEntry.confirming"
          v-bind="currentEntry.confirmButtonProps"
          @click="handleConfirm"
        >
          {{ currentEntry.confirmButtonText }}
        </xy-button>
      </template>
    </template>
  </Dialog>
</template>
