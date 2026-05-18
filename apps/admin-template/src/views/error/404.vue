<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { XyButton } from 'xiaoye-components'

const router = useRouter()
const countdown = ref(5)
let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      router.push('/')
    }
  }, 1000)
})

function goHome() {
  if (timer) clearInterval(timer)
  router.push('/')
}

function goBack() {
  if (timer) clearInterval(timer)
  router.back()
}
</script>

<template>
  <div class="error-page error-404">
    <div class="error-content">
      <div class="error-icon">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
          <path d="M9 9H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="9" cy="11" r="1" fill="currentColor"/>
          <circle cx="15" cy="11" r="1" fill="currentColor"/>
          <path d="M12 17V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M8 8L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-desc">
        抱歉，您访问的页面不存在或已被移除<br/>
        请检查 URL 是否正确，或通过以下方式继续操作
      </p>
      
      <div class="error-actions">
        <XyButton type="primary" size="large" @click="goHome">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          返回首页
        </XyButton>
        <XyButton size="large" @click="goBack">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          返回上一页
        </XyButton>
      </div>
      
      <p class="auto-redirect">
        <span>{{ countdown }}</span> 秒后自动返回首页
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  
  .error-content {
    text-align: center;
    max-width: 600px;
    
    .error-icon {
      margin-bottom: 24px;
      color: rgba(255, 255, 255, 0.9);
      
      svg {
        filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15));
      }
    }
    
    .error-code {
      font-size: 120px;
      font-weight: 800;
      color: #fff;
      margin: 0;
      line-height: 1;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    .error-title {
      font-size: 32px;
      font-weight: 600;
      color: #fff;
      margin: 16px 0;
    }
    
    .error-desc {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      margin: 0 0 40px;
    }
    
    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 24px;
      
      button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 28px;
        font-size: 15px;
        border-radius: 10px;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
        }
      }
    }
    
    .auto-redirect {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      
      span {
        font-weight: 600;
        color: #fff;
      }
    }
  }
}

.error-404 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

@media (max-width: 768px) {
  .error-page {
    .error-content {
      .error-code {
        font-size: 80px;
      }
      
      .error-title {
        font-size: 24px;
      }
      
      .error-desc {
        font-size: 14px;
      }
      
      .error-actions {
        flex-direction: column;
        
        button {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }
}
</style>
