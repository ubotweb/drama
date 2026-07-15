import { defineConfig } from 'vite'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import pages from '@hono/vite-cloudflare-pages'

export default defineConfig(({ mode }) => {
  // 1. Build khusus Client
  if (mode === 'client') {
    return {
      build: {
        outDir: 'dist'
      },
      plugins: [client()]
    }
  }

  // 2. Build khusus Server (Pages Function)
  return {
    build: {
      outDir: 'dist', // Mutlak diperlukan: Memaksa _worker.js keluar di folder utama
      emptyOutDir: false // Mutlak diperlukan: Mencegah penghapusan aset client yang sudah dirakit
    },
    plugins: [
      honox(),
      pages({
        entry: 'app/server.ts'
      })
    ]
  }
})
