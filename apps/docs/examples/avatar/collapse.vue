<template>
  <xy-avatar-group
    size="lg"
    :items="[
      { key: 'xiaoye', text: '叶' },
      { key: 'mavis', icon: 'mdi:account-outline' },
      { key: 'abby', text: 'AB' },
      { key: 'luna', text: '露' },
      { key: 'kai', icon: 'mdi:briefcase-account-outline' }
    ]"
    collapse-avatars
    collapse-avatars-tooltip
    :max-collapse-avatars="2"
  />
</template>
