import { jsxRenderer } from 'hono/jsx-renderer'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'AllDrama - Nonton Drama Pendek'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <style>
          {`
            body { background-color: #0d0d0d; color: #ffffff; }
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}
        </style>
      </head>
      <body>
        <nav class="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-gray-800">
          <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" class="text-2xl font-bold text-red-600 tracking-tighter">ALLDRAMA</a>
            <div class="flex gap-4 text-sm">
              <a href="/" class="hover:text-red-500 transition">Beranda</a>
              <a href="/login" class="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-full transition font-semibold">Akun</a>
            </div>
          </div>
        </nav>
        <main class="pt-20 min-h-screen pb-20">
          {children}
        </main>
      </body>
    </html>
  )
})
