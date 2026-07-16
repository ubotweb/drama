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
      <body class="antialiased">
        <nav class="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-white/10 transition-all duration-300">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" class="text-2xl font-black text-red-600 tracking-tighter">ALLDRAMA</a>
            <div class="flex items-center gap-4 text-sm font-medium">
              
              <form action="" method="GET" class="relative">
                <select name="lang" onchange="this.form.submit()" class="bg-[#262626] text-white border border-white/20 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-600 appearance-none text-xs sm:text-sm cursor-pointer">
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

              <a href="/" class="hidden sm:block hover:text-red-500 transition-colors">{t(currentLang, 'home')}</a>
              <a href="/login" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition-all shadow-lg shadow-red-900/50">{t(currentLang, 'account')}</a>
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
