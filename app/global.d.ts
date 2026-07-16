import {} from 'hono'
import { D1Database } from '@cloudflare/workers-types'

declare module 'hono' {
  interface Env {
    Bindings: {
      DB: D1Database
      JWT_SECRET: string
    }
    Variables: {
      user: { id: number; username: string; is_premium: boolean; exp?: number } | null
      lang: string 
    }
  }
}
