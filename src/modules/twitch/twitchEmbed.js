const { EmbedBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const { Get } = require("../../tools/functions/sql/db.js");
const humanizeDuration = require("humanize-duration");
require("dotenv").config();

const { LanguageConvert } = require("../../tools/functions/languageConvert.js");
// eslint-disable-next-line no-undef
const clientId = globalclient.user.id;
const dataConfig = Get.costumGet("Config", "SELECT * FROM discord_bot WHERE BotID = ?;", clientId);
const getBotConfigID = `${dataConfig.GuildID}-${dataConfig.ShardID}`;

// Language
let dataLang;
dataLang = Get.configByID("discord_bot", getBotConfigID);
if (dataLang == null) dataLang = { Lang: "en_US" };
const lang = require(`../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
const langTwitch = lang.modules.notifyer.twitch;

class TwitchEmbed {
	static create(streamData) {
		const isLive = streamData.type === "live";
		const allowBoxArt = "true";

		const msgEmbed = new EmbedBuilder();
		msgEmbed.setColor("#9146ff");
		msgEmbed.setURL(`https://twitch.tv/${(streamData.login || streamData.user_name).toLowerCase()}`);

		// Thumbnail
		let thumbUrl = streamData.profile_image_url;

		if (allowBoxArt && streamData.game && streamData.game.box_art_url) {
			thumbUrl = streamData.game.box_art_url;
			thumbUrl = thumbUrl.replace("{width}", "288");
			thumbUrl = thumbUrl.replace("{height}", "384");
		}

		msgEmbed.setThumbnail(thumbUrl);

		if (isLive) {
			// Title
			msgEmbed.setTitle(`:red_circle: **${LanguageConvert.lang(langTwitch.islivetitle, streamData.user_name)}**`);
			msgEmbed.addFields([{ name: langTwitch.title, value: streamData.title, inline: false }]);
		} else {
			msgEmbed.setTitle(`:white_circle: ${LanguageConvert.lang(langTwitch.notlivetitle, streamData.user_name)}`);
			msgEmbed.setDescription(langTwitch.notlivedesc);

			msgEmbed.addFields([{ name: langTwitch.title, value: streamData.title, inline: true }]);
		}

		// Add game
		if (streamData.game) {
			msgEmbed.addFields([{ name: langTwitch.game, value: streamData.game.name, inline: false }]);
		}

		if (isLive) {
			// Add status
			msgEmbed.addFields([{ name: langTwitch.status, value: isLive ? LanguageConvert.lang(langTwitch.viewercount, streamData.viewer_count) : `${lang.notify.twitch.streamended}`, inline: true }]);

			// Set main image (stream preview)
			let imageUrl = streamData.thumbnail_url;
			imageUrl = imageUrl.replace("{width}", "1280");
			imageUrl = imageUrl.replace("{height}", "720");
			const thumbnailBuster = (DateTime.now() / 1000).toFixed(0);
			imageUrl += `?t=${thumbnailBuster}`;
			msgEmbed.setImage(imageUrl);

			// Add uptime
			const now = DateTime.utc();
			const iso = DateTime.fromISO(streamData.started_at);
			const startedAt = iso.setZone("utc");

			msgEmbed.addFields([{ name: langTwitch.uptime, value: humanizeDuration(now - startedAt, {
				delimiter: ", ",
				largest: 2,
				round: true,
				units: ["y", "mo", "w", "d", "h", "m"]
			}), inline: true }]);
		}

		return msgEmbed;
	}
}

module.exports.TwitchEmbed = TwitchEmbed;