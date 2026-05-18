import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'xiaoye-components/style.css': fileURLToPath(
        new URL('../../packages/components/dist/style.css', import.meta.url)
      )
    }
  }
})
