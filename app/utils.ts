export const API_BASE = "https://dramapi.ubot.web.id/api";

export async function fetchApiData(endpoint: string) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) return [];
        const json = await res.json();
        if (json.status !== "success" || !json.data) return [];
        
        // Deteksi key bahasa (id/en/ch) secara dinamis
        const langKey = Object.keys(json.data)[0];
        if (!langKey || !json.data[langKey].nextjs_ssr_data) return [];

        const rawData = json.data[langKey].nextjs_ssr_data;
        
        // GABUNGKAN teks dan BUKA semua backslash agar Regex tidak pernah gagal
        const fullText = rawData.join("").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        
        const extractedItems: any[] = [];
        
        // Regex bersih yang akan langsung menangkap katalog tanpa peduli struktur objek
        const regex = /"id":"(\d+)","title":"(.*?)","description":"(.*?)","slug":"(.*?)","thumbnailUrl":"(.*?)"/g;
        
        let match;
        while ((match = regex.exec(fullText)) !== null) {
            extractedItems.push({
                id: match[1],
                title: match[2],
                description: match[3],
                slug: match[4],
                thumbnailUrl: match[5]
            });
        }

        // Hapus duplikat
        const uniqueItems = Array.from(new Map(extractedItems.map(item => [item.id, item])).values());
        return uniqueItems;
    } catch (error) {
        console.error("Fetch API Error:", error);
        return [];
    }
}

// PARAMETER DIKEMBALIKAN (slug dahulu). Lang dijadikan opsional di akhir agar TIDAK ERROR dengan route lama.
export async function fetchMovieDetail(slug: string, lang: string = "id") {
    try {
        const res = await fetch(`${API_BASE}/detail/${lang}/${slug}`);
        if (!res.ok) return null;
        const json = await res.json();
        if (json.status !== "success" || !json.data) return null;

        const langKey = Object.keys(json.data)[0];
        if (!langKey || !json.data[langKey].nextjs_ssr_data) return null;

        const rawData = json.data[langKey].nextjs_ssr_data;
        const fullText = rawData.join("").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        
        let movie: any = null;
        let maxEpisode = 0;

        const titleMatch = fullText.match(/"title":"(.*?)".*?"slug":"(.*?)"/);
        const descMatch = fullText.match(/"description":"(.*?)"/);
        const thumbMatch = fullText.match(/"thumbnailUrl":"(.*?)"/);
        
        if (titleMatch && titleMatch[2] === slug) {
            movie = {
                title: titleMatch[1],
                description: descMatch ? descMatch[1] : '',
                slug: titleMatch[2],
                thumbnailUrl: thumbMatch ? thumbMatch[1] : ''
            };
        }

        const epRegex = /"episodeNumber":(\d+)/g;
        let epMatch;
        while ((epMatch = epRegex.exec(fullText)) !== null) {
            const epNum = parseInt(epMatch[1], 10);
            if (epNum > maxEpisode) {
                maxEpisode = epNum;
            }
        }

        return { movie, maxEpisode };
    } catch (error) {
        return null;
    }
}

// PARAMETER DIKEMBALIKAN (slug, episode). Lang opsional agar cocok dengan router Anda.
export async function fetchEpisodeData(slug: string, episode: string, lang: string = "id") {
    try {
        const res = await fetch(`${API_BASE}/episode/${lang}/${slug}/${episode}`);
        if (!res.ok) return null;
        const json = await res.json();
        if (json.status !== "success" || !json.data) return null;

        const langKey = Object.keys(json.data)[0];
        if (!langKey || !json.data[langKey].nextjs_ssr_data) return null;

        const rawData = json.data[langKey].nextjs_ssr_data;
        const fullText = rawData.join("").replace(/\\"/g, '"').replace(/\\\\/g, '\\');

        let videoUrl = "";
        let subtitleUrl = "";
        const targetEp = parseInt(episode, 10);

        // Cari blok tepat di mana nomor episode ini berada
        const epIdentifier = `"episodeNumber":${targetEp}`;
        const epIdentifierSpace = `"episodeNumber": ${targetEp}`; 

        let startIndex = fullText.indexOf(epIdentifier);
        if (startIndex === -1) startIndex = fullText.indexOf(epIdentifierSpace);

        // Jika ketemu, ekstrak video yang ada tepat di sebelah tulisan episode tersebut
        if (startIndex !== -1) {
            const searchArea = fullText.substring(startIndex, startIndex + 3000);
            
            const vidMatch = searchArea.match(/https:\/\/[^"'\s]*?\.m3u8/);
            if (vidMatch) videoUrl = vidMatch[0];

            const subMatch = searchArea.match(/https:\/\/[^"'\s]*?\.vtt/);
            if (subMatch) subtitleUrl = subMatch[0];
        }

        // Fallback 1: Jika pemisahan koma berbeda strukturnya
        if (!videoUrl) {
            const parts = fullText.split(/"episodeNumber":\s*/);
            for (let i = 1; i < parts.length; i++) {
                const part = parts[i];
                const epMatch = part.match(/^(\d+)/);
                if (epMatch && parseInt(epMatch[1], 10) === targetEp) {
                    const vidMatchAfter = part.match(/https:\/\/[^"'\s]*?\.m3u8/);
                    if (vidMatchAfter) videoUrl = vidMatchAfter[0];
                    
                    const subMatchAfter = part.match(/https:\/\/[^"'\s]*?\.vtt/);
                    if (subMatchAfter) subtitleUrl = subMatchAfter[0];
                    
                    if (videoUrl) break;
                }
            }
        }

        // Fallback 2: Pastikan tidak blank hitam meskipun formatnya amburadul
        if (!videoUrl) {
            const fallbackVid = fullText.match(/https:\/\/[^"'\s]*?\.m3u8/);
            if (fallbackVid) videoUrl = fallbackVid[0];
            
            const fallbackSub = fullText.match(/https:\/\/[^"'\s]*?\.vtt/);
            if (fallbackSub) subtitleUrl = fallbackSub[0];
        }

        return { videoUrl, subtitleUrl };
    } catch (error) {
        return null;
    }
}
