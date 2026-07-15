import { defineConfig } from 'vite'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import pages from '@hono/vite-cloudflare-pages'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [client()]
    }
  }

  return {
    build: {
      emptyOutDir: false
    },
    plugins: [
      honox(),
      pages() // Tanpa parameter entry, otomatis membaca src/index.ts
    ]
  }
})
