import { createRoute } from 'honox/factory'
import { fetchMovieDetail } from '../../utils'

export default createRoute(async (c) => {
  const slug = c.req.param('slug');
  const detailData = await fetchMovieDetail(slug);

  if (!detailData || !detailData.movie) {
    return c.render(<div class="text-center mt-20 text-white">Data tidak ditemukan</div>);
  }

  const { movie, maxEpisode } = detailData;
  // Generate tombol episode secara dinamis berapapun jumlahnya (misal 100+)
  const totalEpisodes = maxEpisode > 0 ? maxEpisode : 1; 
  const episodes = Array.from({ length: totalEpisodes }, (_, i) => i + 1);

  return c.render(
    <div class="max-w-4xl mx-auto px-4">
      <div class="flex flex-col md:flex-row gap-6 mb-10">
        <img src={movie.thumbnailUrl} class="w-full md:w-64 rounded-xl shadow-2xl shadow-red-900/20" />
        <div>
          <h1 class="text-3xl font-bold mb-3">{movie.title}</h1>
          <p class="text-gray-400 text-sm leading-relaxed mb-6">{movie.description}</p>
          <a href={`/episode/${movie.slug}/1`} class="inline-block bg-red-600 text-white font-bold px-8 py-3 rounded-full hover:bg-red-700 hover:scale-105 transition">▶ Putar Episode 1</a>
        </div>
      </div>

      <h3 class="text-xl font-bold mb-4">Daftar Episode ({totalEpisodes} Episode)</h3>
      <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
        {episodes.map(ep => (
          <a href={`/episode/${movie.slug}/${ep}`} class="bg-gray-800 hover:bg-gray-700 text-center py-3 rounded-lg font-mono text-sm transition">
            {ep}
          </a>
        ))}
      </div>
    </div>,
    { title: `${movie.title} - AllDrama` }
  )
})
