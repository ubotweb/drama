import { createRoute } from 'honox/factory'
import { fetchMovieDetail, t } from '../../utils'

export default createRoute(async (c) => {
  // 1. Mengambil bahasa secara AMAN dari state Global (Cookie), bukan dari URL!
  const lang = c.get('lang') || 'id';
  const slug = c.req.param('slug');
  const detailData = await fetchMovieDetail(lang, slug);

  if (!detailData || !detailData.movie) {
    return c.render(<div class="text-center mt-32 text-white">{t(lang, 'not_found')}</div>);
  }

  const { movie, maxEpisode } = detailData;
  const totalEpisodes = maxEpisode > 0 ? maxEpisode : 1; 
  const episodes = Array.from({ length: totalEpisodes }, (_, i) => i + 1);

  return c.render(
    <div>
      <div class="relative w-full pt-16 pb-12 px-4 flex items-center justify-center min-h-[50vh]">
        <div class="absolute inset-0 bg-cover bg-center blur-3xl opacity-30" style={`background-image: url('${movie.thumbnailUrl}');`}></div>
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#000000]"></div>
        
        <div class="relative z-10 max-w-5xl w-full flex flex-col md:flex-row gap-8 items-center md:items-start mt-8">
          <img src={movie.thumbnailUrl} class="w-48 md:w-72 rounded-lg shadow-2xl shadow-black ring-1 ring-white/10" />
          <div class="text-center md:text-left flex-1">
            <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4">{movie.title}</h1>
            <div class="flex items-center justify-center md:justify-start gap-3 text-sm text-gray-400 mb-6">
              <span class="text-green-500 font-bold">{t(lang, 'suitable')}</span>
              <span>• {totalEpisodes} {t(lang, 'episode')}</span>
            </div>
            <p class="text-gray-300 text-sm md:text-base leading-relaxed mb-8">{movie.description}</p>
            {/* LINK EPISODE: Memasukkan variabel 'lang' yang sudah pasti ada nilainya (id/en/dst) */}
            <a href={`/episode/${lang}/${movie.slug}/1`} class="inline-flex w-full md:w-auto items-center justify-center bg-red-600 text-white font-bold px-10 py-4 rounded-md hover:bg-red-700 transition gap-2 shadow-lg shadow-red-900/40">
               ▶ {t(lang, 'watch_ep1')}
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 py-8">
        <h3 class="text-xl font-bold text-white mb-6">{t(lang, 'select_ep')}</h3>
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3">
          {episodes.map(ep => (
            {/* LINK EPISODE LIST: Memasukkan variabel 'lang' secara eksplisit */}
            <a href={`/episode/${lang}/${movie.slug}/${ep}`} class="bg-[#141414] border border-white/5 hover:border-white/20 hover:bg-[#262626] text-gray-300 text-center py-4 rounded-md font-medium text-sm transition-all shadow-sm">
              {ep}
            </a>
          ))}
        </div>
      </div>
    </div>,
    { title: `${movie.title} - AllDrama` }
  )
})
