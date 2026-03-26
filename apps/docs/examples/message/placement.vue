<script setup lang="ts">
import { XyMessage } from "xiaoye-components";
import type { MessagePlacement } from "xiaoye-components";

const placements: MessagePlacement[] = [
  "top-left",
  "top",
  "top-right",
  "bottom-left",
  "bottom",
  "bottom-right"
];

function openPlacementMessage(placement: MessagePlacement) {
  XyMessage({
    message: `当前 placement 为 ${placement}。`,
    placement,
    duration: 1800
  });
}
</script>

<template>
  <xy-space wrap>
    <xy-button
      v-for="placement in placements"
      :key="placement"
      plain
      @click="openPlacementMessage(placement)"
    >
      {{ placement }}
    </xy-button>
  </xy-space>
</template>
