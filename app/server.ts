import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { getCookie, setCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

const app = createApp()

// Middleware 1: State Manajemen Bahasa Global
app.use('*', async (c, next) => {
  const urlLang = c.req.query('lang');
  let currentLang = getCookie(c, 'app_lang') || 'id'; // Default Indonesia
  
  if (urlLang) {
    currentLang = urlLang;
    setCookie(c, 'app_lang', currentLang, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  }
  
  c.set('lang', currentLang);
  await next()
})

// Middleware 2: Autentikasi Global menggunakan JWT HS256
app.use('*', async (c, next) => {
  const sessionToken = getCookie(c, 'session')
  if (sessionToken) {
    try {
      const decodedPayload = await verify(sessionToken, c.env.JWT_SECRET, 'HS256')
      c.set('user', decodedPayload as any)
    } catch (e) {
      c.set('user', null)
    }
  } else {
    c.set('user', null)
  }
  await next()
})

showRoutes(app)
export default app
