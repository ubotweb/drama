import { createRoute } from 'honox/factory'
import { fetchEpisodeData } from '../../../../utils'

export default createRoute(async (c) => {
  // Menangkap parameter dari URL (termasuk bahasa)
  const lang = c.req.param('lang');
  const slug = c.req.param('slug');
  const episodeStr = c.req.param('episode');
  const episode = parseInt(episodeStr, 10);
  const user = c.get('user');

  // ==========================================================
  // LOGIKA BISNIS LIMITASI EPISODE (Dengan Validasi JWT)
  // ==========================================================
  
  // 1. Jika Guest (Belum Login / Token Invalid) & Akses Episode > 10
  if (!user && episode > 10) {
    return c.render(
      <div class="max-w-xl mx-auto text-center mt-20 p-6 bg-gray-900 rounded-2xl border border-gray-800">
        <h2 class="text-2xl font-bold text-white mb-2">Batas Episode Tercapai</h2>
        <p class="text-gray-400 mb-6">Pengguna tanpa akun hanya dapat menonton hingga episode 10. Silakan login untuk melanjutkan hingga episode 15 secara gratis.</p>
        <a href="/login" class="bg-red-600 text-white px-6 py-2 rounded-full font-bold">Login Sekarang</a>
      </div>,
      { title: 'Batas Episode - AllDrama' }
    );
  }

  // 2. Jika User Gratis & Akses Episode > 15
  if (user && !user.is_premium && episode > 15) {
    // Cek apakah episode ini sudah dibuka via Iklan di Database
    const unlocked = await c.env.DB.prepare("SELECT 1 FROM unlocked_ads WHERE user_id = ? AND slug = ? AND episode = ?")
      .bind(user.id, slug, episode).first();

    if (!unlocked) {
      return c.render(
        <div class="max-w-xl mx-auto text-center mt-20 p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <h2 class="text-2xl font-bold text-yellow-500 mb-2">Episode Premium Terkunci</h2>
          <p class="text-gray-400 mb-6">Anda telah mencapai batas 15 episode gratis. Tonton satu iklan singkat untuk membuka episode ini, atau langganan VIP untuk akses tanpa batas.</p>
          <div class="flex flex-col gap-3">
             <form method="POST" action={`/api/unlock-ad`}>
               <input type="hidden" name="slug" value={slug} />
               <input type="hidden" name="episode" value={episode} />
               <button type="submit" class="w-full bg-blue-600 text-white px-6 py-3 rounded-full font-bold">▶ Tonton Iklan (Buka 1 Episode)</button>
             </form>
             <button class="w-full bg-yellow-600 text-white px-6 py-3 rounded-full font-bold">💎 Berlangganan VIP</button>
          </div>
        </div>,
        { title: 'Terkunci - AllDrama' }
      );
    }
  }

  // ==========================================================
  // JIKA LOLOS LIMIT, TAMPILKAN VIDEO PLAYER
  // ==========================================================
  
  // Mengirim parameter lang, slug, dan episode ke fungsi fetch
  const media = await fetchEpisodeData(lang, slug, episodeStr);
  
  if (!media || !media.videoUrl) {
    return c.render(<div class="text-center mt-20">Gagal memuat video atau episode belum tersedia.</div>);
  }

  return c.render(
    <div class="max-w-3xl mx-auto">
      <div class="bg-black rounded-lg overflow-hidden shadow-xl aspect-[9/16] md:aspect-video mb-6">
        <video id="player" controls crossorigin="anonymous" class="w-full h-full object-contain bg-black">
            {media.subtitleUrl && <track label="Indonesia" kind="subtitles" srclang="id" src={media.subtitleUrl} default />}
        </video>
      </div>
      
      <div class="px-4 flex justify-between items-center mb-10">
         <h1 class="text-xl font-bold">Episode {episode}</h1>
         <div class="flex gap-2">
            {episode > 1 && <a href={`/episode/${lang}/${slug}/${episode - 1}`} class="bg-gray-800 px-4 py-2 rounded-lg text-sm">Prev</a>}
            <a href={`/episode/${lang}/${slug}/${episode + 1}`} class="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold">Next</a>
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
    { title: `Episode ${episode} - AllDrama` }
  )
})
