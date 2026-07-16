export const API_BASE = "https://dramapi.ubot.web.id/api";

// =====================================================================
// SISTEM KAMUS UI MULTI-BAHASA DINAMIS (i18n)
// =====================================================================
const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
    'id': { home: "Beranda", account: "Akun", trending: "Drama Pilihan", watch_now: "Mulai Tonton", suitable: "Cocok untukmu", episode: "Episode", watch_ep1: "Tonton Episode 1", select_ep: "Pilih Episode", prev: "Sebelumnya", next: "Selanjutnya", ep_list: "Daftar Episode", locked: "Episode Premium Terkunci", limit: "Batas Episode Tercapai", watch_ad: "Tonton Iklan (Buka 1 Ep)", vip: "Berlangganan VIP", login: "Login Sekarang", not_found: "Data tidak ditemukan", no_video: "Video belum tersedia untuk negara ini.", limit_desc: "Pengguna tanpa akun hanya dapat menonton hingga episode 10. Silakan login untuk menonton lebih banyak secara gratis.", locked_desc: "Anda telah mencapai batas 15 episode gratis. Tonton satu iklan singkat untuk membuka episode ini, atau jadilah VIP." },
    'en': { home: "Home", account: "Account", trending: "Trending Now", watch_now: "Watch Now", suitable: "Good for you", episode: "Episodes", watch_ep1: "Watch Episode 1", select_ep: "Select Episode", prev: "Previous", next: "Next", ep_list: "Episode List", locked: "Premium Episode Locked", limit: "Episode Limit Reached", watch_ad: "Watch Ad (Unlock 1 Ep)", vip: "Subscribe VIP", login: "Login Now", not_found: "Data not found", no_video: "Video is not available for this country.", limit_desc: "Guests can only watch up to episode 10. Please log in to watch more for free.", locked_desc: "You have reached the 15 free episodes limit. Watch a short ad to unlock this episode, or become a VIP." },
    'zh': { home: "首頁", account: "帳戶", trending: "熱門趨勢", watch_now: "立即觀看", suitable: "為您推薦", episode: "集", watch_ep1: "觀看第1集", select_ep: "選擇集數", prev: "上一集", next: "下一集", ep_list: "集數列表", locked: "高級集數已鎖定", limit: "達到集數限制", watch_ad: "觀看廣告 (解鎖1集)", vip: "訂閱 VIP", login: "立即登入", not_found: "找不到數據", no_video: "該國家/地區暫無視頻。", limit_desc: "未登入用戶最多只能觀看至第10集。請登入以免費觀看更多。", locked_desc: "您已達到15集免費觀看上限。觀看簡短廣告解鎖此集，或成為 VIP。" },
    'zh-cn': { home: "首页", account: "账户", trending: "热门趋势", watch_now: "立即观看", suitable: "为您推荐", episode: "集", watch_ep1: "观看第1集", select_ep: "选择集数", prev: "上一集", next: "下一集", ep_list: "集数列表", locked: "高级集数已锁定", limit: "达到集数限制", watch_ad: "观看广告 (解锁1集)", vip: "订阅 VIP", login: "立即登录", not_found: "找不到数据", no_video: "该国家/地区暂无视频。", limit_desc: "未登录用户最多只能观看至第10集。请登录以免费观看更多。", locked_desc: "您已达到15集免费观看上限。观看简短广告解锁此集，或成为 VIP。" }
    // Jika bahasa lain (seperti ar, ja, dll) diakses, akan otomatis fallback ke 'en'
};

export function t(lang: string, key: string): string {
    const dictionary = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
    return dictionary[key] || UI_TRANSLATIONS['en'][key] || key;
}

// =====================================================================
// KEAMANAN KRIPTOGRAFI NATIVE (CLOUDFLARE WORKERS)
// =====================================================================
export async function hashPassword(password: string, providedSalt?: string) {
    const enc = new TextEncoder();
    let salt: Uint8Array;
    
    if (providedSalt) {
        salt = Uint8Array.from(providedSalt.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    } else {
        salt = crypto.getRandomValues(new Uint8Array(16));
    }

    const keyMaterial = await crypto.subtle.importKey(
        "raw", 
        enc.encode(password), 
        { name: "PBKDF2" }, 
        false, 
        ["deriveBits"]
    );

    const hashBuffer = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" }, 
        keyMaterial, 
        256
    );

    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string) {
    const [saltHex, hashHex] = storedHash.split(':');
    if (!saltHex || !hashHex) return false;
    const attempt = await hashPassword(password, saltHex);
    return attempt === storedHash;
}

// =====================================================================
// API FETCHERS
// =====================================================================
export async function fetchCatalog(lang: string) {
    const res = await fetch(`${API_BASE}/catalog/${lang}`);
    if (!res.ok) return [];
    const json = await res.json();
    if (json.status !== "success" || !json.data || !json.data[lang] || !json.data[lang].nextjs_ssr_data) return [];
    
    const rawData = json.data[lang].nextjs_ssr_data;
    const extractedItems: any[] = [];

    rawData.forEach((chunk: string) => {
        const regex = /{"id":"(\d+)","title":"(.*?)","description":"(.*?)","slug":"(.*?)","thumbnailUrl":"(.*?)"/g;
        let match;
        while ((match = regex.exec(chunk)) !== null) {
            extractedItems.push({
                id: match[1],
                title: match[2].replace(/\\"/g, '"').replace(/\\\\/g, ''),
                description: match[3].replace(/\\n/g, ' ').replace(/\\"/g, '"').replace(/\\\\/g, ''),
                slug: match[4],
                thumbnailUrl: match[5]
            });
        }
    });

    return Array.from(new Map(extractedItems.map(item => [item.id, item])).values());
}

export async function fetchMovieDetail(lang: string, slug: string) {
    const res = await fetch(`${API_BASE}/detail/${lang}/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "success" || !json.data || !json.data[lang] || !json.data[lang].nextjs_ssr_data) return null;

    const rawData = json.data[lang].nextjs_ssr_data;
    let movie: any = null;
    let maxEpisode = 0;

    rawData.forEach((chunk: string) => {
        if (!movie) {
            const titleMatch = chunk.match(/"title":"(.*?)".*?"slug":"(.*?)"/);
            const descMatch = chunk.match(/"description":"(.*?)"/);
            const thumbMatch = chunk.match(/"thumbnailUrl":"(.*?)"/);
            
            if (titleMatch && titleMatch[2] === slug) {
                movie = {
                    title: titleMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, ''),
                    description: descMatch ? descMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"').replace(/\\\\/g, '') : '',
                    slug: titleMatch[2],
                    thumbnailUrl: thumbMatch ? thumbMatch[1] : ''
                };
            }
        }

        const epRegex = /"episodeNumber":(\d+)/g;
        let epMatch;
        while ((epMatch = epRegex.exec(chunk)) !== null) {
            const epNum = parseInt(epMatch[1], 10);
            if (epNum > maxEpisode) maxEpisode = epNum;
        }
    });

    return { movie, maxEpisode };
}

export async function fetchEpisodeData(lang: string, slug: string, episode: string) {
    const res = await fetch(`${API_BASE}/episode/${lang}/${slug}/${episode}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "success" || !json.data || !json.data[lang] || !json.data[lang].nextjs_ssr_data) return null;

    const rawData = json.data[lang].nextjs_ssr_data;
    let videoUrl = "";
    let subtitleUrl = "";

    rawData.forEach((chunk: string) => {
        const videoMatch = chunk.match(/https:\/\/[^"'\s]*?\.m3u8/);
        if (videoMatch) videoUrl = videoMatch[0];

        const subMatch = chunk.match(/https:\/\/[^"'\s]*?\.vtt/);
        if (subMatch) subtitleUrl = subMatch[0];
    });

    return { videoUrl, subtitleUrl };
}
