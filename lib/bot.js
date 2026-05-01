const fs = require('fs');
if (fs.existsSync('bot.env')) require('dotenv').config({ path: './bot.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
BOT_URL: process.env.BOT_URL || "https://raw.githubusercontent.com/darksr789/data-store/main/datafile.json",
AUTO_SITE: process.env.AUTO_SITE || "https://api-key-surya.up.railway.app",
BAND_URL: process.env.BAND_URL || "https://raw.githubusercontent.com/darksr789/data-store/main/banusers.json",
REPO_LINK: process.env.REPO_LINK || "https://github.com/darksurya345/SURYA-X",
REPO_NAME: process.env.REPO_NAME || "SURYA-X",
BOT_NAME: process.env.BOT_NAME || "SURYA-X",
DESCRIPTION: process.env.DESCRIPTION || "SURYA-X INDIA POWERFULL WHATSAPP BOT",
OWNER_NUMBER: process.env.OWNER_NUMBER || "917797099719",
OWNER_NAME: process.env.OWNER_NAME || "DARK SURYA",
ST_SAVE: process.env.ST_SAVE || "SURYA-X-STATUS-SERVER",
BIO_TEXT: process.env.BIO_TEXT || "SURYA-X-BY-DARK SURYA",
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*`STATUS SEEN BY SURYA-X`* _*POWERD BY*_ *DARK SURYA Whtsapp Bot*",
FOOTER: process.env.FOOTER || "SURYA-X",
COPYRIGHT: process.env.COPYRIGHT || "*㋛ SURYA-X BY DARK SURYA OFFICIAL*",
VERSION: process.env.VERSION || "9.0.0",
NEWSLETTER: process.env.NEWSLETTER || "120363348739987203@newsletter",
WA_CHANNEL: process.env.WA_CHANNEL || "https://whatsapp.com/channel/0029Vb64JNKJf05UHKREBM1h",
INSTA: process.env.INSTA || "https://Instagram.com/",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/qc2dbv.jpg,
OWNER_IMG: process.env.OWNER_IMG || "https://files.catbox.moe/t6i2vr.jpg",
CONVERT_IMG: process.env.CONVERT_IMG || "https://files.catbox.moe/i4mxri.jpg",
AI_IMG: process.env.AI_IMG || "https://files.catbox.moe/3rb552.jpg",
SEARCH_IMG: process.env.SEARCH_IMG || "https://files.catbox.moe/gjjgix.jpg",
DOWNLOAD_IMG: process.env.DOWNLOAD_IMG || "https://files.catbox.moe/6l951y.jpg",
MAIN_IMG: process.env.MAIN_IMG || "https://files.catbox.moe/jbrn0i.jpg",
GROUP_IMG: process.env.GROUP_IMG || "https://files.catbox.moe/jbrn0i.jpg",
FUN_IMG: process.env.FUN_IMG || "https://files.catbox.moe/jbrn0i.jpg",
TOOLS_IMG: process.env.TOOLS_IMG || "https://files.catbox.moe/jbrn0i.jpg",
OTHER_IMG: process.env.OTHER_IMG || "https://files.catbox.moe/jbrn0i.jpg",
MOVIE_IMG: process.env.MOVIE_IMG || "https://files.catbox.moe/jbrn0i.jpg",
NEWS_IMG: process.env.NEWS_IMG || "https://files.catbox.moe/jbrn0i.jpg",
PP_IMG: process.env.PP_IMG || "https://files.catbox.moe/jbrn0i.jpg"
};
