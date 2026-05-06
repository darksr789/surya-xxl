const { cmd } = require('../lib/command');
const axios = require('axios');
const bot = require('../lib/bot');
const yts = require('yt-search');
const fs = require('fs');

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

        // ── Step 1: Search using yt-search ───────────────────
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("❌ Song not found! Please try with a different name.");

        const videoId = video.videoId;
        const title = video.title;
        const duration = video.timestamp || 'N/A';
        const thumbnail = video.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

        reply("🎵 *Found! Downloading...*");

        // ── Step 2: Download MP3 ──────────────────────────────
        let audioUrl = null;

        // API 1 — siputzx
        try {
            const res = await axios.get(
                `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(youtubeUrl)}`,
                { timeout: 20000 }
            );
            audioUrl = res.data?.data?.dl_url || res.data?.download || res.data?.url;
        } catch {}

        // API 2 — agatz
        if (!audioUrl) {
            try {
                const res = await axios.get(
                    `https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(youtubeUrl)}`,
                    { timeout: 20000 }
                );
                audioUrl = res.data?.data?.url || res.data?.url;
            } catch {}
        }

        // API 3 — dreaded
        if (!audioUrl) {
            try {
                const res = await axios.get(
                    `https://api.dreaded.site/api/ytmp3?url=${encodeURIComponent(youtubeUrl)}`,
                    { timeout: 20000 }
                );
                audioUrl = res.data?.result?.audio || res.data?.result?.url || res.data?.result?.link;
            } catch {}
        }

        // API 4 — cobalt
        if (!audioUrl) {
            try {
                const res = await axios.post(
                    'https://api.cobalt.tools/api/json',
                    { url: youtubeUrl, aFormat: 'mp3', isAudioOnly: true },
                    {
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        timeout: 20000
                    }
                );
                audioUrl = res.data?.url;
            } catch {}
        }

        // API 5 — y2mate style
        if (!audioUrl) {
            try {
                const res = await axios.get(
                    `https://api.lolhuman.xyz/api/ytmp3?apikey=lolhuman&id=${videoId}`,
                    { timeout: 20000 }
                );
                audioUrl = res.data?.result?.url;
            } catch {}
        }

        if (!audioUrl) return reply("❌ Failed to download! Please try again later.");

        await conn.sendMessage(from, { react: { text: '🎵', key: mek.key } });

        // ── Step 3: Send ──────────────────────────────────────
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `*🎵 NOW PLAYING*\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Views:* ${video.views?.toLocaleString() || 'N/A'}\n\n*⬇️ Downloaded by SURYA-X*\n\n${bot.COPYRIGHT}`
        }, { quoted: mek });

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
