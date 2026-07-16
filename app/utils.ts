export const API_BASE = "https://dramapi.ubot.web.id/api";

export async function fetchApiData(endpoint: string) {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) return [];
    const json = await res.json();
    if (json.status !== "success" || !json.data) return [];
    
    // DINAMIS: Mendeteksi key bahasa (id/en/ch) secara otomatis dari respon API
    const langKey = Object.keys(json.data)[0];
    if (!json.data[langKey] || !json.data[langKey].nextjs_ssr_data) return [];

    const rawData = json.data[langKey].nextjs_ssr_data;
    const extractedItems: any[] = [];

    // Parsing data kotor bawaan NextJS dari Shortflix
    rawData.forEach((chunk: string) => {
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

// FUNGSI BARU: Mengekstrak total episode secara dinamis dari SSR
// (Ditambahkan parameter lang)
export async function fetchMovieDetail(lang: string, slug: string) {
    const res = await fetch(`${API_BASE}/detail/${lang}/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "success" || !json.data) return null;

    const langKey = Object.keys(json.data)[0];
    if (!json.data[langKey] || !json.data[langKey].nextjs_ssr_data) return null;

    const rawData = json.data[langKey].nextjs_ssr_data;
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

export async function fetchEpisodeData(lang: string, slug: string, episode: string) {
    // Memanggil API dengan struktur lengkap: /api/episode/{lang}/{slug}/{episode}
    const res = await fetch(`${API_BASE}/episode/${lang}/${slug}/${episode}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "success" || !json.data) return null;

    const langKey = Object.keys(json.data)[0];
    if (!json.data[langKey] || !json.data[langKey].nextjs_ssr_data) return null;

    const rawData = json.data[langKey].nextjs_ssr_data;
    const fullText = rawData.join("").replace(/\\"/g, '"').replace(/\\\\/g, '\\');

    let videoUrl = "";
    let subtitleUrl = "";
    const targetEp = parseInt(episode, 10);

    // Kunci pencarian yang ketat (Mencari di mana episode ini persisnya berada di dalam SSR)
    const epIdentifier = `"episodeNumber":${targetEp}`;
    const epIdentifierSpace = `"episodeNumber": ${targetEp}`; 

    let startIndex = fullText.indexOf(epIdentifier);
    if (startIndex === -1) startIndex = fullText.indexOf(epIdentifierSpace);

    // Jika blok untuk episode ini ditemukan, kita HANYA mencari .m3u8 di sekitar blok ini saja
    if (startIndex !== -1) {
        // Ambil potongan teks spesifik untuk obyek episode ini (sekitar 3000 karakter ke depan)
        const searchArea = fullText.substring(startIndex, startIndex + 3000);
        
        const vidMatch = searchArea.match(/https:\/\/[^"'\s]*?\.m3u8/);
        if (vidMatch) videoUrl = vidMatch[0];

        const subMatch = searchArea.match(/https:\/\/[^"'\s]*?\.vtt/);
        if (subMatch) subtitleUrl = subMatch[0];
    }

    // FALLBACK AMAN: Jika objek NextJS diputarbalikkan struktur array-nya
    if (!videoUrl) {
        const parts = fullText.split('"episodeNumber":');
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            const epMatch = part.match(/^\s*(\d+)/);
            if (epMatch && parseInt(epMatch[1], 10) === targetEp) {
                const vidMatchAfter = part.match(/https:\/\/[^"'\s]*?\.m3u8/);
                if (vidMatchAfter) videoUrl = vidMatchAfter[0];
                
                const subMatchAfter = part.match(/https:\/\/[^"'\s]*?\.vtt/);
                if (subMatchAfter) subtitleUrl = subMatchAfter[0];
                
                if (videoUrl) break;
            }
        }
    }

    // FALLBACK TERAKHIR: Agar player tidak hitam sama sekali jika JSON rusak
    if (!videoUrl) {
        const fallbackVid = fullText.match(/https:\/\/[^"'\s]*?\.m3u8/);
        if (fallbackVid) videoUrl = fallbackVid[0];
        
        const fallbackSub = fullText.match(/https:\/\/[^"'\s]*?\.vtt/);
        if (fallbackSub) subtitleUrl = fallbackSub[0];
    }

    return { videoUrl, subtitleUrl };
}
