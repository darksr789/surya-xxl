/*
 * SURYA-X MD - Song Downloader Plugin
 * Developer: DARK SURYA
 */

const ytSearch = require('yt-search');
const axios = require('axios');

module.exports = {
    name: 'song',
    alias: ['music', 'play'],
    category: 'download',
    desc: 'Download songs from YouTube',
    async run(m, { conn, text }) {
        if (!text) return m.reply('*Usage:* .song [song name]\n*Example:* .song Arijit Singh Songs');

        try {
            await m.reply('_Searching for your song..._');

            // Search for the video on YouTube
            const search = await ytSearch(text);
            const video = search.videos[0];

            if (!video) return m.reply('❌ No results found. Please try a different name.');

            let responseMessage = `
*╭───────────────╮*
* 🎵 SURYA-X MUSIC  *
*╰───────────────╯*

📌 *Title:* ${video.title}
🕒 *Duration:* ${video.timestamp}
🔗 *Link:* ${video.url}

_Downloading audio, please wait..._`;

            await conn.sendMessage(m.chat, {
                image: { url: video.thumbnail },
                caption: responseMessage
            }, { quoted: m });

            // Using a public API to fetch the download link
            // Note: API endpoints can change. This is a common structure for MD bots.
            const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp3?url=${encodeURIComponent(video.url)}`;
            const res = await axios.get(apiUrl);
            
            if (res.data && res.data.result && res.data.result.download_url) {
                const audioUrl = res.data.result.download_url;

                await conn.sendMessage(m.chat, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    fileName: `${video.title}.mp3`
                }, { quoted: m });
            } else {
                m.reply('❌ Failed to download audio. Please try again with another song name.');
            }

        } catch (e) {
            console.error(e);
            m.reply('❌ An error occurred. Make sure your bot has axios and yt-search installed.');
        }
    }
};
