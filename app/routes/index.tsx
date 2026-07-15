import { createRoute } from 'honox/factory'
import { fetchApiData } from '../utils'

export default createRoute(async (c) => {
  const movies = await fetchApiData('/catalog/id');

  return c.render(
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-xl font-bold mb-6 border-l-4 border-red-600 pl-3">Mungkin Kamu Suka</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <a href={`/detail/${movie.slug}`} class="group relative block aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 transition hover:ring-2 hover:ring-red-600">
            <img src={movie.thumbnailUrl} alt={movie.title} class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
              <h3 class="text-sm font-semibold line-clamp-2">{movie.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </div>,
    { title: 'Beranda - AllDrama' }
  )
})
