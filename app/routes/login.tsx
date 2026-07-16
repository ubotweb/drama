import { createRoute } from 'honox/factory'
import { setCookie } from 'hono/cookie'
import { sign } from 'hono/jwt'
import { verifyPassword } from '../utils'

export default createRoute(async (c) => {
  const errorMsg = c.req.query('error');
  const successMsg = c.req.query('success');

  return c.render(
    <div class="min-h-screen flex items-center justify-center pt-16 px-4 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black/90 pointer-events-none"></div>
      
      <div class="w-full max-w-md bg-[#141414] p-8 rounded-2xl border border-white/10 text-white shadow-2xl relative z-10">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
        
        <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-white tracking-tight mb-2">Masuk AllDrama</h2>
            <p class="text-gray-400 text-sm">Lanjutkan menonton drama favorit Anda</p>
        </div>

        {errorMsg && <div class="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-lg mb-6 text-center text-sm font-medium">{errorMsg.replace(/\+/g, ' ')}</div>}
        {successMsg && <div class="bg-green-900/30 border border-green-800 text-green-400 p-3 rounded-lg mb-6 text-center text-sm font-medium">{successMsg.replace(/\+/g, ' ')}</div>}

        <form method="POST" action="/login" class="flex flex-col gap-5">
          <div>
            <input type="text" name="username" required class="w-full p-4 bg-[#262626] rounded-lg text-white border border-transparent focus:border-red-600 focus:bg-black focus:outline-none transition-all duration-200" placeholder="Username" />
          </div>
          <div>
            <input type="password" name="password" required class="w-full p-4 bg-[#262626] rounded-lg text-white border border-transparent focus:border-red-600 focus:bg-black focus:outline-none transition-all duration-200" placeholder="Password" />
          </div>
          <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold mt-2 transition-colors shadow-lg shadow-red-900/50">
            Masuk
          </button>
        </form>

        <p class="text-gray-400 text-sm text-center mt-6">
          Belum punya akun? <a href="/register" class="text-white hover:text-red-500 font-bold transition-colors ml-1">Daftar sekarang</a>
        </p>
      </div>
    </div>,
    { title: 'Login - AllDrama' }
  )
})

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
  const username = body.username as string;
  const password = body.password as string;

  const user = await c.env.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
  
  if (user) {
    const isValid = await verifyPassword(password, user.password as string);
    
    if (isValid) {
        const payload = {
            id: user.id,
            username: user.username,
            is_premium: user.is_premium,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 
        };

        const token = await sign(payload, c.env.JWT_SECRET, 'HS256');

        setCookie(c, 'session', token, {
            path: '/',
            secure: true,
            httpOnly: true, 
            maxAge: 60 * 60 * 24 * 7
        });

        return c.redirect('/');
    }
  }
  
  return c.redirect('/login?error=Username+atau+password+salah');
})
