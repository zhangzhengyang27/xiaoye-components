<script setup lang="ts">
import { ref, computed } from 'vue'
import { XyCard, XyInput, XyMessage, XyTag } from 'xiaoye-components'

const searchText = ref('')
const copiedIcon = ref('')

const iconCategories = {
  interface: {
    name: '界面图标',
    icons: [
      'mdi:home', 'mdi:account', 'mdi:cog', 'mdi:dashboard', 'mdi:menu', 'mdi:search',
      'mdi:bell', 'mdi:settings', 'mdi:help-circle', 'mdi:information', 'mdi:alert',
      'mdi:close', 'mdi:check', 'mdi:plus', 'mdi:minus', 'mdi:edit', 'mdi:delete',
      'mdi:refresh', 'mdi:sync', 'mdi:upload', 'mdi:download', 'mdi:save', 'mdi:copy',
      'mdi:zoom-in', 'mdi:zoom-out', 'mdi:fullscreen', 'mdi:fullscreen-exit', 'mdi:maximize',
      'mdi:minimize', 'mdi:drag', 'mdi:filter', 'mdi:sort', 'mdi:grid', 'mdi:view-list'
    ]
  },
  action: {
    name: '操作图标',
    icons: [
      'mdi:play', 'mdi:pause', 'mdi:stop', 'mdi:skip-next', 'mdi:skip-previous',
      'mdi:skip-forward', 'mdi:skip-backward', 'mdi:rewind', 'mdi:fast-forward',
      'mdi:volume-high', 'mdi:volume-medium', 'mdi:volume-low', 'mdi:volume-off',
      'mdi:mic', 'mdi:camera', 'mdi:image', 'mdi:video', 'mdi:music', 'mdi:headphones',
      'mdi:print', 'mdi:share', 'mdi:send', 'mdi:reply', 'mdi:forward', 'mdi:attach',
      'mdi:link', 'mdi:unlink', 'mdi:eye', 'mdi:eye-off', 'mdi:lock', 'mdi:lock-open'
    ]
  },
  business: {
    name: '业务图标',
    icons: [
      'mdi:cart', 'mdi:shopping', 'mdi:store', 'mdi:cash', 'mdi:credit-card', 'mdi:wallet',
      'mdi:package', 'mdi:truck', 'mdi:plane', 'mdi:ship', 'mdi:road', 'mdi:map-marker',
      'mdi:phone', 'mdi:email', 'mdi:message', 'mdi:chat', 'mdi:forum', 'mdi:comment',
      'mdi:calendar', 'mdi:clock', 'mdi:alarm', 'mdi:timer', 'mdi:history', 'mdi:schedule',
      'mdi:folder', 'mdi:file', 'mdi:document', 'mdi:folder-open', 'mdi:file-multiple',
      'mdi:cloud', 'mdi:database', 'mdi:server', 'mdi:harddisk', 'mdi:laptop', 'mdi:monitor'
    ]
  },
  chart: {
    name: '图表图标',
    icons: [
      'mdi:chart-line', 'mdi:chart-bar', 'mdi:chart-pie', 'mdi:chart-donut', 'mdi:chart-areaspline',
      'mdi:chart-scatter-plot', 'mdi:chart-bubble', 'mdi:chart-timeline', 'mdi:chart-gantt',
      'mdi:trending-up', 'mdi:trending-down', 'mdi:trending-neutral', 'mdi:gauge', 'mdi:speedometer',
      'mdi:percent', 'mdi:calculator', 'mdi:function', 'mdi:sigma', 'mdi:chart-arc', 'mdi:chart-radar'
    ]
  },
  status: {
    name: '状态图标',
    icons: [
      'mdi:check-circle', 'mdi:close-circle', 'mdi:alert-circle', 'mdi:alert', 'mdi:information',
      'mdi:help-circle', 'mdi:exclamation', 'mdi:shield', 'mdi:shield-check', 'mdi:shield-alert',
      'mdi:shield-off', 'mdi:security', 'mdi:certificate', 'mdi:verified', 'mdi:thumb-up',
      'mdi:thumb-down', 'mdi:heart', 'mdi:star', 'mdi:bookmark', 'mdi:flag', 'mdi:pin',
      'mdi:tag', 'mdi:label', 'mdi:ticket', 'mdi:invoice', 'mdi:receipt', 'mdi:currency-usd'
    ]
  },
  social: {
    name: '社交图标',
    icons: [
      'mdi:facebook', 'mdi:twitter', 'mdi:instagram', 'mdi:linkedin', 'mdi:youtube', 'mdi:github',
      'mdi:gitlab', 'mdi:bitbucket', 'mdi:web', 'mdi:earth', 'mdi:translate', 'mdi:webhook',
      'mdi:api', 'mdi:code-tags', 'mdi:xml', 'mdi:json', 'mdi:html', 'mdi:css', 'mdi:javascript',
      'mdi:vuejs', 'mdi:react', 'mdi:nodejs', 'mdi:npm', 'mdi:yarn', 'mdi:git', 'mdi:gitlab'
    ]
  }
}

const filteredIcons = computed(() => {
  const result: Record<string, any> = {}
  
  for (const [key, category] of Object.entries(iconCategories)) {
    if (searchText.value) {
      const filtered = category.icons.filter(icon => 
        icon.toLowerCase().includes(searchText.value.toLowerCase())
      )
      if (filtered.length > 0) {
        result[key] = { name: category.name, icons: filtered }
      }
    } else {
      result[key] = category
    }
  }
  
  return result
})

async function copyIconName(iconName: string) {
  try {
    await navigator.clipboard.writeText(iconName)
    copiedIcon.value = iconName
    XyMessage.success(`已复制: ${iconName}`)
    setTimeout(() => {
      copiedIcon.value = ''
    }, 2000)
  } catch {
    XyMessage.error('复制失败')
  }
}

function getTotalCount() {
  return Object.values(iconCategories).reduce((sum, cat) => sum + cat.icons.length, 0)
}
</script>

<template>
  <div class="icon-gallery">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">图标库</h2>
          <p class="page-desc">基于 Material Design Icons，共 <strong>{{ getTotalCount() }}</strong> 个图标</p>
        </div>
        <div class="header-right">
          <XyInput
            v-model="searchText"
            placeholder="搜索图标..."
            :prefix-icon="'mdi:magnify'"
            clearable
            style="width: 280px"
          />
        </div>
      </div>
    </XyCard>
    
    <div v-for="(category, key) in filteredIcons" :key="key" class="icon-category">
      <XyCard>
        <template #title>
          <div class="category-title">
            <span>{{ category.name }}</span>
            <XyTag type="primary" size="small">{{ category.icons.length }}</XyTag>
          </div>
        </template>
        
        <div class="icon-grid">
          <div
            v-for="icon in category.icons"
            :key="icon"
            class="icon-item"
            :class="{ copied: copiedIcon === icon }"
            @click="copyIconName(icon)"
          >
            <div class="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <span class="icon-name">{{ icon.replace('mdi:', '') }}</span>
            <span class="icon-hint">{{ copiedIcon === icon ? '已复制!' : '点击复制' }}</span>
          </div>
        </div>
      </XyCard>
    </div>
    
    <XyCard v-if="Object.keys(filteredIcons).length === 0" class="empty-state">
      <div class="empty-content">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <h3>未找到匹配的图标</h3>
        <p>请尝试其他关键词</p>
      </div>
    </XyCard>
  </div>
</template>

<style lang="scss" scoped>
.icon-gallery {
  .page-header {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      
      .header-left {
        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px;
        }
        
        .page-desc {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          
          strong {
            color: #3b82f6;
          }
        }
      }
    }
  }
  
  .icon-category {
    margin-bottom: 20px;
    
    .category-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 12px;
      
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #f8fafc;
        border: 2px solid transparent;
        
        &:hover {
          background: #f1f5f9;
          border-color: #3b82f6;
          transform: translateY(-2px);
          
          .icon-hint {
            opacity: 1;
          }
        }
        
        &.copied {
          background: #ecfdf5;
          border-color: #10b981;
          
          .icon-wrapper {
            color: #10b981;
          }
        }
        
        .icon-wrapper {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }
        
        .icon-name {
          font-size: 11px;
          color: #64748b;
          text-align: center;
          word-break: break-word;
          margin-bottom: 4px;
        }
        
        .icon-hint {
          font-size: 10px;
          color: #94a3b8;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
      }
    }
  }
  
  .empty-state {
    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      
      svg {
        color: #cbd5e1;
        margin-bottom: 16px;
      }
      
      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #475569;
        margin: 0 0 8px;
      }
      
      p {
        font-size: 14px;
        color: #94a3b8;
        margin: 0;
      }
    }
  }
}
</style>
