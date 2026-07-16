import { createRoute } from 'honox/factory'
import { fetchCatalog, t } from '../utils'

export default createRoute(async (c) => {
  const currentLang = c.var.lang || 'id'; 
  const movies = await fetchCatalog(currentLang);
  
  const heroMovie = movies.length > 0 ? movies[Math.floor(Math.random() * movies.length)] : null;

  return c.render(
    <div>
      {heroMovie ? (
        <div class="relative w-full h-[60vh] md:h-[75vh] flex items-end">
          <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style={`background-image: url('${heroMovie.thumbnailUrl}');`}></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent"></div>
          <div class="relative z-10 w-full max-w-7xl mx-auto px-4 pb-12">
            <h1 class="text-4xl md:text-6xl font-black text-white mb-4 line-clamp-2 drop-shadow-lg">{heroMovie.title}</h1>
            <p class="text-gray-300 md:w-1/2 line-clamp-3 mb-6 drop-shadow-md text-sm md:text-base">{heroMovie.description}</p>
            <a href={`/detail/${heroMovie.slug}`} class="inline-flex items-center justify-center bg-white text-black font-bold px-8 py-3 rounded-md hover:bg-gray-200 transition gap-2">
              <span class="text-xl">▶</span> {t(currentLang, 'watch_now')}
            </a>
          </div>
        </div>
      ) : (
        <div class="w-full h-[50vh] flex flex-col items-center justify-center text-gray-500 bg-[#0a0a0a]">
           <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
           <p>Memuat Data Katalog Drama...</p>
        </div>
      )}

      <div class="max-w-7xl mx-auto px-4 py-8">
        <h2 class="text-xl font-bold text-white mb-6">{t(currentLang, 'trending')}</h2>
        
        {movies.length > 0 ? (
          {/* PERBAIKAN: Mengubah Flex Horizontal menjadi Grid agar seluruh film tampil memanjang ke bawah */}
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-6">
            {movies.map((movie) => (
              <a href={`/detail/${movie.slug}`} class="group relative block w-full aspect-[2/3] rounded-md overflow-hidden bg-[#141414] transition-transform duration-300 hover:scale-105 shadow-md">
                <img src={movie.thumbnailUrl} alt={movie.title} class="object-cover w-full h-full" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <h3 class="text-xs md:text-sm font-semibold text-white line-clamp-2 leading-snug">{movie.title}</h3>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div class="text-gray-500 text-sm py-4">Belum ada drama yang tersedia untuk bahasa ini.</div>
        )}
      </div>
    </div>,
    { title: `AllDrama - ${t(currentLang, 'home')}`, lang: currentLang }
  )
})
