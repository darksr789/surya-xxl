const { cmd } = require('../lib/command');
const axios = require('axios');
const bot = require('../lib/bot');

cmd({
    pattern: "song",
    alias: ["music", "play", "yta", "ytmp3"],
    react: "🎵",
    desc: "Download song by name",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a song name!\nExample: .song Tum Hi Ho");

        await conn.sendMessage(from, { react: { text: '🔍', key: mek.key } });
        reply("🔍 *Searching song...*");

        // ── Step 1: Search YouTube for video ID ──────────────
        let videoId = null;
        let title = q;
        let thumbnail = null;

        // API 1 — YouTube scrape
        try {
            const res = await axios.get(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' audio')}`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9'
                    },
                    timeout: 10000
                }
            );
            const match = res.data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
            if (match) videoId = match[1];
            const titleMatch = res.data.match(/"title":{"runs":\[{"text":"([^"]+)"/);
            if (titleMatch) title = titleMatch[1];
        } catch {}

        // API 2 — invidious
        if (!videoId) {
            try {
                const res = await axios.get(
                    `https://invidious.privacyredirect.com/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
                    { timeout: 10000 }
                );
                if (res.data?.[0]?.videoId) {
                    videoId = res.data[0].videoId;
                    title = res.data[0].title || q;
                }
            } catch {}
        }

        // API 3 — pipedapi
        if (!videoId) {
            try {
                const res = await axios.get(
                    `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(q)}&filter=music_songs`,
                    { timeout: 10000 }
                );
                if (res.data?.items?.[0]?.url) {
                    const idMatch = res.data.items[0].url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
                    if (idMatch) videoId = idMatch[1];
                    title = res.data.items[0].title || q;
                    thumbnail = res.data.items[0].thumbnail;
                }
            } catch {}
        }

        if (!videoId) return reply("❌ Song not found! Please try with a different name.");

        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        if (!thumbnail) thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        reply("🎵 *Found! Downloading...*");

        // ── Step 2: Download MP3 ──────────────────────────────
        let audioUrl = null;
        let duration = 'N/A';

        // Download API 1 — cobalt.tools
        try {
            const res = await axios.post(
                'https://api.cobalt.tools/api/json',
                {
                    url: youtubeUrl,
                    vCodec: 'h264',
                    vQuality: '720',
                    aFormat: 'mp3',
                    isAudioOnly: true
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 15000
                }
            );
            audioUrl = res.data?.url;
        } catch {}

        // Download API 2 — siputzx
        if (!audioUrl) {
            try {
                const res = await axios.get(
                    `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(youtubeUrl)}`,
                    { timeout: 15000 }
                );
                audioUrl = res.data?.data?.dl_url || res.data?.download || res.data?.url;
                if (res.data?.data?.title) title = res.data.data.title;
                if (res.data?.data?.duration) duration = res.data.data.duration;
                if (res.data?.data?.thumbnail) thumbnail = res.data.data.thumbnail;
            } catch {}
        }

        // Download API 3 — agatz
        if (!audioUrl) {
            try {
                const res = await axios.get(
                    `https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(youtubeUrl)}`,
                    { timeout: 15000 }
                );
                audioUrl = res.data?.data?.url || res.data?.url;
            } catch {}
        }

        // Download API 4 — dreaded
        if (!audioUrl) {
            try {
                const res = await axios.get(
                    `https://api.dreaded.site/api/ytmp3?url=${encodeURIComponent(youtubeUrl)}`,
                    { timeout: 15000 }
                );
                audioUrl = res.data?.result?.audio || res.data?.result?.url;
                if (res.data?.result?.title) title = res.data.result.title;
                if (res.data?.result?.thumbnail) thumbnail = res.data.result.thumbnail;
            } catch {}
        }

        if (!audioUrl) return reply("❌ Failed to download! Please try again later.");

        // ── Step 3: Send ──────────────────────────────────────
        await conn.sendMessage(from, { react: { text: '🎵', key: mek.key } });

        // Send thumbnail with info
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `*🎵 NOW PLAYING*\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Source:* YouTube\n\n*⬇️ Downloaded by SURYA-X*\n\n${bot.COPYRIGHT}`
        }, { quoted: mek });

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ Error: ${e.message}`);
    }
});
