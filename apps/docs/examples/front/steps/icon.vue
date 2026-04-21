<template>
  <xyu-steps :active="1">
    <xyu-step title="步骤 1">
      <template #icon>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        </svg>
      </template>
    </xyu-step>
    <xyu-step title="步骤 2" />
    <xyu-step title="步骤 3" />
  </xyu-steps>
</template>
