<template>
  <xyu-space direction="vertical" style="width: 100%">
    <xyu-input placeholder="搜索内容...">
      <template #prefix>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </template>
    </xyu-input>
    <xyu-input placeholder="输入用户名">
      <template #suffix>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </template>
    </xyu-input>
    <xyu-input prefix-text="https://" suffix-text=".com" placeholder="输入域名" />
  </xyu-space>
</template>
