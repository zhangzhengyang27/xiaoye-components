---
title: Headless 组合 API
description: 基于 Headless UI Vue 模式的组合式组件 API
outline: deep
---

# Headless 组合 API

基于 Headless UI Vue 交互模式的组合式组件 API，提供无样式或低样式的组件组合方式，支持灵活的样式定制和插槽模式。

## 设计理念

Headless 组合 API 将组件的交互逻辑与样式解耦：
- **无障碍**：完整的 ARIA 属性和键盘导航支持
- **可组合**：通过插槽和 slot props 实现灵活定制
- **可扩展**：样式完全由使用者控制

## 组合方式

### TransitionRoot / TransitionChild

多层嵌套过渡动画协调组件。

```vue
<script setup>
import { ref } from "vue";

const isOpen = ref(false);
</script>

<template>
  <xy-button @click="isOpen = true">打开</xy-button>

  <xy-transition-root :show="isOpen">
    <xy-transition-child
      enter="duration-300 ease-out"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="duration-200 ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <div class="overlay" />
    </xy-transition-child>

    <xy-transition-child
      enter="duration-300 ease-out"
      enter-from="opacity-0 scale-95"
      enter-to="opacity-100 scale-100"
    >
      <xy-dialog-panel class="modal">
        <h2>标题</h2>
        <p>内容...</p>
      </xy-dialog-panel>
    </xy-transition-child>
  </xy-transition-root>
</template>
```

### Dialog 分层组合

```vue
<script setup>
import { ref } from "vue";

const isOpen = ref(false);
</script>

<template>
  <xy-button @click="isOpen = true">打开 Dialog</xy-button>

  <xy-dialog-root :open="isOpen" @close="isOpen = false">
    <xy-transition-root :show="isOpen">
      <xy-transition-child class="overlay">
        <div class="fixed inset-0 bg-black/30" />
      </xy-transition-child>

      <xy-transition-child>
        <xy-dialog-panel class="modal">
          <xy-dialog-title>标题</xy-dialog-title>
          <xy-dialog-description>描述内容</xy-dialog-description>
          <slot />
        </xy-dialog-panel>
      </xy-transition-child>
    </xy-transition-root>
  </xy-dialog-root>
</template>
```

### Menu 分层组合

```vue
<script setup>
import { ref } from "vue";

const isOpen = ref(false);
</script>

<template>
  <xy-menu-root v-model:open="isOpen">
    <xy-menu-button>
      Options
      <xy-icon icon="mdi:chevron-down" />
    </xy-menu-button>

    <xy-menu-items>
      <xy-menu-item v-slot="{ active, disabled, close }">
        <button :class="{ 'bg-blue-500': active }" @click="close">
          Account settings
        </button>
      </xy-menu-item>
    </xy-menu-items>
  </xy-menu-root>
</template>
```

### Listbox 分层组合

```vue
<script setup>
import { ref } from "vue";

const selected = ref(null);
const people = ref([
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
  { id: 3, name: "王五" }
]);
</script>

<template>
  <xy-listbox-root v-model="selected" :options="people">
    <xy-listbox-button>{{ selected?.name || '选择人员' }}</xy-listbox-button>
    <xy-listbox-options>
      <xy-listbox-option
        v-for="person in people"
        :key="person.id"
        :value="person"
        v-slot="{ active, selected, disabled }"
      >
        <li :class="{ 'bg-blue-100': active }">
          {{ person.name }}
          <span v-if="selected">*</span>
        </li>
      </xy-listbox-option>
    </xy-listbox-options>
  </xy-listbox-root>
</template>
```

### Disclosure 分层组合

```vue
<template>
  <xy-disclosure-root>
    <xy-disclosure-button>
      What is your refund policy?
      <xy-icon icon="mdi:chevron-down" />
    </xy-disclosure-button>
    <xy-disclosure-panel v-slot="{ open }">
      <p :class="{ 'animate-in': open }">
        We'll refund you in full.
      </p>
    </xy-disclosure-panel>
  </xy-disclosure-root>
</template>
```

### Tabs 分层组合

```vue
<script setup>
import { ref } from "vue";

const selectedIndex = ref(0);
</script>

<template>
  <xy-tab-group v-model:selected-index="selectedIndex">
    <xy-tab-list>
      <xy-tab v-for="tab in tabs" :key="tab" v-slot="{ selected }">
        {{ tab }}
      </xy-tab>
    </xy-tab-list>

    <xy-tab-panels>
      <xy-tab-panel v-for="(tab, index) in tabs" :key="tab">
        {{ tab }} 的内容
      </xy-tab-panel>
    </xy-tab-panels>
  </xy-tab-group>
</template>
```

### Popover 分层组合

```vue
<template>
  <xy-popover-root v-slot="{ isOpen, toggle }">
    <xy-popover-button>Solutions</xy-popover-button>
    <xy-popover-panel v-if="isOpen">
      <xy-popover-heading>Heading</xy-popover-heading>
      <p>Content here</p>
    </xy-popover-panel>
  </xy-popover-root>
</template>
```

## 组件列表

| 组件 | 说明 |
| --- | --- |
| `TransitionRoot` / `TransitionChild` | 过渡动画协调 |
| `DialogRoot` / `DialogPanel` / `DialogTitle` / `DialogDescription` | 对话框分层组合 |
| `MenuRoot` / `MenuButton` / `MenuItems` / `MenuItem` | 菜单分层组合 |
| `ListboxRoot` / `ListboxButton` / `ListboxOptions` / `ListboxOption` | 列表框分层组合 |
| `ComboboxRoot` / `ComboboxInput` | 组合框（带搜索） |
| `DisclosureRoot` / `DisclosureButton` / `DisclosurePanel` | 折叠面板分层组合 |
| `RadioGroupRoot` / `RadioGroupLabel` / `RadioGroupOption` | 单选组分层组合 |
| `TabGroup` / `TabList` / `Tab` / `TabPanels` / `TabPanel` | 标签页分层组合 |
| `PopoverRoot` / `PopoverButton` / `PopoverPanel` / `PopoverHeading` | 浮层面板分层组合 |
| `SwitchGroup` / `SwitchLabel` / `SwitchDescription` | 开关分组组合 |
