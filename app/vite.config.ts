import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ホットリロード対策用（なくても動いてたが一応公式に書いてあったので適用している）
    watch: {
      usePolling: true,
    },
  },
})
