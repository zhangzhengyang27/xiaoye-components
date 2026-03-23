<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  role: "owner"
});
</script>

<template>
  <xy-form :model="model" label-width="88px">
    <xy-form-item label="协作角色" prop="role" help="border 适合更强调点击区域的设置面板。">
      <xy-radio-group v-model="model.role">
        <xy-radio value="owner" border>Owner</xy-radio>
        <xy-radio value="maintainer" border>Maintainer</xy-radio>
        <xy-radio value="viewer" border disabled>Viewer</xy-radio>
      </xy-radio-group>
    </xy-form-item>
  </xy-form>
</template>
