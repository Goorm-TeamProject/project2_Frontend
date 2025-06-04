import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // S3 업로드용
    emptyOutDir: true, // 기존 파일 제거 후 빌드
  },
  base: '/', // 루트 경로에서 index.html 접근 (S3 정적 호스팅용)
})
