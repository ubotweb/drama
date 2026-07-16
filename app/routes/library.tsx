import { createRoute } from 'honox/factory'
import { fetchLibrary, fetchGenres, t, getAppLang } from '../utils'

export default createRoute(async (c) => {
  const lang = getAppLang(c);
  
  const url = new URL(c.req.url);
  const searchParams = url.search; 
  const currentProvider = c.req.query('provider') || '';
  const currentSort = c.req.query('sortBy') || '';
  const currentGenres = c.req.queries('genre') || []; 
  
  const { movies, nextPageToken } = await fetchLibrary(lang, searchParams);
  const rawGenres = await fetchGenres(lang);
  
  const providers = [
    { id: '', name: 'Semua Provider' },
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

  const buildGenreUrl = (genreSlug: string) => {
      const params = new URLSearchParams(searchParams);
      if (genreSlug === '') {
          params.delete('genre'); 
      } else {
          const existingGenres = params.getAll('genre');
          params.delete('genre'); 
          
          if (existingGenres.includes(genreSlug)) {
              existingGenres.filter(g => g !== genreSlug).forEach(g => params.append('genre', g));
          } else {
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

  return c.render(
    <div class="max-w-7xl mx-auto px-4 pt-24 pb-12 min-h-screen">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <h1 class="text-3xl md:text-4xl font-extrabold text-white border-l-4 border-red-600 pl-4">{t(lang, 'library')}</h1>
        
        <div class="w-full md:w-auto flex items-center gap-3">
           <span class="text-sm text-gray-400 font-semibold uppercase tracking-wider">Urutkan:</span>
           <form action="" method="GET" class="relative m-0 p-0 flex-1 md:flex-none">
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

      {movies.length > 0 ? (
        <>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" id="library-grid">
            {movies.map((movie) => (
                <a href={`/detail/${movie.slug}`} class={`group relative block w-full aspect-[2/3] rounded-md overflow-hidden bg-[#141414] transition-transform duration-300 hover:scale-105 shadow-md border border-white/5`}>
                <img src={movie.thumbnailUrl} alt={movie.title} class="object-cover w-full h-full" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <h3 class="text-xs md:text-sm font-semibold text-white line-clamp-2 leading-snug">{movie.title}</h3>
                </div>
                </a>
            ))}
            </div>

            {nextPageToken && (
                <div class="flex justify-center mt-12 mb-4">
                    <button id="lib-load-more" data-token={nextPageToken} class="bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2">
                        <span>Tampilkan Lebih Banyak Data</span>
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

      {/* SCRIPT FETCH PAGINASI API REAL-TIME MULTI-FILTER */}
      <script dangerouslySetInnerHTML={{__html: `
        document.addEventListener("DOMContentLoaded", function() {
            const btn = document.getElementById('lib-load-more');
            const grid = document.getElementById('library-grid');
            if (!btn || !grid) return;

            btn.addEventListener('click', async function() {
                const token = btn.getAttribute('data-token');
                if (!token) return;

                const originalText = btn.innerHTML;
                btn.innerHTML = 'Memuat Data...';
                btn.disabled = true;

                try {
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.set('pageToken', token); // Meneruskan PageToken
                    
                    const lang = document.documentElement.lang || 'id';
                    const apiBase = "https://dramapi.ubot.web.id/api";
                    const fetchUrl = apiBase + '/library/' + lang + '?' + urlParams.toString();
                    
                    const res = await fetch(fetchUrl);
                    const json = await res.json();
                    
                    const langData = json?.data?.[lang] || json?.data?.id || json?.data?.en || json?.data?.zh || json?.data;
                    const rawData = langData?.nextjs_ssr_data || [];
                    
                    let newItems = [];
                    let nextToken = null;
                    
                    rawData.forEach(chunk => {
                        const cleanChunk = chunk.replace(/\\\\"/g, '"').replace(/\\\\\\\\/g, '\\\\').replace(/\\\\\\//g, '/');
                        const blocks = cleanChunk.split('{"id":"');
                        
                        for (let i = 1; i < blocks.length; i++) {
                            const block = '"id":"' + blocks[i];
                            const idMatch = block.match(/"id":"(\\\\d+)"/);
                            const titleMatch = block.match(/"title":"(.*?)"/);
                            const slugMatch = block.match(/"slug":"(.*?)"/);
                            const thumbMatch = block.match(/"thumbnailUrl":"(.*?)"/);
                            
                            if (idMatch && titleMatch && slugMatch && thumbMatch) {
                                newItems.push({ id: idMatch[1], title: titleMatch[1], slug: slugMatch[1], thumbnailUrl: thumbMatch[1] });
                            }
                        }
                        
                        if (!nextToken) {
                            const tMatch = cleanChunk.match(/"[^"]+"\\s*:\\s*"(eyJpZCI6[^"]+)"/);
                            if (tMatch) nextToken = tMatch[1];
                        }
                    });
                    
                    const uniqueItems = Array.from(new Map(newItems.map(item => [item.id, item])).values());
                    
                    uniqueItems.forEach(movie => {
                        const a = document.createElement('a');
                        a.href = '/detail/' + movie.slug;
                        a.className = 'group relative block w-full aspect-[2/3] rounded-md overflow-hidden bg-[#141414] transition-transform duration-300 hover:scale-105 shadow-md border border-white/5';
                        a.innerHTML = '<img src="' + movie.thumbnailUrl + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" class="object-cover w-full h-full" loading="lazy" />' +
                                      '<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">' +
                                      '<h3 class="text-xs md:text-sm font-semibold text-white line-clamp-2 leading-snug">' + movie.title + '</h3></div>';
                        grid.appendChild(a);
                    });
                    
                    if (nextToken) {
                        btn.setAttribute('data-token', nextToken);
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    } else {
                        btn.style.display = 'none';
                    }
                    
                } catch (e) {
                    btn.innerHTML = 'Gagal memuat. Coba lagi.';
                    btn.disabled = false;
                }
            });
        });
      `}}></script>
    </div>,
    { title: `AllDrama - ${t(lang, 'library')}`, lang: lang }
  )
})
