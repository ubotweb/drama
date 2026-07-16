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
        // Regex dengan opsional backslash (\?)
        const regex = /{\\?"id\\?":\\?"(\d+)\\?",\\?"title\\?":\\?"(.*?)\\?",\\?"description\\?":\\?"(.*?)\\?",\\?"slug\\?":\\?"(.*?)\\?",\\?"thumbnailUrl\\?":\\?"(.*?)\\?"/g;
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

// Mengekstrak total episode secara dinamis dari SSR
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
            const titleMatch = chunk.match(/\\?"title\\?":\\?"(.*?)".*?\\?"slug\\?":\\?"(.*?)\\?"/);
            const descMatch = chunk.match(/\\?"description\\?":\\?"(.*?)\\?"/);
            const thumbMatch = chunk.match(/\\?"thumbnailUrl\\?":\\?"(.*?)\\?"/);
            
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
        const epRegex = /\\?"episodeNumber\\?":(\d+)/g;
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

// Mengekstrak Data Video Spesifik Berdasarkan Episode
export async function fetchEpisodeData(slug: string, episode: string) {
    const res = await fetch(`${API_BASE}/episode/id/${slug}/${episode}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "success" || !json.data || !json.data.id || !json.data.id.nextjs_ssr_data) return null;

    const rawData = json.data.id.nextjs_ssr_data;
    let videoUrl = "";
    let subtitleUrl = "";
    
    // Pastikan kita mencari episode dengan bentuk angka (Integer)
    const targetEp = parseInt(episode, 10);

    rawData.forEach((chunk: string) => {
        // Hapus escape backslash (\") agar format JSON lebih bersih dan mudah di-regex
        const cleanChunk = chunk.replace(/\\"/g, '"');

        // Pola pencarian ketat agar M3U8 yang diambil PASTI milik episode yang sedang diklik.
        // (?!\d) mencegah angka 2 me-match angka 20 atau 21
        // [^{}]*? memastikan kita hanya mencari URL di dalam blok obyek JSON yang sama.
        const epPattern = `"episodeNumber":\\s*${targetEp}(?!\\d)`;
        const vidPattern = `"videoUrl":\\s*"(https:\/\/[^"\\s]*?\\.m3u8)"`;
        const subPattern = `"subtitleUrl":\\s*"(https:\/\/[^"\\s]*?\\.vtt)"`;

        // 1. Cari M3U8 (Kemungkinan A: Nomor Episode disebut duluan di data JSON)
        const vidRegexA = new RegExp(`${epPattern}[^{}]*?${vidPattern}`);
        const matchVidA = cleanChunk.match(vidRegexA);
        if (matchVidA) videoUrl = matchVidA[1];

        // 1. Cari M3U8 (Kemungkinan B: URL Video disebut duluan sebelum Nomor Episode)
        const vidRegexB = new RegExp(`${vidPattern}[^{}]*?${epPattern}`);
        const matchVidB = cleanChunk.match(vidRegexB);
        if (matchVidB && !videoUrl) videoUrl = matchVidB[1];

        // 2. Cari VTT / Subtitle (Kemungkinan A & B)
        const subRegexA = new RegExp(`${epPattern}[^{}]*?${subPattern}`);
        const matchSubA = cleanChunk.match(subRegexA);
        if (matchSubA) subtitleUrl = matchSubA[1];

        const subRegexB = new RegExp(`${subPattern}[^{}]*?${epPattern}`);
        const matchSubB = cleanChunk.match(subRegexB);
        if (matchSubB && !subtitleUrl) subtitleUrl = matchSubB[1];
    });

    // Fallback Darurat: Jika karena suatu alasan struktur JSON berubah drastis 
    // dan gagal ditemukan, fallback mengambil .m3u8 dan .vtt apa pun yang ada agar player tidak blank.
    if (!videoUrl) {
        rawData.forEach((chunk: string) => {
            const cleanChunk = chunk.replace(/\\"/g, '"');
            const fallbackVid = cleanChunk.match(/https:\/\/[^"'\s]*?\.m3u8/);
            if (fallbackVid && !videoUrl) videoUrl = fallbackVid[0];
            
            const fallbackSub = cleanChunk.match(/https:\/\/[^"'\s]*?\.vtt/);
            if (fallbackSub && !subtitleUrl) subtitleUrl = fallbackSub[0];
        });
    }

    return { videoUrl, subtitleUrl };
}
