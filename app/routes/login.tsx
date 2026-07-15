import { createRoute } from 'honox/factory'
import { setCookie } from 'hono/cookie'
import { sign } from 'hono/jwt'

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
  
  // SIMULASI LOGIN - Di produksi, Anda harus mengecek password hash di DB
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(body.email).first();
  
  if (user) {
    // Siapkan payload data User untuk dienkripsi ke dalam JWT
    const payload = {
        id: user.id,
        email: user.email,
        is_premium: user.is_premium,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // Masa kedaluwarsa token: 7 Hari
    };

    // Tandatangani token dengan JWT_SECRET secara eksplisit menggunakan algoritma HS256
    const token = await sign(payload, c.env.JWT_SECRET, 'HS256');

    // Simpan token JWT di Cookie
    setCookie(c, 'session', token, {
        path: '/',
        secure: true,
        httpOnly: true, // Amankan dari pembacaan Javascript Client-Side
        maxAge: 60 * 60 * 24 * 7
    });

    return c.redirect('/');
  }
  
  return c.redirect('/login?error=1');
})

export default createRoute(async (c) => {
  return c.render(
    <div class="max-w-md mx-auto mt-20 px-4">
      <div class="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h1 class="text-2xl font-bold mb-6 text-center text-white">Login AllDrama</h1>
        <form method="POST" class="flex flex-col gap-4">
          <input type="email" name="email" placeholder="Email Anda" required class="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600" />
          <input type="password" name="password" placeholder="Password" required class="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600" />
          <button type="submit" class="bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition mt-2">Masuk</button>
        </form>
      </div>
    </div>,
    { title: 'Login - AllDrama' }
  )
})
