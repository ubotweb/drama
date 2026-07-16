import { createRoute } from 'honox/factory'

// Fungsi bantuan (helper) untuk melakukan hashing password menggunakan WebCrypto API 
// Sangat disarankan untuk lingkungan Edge/Cloudflare Workers
async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default createRoute(async (c) => {
  // ==========================================================
  // 1. GET METHOD: Tampilkan Form Registrasi
  // ==========================================================
  if (c.req.method === 'GET') {
    const errorMsg = c.req.query('error');

    return c.render(
      <div class="max-w-md mx-auto mt-20 p-6 bg-gray-900 rounded-2xl border border-gray-800 text-white shadow-xl">
        <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-yellow-500 mb-2">Daftar Akun</h2>
            <p class="text-gray-400">Buat akun untuk menonton lebih banyak episode</p>
        </div>

        {errorMsg && (
          <div class="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-center text-sm">
            {errorMsg.replace(/\+/g, ' ')}
          </div>
        )}

        <form method="POST" action="/register" class="flex flex-col gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input 
              type="text" 
              name="username" 
              required 
              class="w-full p-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition-all" 
              placeholder="Masukkan username unik" 
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              minLength={6}
              class="w-full p-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition-all" 
              placeholder="Minimal 6 karakter" 
            />
          </div>
          <button 
            type="submit" 
            class="w-full bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold mt-2 transition-colors shadow-lg"
          >
            Daftar Sekarang
          </button>
        </form>

        <p class="text-gray-400 text-sm text-center mt-6">
          Sudah punya akun? <a href="/login" class="text-yellow-500 hover:underline">Login di sini</a>
        </p>
      </div>,
      { title: 'Daftar Akun - AllDrama' }
    )
  }

  // ==========================================================
  // 2. POST METHOD: Proses Data Registrasi ke Database
  // ==========================================================
  if (c.req.method === 'POST') {
    const body = await c.req.parseBody();
    const username = body.username as string;
    const password = body.password as string;

    // Validasi input kosong
    if (!username || !password) {
       return c.redirect('/register?error=Username+dan+password+harus+diisi');
    }

    try {
      // Pengecekan apakah username sudah digunakan di Database
      const existingUser = await c.env.DB.prepare("SELECT id FROM users WHERE username = ?")
        .bind(username).first();
        
      if (existingUser) {
         return c.redirect('/register?error=Username+sudah+terdaftar');
      }

      // Melakukan hashing pada password demi keamanan (Jangan simpan plain text)
      const hashedPassword = await hashPassword(password);

      // Memasukkan pengguna baru ke database (Default: is_premium = 0)
      await c.env.DB.prepare(
        "INSERT INTO users (username, password, is_premium) VALUES (?, ?, 0)"
      ).bind(username, hashedPassword).run();

      // Redirect ke halaman login setelah registrasi berhasil
      // Pengguna bisa langsung login untuk mendapatkan token JWT dari rute login
      return c.redirect('/login?success=Akun+berhasil+dibuat.+Silakan+login.');

    } catch (error) {
      console.error("Terjadi kesalahan saat registrasi:", error);
      return c.redirect('/register?error=Terjadi+kesalahan+pada+server');
    }
  }
})
