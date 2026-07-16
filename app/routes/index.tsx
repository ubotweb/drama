import { createRoute } from 'honox/factory'
import { fetchLibrary, t, getAppLang } from '../utils'

const loadMoreTexts: Record<string, string> = {
  'id': 'Tampilkan Lebih Banyak',
  'en': 'Load More',
  'vi': 'Tải thêm',
  'th': 'โหลดเพิ่มเติม',
  'es': 'Cargar más',
  'de': 'Mehr laden',
  'pt': 'Carregar mais',
  'ms': 'Muatkan Lagi',
  'it': 'Carica altro',
  'zh': '載入更多',
  'zh-cn': '加载更多',
  'fr': 'Charger plus',
  'ja': 'もっと読み込む',
  'tr': 'Daha Fazla Yükle',
  'ko': '더 보기',
  'ar': 'تحميل المزيد',
  'fil': 'I-load Pa'
};

export default createRoute(async (c) => {
  const currentLang = getAppLang(c); 
  
  // Mengambil API Paginasi Asli (Mendapatkan Film & nextPageToken)
  const { movies, nextPageToken } = await fetchLibrary(currentLang, "");
  
  const heroMovie = movies.length > 0 ? movies[Math.floor(Math.random() * movies.length)] : null;
  const loadMoreBtnText = loadMoreTexts[currentLang] || 'Load More';

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
           <p>Memuat Data...</p>
        </div>
      )}

      <div class="max-w-7xl mx-auto px-4 py-8">
        <h2 class="text-xl font-bold text-white mb-6">{t(currentLang, 'trending')}</h2>
        
        {movies.length > 0 ? (
          <>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-6" id="movies-grid">
              {movies.map((movie) => (
                <a href={`/detail/${movie.slug}`} class="group relative block w-full aspect-[2/3] rounded-md overflow-hidden bg-[#141414] transition-transform duration-300 hover:scale-105 shadow-md border border-white/5">
                  <img src={movie.thumbnailUrl} alt={movie.title} class="object-cover w-full h-full" loading="lazy" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <h3 class="text-xs md:text-sm font-semibold text-white line-clamp-2 leading-snug">{movie.title}</h3>
                  </div>
                </a>
              ))}
            </div>

            {/* Tombol akan muncul hanya jika Token Paginasi Asli Tersedia */}
            {nextPageToken && (
              <div class="flex justify-center mt-4 mb-12">
                <button id="load-more-btn" data-token={nextPageToken} class="bg-[#1a1a1a] hover:bg-red-600 text-white px-8 py-3.5 rounded-full font-bold transition-all border border-white/10 hover:border-red-600 shadow-lg flex items-center gap-2">
                  <span>{loadMoreBtnText}</span>
                  <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div class="text-gray-500 text-sm py-4">Belum ada drama yang tersedia untuk bahasa ini.</div>
        )}
      </div>

      {/* SCRIPT FETCH PAGINASI API REAL-TIME */}
      <script dangerouslySetInnerHTML={{__html: `
        document.addEventListener("DOMContentLoaded", function() {
            const btn = document.getElementById('load-more-btn');
            const grid = document.getElementById('movies-grid');
            if (!btn || !grid) return;

            btn.addEventListener('click', async function() {
                const token = btn.getAttribute('data-token');
                if (!token) return;

                const originalText = btn.innerHTML;
                btn.innerHTML = 'Memuat Data...';
                btn.disabled = true;

                try {
                    const lang = document.documentElement.lang || 'id';
                    const apiBase = "https://dramapi.ubot.web.id/api";
                    const fetchUrl = apiBase + '/library/' + lang + '?pageToken=' + encodeURIComponent(token);
                    
                    const res = await fetch(fetchUrl);
                    const json = await res.json();
                    
                    const langData = json?.data?.[lang] || json?.data?.id || json?.data?.en || json?.data?.zh || json?.data;
                    const rawData = langData?.nextjs_ssr_data || [];
                    
                    let newItems = [];
                    let nextToken = null;
                    
                    rawData.forEach(chunk => {
                        const cleanChunk = chunk.replace(/\\\\"/g, '"').replace(/\\\\\\\\/g, '\\\\').replace(/\\\\\\//g, '/');
                        const regex = /"id":"(\\\\d+)","title":"(.*?)","description":"(.*?)","slug":"(.*?)","thumbnailUrl":"(.*?)"/g;
                        let match;
                        while ((match = regex.exec(cleanChunk)) !== null) {
                            newItems.push({ id: match[1], title: match[2], description: match[3], slug: match[4], thumbnailUrl: match[5] });
                        }
                        
                        if (!nextToken) {
                            const tMatch = cleanChunk.match(/"(?:nextPageToken|pageToken)"\\s*:\\s*"([^"]+)"/);
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
    { title: `AllDrama - ${t(currentLang, 'home')}`, lang: currentLang }
  )
})
