import { createRoute } from 'honox/factory'
import { fetchEpisodeData, fetchMovieDetail, t } from '../../../../utils'

export default createRoute(async (c) => {
  const lang = c.req.param('lang'); 
  const slug = c.req.param('slug');
  const episodeStr = c.req.param('episode');
  const episode = parseInt(episodeStr, 10);
  const user = c.get('user');

  if (!user && episode > 10) {
    return c.render(
      <div class="min-h-screen flex items-center justify-center px-4 pt-16">
        <div class="max-w-md w-full text-center p-8 bg-[#141414] rounded-2xl border border-white/10 shadow-2xl">
          <div class="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🔒</div>
          <h2 class="text-2xl font-bold text-white mb-3">{t(lang, 'limit')}</h2>
          <p class="text-gray-400 mb-8 text-sm leading-relaxed">{t(lang, 'limit_desc')}</p>
          <a href="/login" class="block w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-lg font-bold transition">{t(lang, 'login')}</a>
        </div>
      </div>,
      { title: `AllDrama - ${t(lang, 'limit')}`, lang: lang }
    );
  }

  if (user && !user.is_premium && episode > 15) {
    const unlocked = await c.env.DB.prepare("SELECT 1 FROM unlocked_ads WHERE user_id = ? AND slug = ? AND episode = ?")
      .bind(user.id, slug, episode).first();

    if (!unlocked) {
      return c.render(
        <div class="min-h-screen flex items-center justify-center px-4 pt-16">
          <div class="max-w-md w-full text-center p-8 bg-[#141414] rounded-2xl border border-white/10 shadow-2xl">
             <div class="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">💎</div>
            <h2 class="text-2xl font-bold text-white mb-3">{t(lang, 'locked')}</h2>
            <p class="text-gray-400 mb-8 text-sm leading-relaxed">{t(lang, 'locked_desc')}</p>
            <div class="flex flex-col gap-3">
               <form method="POST" action={`/api/unlock-ad`}>
                 <input type="hidden" name="lang" value={lang} />
                 <input type="hidden" name="slug" value={slug} />
                 <input type="hidden" name="episode" value={episode} />
                 <button type="submit" class="w-full bg-white text-black hover:bg-gray-200 py-3.5 rounded-lg font-bold transition flex justify-center items-center gap-2">
                   ▶ {t(lang, 'watch_ad')}
                 </button>
               </form>
               <button class="w-full border border-yellow-600 text-yellow-500 hover:bg-yellow-600/10 py-3.5 rounded-lg font-bold transition">{t(lang, 'vip')}</button>
            </div>
          </div>
        </div>,
        { title: `AllDrama - ${t(lang, 'locked')}`, lang: lang }
      );
    }
  }

  const media = await fetchEpisodeData(lang, slug, episodeStr);
  const detailData = await fetchMovieDetail(lang, slug);
  const totalEpisodes = detailData?.maxEpisode || episode + 5; 
  const episodes = Array.from({ length: totalEpisodes }, (_, i) => i + 1);
  
  if (!media || !media.videoUrl) {
    return c.render(<div class="text-center mt-32 text-white">{t(lang, 'no_video')}</div>, { lang: lang });
  }

  return c.render(
    <div class="pt-16">
      <div class="w-full bg-black border-b border-white/10">
        <div class="max-w-5xl mx-auto aspect-[9/16] md:aspect-video relative">
            <video id="player" controls crossorigin="anonymous" class="w-full h-full object-contain bg-black">
                {media.subtitleUrl && <track label={lang.toUpperCase()} kind="subtitles" srclang={lang} src={media.subtitleUrl} default />}
            </video>
        </div>
      </div>
      
      <div class="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
             <h1 class="text-2xl font-bold text-white mb-1">{t(lang, 'episode')} {episode}</h1>
             <p class="text-gray-400 text-sm">{detailData?.movie?.title || slug}</p>
         </div>
         <div class="flex gap-2 w-full sm:w-auto">
            {episode > 1 && <a href={`/episode/${lang}/${slug}/${episode - 1}`} class="flex-1 sm:flex-none text-center bg-[#262626] hover:bg-[#333] text-white px-6 py-3 rounded-md text-sm font-semibold transition">{t(lang, 'prev')}</a>}
            <a href={`/episode/${lang}/${slug}/${episode + 1}`} class="flex-1 sm:flex-none text-center bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-md text-sm font-bold transition">{t(lang, 'next')}</a>
         </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 pb-12">
        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t(lang, 'ep_list')}</h3>
        <div class="flex overflow-x-auto gap-2 pb-4 hide-scrollbar snap-x">
            {episodes.map(ep => (
                <a href={`/episode/${lang}/${slug}/${ep}`} class={`snap-start shrink-0 px-5 py-3 rounded-md font-medium text-sm transition-all ${ep === episode ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'bg-[#141414] border border-white/5 text-gray-400 hover:bg-[#262626]'}`}>
                    {ep}
                </a>
            ))}
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        const video = document.getElementById('player');
        const source = "${media.videoUrl}";
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.play();
        }
      `}}></script>
    </div>,
    { title: `${t(lang, 'episode')} ${episode} - AllDrama`, lang: lang }
  )
})
