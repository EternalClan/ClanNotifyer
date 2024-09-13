/* eslint-disable no-console */
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = async (message, args) => {
	// const getGuildID = message.guild.id;
	const getBotConfigID = `${message.guild.id}-${message.guild.shardId}`;
	// // eslint-disable-next-line no-undef
	// const getClientID = globalclient.user.id;
	const { Get, Del, SQL } = require("../../../tools/functions/sql/db.js");
	let dataLang = Get.configByID("discord_bot", getBotConfigID);
	if (dataLang == null) dataLang = { Lang: "en_US" };
	const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
	const langDev = lang.cmd.dev;
	const { LanguageConvert } = require("../../../tools/functions/languageConvert.js");

	// Context
	if (args[1] === "database") {
		// eslint-disable-next-line prefer-const, no-undef
		const guildsCache = globalclient.guilds.cache.size;
		if (guildsCache !== 0) {
			const databaseGuildIds = [];
			let prunedGuilds;

			const sqlString = "SELECT * FROM discord_bot";
			const dataGuildIds = SQL.config().prepare(sqlString).all();
			if (!dataGuildIds || dataGuildIds == null) return;

			dataGuildIds.forEach(guildId => {
				databaseGuildIds.push(guildId.GuildID);
			});

			if (databaseGuildIds.length === 0) {
				console.log("database is empty");
				return;
			}

			// eslint-disable-next-line no-undef
			globalclient.guilds.cache.each(guild => {
				prunedGuilds = databaseGuildIds.filter(dbID => dbID !== guild.id);
			});

			const conMsg = `[${DateTime.utc().toFormat(timeFormat)}] Successfully pruned ${prunedGuilds.length} guilds from Database.`;
			const replyMsg = LanguageConvert.lang(langDev.prune.guilds, prunedGuilds.length);
			if (prunedGuilds.length === 0) {
				console.log(conMsg);
				message.reply({ content: replyMsg, ephemeral: true });
			} else if (prunedGuilds.length > 0) {
				removeGuilds(prunedGuilds);
				console.log(conMsg);
				message.reply({ content: replyMsg, ephemeral: true });
			}
		}

		// eslint-disable-next-line no-inner-declarations
		function removeGuilds(guildIds) {
			guildIds.forEach(guildId => {
				// CONFIG
				// Config
				Del.configAll("discord_bot", guildId);
				// OnOff
				// Commands
				Del.toggleAll("command_system", guildId);
				Del.toggleAll("command_admin", guildId);
				// Twitch
				Del.toggleAll("twitch", guildId);
				// ChannelRole
				// Channel
				Del.channelAll("channel_bot", guildId);
				Del.channelAll("channel_log", guildId);
				// Role
				Del.roleAll("role_admin", guildId);
				Del.roleAll("role_nsfw", guildId);
				Del.roleAll("role_user", guildId);
			});
		}
	}
};
