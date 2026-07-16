import { createRoute } from 'honox/factory'
import { fetchLibrary, fetchGenres, t, getAppLang } from '../utils'

export default createRoute(async (c) => {
  const lang = getAppLang(c);
  
  // Tangkap query pencarian (filter) dari frontend secara utuh
  const currentProvider = c.req.query('provider') || '';
  const currentGenre = c.req.query('genre') || '';
  const url = new URL(c.req.url);
  const searchParams = url.search; 
  
  // Minta data ke Worker API kita yang sekarang sudah di-upgrade
  const movies = await fetchLibrary(lang, searchParams);
  const rawGenres = await fetchGenres(lang);
  
  // Mapping Provider Sesuai dengan instruksi Anda
  const providers = [
    { id: '', name: 'Semua' },
    { id: 'flixreels', name: 'Flixreels' },
    { id: 'reelshort', name: 'Reelshort' },
    { id: 'dramashorts', name: 'DramaShorts' },
    { id: 'dramawave', name: 'Dramawave' },
    { id: 'netshort', name: 'Netshort' } // Tambahan provider internal API
  ];

  // Fungsi dinamis pembangun URL Filter
  const buildUrl = (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set(key, value);
      else params.delete(key);
      return `/library?${params.toString()}`;
  };

  return c.render(
    <div class="max-w-7xl mx-auto px-4 pt-24 pb-12 min-h-screen">
      <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-8 border-l-4 border-red-600 pl-4">{t(lang, 'library')}</h1>
      
      {/* FILTER PROVIDERS */}
      <div class="mb-6">
          <h3 class="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Provider</h3>
          <div class="flex overflow-x-auto gap-3 pb-2 hide-scrollbar snap-x">
            {providers.map(p => (
                <a href={buildUrl('provider', p.id)} class={`snap-start shrink-0 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${currentProvider === p.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-[#1a1a1a] border border-white/5 hover:border-white/20 text-gray-300'}`}>
                    {p.name}
                </a>
            ))}
          </div>
      </div>

      {/* FILTER GENRES */}
      <div class="mb-10">
          <h3 class="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Genre</h3>
          <div class="flex overflow-x-auto gap-3 pb-2 hide-scrollbar snap-x">
            <a href={buildUrl('genre', '')} class={`snap-start shrink-0 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${currentGenre === '' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-[#1a1a1a] border border-white/5 hover:border-white/20 text-gray-300'}`}>Semua</a>
            {rawGenres.map((g: any) => {
                let display_name = g.name;
                // Ekstraksi terjemahan genre berdasarkan bahasa JSON API 
                if (g.translates) {
                    const tl = g.translates.find((t: any) => t.lang.startsWith(lang) || t.lang.startsWith(lang.toLowerCase()));
                    if (tl) display_name = tl.name;
                }
                return (
                    <a href={buildUrl('genre', g.slug)} class={`snap-start shrink-0 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${currentGenre === g.slug ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-[#1a1a1a] border border-white/5 hover:border-white/20 text-gray-300'}`}>
                        {display_name}
                    </a>
                )
            })}
          </div>
      </div>

      {/* GRID FILM PUSTAKA */}
      {movies.length > 0 ? (
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <a href={`/detail/${movie.slug}`} class="group relative block w-full aspect-[2/3] rounded-md overflow-hidden bg-[#141414] transition-transform duration-300 hover:scale-105 shadow-md border border-white/5">
              <img src={movie.thumbnailUrl} alt={movie.title} class="object-cover w-full h-full" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <h3 class="text-xs md:text-sm font-semibold text-white line-clamp-2 leading-snug">{movie.title}</h3>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div class="text-gray-500 text-sm py-12 text-center bg-[#0a0a0a] rounded-lg border border-white/5">
            {t(lang, 'not_found')}
        </div>
      )}
    </div>,
    { title: `AllDrama - ${t(lang, 'library')}`, lang: lang }
  )
})
