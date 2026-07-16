export const API_BASE = "https://dramapi.ubot.web.id/api";

// =====================================================================
// SISTEM KAMUS UI MULTI-BAHASA DINAMIS (i18n) - 17 BAHASA GLOBAL
// =====================================================================
const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
    'id': { home: "Beranda", account: "Akun", trending: "Drama Pilihan", watch_now: "Mulai Tonton", suitable: "Cocok untukmu", episode: "Episode", watch_ep1: "Tonton Episode 1", select_ep: "Pilih Episode", prev: "Sebelumnya", next: "Selanjutnya", ep_list: "Daftar Episode", locked: "Episode Premium Terkunci", limit: "Batas Episode Tercapai", watch_ad: "Tonton Iklan (Buka 1 Ep)", vip: "Berlangganan VIP", login: "Login Sekarang", not_found: "Data tidak ditemukan", no_video: "Video belum tersedia untuk negara ini.", limit_desc: "Pengguna tanpa akun hanya dapat menonton hingga episode 10. Silakan login untuk menonton lebih banyak secara gratis.", locked_desc: "Anda telah mencapai batas 15 episode gratis. Tonton satu iklan singkat untuk membuka episode ini, atau jadilah VIP." },
    'en': { home: "Home", account: "Account", trending: "Trending Now", watch_now: "Watch Now", suitable: "Good for you", episode: "Episodes", watch_ep1: "Watch Episode 1", select_ep: "Select Episode", prev: "Previous", next: "Next", ep_list: "Episode List", locked: "Premium Episode Locked", limit: "Episode Limit Reached", watch_ad: "Watch Ad (Unlock 1 Ep)", vip: "Subscribe VIP", login: "Login Now", not_found: "Data not found", no_video: "Video is not available for this country.", limit_desc: "Guests can only watch up to episode 10. Please log in to watch more for free.", locked_desc: "You have reached the 15 free episodes limit. Watch a short ad to unlock this episode, or become a VIP." },
    'vi': { home: "Trang chủ", account: "Tài khoản", trending: "Thịnh hành", watch_now: "Xem ngay", suitable: "Dành cho bạn", episode: "Tập", watch_ep1: "Xem Tập 1", select_ep: "Chọn Tập", prev: "Trước", next: "Tiếp theo", ep_list: "Danh sách Tập", locked: "Tập Premium Đã Khóa", limit: "Đạt Giới Hạn", watch_ad: "Xem Quảng Cáo (Mở 1 Tập)", vip: "Đăng ký VIP", login: "Đăng nhập ngay", not_found: "Không tìm thấy dữ liệu", no_video: "Video chưa có sẵn tại quốc gia này.", limit_desc: "Khách chỉ có thể xem đến tập 10. Vui lòng đăng nhập để xem thêm miễn phí.", locked_desc: "Bạn đã đạt giới hạn 15 tập miễn phí. Xem quảng cáo ngắn để mở khóa tập này, hoặc trở thành VIP." },
    'th': { home: "หน้าแรก", account: "บัญชี", trending: "มาแรง", watch_now: "ดูตอนนี้", suitable: "เหมาะสำหรับคุณ", episode: "ตอน", watch_ep1: "ดูตอนที่ 1", select_ep: "เลือกตอน", prev: "ก่อนหน้า", next: "ถัดไป", ep_list: "รายชื่อตอน", locked: "ล็อกตอนพรีเมียม", limit: "ถึงขีดจำกัด", watch_ad: "ดูโฆษณา (ปลดล็อก 1 ตอน)", vip: "สมัคร VIP", login: "เข้าสู่ระบบ", not_found: "ไม่พบข้อมูล", no_video: "วิดีโอไม่พร้อมใช้งานสำหรับประเทศนี้", limit_desc: "ผู้ชมทั่วไปดูได้ถึงตอนที่ 10 กรุณาเข้าสู่ระบบเพื่อดูเพิ่มเติมฟรี", locked_desc: "คุณดูฟรีครบ 15 ตอนแล้ว ดูโฆษณาสั้นๆ เพื่อปลดล็อกตอนนี้ หรือสมัคร VIP" },
    'es': { home: "Inicio", account: "Cuenta", trending: "Tendencias", watch_now: "Ver Ahora", suitable: "Recomendado", episode: "Episodio", watch_ep1: "Ver Episodio 1", select_ep: "Elegir Episodio", prev: "Anterior", next: "Siguiente", ep_list: "Lista de Episodios", locked: "Episodio Premium Bloqueado", limit: "Límite Alcanzado", watch_ad: "Ver Anuncio (Desbloquear 1 Ep)", vip: "Suscribirse a VIP", login: "Iniciar Sesión", not_found: "Datos no encontrados", no_video: "Video no disponible para este país.", limit_desc: "Los invitados solo pueden ver hasta el episodio 10. Inicia sesión para ver más gratis.", locked_desc: "Has alcanzado el límite de 15 episodios gratuitos. Mira un anuncio para desbloquear este episodio o conviértete en VIP." },
    'de': { home: "Startseite", account: "Konto", trending: "Trends", watch_now: "Jetzt ansehen", suitable: "Für dich", episode: "Episode", watch_ep1: "Episode 1 ansehen", select_ep: "Episode wählen", prev: "Zurück", next: "Weiter", ep_list: "Episodenliste", locked: "Premium-Episode gesperrt", limit: "Limit erreicht", watch_ad: "Werbung ansehen (1 Ep freischalten)", vip: "VIP abonnieren", login: "Jetzt einloggen", not_found: "Daten nicht gefunden", no_video: "Video in diesem Land nicht verfügbar.", limit_desc: "Gäste können nur bis Episode 10 ansehen. Bitte loggen Sie sich ein, um mehr kostenlos zu sehen.", locked_desc: "Sie haben das Limit von 15 kostenlosen Episoden erreicht. Sehen Sie sich eine kurze Werbung an, um diese Episode freizuschalten, oder werden Sie VIP." },
    'pt': { home: "Início", account: "Conta", trending: "Em Alta", watch_now: "Assistir Agora", suitable: "Para você", episode: "Episódio", watch_ep1: "Assistir Ep 1", select_ep: "Escolher Episódio", prev: "Anterior", next: "Próximo", ep_list: "Lista de Episódios", locked: "Episódio Premium Bloqueado", limit: "Limite Atingido", watch_ad: "Ver Anúncio (Desbloquear 1 Ep)", vip: "Assinar VIP", login: "Entrar", not_found: "Dados não encontrados", no_video: "Vídeo não disponível neste país.", limit_desc: "Convidados só podem assistir até o ep 10. Faça login para assistir mais de graça.", locked_desc: "Você atingiu o limite de 15 episódios gratuitos. Assista a um anúncio para desbloquear este episódio ou torne-se VIP." },
    'ms': { home: "Utama", account: "Akaun", trending: "Trending", watch_now: "Tonton Sekarang", suitable: "Sesuai untuk anda", episode: "Episod", watch_ep1: "Tonton Episod 1", select_ep: "Pilih Episod", prev: "Sebelum", next: "Seterusnya", ep_list: "Senarai Episod", locked: "Episod Premium Dikunci", limit: "Had Dicapai", watch_ad: "Tonton Iklan (Buka 1 Ep)", vip: "Langgan VIP", login: "Log Masuk", not_found: "Tiada data ditemui", no_video: "Video tidak tersedia untuk negara ini.", limit_desc: "Tetamu hanya boleh menonton sehingga episod 10. Sila log masuk untuk menonton lebih banyak secara percuma.", locked_desc: "Anda telah mencapai had 15 episod percuma. Tonton iklan pendek untuk membuka episod ini, atau jadi VIP." },
    'it': { home: "Home", account: "Account", trending: "Tendenze", watch_now: "Guarda Ora", suitable: "Per te", episode: "Episodio", watch_ep1: "Guarda Ep 1", select_ep: "Scegli Episodio", prev: "Precedente", next: "Successivo", ep_list: "Lista Episodi", locked: "Episodio Premium Bloccato", limit: "Limite Raggiunto", watch_ad: "Guarda Annuncio (Sblocca 1 Ep)", vip: "Abbonati VIP", login: "Accedi", not_found: "Dati non trovati", no_video: "Video non disponibile in questo paese.", limit_desc: "Gli ospiti possono guardare fino all'episodio 10. Accedi per guardare di più gratuitamente.", locked_desc: "Hai raggiunto il limite di 15 episodi gratuiti. Guarda un annuncio per sbloccare questo episodio o diventa VIP." },
    'zh': { home: "首頁", account: "帳戶", trending: "熱門趨勢", watch_now: "立即觀看", suitable: "為您推薦", episode: "集", watch_ep1: "觀看第1集", select_ep: "選擇集數", prev: "上一集", next: "下一集", ep_list: "集數列表", locked: "高級集數已鎖定", limit: "達到集數限制", watch_ad: "觀看廣告 (解鎖1集)", vip: "訂閱 VIP", login: "立即登入", not_found: "找不到數據", no_video: "該國家/地區暫無視頻。", limit_desc: "未登入用戶最多只能觀看至第10集。請登入以免費觀看更多。", locked_desc: "您已達到15集免費觀看上限。觀看簡短廣告解鎖此集，或成為 VIP。" },
    'zh-cn': { home: "首页", account: "账户", trending: "热门趋势", watch_now: "立即观看", suitable: "为您推荐", episode: "集", watch_ep1: "观看第1集", select_ep: "选择集数", prev: "上一集", next: "下一集", ep_list: "集数列表", locked: "高级集数已锁定", limit: "达到集数限制", watch_ad: "观看广告 (解锁1集)", vip: "订阅 VIP", login: "立即登录", not_found: "找不到数据", no_video: "该国家/地区暂无视频。", limit_desc: "未登录用户最多只能观看至第10集。请登录以免费观看更多。", locked_desc: "您已达到15集免费观看上限。观看简短广告解锁此集，或成为 VIP。" },
    'fr': { home: "Accueil", account: "Compte", trending: "Tendances", watch_now: "Regarder", suitable: "Pour vous", episode: "Épisode", watch_ep1: "Voir Épisode 1", select_ep: "Choisir l'épisode", prev: "Précédent", next: "Suivant", ep_list: "Liste des épisodes", locked: "Épisode Premium Verrouillé", limit: "Limite Atteinte", watch_ad: "Voir Pub (Débloquer 1 Ep)", vip: "S'abonner VIP", login: "Se connecter", not_found: "Données introuvables", no_video: "Vidéo indisponible dans ce pays.", limit_desc: "Les invités peuvent voir jusqu'à l'épisode 10. Connectez-vous pour en voir plus gratuitement.", locked_desc: "Vous avez atteint la limite de 15 épisodes gratuits. Regardez une publicité pour débloquer cet épisode ou devenez VIP." },
    'ja': { home: "ホーム", account: "アカウント", trending: "トレンド", watch_now: "今すぐ見る", suitable: "おすすめ", episode: "エピソード", watch_ep1: "第1話を見る", select_ep: "エピソードを選択", prev: "前へ", next: "次へ", ep_list: "エピソードリスト", locked: "プレミアムエピソードロック", limit: "制限に達しました", watch_ad: "広告を見る（1話解放）", vip: "VIP購読", login: "ログイン", not_found: "データが見つかりません", no_video: "動画はこの国では利用できません。", limit_desc: "ゲストは10話まで視聴可能です。無料で続きを見るにはログインしてください。", locked_desc: "15話の無料視聴制限に達しました。広告を見てこのエピソードを解放するか、VIPになってください。" },
    'tr': { home: "Ana Sayfa", account: "Hesap", trending: "Trendler", watch_now: "Şimdi İzle", suitable: "Senin için", episode: "Bölüm", watch_ep1: "1. Bölümü İzle", select_ep: "Bölüm Seç", prev: "Önceki", next: "Sonraki", ep_list: "Bölüm Listesi", locked: "Premium Bölüm Kilitli", limit: "Sınıra Ulaşıldı", watch_ad: "Reklam İzle (1 Bölüm Aç)", vip: "VIP Abone Ol", login: "Giriş Yap", not_found: "Veri bulunamadı", no_video: "Video bu ülkede kullanılamıyor.", limit_desc: "Misafirler sadece 10. bölüme kadar izleyebilir. Ücretsiz izlemek için giriş yapın.", locked_desc: "15 bölümlük ücretsiz izleme sınırına ulaştınız. Bu bölümü açmak için reklam izleyin veya VIP olun." },
    'ko': { home: "홈", account: "계정", trending: "트렌딩", watch_now: "지금 시청", suitable: "추천", episode: "에피소드", watch_ep1: "1화 보기", select_ep: "에피소드 선택", prev: "이전", next: "다음", ep_list: "에피소드 목록", locked: "프리미엄 에피소드 잠김", limit: "제한 도달", watch_ad: "광고 보기 (1화 잠금해제)", vip: "VIP 구독", login: "로그인", not_found: "데이터를 찾을 수 없습니다", no_video: "이 국가에서는 동영상을 시청할 수 없습니다.", limit_desc: "게스트는 10화까지 시청 가능합니다. 로그인하여 더 많이 무료로 시청하세요.", locked_desc: "15화 무료 시청 제한에 도달했습니다. 광고를 시청하여 이 에피소드를 잠금 해제하거나 VIP가 되세요." },
    'ar': { home: "الرئيسية", account: "الحساب", trending: "الرائج", watch_now: "شاهد الآن", suitable: "مناسب لك", episode: "حلقة", watch_ep1: "شاهد الحلقة 1", select_ep: "اختر الحلقة", prev: "السابق", next: "التالي", ep_list: "قائمة الحلقات", locked: "حلقة مميزة مقفلة", limit: "تم الوصول للحد", watch_ad: "شاهد إعلان (لفتح حلقة)", vip: "اشتراك VIP", login: "تسجيل الدخول", not_found: "لا توجد بيانات", no_video: "الفيديو غير متاح في هذا البلد.", limit_desc: "يمكن للضيوف مشاهدة حتى الحلقة 10. يرجى تسجيل الدخول لمشاهدة المزيد مجانًا.", locked_desc: "لقد وصلت إلى الحد المجاني المكون من 15 حلقة. شاهد إعلانًا لفتح هذه الحلقة، أو كن VIP." },
    'fil': { home: "Home", account: "Account", trending: "Trending", watch_now: "Manood Ngayon", suitable: "Para sa iyo", episode: "Episode", watch_ep1: "Manood ng Ep 1", select_ep: "Pumili ng Episode", prev: "Nakaraan", next: "Susunod", ep_list: "Listahan ng Episode", locked: "Naka-lock na Premium", limit: "Naabot ang Limitasyon", watch_ad: "Manood ng Ads (I-unlock ang 1 Ep)", vip: "Mag-subscribe sa VIP", login: "Mag-login", not_found: "Walang data", no_video: "Hindi available ang video sa bansang ito.", limit_desc: "Hanggang ep 10 lang ang maaaring mapanood ng guest. Mag-login para manood pa nang libre.", locked_desc: "Naabot mo na ang 15 libreng episode. Manood ng ad para i-unlock ang episode na ito, o maging VIP." }
};

// =====================================================================
// HIERARKI FALLBACK BAHASA UI BERTINGKAT: Requested Lang -> id -> en -> zh
// =====================================================================
export function t(lang: string, key: string): string {
    const dictionary = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['id'] || UI_TRANSLATIONS['en'] || UI_TRANSLATIONS['zh'];
    return dictionary[key] || UI_TRANSLATIONS['id']?.[key] || UI_TRANSLATIONS['en']?.[key] || UI_TRANSLATIONS['zh']?.[key] || key;
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
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);
    const hashBuffer = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, 256);
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
// API FETCHERS DENGAN HIERARKI FALLBACK BERANTAI DAN PARSER MUTLAK
// =====================================================================

export async function fetchCatalog(lang: string) {
    const res = await fetch(`${API_BASE}/catalog/${lang}`);
    if (!res.ok) return [];
    const json = await res.json();
    
    // HIERARKI FALLBACK DATA BERANTAI MUTLAK: lang -> id -> en -> zh
    const langData = json?.data?.[lang] || json?.data?.id || json?.data?.en || json?.data?.zh || json?.data;
    if (!langData || !langData.nextjs_ssr_data) return [];
    
    const rawData = langData.nextjs_ssr_data;
    const extractedItems: any[] = [];

    rawData.forEach((chunk: string) => {
        const cleanChunk = chunk.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\\//g, '/');
        const regex = /"id":"(\d+)","title":"(.*?)","description":"(.*?)","slug":"(.*?)","thumbnailUrl":"(.*?)"/g;
        let match;
        while ((match = regex.exec(cleanChunk)) !== null) {
            extractedItems.push({
                id: match[1],
                title: match[2],
                description: match[3],
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
    
    // HIERARKI FALLBACK DATA BERANTAI MUTLAK: lang -> id -> en -> zh
    const langData = json?.data?.[lang] || json?.data?.id || json?.data?.en || json?.data?.zh || json?.data;
    if (!langData || !langData.nextjs_ssr_data) return null;

    const rawData = langData.nextjs_ssr_data;
    let movie: any = null;
    let maxEpisode = 0;

    rawData.forEach((chunk: string) => {
        const cleanChunk = chunk.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\\//g, '/');
        
        if (!movie) {
            const titleMatch = cleanChunk.match(/"title":"(.*?)".*?"slug":"(.*?)"/);
            const descMatch = cleanChunk.match(/"description":"(.*?)"/);
            const thumbMatch = cleanChunk.match(/"thumbnailUrl":"(.*?)"/);
            
            if (titleMatch && titleMatch[2] === slug) {
                movie = {
                    title: titleMatch[1],
                    description: descMatch ? descMatch[1] : '',
                    slug: titleMatch[2],
                    thumbnailUrl: thumbMatch ? thumbMatch[1] : ''
                };
            }
        }

        const epRegex = /"episodeNumber":(\d+)/g;
        let epMatch;
        while ((epMatch = epRegex.exec(cleanChunk)) !== null) {
            const epNum = parseInt(epMatch[1], 10);
            if (epNum > maxEpisode) maxEpisode = epNum;
        }
    });

    return { movie, maxEpisode };
}

export async function fetchEpisodeData(lang: string, slug: string, episodeStr: string) {
    const res = await fetch(`${API_BASE}/episode/${lang}/${slug}/${episodeStr}`);
    if (!res.ok) return null;
    const json = await res.json();
    
    // HIERARKI FALLBACK DATA BERANTAI MUTLAK: lang -> id -> en -> zh
    const langData = json?.data?.[lang] || json?.data?.id || json?.data?.en || json?.data?.zh || json?.data;
    if (!langData || !langData.nextjs_ssr_data) return null;

    const rawData = langData.nextjs_ssr_data;
    let videoUrl = "";
    let subtitleUrl = "";
    const targetEp = parseInt(episodeStr, 10);

    rawData.forEach((chunk: string) => {
        const cleanChunk = chunk.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\\//g, '/');
        
        // PERBAIKAN FATAL: Memecah string tepat di posisi kunci "episodeNumber": 
        // Ini memastikan kita mendapatkan array blok di mana setiap blok didedikasikan untuk 1 episode.
        const epBlocks = cleanChunk.split('"episodeNumber":');
        
        // Kita mulai dari index 1 karena index 0 adalah data sebelum kata "episodeNumber": pertama muncul
        for (let i = 1; i < epBlocks.length; i++) {
            const block = epBlocks[i];
            
            // Cek secara spesifik apakah blok ini milik episode yang sedang dicari (cth: "2," atau "2}")
            if (block.startsWith(`${targetEp},`) || block.startsWith(`${targetEp}}`)) {
                
                // Mengambil video URL (.m3u8) di DALAM blok episode ini
                const vMatch = block.match(/"videoUrl"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
                if (vMatch) videoUrl = vMatch[1];

                // PERBAIKAN FATAL SUBTITLE: URL subtitle dari API Shortflix ternyata disimpan dengan kunci "fileUrl", bukan "subtitleUrl"!
                const sMatch = block.match(/"fileUrl"\s*:\s*"([^"]+\.vtt[^"]*)"/);
                if (sMatch) subtitleUrl = sMatch[1];
                
                // Jika sudah mendapatkan video, hentikan pencarian karena kita sudah berada di episode yang tepat!
                if (videoUrl) break;
            }
        }

        // CADANGAN KEAMANAN: Jika metode split gagal membedah, gunakan pemindai berbasis index
        if (!videoUrl) {
            const indexToken = cleanChunk.indexOf(`"episodeNumber":${targetEp}`);
            if (indexToken !== -1) {
                // Mengambil 3000 karakter setelah nomor episode ditemukan untuk melacak URL-nya
                const isolatedWindow = cleanChunk.substring(indexToken, indexToken + 3000);
                
                const vMatch = isolatedWindow.match(/"videoUrl"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
                if (vMatch) videoUrl = vMatch[1];

                // Menggunakan kunci "fileUrl" untuk mengambil subtitle
                const sMatch = isolatedWindow.match(/"fileUrl"\s*:\s*"([^"]+\.vtt[^"]*)"/);
                if (sMatch) subtitleUrl = sMatch[1];
            }
        }
    });

    return { videoUrl, subtitleUrl };
}
