const { cmd } = require('../lib/command');
const bot = require('../lib/bot');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

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

        // ── Step 1: Search ────────────────────────────────────
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("❌ Song not found! Please try with a different name.");

        const videoId = video.videoId;
        const title = video.title;
        const duration = video.timestamp || 'N/A';
        const thumbnail = video.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

        reply("🎵 *Found! Downloading...*");

        // ── Step 2: Download with ytdl-core ──────────────────
        const outputPath = path.join('/tmp', `${videoId}.mp3`);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        await new Promise((resolve, reject) => {
            const stream = ytdl(youtubeUrl, {
                quality: 'highestaudio',
                filter: 'audioonly'
            });

            ffmpeg(stream)
                .audioBitrate(128)
                .toFormat('mp3')
                .on('end', resolve)
                .on('error', reject)
                .save(outputPath);
        });

        if (!fs.existsSync(outputPath)) return reply("❌ Download failed! Please try again.");

        const audioBuffer = fs.readFileSync(outputPath);
        fs.unlinkSync(outputPath);

        await conn.sendMessage(from, { react: { text: '🎵', key: mek.key } });

        // ── Step 3: Send ──────────────────────────────────────
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `*🎵 NOW PLAYING*\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Views:* ${video.views?.toLocaleString() || 'N/A'}\n\n*⬇️ Downloaded by SURYA-X*\n\n${bot.COPYRIGHT}`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ Error: ${e.message}`);
    }
});
