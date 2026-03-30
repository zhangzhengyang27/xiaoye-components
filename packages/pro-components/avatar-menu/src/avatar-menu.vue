<script setup lang="ts">
import { computed } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyAvatar, XyDropdown } from "@xiaoye/components";
import type { DropdownSelectItem } from "@xiaoye/components";
import type { AvatarMenuCommand, AvatarMenuProps } from "./avatar-menu";

defineOptions({
  name: "XyAvatarMenu"
});

const props = withDefaults(defineProps<AvatarMenuProps>(), {
  username: "",
  description: "",
  items: () => [],
  dropdownProps: () => ({}),
  avatarProps: () => ({})
});

const emit = defineEmits<{
  command: [command: AvatarMenuCommand];
  select: [item: DropdownSelectItem];
}>();

const ns = useNamespace("avatar-menu");
const initials = computed(() => props.username.trim().slice(0, 1).toUpperCase());

function handleCommand(command: AvatarMenuCommand) {
  emit("command", command);
}

function handleSelect(item: DropdownSelectItem) {
  emit("select", item);
}
</script>

<template>
  <xy-dropdown
    :items="props.items"
    trigger="click"
    v-bind="props.dropdownProps"
    @command="handleCommand"
    @select="handleSelect"
  >
    <button type="button" :class="ns.base.value">
      <xy-avatar v-bind="props.avatarProps">
        {{ initials }}
      </xy-avatar>
      <span v-if="props.username || props.description" class="xy-avatar-menu__meta">
        <strong v-if="props.username" class="xy-avatar-menu__name">{{ props.username }}</strong>
        <small v-if="props.description" class="xy-avatar-menu__description">
          {{ props.description }}
        </small>
      </span>
    </button>
  </xy-dropdown>
</template>
