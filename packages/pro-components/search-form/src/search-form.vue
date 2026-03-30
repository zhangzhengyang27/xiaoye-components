<script setup lang="ts">
import { computed, ref, toRaw, watch, useSlots, type Component } from "vue";
import { useNamespace } from "@xiaoye/composables";
import {
  XyAvatar,
  XyButton,
  XyCascader,
  XyCheckbox,
  XyCheckboxGroup,
  XyDatePicker,
  XyForm,
  XyFormItem,
  XyImage,
  XyInput,
  XyInputNumber,
  XyProgress,
  XyRadioGroup,
  XySelect,
  XySwitch,
  XyTag,
  XyTimePicker,
  XyTimeSelect,
  XyTimeline,
  XyTransfer,
  XyTree,
  XySteps
} from "@xiaoye/components";
import type { SearchFormField, SearchFormProps } from "./search-form";

defineOptions({
  name: "XySearchForm"
});

type FormExpose = {
  validate: () => Promise<boolean>;
  resetFields: () => void;
  clearValidate: () => void;
};

const props = withDefaults(defineProps<SearchFormProps>(), {
  rules: () => ({}),
  labelWidth: "96px",
  labelPosition: "left",
  size: "md",
  columns: 3,
  collapsed: undefined,
  defaultCollapsed: true,
  submitText: "查询",
  resetText: "重置",
  expandText: "展开更多",
  collapseText: "收起筛选",
  showSubmit: true,
  showReset: true,
  submitOnReset: true,
  validateOnSearch: false
});

const emit = defineEmits<{
  search: [payload: Record<string, unknown>];
  reset: [payload: Record<string, unknown>];
  "update:collapsed": [value: boolean];
  "collapse-change": [value: boolean];
}>();

const slots = useSlots() as Record<string, ((payload: unknown) => unknown) | undefined>;
const ns = useNamespace("search-form");
const formRef = ref<FormExpose | null>(null);
const innerCollapsed = ref(props.defaultCollapsed);
const builtInComponentMap: Record<string, Component> = {
  input: XyInput,
  select: XySelect,
  checkbox: XyCheckbox,
  "checkbox-group": XyCheckboxGroup,
  radio: XyRadioGroup,
  "radio-button": XyRadioGroup,
  "radio-group": XyRadioGroup,
  cascader: XyCascader,
  "date-picker": XyDatePicker,
  "time-picker": XyTimePicker,
  "time-select": XyTimeSelect,
  "input-number": XyInputNumber,
  switch: XySwitch,
  transfer: XyTransfer,
  avatar: XyAvatar,
  image: XyImage,
  progress: XyProgress,
  tag: XyTag,
  timeline: XyTimeline,
  tree: XyTree,
  steps: XySteps
};

const normalizedColumns = computed(() => Math.max(1, Math.floor(props.columns)));
const isCollapsedControlled = computed(() => typeof props.collapsed === "boolean");
const collapsedBridge = computed(() => props.collapsed ?? innerCollapsed.value);
const visibleFields = computed(() =>
  props.fields.filter((field) => {
    const hidden = typeof field.hidden === "function" ? field.hidden(props.model) : field.hidden;

    if (hidden) {
      return false;
    }

    return !(collapsedBridge.value && field.collapsible);
  })
);
const collapsibleFieldCount = computed(
  () =>
    props.fields.filter((field) => {
      const hidden = typeof field.hidden === "function" ? field.hidden(props.model) : field.hidden;
      return !hidden && field.collapsible;
    }).length
);
const showCollapseToggle = computed(() => collapsibleFieldCount.value > 0);
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${normalizedColumns.value}, minmax(0, 1fr))`
}));

watch(
  () => props.collapsed,
  (value) => {
    if (typeof value === "boolean") {
      innerCollapsed.value = value;
    }
  }
);

function cloneModelValue(value: Record<string, unknown>) {
  const rawValue = toRaw(value);

  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(rawValue);
  }

  return JSON.parse(JSON.stringify(rawValue)) as Record<string, unknown>;
}

function updateModelValue(prop: string, value: unknown) {
  const model = props.model as Record<string, unknown>;
  model[prop] = value;
}

function resolveFieldComponent(field: SearchFormField) {
  if (!field.component) {
    return XyInput;
  }

  if (typeof field.component === "string") {
    return builtInComponentMap[field.component] ?? XyInput;
  }

  return field.component;
}

function resolveFieldSlotName(field: SearchFormField) {
  return field.slot ?? field.prop;
}

function resolveFieldPlaceholder(field: SearchFormField) {
  if (field.placeholder) {
    return field.placeholder;
  }

  if (field.componentProps?.placeholder !== undefined) {
    return field.componentProps.placeholder;
  }

  const componentName =
    typeof field.component === "string" ? field.component : field.component ? "custom" : "input";
  const selectLike = ["select", "date-picker", "time-picker", "time-select"].includes(componentName);

  return `${selectLike ? "请选择" : "请输入"}${field.label}`;
}

function resolveFieldProps(field: SearchFormField) {
  const componentName =
    typeof field.component === "string" ? field.component : field.component ? "custom" : "input";
  const nextProps = {
    ...field.componentProps,
    placeholder: resolveFieldPlaceholder(field)
  } as Record<string, unknown>;

  if (
    componentName === "select" ||
    componentName === "checkbox-group" ||
    componentName === "radio-group"
  ) {
    nextProps.options = field.options ?? [];
  }

  if (componentName === "radio-button") {
    nextProps.options = field.options ?? [];
    nextProps.type = "button";
  }

  return nextProps;
}

function resolveFieldBindings(field: SearchFormField) {
  return {
    modelValue: props.model[field.prop],
    "onUpdate:modelValue": (value: unknown) => {
      updateModelValue(field.prop, value);
    }
  };
}

function resolveFieldDisabled(field: SearchFormField) {
  return typeof field.disabled === "function" ? field.disabled(props.model) : field.disabled;
}

function isInputEnterSubmitEnabled(field: SearchFormField) {
  const componentName =
    typeof field.component === "string" ? field.component : field.component ? "custom" : "input";

  if (componentName !== "input") {
    return false;
  }

  return field.componentProps?.type !== "textarea";
}

function createFieldKeydownHandler(field: SearchFormField) {
  const originalHandler = field.componentProps?.onKeydown;

  return (event: KeyboardEvent) => {
    if (typeof originalHandler === "function") {
      originalHandler(event);
    }

    if (!isInputEnterSubmitEnabled(field) || event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    void submit();
  };
}

function resolveFieldRenderProps(field: SearchFormField) {
  const disabled = resolveFieldDisabled(field);

  return {
    ...resolveFieldProps(field),
    ...(disabled !== undefined
      ? {
          disabled
        }
      : {}),
    ...resolveFieldBindings(field),
    ...(isInputEnterSubmitEnabled(field)
      ? {
          onKeydown: createFieldKeydownHandler(field)
        }
      : {})
  };
}

function resolveFieldSpan(field: SearchFormField) {
  if (!field.span) {
    return 1;
  }

  return Math.max(1, Math.min(normalizedColumns.value, Math.floor(field.span)));
}

function getFieldSlotProps(field: SearchFormField) {
  return {
    field,
    model: props.model,
    value: props.model[field.prop],
    update: (value: unknown) => {
      updateModelValue(field.prop, value);
    }
  };
}

function updateCollapsed(nextValue: boolean) {
  if (!isCollapsedControlled.value) {
    innerCollapsed.value = nextValue;
  }

  emit("update:collapsed", nextValue);
  emit("collapse-change", nextValue);
}

async function submit() {
  if (props.validateOnSearch) {
    const valid = await formRef.value?.validate();

    if (!valid) {
      return false;
    }
  }

  emit("search", cloneModelValue(props.model));
  return true;
}

function reset() {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();

  const payload = cloneModelValue(props.model);
  emit("reset", payload);

  if (props.submitOnReset) {
    emit("search", payload);
  }
}

function toggleCollapse(force?: boolean) {
  updateCollapsed(force ?? !collapsedBridge.value);
}

defineExpose({
  validate: () => formRef.value?.validate() ?? Promise.resolve(true),
  submit,
  reset,
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: () => formRef.value?.clearValidate(),
  toggleCollapse
});
</script>

<template>
  <xy-form
    ref="formRef"
    :model="props.model"
    :rules="props.rules"
    :label-width="props.labelWidth"
    :label-position="props.labelPosition"
    :size="props.size"
    :class="ns.base.value"
  >
    <div class="xy-search-form__grid" :style="gridStyle">
      <div
        v-for="field in visibleFields"
        :key="field.prop"
        class="xy-search-form__field"
        :style="{ gridColumn: `span ${resolveFieldSpan(field)}` }"
      >
        <xy-form-item
          :label="field.label"
          :prop="field.prop"
          :rules="field.rules"
          :required="field.required"
          :help="field.help"
        >
          <slot
            v-if="slots[resolveFieldSlotName(field)]"
            :name="resolveFieldSlotName(field)"
            v-bind="getFieldSlotProps(field)"
          />
          <component
            :is="resolveFieldComponent(field)"
            v-else
            v-bind="resolveFieldRenderProps(field)"
          />
        </xy-form-item>
      </div>
    </div>
    <div class="xy-search-form__actions">
      <div class="xy-search-form__meta">
        <slot
          name="meta"
          :collapsed="collapsedBridge"
          :hidden-count="collapsibleFieldCount"
        />
      </div>
      <div class="xy-search-form__actions-main">
        <slot
          name="actions"
          :collapsed="collapsedBridge"
          :toggle-collapse="toggleCollapse"
          :reset="reset"
          :submit="submit"
        >
          <xy-button
            v-if="showCollapseToggle"
            class="xy-search-form__toggle"
            text
            @click="toggleCollapse()"
          >
            {{ collapsedBridge ? props.expandText : props.collapseText }}
          </xy-button>
          <xy-button v-if="props.showReset" @click="reset">
            {{ props.resetText }}
          </xy-button>
          <xy-button v-if="props.showSubmit" type="primary" @click="submit">
            {{ props.submitText }}
          </xy-button>
        </slot>
      </div>
    </div>
  </xy-form>
</template>
