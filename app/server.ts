import { Hono } from 'hono'
import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { getCookie, setCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

// 1. Buat instance Hono dasar untuk Middleware
const baseApp = new Hono()

// 2. Terapkan Middleware DI AWAL (Sebelum HonoX mendaftarkan rute halaman)
baseApp.use('*', async (c, next) => {
  const urlLang = c.req.query('lang');
  let currentLang = getCookie(c, 'app_lang') || 'id'; 
  
  if (urlLang) {
    currentLang = urlLang;
    setCookie(c, 'app_lang', currentLang, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  }
  
  c.set('lang', currentLang);
  await next();
})

// 3. Terapkan Middleware Autentikasi
baseApp.use('*', async (c, next) => {
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

// 4. Masukkan baseApp yang sudah berisi middleware ke dalam HonoX createApp!
const app = createApp({ app: baseApp })

showRoutes(app)
export default app
