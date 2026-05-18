<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { XyButton, XyInput, XyCheckbox, XyCard, XyIcon, XyMessage } from 'xiaoye-components'

const router = useRouter()
const appStore = useAppStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    XyMessage.error('请输入用户名和密码')
    return
  }
  
  loading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const success = appStore.login(username.value, password.value)
  
  if (success) {
    XyMessage.success('登录成功')
    router.push('/dashboard')
  } else {
    XyMessage.error('用户名或密码错误')
  }
  
  loading.value = false
}
</script>

<template>
  <div class="login-container">
    <div class="login-bg"></div>
    
    <div class="login-wrapper">
      <XyCard class="login-card">
        <div class="login-header">
          <div class="logo">
            <XyIcon icon="mdi:rocket" :size="48" />
          </div>
          <h1 class="title">Xiaoye Admin</h1>
          <p class="subtitle">欢迎回来，请登录您的账户</p>
        </div>
        
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-item">
            <label class="form-label">用户名</label>
            <XyInput
              v-model="username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="'mdi:account'"
            />
          </div>
          
          <div class="form-item">
            <label class="form-label">密码</label>
            <XyInput
              v-model="password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="'mdi:lock'"
            />
          </div>
          
          <div class="form-item form-row">
            <XyCheckbox v-model="rememberMe">记住我</XyCheckbox>
            <a href="#" class="forgot-password">忘记密码?</a>
          </div>
          
          <XyButton
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </XyButton>
        </form>
        
        <div class="login-footer">
          <span>没有账户?</span>
          <a href="#" class="register-link">立即注册</a>
        </div>
      </XyCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  
  .login-bg {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(120, 80, 200, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(90, 150, 255, 0.15) 0%, transparent 50%);
  }
}

.login-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  
  .login-header {
    text-align: center;
    padding: 40px 20px 30px;
    
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
      
      :deep(.xy-icon) {
        color: #fff;
      }
    }
    
    .title {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px;
    }
    
    .subtitle {
      font-size: 14px;
      color: #94a3b8;
      margin: 0;
    }
  }
  
  .login-form {
    padding: 0 30px 30px;
    
    .form-item {
      margin-bottom: 20px;
      
      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #334155;
        margin-bottom: 8px;
      }
      
      &.form-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .forgot-password {
          font-size: 13px;
          color: #3b82f6;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    
    .login-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .login-footer {
    padding: 20px 30px 30px;
    text-align: center;
    border-top: 1px solid #e2e8f0;
    
    span {
      font-size: 14px;
      color: #64748b;
    }
    
    .register-link {
      margin-left: 8px;
      font-size: 14px;
      color: #3b82f6;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
