<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { XyButton, XyInput, XyCheckbox, XyIcon, XyMessage } from 'xiaoye-components'

const router = useRouter()
const appStore = useAppStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const cardRef = ref<HTMLElement | null>(null)

// 鼠标位置状态
const mousePosition = ref({ x: 0, y: 0 })

// 测试账号数据
const testAccounts = [
  { label: '管理员', username: 'admin', password: '123456', role: 'admin' },
  { label: '普通用户', username: 'user', password: 'user123', role: 'user' },
  { label: '访客', username: 'guest', password: 'guest123', role: 'guest' }
]

function fillTestAccount(account: typeof testAccounts[0]) {
  username.value = account.username
  password.value = account.password
}

function handleMouseMove(e: MouseEvent) {
  if (!cardRef.value) return
  
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const rotateX = (y - centerY) / 80
  const rotateY = (centerX - x) / 80
  
  cardRef.value.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

function handleMouseLeave() {
  if (cardRef.value) {
    cardRef.value.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
  }
}

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
    <!-- 背景装饰层 -->
    <div class="login-bg">
      <!-- 动态网格 -->
      <div class="bg-grid"></div>

      <!-- 浮动光球 -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <!-- 扫描线 -->
      <div class="scanline"></div>

      <!-- 噪点纹理 -->
      <div class="noise-overlay"></div>
    </div>

    <!-- 左侧品牌区 -->
    <div class="brand-panel">
      <div class="brand-content">
        <div class="brand-logo">
          <div class="logo-hex">
            <XyIcon icon="mdi:hexagon-slice-6" :size="36" />
          </div>
        </div>
        <h1 class="brand-name">XIAOYE</h1>
        <p class="brand-tagline">ADMIN SYSTEM</p>

        <div class="brand-features">
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>高效的数据管理</span>
          </div>
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>灵活的权限控制</span>
          </div>
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>实时的监控预警</span>
          </div>
        </div>
      </div>

      <div class="brand-decoration">
        <div class="deco-ring ring-1"></div>
        <div class="deco-ring ring-2"></div>
        <div class="deco-ring ring-3"></div>
      </div>
    </div>

    <!-- 登录表单区 -->
    <div class="form-panel">
      <div class="login-wrapper">
        <div
          ref="cardRef"
          class="login-card"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        >
          <div class="card-body">
            <div class="login-header">
              <h2 class="login-title">欢迎回来</h2>
              <p class="login-subtitle">请登录您的账户以继续</p>
            </div>

            <!-- 测试账号快捷入口 -->
            <div class="test-accounts">
              <p class="test-accounts-label">
                <XyIcon icon="mdi:lightning-bolt" :size="14" />
                快速填充测试账号
              </p>
              <div class="test-accounts-list">
                <button
                  v-for="account in testAccounts"
                  :key="account.role"
                  type="button"
                  class="test-account-btn"
                  :class="`role-${account.role}`"
                  @click="fillTestAccount(account)"
                >
                  <span class="account-role">{{ account.label }}</span>
                  <span class="account-cred">{{ account.username }}</span>
                </button>
              </div>
            </div>

            <form class="login-form" @submit.prevent="handleLogin">
              <!-- 用户名输入框 -->
              <div class="input-group" :class="{ 'is-focused': username.length > 0 }">
                <div class="input-icon">
                  <XyIcon :icon="username.length > 0 ? 'mdi:account' : 'mdi:account-outline'" :size="18" />
                </div>
                <input
                  v-model="username"
                  type="text"
                  class="custom-input"
                  placeholder="请输入用户名"
                  autocomplete="username"
                />
              </div>

              <!-- 密码输入框 -->
              <div class="input-group" :class="{ 'is-focused': password.length > 0 }">
                <div class="input-icon">
                  <XyIcon :icon="password.length > 0 ? 'mdi:lock' : 'mdi:lock-outline'" :size="18" />
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="custom-input"
                  placeholder="请输入密码"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <XyIcon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" :size="18" />
                </button>
              </div>

              <!-- 记住我和忘记密码 -->
              <div class="form-options">
                <XyCheckbox v-model="rememberMe">记住我</XyCheckbox>
                <a href="#" class="forgot-link">忘记密码?</a>
              </div>

              <XyButton
                type="primary"
                size="large"
                class="login-btn"
                :loading="loading"
                @click="handleLogin"
              >
                <template v-if="!loading">
                  <XyIcon icon="mdi:login" :size="18" />
                  登 录
                </template>
                <template v-else>
                  登录中...
                </template>
              </XyButton>
            </form>

            <div class="login-footer">
              <span class="footer-text">没有账户?</span>
              <a href="#" class="register-link">立即注册</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  position: relative;
  background: #060912;
  overflow: hidden;
}

// ============ 背景层 ============
.login-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: float 20s ease-in-out infinite;

    &.orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%);
      top: -200px;
      right: 10%;
      animation-delay: 0s;
    }

    &.orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
      bottom: -100px;
      left: 20%;
      animation-delay: -7s;
    }

    &.orb-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      top: 40%;
      right: 30%;
      animation-delay: -14s;
    }
  }

  .scanline {
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
    animation: scanline 8s linear infinite;
    opacity: 0.5;
  }

  .noise-overlay {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

@keyframes scanline {
  0% { top: -2px; }
  100% { top: 100%; }
}

// ============ 品牌区 ============
.brand-panel {
  position: relative;
  z-index: 10;
  width: 42%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  border-right: 1px solid rgba(99, 102, 241, 0.08);

  .brand-content {
    position: relative;
    z-index: 10;
    max-width: 400px;
    animation: slideUp 0.6s ease-out;
  }

  .brand-logo {
    margin-bottom: 32px;

    .logo-hex {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 0 40px rgba(99, 102, 241, 0.4),
        0 20px 40px rgba(0, 0, 0, 0.4);
      animation: pulse-glow 3s ease-in-out infinite;

      :deep(.xy-icon) {
        color: #fff;
      }
    }
  }

  .brand-name {
    font-family: 'Outfit', sans-serif;
    font-size: 48px;
    font-weight: 800;
    letter-spacing: 0.2em;
    margin: 0 0 8px;
    background: linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .brand-tagline {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.4em;
    color: #6366f1;
    margin: 0 0 48px;
  }

  .brand-features {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 15px;
      color: #94a3b8;
      font-weight: 500;

      .feature-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        box-shadow: 0 0 12px rgba(99, 102, 241, 0.6);
        animation: blink 2s ease-in-out infinite;
      }

      &:nth-child(2) .feature-dot { animation-delay: 0.5s; }
      &:nth-child(3) .feature-dot { animation-delay: 1s; }
    }
  }

  .brand-decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;

    .deco-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(99, 102, 241, 0.1);
      animation: expand 8s ease-out infinite;

      &.ring-1 {
        width: 400px;
        height: 400px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &.ring-2 {
        width: 600px;
        height: 600px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: -2s;
      }

      &.ring-3 {
        width: 800px;
        height: 800px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: -4s;
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow:
      0 0 40px rgba(99, 102, 241, 0.4),
      0 20px 40px rgba(0, 0, 0, 0.4);
  }
  50% {
    box-shadow:
      0 0 60px rgba(99, 102, 241, 0.6),
      0 20px 40px rgba(0, 0, 0, 0.4);
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes expand {
  0% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

// ============ 表单区 ============
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  z-index: 10;
}

.login-wrapper {
  width: 100%;
  max-width: 420px;
  animation: slideUp 0.6s ease-out 0.2s both;
}

.login-card {
  position: relative;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.15);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(99, 102, 241, 0.08);
  overflow: hidden;
  transition: transform 0.15s ease-out, box-shadow 0.3s ease;
  transform-style: preserve-3d;
  perspective: 1000px;

  &:hover {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.05) inset,
      0 35px 60px rgba(0, 0, 0, 0.5),
      0 0 100px rgba(99, 102, 241, 0.12);
  }

  .card-body {
    padding: 48px 40px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 24px;

  .login-title {
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }

  .login-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
}

// ============ 测试账号快捷入口 ============
.test-accounts {
  margin-bottom: 28px;
  padding: 16px;
  background: rgba(99, 102, 241, 0.06);
  border: 1px dashed rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  animation: fadeInUp 0.4s ease-out 0.3s both;

  .test-accounts-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #6366f1;
    margin: 0 0 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .test-accounts-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .test-account-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px 8px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    .account-role {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .account-cred {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 500;
      color: #e2e8f0;
    }

    &:hover {
      transform: translateY(-2px);
      border-color: rgba(99, 102, 241, 0.3);

      .account-role {
        color: #f1f5f9;
      }

      &.role-admin {
        background: rgba(99, 102, 241, 0.15);
        border-color: rgba(99, 102, 241, 0.3);

        .account-role {
          color: #818cf8;
        }
      }

      &.role-user {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.3);

        .account-role {
          color: #10b981;
        }
      }

      &.role-guest {
        background: rgba(245, 158, 11, 0.1);
        border-color: rgba(245, 158, 11, 0.3);

        .account-role {
          color: #f59e0b;
        }
      }
    }

    &:active {
      transform: translateY(0);
    }

    &.role-admin {
      border-color: rgba(99, 102, 241, 0.15);

      .account-role {
        color: #6366f1;
      }
    }

    &.role-user {
      border-color: rgba(16, 185, 129, 0.1);

      .account-role {
        color: #10b981;
      }
    }

    &.role-guest {
      border-color: rgba(245, 158, 11, 0.1);

      .account-role {
        color: #f59e0b;
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form {
  margin-bottom: 20px;

  // ============ 自定义输入框组 ============
  .input-group {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px 18px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: rgba(255, 255, 255, 0.12);
      background: rgba(15, 23, 42, 0.8);
    }

    &.is-focused {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.05);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .input-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 14px;
      color: #64748b;
      transition: color 0.3s ease;

      .xy-icon {
        transition: all 0.3s ease;
      }
    }

    &.is-focused .input-icon {
      color: #6366f1;
    }

    .custom-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 15px;
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;

      &::placeholder {
        color: #475569;
      }
    }

    .password-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      margin-left: 8px;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #64748b;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        color: #94a3b8;
        background: rgba(255, 255, 255, 0.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  // 记住我和忘记密码
  .form-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    :deep(.xy-checkbox) {
      .xy-checkbox__label {
        font-size: 14px;
        color: #64748b;
      }
    }

    .forgot-link {
      font-size: 14px;
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;

      &:hover {
        color: #818cf8;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 52px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.05em;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    box-shadow:
      0 4px 15px rgba(99, 102, 241, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    &:hover::before {
      opacity: 1;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow:
        0 8px 25px rgba(99, 102, 241, 0.45),
        0 0 0 1px rgba(255, 255, 255, 0.15) inset;
    }

    &:active {
      transform: translateY(0);
    }

    :deep(.xy-button__content) {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
  }
}

.login-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;

  .footer-text {
    font-size: 14px;
    color: #64748b;
  }

  .register-link {
    margin-left: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #6366f1;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #818cf8;
    }
  }
}

// ============ 响应式 ============
@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
  }

  .brand-panel {
    width: 100%;
    min-height: auto;
    padding: 40px 24px;
    border-right: none;
    border-bottom: 1px solid rgba(99, 102, 241, 0.08);

    .brand-name {
      font-size: 36px;
    }

    .brand-features {
      display: none;
    }
  }

  .form-panel {
    padding: 40px 24px;
  }
}
</style>
