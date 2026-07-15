import { defineConfig } from 'vite'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import pages from '@hono/vite-cloudflare-pages'

export default defineConfig(({ mode }) => {
  // 1. Build khusus untuk sisi Client (Browser)
  if (mode === 'client') {
    return {
      plugins: [client()]
    }
  }

  // 2. Build khusus untuk sisi Server (menghasilkan _worker.js untuk Cloudflare)
  return {
    build: {
      emptyOutDir: false // PENTING: Mencegah file client terhapus saat server sedang dirakit
    },
    plugins: [
      honox(),
      pages({
        entry: 'app/server.ts'
      })
    ]
  }
})
