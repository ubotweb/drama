import { createRoute } from 'honox/factory'
import { hashPassword } from '../utils'

export default createRoute(async (c) => {
  const errorMsg = c.req.query('error');

  return c.render(
    <div class="min-h-screen flex items-center justify-center pt-16 px-4 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black/90 pointer-events-none"></div>
      
      <div class="w-full max-w-md bg-[#141414] p-8 rounded-2xl border border-white/10 text-white shadow-2xl relative z-10">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
        
        <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-white tracking-tight mb-2">Daftar Akun</h2>
            <p class="text-gray-400 text-sm">Buat akun untuk menonton lebih banyak episode</p>
        </div>

        {errorMsg && (
          <div class="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-lg mb-6 text-center text-sm font-medium">
            {errorMsg.replace(/\+/g, ' ')}
          </div>
        )}

        <form method="POST" action="/register" class="flex flex-col gap-5">
          <div>
            <input 
              type="text" 
              name="username" 
              required 
              class="w-full p-4 bg-[#262626] rounded-lg text-white border border-transparent focus:border-red-600 focus:bg-black focus:outline-none transition-all duration-200" 
              placeholder="Username" 
            />
          </div>
          <div>
            <input 
              type="password" 
              name="password" 
              required 
              minLength={6}
              class="w-full p-4 bg-[#262626] rounded-lg text-white border border-transparent focus:border-red-600 focus:bg-black focus:outline-none transition-all duration-200" 
              placeholder="Password (Min. 6 Karakter)" 
            />
          </div>
          <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold mt-2 transition-colors shadow-lg shadow-red-900/50">
            Daftar Sekarang
          </button>
        </form>

        <p class="text-gray-400 text-sm text-center mt-6">
          Sudah punya akun? <a href="/login" class="text-white hover:text-red-500 font-bold transition-colors ml-1">Login</a>
        </p>
      </div>
    </div>,
    { title: 'Daftar Akun - AllDrama' }
  )
})

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
  const username = body.username as string;
  const password = body.password as string;

  if (!username || !password) return c.redirect('/register?error=Data+tidak+lengkap');

  try {
    const existingUser = await c.env.DB.prepare("SELECT id FROM users WHERE username = ?").bind(username).first();
    if (existingUser) return c.redirect('/register?error=Username+sudah+terdaftar');

    const hashedPassword = await hashPassword(password);

    await c.env.DB.prepare(
      "INSERT INTO users (username, password, is_premium) VALUES (?, ?, 0)"
    ).bind(username, hashedPassword).run();

    return c.redirect('/login?success=Akun+berhasil+dibuat');
  } catch (error) {
    return c.redirect('/register?error=Terjadi+kesalahan+sistem');
  }
})
