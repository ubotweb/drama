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
            
            /* Animasi Buka/Tutup Menu Mobile */
            #mobile-menu { transition: max-height 0.3s ease-in-out; overflow: hidden; max-height: 0; }
            #mobile-menu.open { max-height: 500px; }
          `}
        </style>
      </head>
      <body class="antialiased">
        <nav class="fixed top-0 w-full bg-[#0a0a0a]/95 backdrop-blur-lg z-50 border-b border-white/10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* LOGO */}
            <a href="/" class="text-2xl font-black text-red-600 tracking-tighter">ALLDRAMA</a>
            
            {/* ========================================= */}
            {/* MENU DESKTOP (Terlihat di PC/Laptop) */}
            {/* ========================================= */}
            <div class="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="/" class="hover:text-red-500 transition-colors">{t(currentLang, 'home')}</a>
              <a href="/library" class="hover:text-red-500 transition-colors">{t(currentLang, 'library')}</a>
              
              <form action="" method="GET" class="relative m-0 p-0">
                <select name="lang" onchange="this.form.submit()" class="bg-[#262626] text-white border border-white/20 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-600 appearance-none text-xs cursor-pointer outline-none">
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

              <a href="/login" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition-all shadow-lg shadow-red-900/50">{t(currentLang, 'account')}</a>
            </div>

            {/* ========================================= */}
            {/* TOMBOL MENU MOBILE (Terlihat di HP) */}
            {/* ========================================= */}
            <button id="menu-btn" class="md:hidden text-gray-300 hover:text-white p-2 focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* ========================================= */}
          {/* MENU DROPDOWN MOBILE (Tampil saat diklik) */}
          {/* ========================================= */}
          <div id="mobile-menu" class="md:hidden bg-[#0a0a0a] border-b border-white/10 px-4">
            <div class="flex flex-col gap-4 py-5">
                <a href="/" class="text-white hover:text-red-500 font-medium text-lg">{t(currentLang, 'home')}</a>
                <a href="/library" class="text-white hover:text-red-500 font-medium text-lg">{t(currentLang, 'library')}</a>
                
                <form action="" method="GET" class="relative m-0 p-0 w-full mt-2">
                  <select name="lang" onchange="this.form.submit()" class="w-full bg-[#262626] text-white border border-white/20 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-red-600 appearance-none text-sm cursor-pointer outline-none">
                    <option value="id" selected={currentLang === 'id'}>🇮🇩 Indonesia</option>
                    <option value="en" selected={currentLang === 'en'}>🇺🇸 English</option>
                    <option value="vi" selected={currentLang === 'vi'}>🇻🇳 Tiếng Việt</option>
                    <option value="th" selected={currentLang === 'th'}>🇹🇭 ไทย</option>
                    <option value="es" selected={currentLang === 'es'}>🇪🇸 Español</option>
                    <option value="de" selected={currentLang === 'de'}>🇩🇪 Deutsch</option>
                    <option value="pt" selected={currentLang === 'pt'}>🇵🇹 Português</option>
                    <option value="ms" selected={currentLang === 'ms'}>🇲🇾 Bahasa Melayu</option>
                    <option value="it" selected={currentLang === 'it'}>🇮🇹 Italiano</option>
                    <option value="zh" selected={currentLang === 'zh'}>🇹🇼 繁體中文</option>
                    <option value="zh-cn" selected={currentLang === 'zh-cn'}>🇨🇳 简体中文</option>
                    <option value="fr" selected={currentLang === 'fr'}>🇫🇷 Français</option>
                    <option value="ja" selected={currentLang === 'ja'}>🇯🇵 日本語</option>
                    <option value="tr" selected={currentLang === 'tr'}>🇹🇷 Türkçe</option>
                    <option value="ko" selected={currentLang === 'ko'}>🇰🇷 한국어</option>
                    <option value="ar" selected={currentLang === 'ar'}>🇸🇦 العربية</option>
                    <option value="fil" selected={currentLang === 'fil'}>🇵🇭 Filipino</option>
                  </select>
                </form>
                
                <a href="/login" class="text-center bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-md transition-all font-bold mt-2">{t(currentLang, 'account')}</a>
            </div>
          </div>
        </nav>

        <main class="min-h-screen">
          {children}
        </main>

        {/* Script Vanilla JS untuk fungsi Buka/Tutup Menu HP */}
        <script dangerouslySetInnerHTML={{__html: `
          document.getElementById('menu-btn').addEventListener('click', function() {
              document.getElementById('mobile-menu').classList.toggle('open');
          });
        `}}></script>
      </body>
    </html>
  )
})
