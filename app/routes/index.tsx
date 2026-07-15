import { createRoute } from 'honox/factory'
import { fetchApiData } from '../utils'

export default createRoute(async (c) => {
  // 1. Ambil data dari API Anda yang sudah Anda buat sebelumnya
  const movies = await fetchApiData('/catalog/id')

  // 2. Render data tersebut menjadi antarmuka HTML menggunakan HonoX (JSX)
  return c.render(
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Katalog Drama & Short Film</h1>
      
      {movies.length === 0 ? (
        <p>Tidak ada drama yang ditemukan atau API gagal merespons.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <a href={`/detail/${movie.slug}`} key={movie.id} className="block group">
              <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 transition-transform transform group-hover:scale-105">
                <img 
                  src={movie.thumbnailUrl} 
                  alt={movie.title} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white truncate">{movie.title}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
})
