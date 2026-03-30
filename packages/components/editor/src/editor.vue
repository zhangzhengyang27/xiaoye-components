<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { useNamespace } from "@xiaoye/composables";
import type { EditorProps } from "./editor";

defineOptions({
  name: "XyEditor"
});

const props = withDefaults(defineProps<EditorProps>(), {
  modelValue: "",
  options: () => ({}),
  placeholder: "",
  height: "auto",
  minHeight: 360,
  disabled: false
});

const emit = defineEmits(["update:modelValue", "init", "ready", "focus", "blur"]);

const ns = useNamespace("editor");
const rootRef = ref<HTMLDivElement | null>(null);
const editorRef = ref<Vditor | null>(null);
const cacheId = `xy-editor-${Math.random().toString(36).slice(2, 10)}`;

const rootStyle = computed(() => ({
  minHeight: typeof props.minHeight === "number" ? `${props.minHeight}px` : props.minHeight,
  height: typeof props.height === "number" ? `${props.height}px` : props.height
}));

function createOptions() {
  return {
    cache: {
      enable: false,
      id: cacheId
    },
    minHeight: typeof props.minHeight === "number" ? props.minHeight : Number(props.minHeight) || 360,
    height: props.height,
    placeholder: props.placeholder,
    value: props.modelValue,
    after: () => {
      queueMicrotask(() => {
        if (props.disabled) {
          editorRef.value?.disabled();
        }
        if (props.modelValue && editorRef.value?.getValue() !== props.modelValue) {
          editorRef.value?.setValue(props.modelValue, true);
        }
        if (editorRef.value) {
          const editor = editorRef.value;
          emit("init", editor);
          emit("ready", editor);
        }
      });
    },
    input: (value: string) => {
      emit("update:modelValue", value);
    },
    focus: () => {
      emit("focus");
    },
    blur: (value: string) => {
      emit("blur", value);
    },
    ...props.options
  };
}

function createEditor() {
  if (!rootRef.value) {
    return;
  }

  editorRef.value?.destroy();
  editorRef.value = new Vditor(rootRef.value, createOptions());
}

function getValue() {
  return editorRef.value?.getValue() ?? "";
}

function setValue(value: string, clearStack = false) {
  editorRef.value?.setValue(value, clearStack);
}

function focus() {
  editorRef.value?.focus();
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editorRef.value) {
      return;
    }

    if (value === editorRef.value.getValue()) {
      return;
    }

    editorRef.value.setValue(value, true);
  }
);

watch(
  () => props.disabled,
  (disabled) => {
    if (!editorRef.value) {
      return;
    }

    if (disabled) {
      editorRef.value.disabled();
      return;
    }

    editorRef.value.enable();
  }
);

watch(
  () => [props.options, props.height, props.minHeight, props.placeholder] as const,
  async () => {
    await nextTick();
    createEditor();
  },
  {
    deep: true
  }
);

onMounted(() => {
  createEditor();
});

onBeforeUnmount(() => {
  editorRef.value?.destroy();
  editorRef.value = null;
});

defineExpose({
  editor: editorRef,
  getValue,
  setValue,
  focus
});
</script>

<template>
  <div :class="ns.base.value" :style="rootStyle">
    <div ref="rootRef" class="xy-editor__surface" />
  </div>
</template>
