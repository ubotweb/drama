export const API_BASE = "https://dramapi.ubot.web.id/api";

export async function fetchApiData(endpoint: string) {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) return [];
    const json = await res.json();
    if (json.status !== "success" || !json.data || !json.data.id || !json.data.id.nextjs_ssr_data) return [];
    
    const rawData = json.data.id.nextjs_ssr_data;
    const extractedItems: any[] = [];

    // Parsing data kotor bawaan NextJS dari Shortflix
    rawData.forEach((chunk: string) => {
        const regex = /{"id":"(\d+)","title":"(.*?)","description":"(.*?)","slug":"(.*?)","thumbnailUrl":"(.*?)"/g;
        let match;
        while ((match = regex.exec(chunk)) !== null) {
            extractedItems.push({
                id: match[1],
                title: match[2].replace(/\\"/g, '"'),
                description: match[3].replace(/\\n/g, ' ').replace(/\\"/g, '"'),
                slug: match[4],
                thumbnailUrl: match[5]
            });
        }
    });

    // Hapus duplikat berdasarkan ID
    const uniqueItems = Array.from(new Map(extractedItems.map(item => [item.id, item])).values());
    return uniqueItems;
}

// FUNGSI BARU: Mengekstrak total episode secara dinamis dari SSR
export async function fetchMovieDetail(slug: string) {
    const res = await fetch(`${API_BASE}/detail/id/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "success" || !json.data || !json.data.id || !json.data.id.nextjs_ssr_data) return null;

    const rawData = json.data.id.nextjs_ssr_data;
    let movie: any = null;
    let maxEpisode = 0;

    rawData.forEach((chunk: string) => {
        // Deteksi metadata film
        if (!movie) {
            const titleMatch = chunk.match(/"title":"(.*?)".*?"slug":"(.*?)"/);
            const descMatch = chunk.match(/"description":"(.*?)"/);
            const thumbMatch = chunk.match(/"thumbnailUrl":"(.*?)"/);
            
            // Pastikan slug cocok agar tidak salah ambil film rekomendasi
            if (titleMatch && titleMatch[2] === slug) {
                movie = {
                    title: titleMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, ''),
                    description: descMatch ? descMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"').replace(/\\\\/g, '') : '',
                    slug: titleMatch[2],
                    thumbnailUrl: thumbMatch ? thumbMatch[1] : ''
                };
            }
        }

        // Ekstrak semua episodeNumber untuk mencari total episode sebenarnya
        const epRegex = /"episodeNumber":(\d+)/g;
        let epMatch;
        while ((epMatch = epRegex.exec(chunk)) !== null) {
            const epNum = parseInt(epMatch[1], 10);
            if (epNum > maxEpisode) {
                maxEpisode = epNum;
            }
        }
    });

    return { movie, maxEpisode };
}

export async function fetchEpisodeData(slug: string, episode: string) {
    const res = await fetch(`${API_BASE}/episode/id/${slug}/${episode}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "success" || !json.data || !json.data.id || !json.data.id.nextjs_ssr_data) return null;

    const rawData = json.data.id.nextjs_ssr_data;
    let videoUrl = "";
    let subtitleUrl = "";

    rawData.forEach((chunk: string) => {
        // Cari URL M3U8
        const videoMatch = chunk.match(/https:\/\/[^"'\s]*?\.m3u8/);
        if (videoMatch) videoUrl = videoMatch[0];

        // Cari URL Subtitle VTT
        const subMatch = chunk.match(/https:\/\/[^"'\s]*?\.vtt/);
        if (subMatch) subtitleUrl = subMatch[0];
    });

    return { videoUrl, subtitleUrl };
}
