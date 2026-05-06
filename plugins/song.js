const { cmd, commands } = require('../lib/command');
const fg = require('api-dylux');
const yts = require('yt-search');

cmd({
    pattern: "song",
    alias: ["play", "ytmp3"],
    desc: "Download songs from YouTube",
    category: "download",
    react: "🎶",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please provide a song name or YouTube link! 🎵");

        // Search for the song
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
*╭──❍「 SURYA-X SONG 」❍──╮*
│
├─❍ *Title:* ${data.title}
├─❍ *Views:* ${data.views}
├─❍ *Duration:* ${data.timestamp}
├─❍ *Ago:* ${data.ago}
│
╰──────────────────❍
> *SURYA-X Bot is downloading...* 📥`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Download Audio
        let down = await fg.yta(url);
        let downloadUrl = down.dl_url;

        // Send Audio File
        await conn.sendMessage(from, { 
            audio: { url: downloadUrl }, 
            mimetype: "audio/mpeg" 
        }, { quoted: mek });

        await m.react("✅");

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
