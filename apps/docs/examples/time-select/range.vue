<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  startAt: "09:00" as string | null,
  endAt: "10:30" as string | null
});
</script>

<template>
  <div class="xy-doc-stack">
    <div style="width: 420px; max-width: 100%">
      <xy-form :model="model" label-width="88px">
        <xy-form-item label="开始时间">
          <xy-time-select
            v-model="model.startAt"
            clearable
            end="21:00"
            step="00:30"
            :max-time="model.endAt ?? undefined"
          />
        </xy-form-item>
        <xy-form-item label="结束时间">
          <xy-time-select
            v-model="model.endAt"
            clearable
            start="09:00"
            end="22:00"
            step="00:30"
            include-end-time
            :min-time="model.startAt ?? undefined"
          />
        </xy-form-item>
      </xy-form>
    </div>

    <xy-space>
      <xy-tag status="warning">区间：{{ model.startAt ?? "未选" }} - {{ model.endAt ?? "未选" }}</xy-tag>
    </xy-space>
  </div>
</template>
