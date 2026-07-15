import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

const app = createApp()

// Middleware Autentikasi Global menggunakan JWT
app.use('*', async (c, next) => {
  const sessionToken = getCookie(c, 'session')
  
  if (sessionToken) {
    try {
      // Verifikasi token dengan JWT_SECRET dan secara eksplisit mensyaratkan algoritma HS256
      const decodedPayload = await verify(sessionToken, c.env.JWT_SECRET, 'HS256')
      c.set('user', decodedPayload as any)
    } catch (e) {
      // Jika token invalid, kedaluwarsa, atau dimanipulasi, anggap sebagai guest (null)
      c.set('user', null)
    }
  } else {
    c.set('user', null)
  }
  
  await next()
})

showRoutes(app)
export default app
