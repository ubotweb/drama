import { createRoute } from 'honox/factory'
import { fetchLibrary, fetchGenres, t, getAppLang } from '../utils'

export default createRoute(async (c) => {
  const lang = getAppLang(c);
  
  // Tangkap seluruh query (bisa berupa array jika ada beberapa '?genre=')
  const url = new URL(c.req.url);
  const searchParams = url.search; 
  const currentProvider = c.req.query('provider') || '';
  const currentSort = c.req.query('sortBy') || '';
  const currentGenres = c.req.queries('genre') || []; // Array untuk multi-select genre
  
  const movies = await fetchLibrary(lang, searchParams);
  const rawGenres = await fetchGenres(lang);
  
  // Daftar 15 Provider Mutlak sesuai instruksi Anda
  const providers = [
    { id: '', name: 'All Providers' },
    { id: 'flickreels', name: 'Flickreels' },
    { id: 'reelshort', name: 'Reelshort' },
    { id: 'dramashorts', name: 'DramaShorts' },
    { id: 'dramawave', name: 'Dramawave' },
    { id: 'candyjar', name: 'Candyjar' },
    { id: 'netshort', name: 'Netshort' },
    { id: 'shorttv', name: 'ShortTV' },
    { id: 'stardust', name: 'Stardust' },
    { id: 'dramatv', name: 'DramaTV' },
    { id: 'minutedrama', name: 'MinuteDrama' },
    { id: 'vigloo', name: 'Vigloo' },
    { id: 'flextv', name: 'FlexTV' },
    { id: 'joyreels', name: 'Joyreels' },
    { id: 'flareflow', name: 'Flareflow' },
    { id: 'kalostv', name: 'KalosTV' }
  ];

  // Daftar Sorting
  const sortOptions = [
    { id: '', name: 'Default' },
    { id: 'last_episode_at', name: 'Terbaru Ditambahkan' },
    { id: 'view_count', name: 'Paling Banyak Ditonton' },
    { id: 'day_view_count', name: 'Trending Harian' },
    { id: 'week_view_count', name: 'Trending Mingguan' },
    { id: 'month_view_count', name: 'Trending Bulanan' },
    { id: 'like_count', name: 'Paling Disukai' },
    { id: 'follow_count', name: 'Paling Diikuti' },
    { id: 'rating_count', name: 'Rating Tertinggi' }
  ];

  // Fungsi Toggle Multi-Genre
  const buildGenreUrl = (genreSlug: string) => {
      const params = new URLSearchParams(searchParams);
      if (genreSlug === '') {
          params.delete('genre'); // Tombol 'Semua' menghapus seluruh filter genre
      } else {
          const existingGenres = params.getAll('genre');
          params.delete('genre'); // Hapus semua dulu
          
          if (existingGenres.includes(genreSlug)) {
              // Jika sudah ada, berarti user ingin membatalkan pilihan ini (Toggle Off)
              existingGenres.filter(g => g !== genreSlug).forEach(g => params.append('genre', g));
          } else {
              // Jika belum ada, tambahkan ke dalam filter (Toggle On)
              existingGenres.forEach(g => params.append('genre', g));
              params.append('genre', genreSlug);
          }
      }
      return `/library?${params.toString()}`;
  };

  const buildUrl = (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set(key, value);
      else params.delete(key);
      return `/library?${params.toString()}`;
  };

  const PAGE_SIZE = 24; // Paginasi Profesional: Tampilkan 24 film per klik load

  return c.render(
    <div class="max-w-7xl mx-auto px-4 pt-24 pb-12 min-h-screen">
      
      {/* HEADER & SORTING */}
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <h1 class="text-3xl md:text-4xl font-extrabold text-white border-l-4 border-red-600 pl-4">{t(lang, 'library')}</h1>
        
        {/* DROPDOWN SORTING */}
        <div class="w-full md:w-auto flex items-center gap-3">
           <span class="text-sm text-gray-400 font-semibold uppercase tracking-wider">Urutkan:</span>
           <form action="" method="GET" class="relative m-0 p-0 flex-1 md:flex-none">
             {/* Pertahankan query provider dan genre saat mensorting */}
             {currentProvider && <input type="hidden" name="provider" value={currentProvider} />}
             {currentGenres.map(g => <input type="hidden" name="genre" value={g} />)}
             
             <select name="sortBy" onchange="this.form.submit()" class="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-md px-4 py-2 focus:outline-none focus:border-red-600 appearance-none text-sm cursor-pointer font-medium">
                {sortOptions.map(sort => (
                   <option value={sort.id} selected={currentSort === sort.id}>{sort.name}</option>
                ))}
             </select>
           </form>
        </div>
      </div>
      
      {/* FILTER PROVIDERS */}
      <div class="mb-6">
          <h3 class="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Sumber Provider</h3>
          <div class="flex overflow-x-auto gap-3 pb-2 hide-scrollbar snap-x">
            {providers.map(p => (
                <a href={buildUrl('provider', p.id)} class={`snap-start shrink-0 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${currentProvider === p.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-[#1a1a1a] border border-white/5 hover:border-white/20 text-gray-300'}`}>
                    {p.name}
                </a>
            ))}
          </div>
      </div>

      {/* FILTER GENRES (MULTI-SELECTABLE) */}
      <div class="mb-10">
          <h3 class="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Kategori Genre (Bisa Pilih Banyak)</h3>
          <div class="flex flex-wrap gap-2 md:gap-3">
            <a href={buildGenreUrl('')} class={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${currentGenres.length === 0 ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-[#1a1a1a] border border-white/5 hover:border-white/20 text-gray-300'}`}>Semua Genre</a>
            {rawGenres.map((g: any) => {
                let display_name = g.name;
                if (g.translates) {
                    const tl = g.translates.find((t: any) => t.lang.toLowerCase().startsWith(lang.toLowerCase()));
                    if (tl) display_name = tl.name;
                }
                const isActive = currentGenres.includes(g.slug);
                return (
                    <a href={buildGenreUrl(g.slug)} class={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 border border-red-500' : 'bg-[#1a1a1a] border border-white/5 hover:border-white/20 text-gray-300'}`}>
                        {display_name} {isActive && <span class="text-white text-xs">×</span>}
                    </a>
                )
            })}
          </div>
      </div>

      {/* GRID FILM PUSTAKA (PAGINASI LOAD MORE) */}
      {movies.length > 0 ? (
        <>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" id="library-grid">
            {movies.map((movie, index) => (
                <a href={`/detail/${movie.slug}`} class={`lib-card group relative block w-full aspect-[2/3] rounded-md overflow-hidden bg-[#141414] transition-transform duration-300 hover:scale-105 shadow-md border border-white/5 ${index >= PAGE_SIZE ? 'hidden' : ''}`}>
                <img src={movie.thumbnailUrl} alt={movie.title} class="object-cover w-full h-full" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <h3 class="text-xs md:text-sm font-semibold text-white line-clamp-2 leading-snug">{movie.title}</h3>
                </div>
                </a>
            ))}
            </div>

            {/* TOMBOL LOAD MORE PROFESIONAL */}
            {movies.length > PAGE_SIZE && (
                <div class="flex justify-center mt-12 mb-4">
                    <button id="lib-load-more" class="bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2">
                        <span>Tampilkan Lebih Banyak ({movies.length} Judul)</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
            )}
        </>
      ) : (
        <div class="flex flex-col items-center justify-center py-20 text-center bg-[#0a0a0a] rounded-xl border border-white/5">
            <svg class="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <h3 class="text-xl font-bold text-white mb-2">Pencarian Tidak Ditemukan</h3>
            <p class="text-gray-500 max-w-md text-sm">Cobalah untuk menghapus beberapa filter genre atau ganti sumber provider untuk menemukan drama yang Anda cari.</p>
        </div>
      )}

      {/* SCRIPT CLIENT-SIDE PAGINASI */}
      <script dangerouslySetInnerHTML={{__html: `
        document.addEventListener("DOMContentLoaded", function() {
          const loadMoreBtn = document.getElementById('lib-load-more');
          if (!loadMoreBtn) return;
          
          const increment = 24; // Render 24 item setiap kali tombol ditekan
          
          loadMoreBtn.addEventListener('click', function() {
            const hiddenCards = document.querySelectorAll('.lib-card.hidden');
            for(let i = 0; i < increment && i < hiddenCards.length; i++) {
              hiddenCards[i].classList.remove('hidden');
            }
            
            // Sembunyikan tombol jika semua film sudah dirender
            if (document.querySelectorAll('.lib-card.hidden').length === 0) {
              loadMoreBtn.style.display = 'none';
            }
          });
        });
      `}}></script>
    </div>,
    { title: `AllDrama - ${t(lang, 'library')}`, lang: lang }
  )
})
