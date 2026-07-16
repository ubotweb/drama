import { jsxRenderer } from 'hono/jsx-renderer'
import { t } from '../utils'

export default jsxRenderer(({ children, title, lang }) => {
  const currentLang = (lang as string) || 'id';

  return (
    <html lang={currentLang}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'AllDrama - Nonton Drama Pendek'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <style>
          {`
            body { background-color: #000000; color: #ffffff; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}
        </style>
      </head>
      {/* pt-16 memastikan konten web tidak tertutup oleh Navbar yang fixed */}
      <body class="antialiased pt-16">
        <nav class="fixed top-0 left-0 right-0 w-full bg-[#0a0a0a] border-b border-white/10 z-50 h-16 flex items-center">
          <div class="w-full max-w-7xl mx-auto px-4 flex items-center justify-between">
            
            {/* LOGO */}
            <a href="/" class="text-xl md:text-2xl font-black text-red-600 tracking-tighter">ALLDRAMA</a>
            
            {/* MENU NAVIGASI: PASTI MUNCUL DI SEMUA LAYAR, ANTI-HILANG */}
            <div class="flex items-center gap-3 md:gap-6 text-sm font-bold">
              <a href="/" class="hover:text-red-500 transition-colors">{t(currentLang, 'home')}</a>
              <a href="/library" class="hover:text-red-500 transition-colors">{t(currentLang, 'library')}</a>
              
              {/* Dropdown bahasa disembunyikan di HP kecil agar menu utama tetap muat, tampil di layar lebih besar */}
              <form action="" method="GET" class="relative m-0 p-0 hidden sm:block">
                <select name="lang" onchange="this.form.submit()" class="bg-[#262626] text-white border border-white/20 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-600 appearance-none text-xs cursor-pointer outline-none">
                  <option value="id" selected={currentLang === 'id'}>🇮🇩 ID</option>
                  <option value="en" selected={currentLang === 'en'}>🇺🇸 EN</option>
                  <option value="vi" selected={currentLang === 'vi'}>🇻🇳 VI</option>
                  <option value="th" selected={currentLang === 'th'}>🇹🇭 TH</option>
                  <option value="es" selected={currentLang === 'es'}>🇪🇸 ES</option>
                  <option value="de" selected={currentLang === 'de'}>🇩🇪 DE</option>
                  <option value="pt" selected={currentLang === 'pt'}>🇵🇹 PT</option>
                  <option value="ms" selected={currentLang === 'ms'}>🇲🇾 MS</option>
                  <option value="it" selected={currentLang === 'it'}>🇮🇹 IT</option>
                  <option value="zh" selected={currentLang === 'zh'}>🇹🇼 ZH</option>
                  <option value="zh-cn" selected={currentLang === 'zh-cn'}>🇨🇳 ZH-CN</option>
                  <option value="fr" selected={currentLang === 'fr'}>🇫🇷 FR</option>
                  <option value="ja" selected={currentLang === 'ja'}>🇯🇵 JA</option>
                  <option value="tr" selected={currentLang === 'tr'}>🇹🇷 TR</option>
                  <option value="ko" selected={currentLang === 'ko'}>🇰🇷 KO</option>
                  <option value="ar" selected={currentLang === 'ar'}>🇸🇦 AR</option>
                  <option value="fil" selected={currentLang === 'fil'}>🇵🇭 FIL</option>
                </select>
              </form>

              <a href="/login" class="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full transition-all shadow-lg shadow-red-900/50">{t(currentLang, 'account')}</a>
            </div>

          </div>
        </nav>

        <main class="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
})
