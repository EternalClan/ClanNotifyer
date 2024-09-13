/* eslint-disable max-len */
/* eslint-disable no-undef */
require("dotenv").config();

class SQLiteTableData {
	static data (guild) {
		// SQLite
		const { Get, Set } = require("../functions/sql/db.js");
		// Get/Set
		if (globalclient) {
			const getClientGuildId = guild.id;
			const getClientShardId = guild.shard.id;
			const getClientUserId = globalclient.user.id;
			if (getClientGuildId == null) return;
			const getBotConfigId = `${getClientGuildId}-${getClientShardId}`;
			// CONFIG
			// Config
			let dataConfig;
			dataConfig = Get.configByID("discord_bot", getBotConfigId);
			if (dataConfig == null) {
				dataConfig = { ConfigID: `${getBotConfigId}`, GuildID: `${getClientGuildId}`, ShardID: `${getClientShardId}`, BotID: `${getClientUserId}`, Lang: "en_US" };
				Set.configByData("discord_bot", dataConfig);
			}
			// Toggle
			// Commands
			let dataToggleCommandSystem;
			dataToggleCommandSystem = Get.toggleByID("command_system", getBotConfigId);
			if (dataToggleCommandSystem == null) {
				dataToggleCommandSystem = { ToggleID: `${getBotConfigId}`, GuildID: `${getClientGuildId}`, ShardID: `${getClientShardId}`, GlobalAdd: "true", GlobalRemove: "true", LocalAdd: "true", LocalRemove: "true" };
				Set.toggleByData("command_system", dataToggleCommandSystem);
			}
			let dataToggleCommandAdmin;
			dataToggleCommandAdmin = Get.toggleByID("command_admin", getBotConfigId);
			if (dataToggleCommandAdmin == null) {
				dataToggleCommandAdmin = { ToggleID: `${getBotConfigId}`, GuildID: `${getClientGuildId}`, ShardID: `${getClientShardId}`, Channel: "true", Config: "true", Language: "true", Notifyer: "true", Reaction: "true", Roles: "true", Help: "true", Info: "true", Ping: "true", Reload: "false", Restart: "false", Sleep: "false", Test: "true" };
				Set.toggleByData("command_admin", dataToggleCommandAdmin);
			}
			let dataToggleNotifyer;
			dataToggleNotifyer = Get.toggleByID("notifyer", getBotConfigId);
			if (dataToggleNotifyer == null) {
				dataToggleNotifyer = { ToggleID: `${getBotConfigId}`, GuildID: `${getClientGuildId}`, ShardID: `${getClientShardId}`, Twitch: "false", YouTube: "false", TikTok: "false" };
				Set.toggleByData("notifyer", dataToggleNotifyer);
			}
			// NOTIFYER
			// Twitch
			// let dataTwitchAnnouncement;
			// dataTwitchAnnouncement = Get.notifyerByID("twitch_announcement", getBotConfigId);
			// if (dataTwitchAnnouncement == null) {
			// 	dataTwitchAnnouncement = { NotifyerID: `${getBotConfigId}`, GuildID: `${getClientGuildId}`, ShardID: `${getClientShardId}`, BotID: `${getClientUserId}`, TwitchChannelID: "", ChannelID: "", Announce: "", Mention: "" };
			// 	Set.notifyerByData("twitch_announcement", dataTwitchAnnouncement);
			// }
			// let dataTwitchOAuth;
			// dataTwitchOAuth = Get.notifyerByID("twitch_oauth", getBotConfigId);
			// if (dataTwitchOAuth == null) {
			// 	dataTwitchOAuth = { NotifyerID: `${getBotConfigId}`, GuildID: `${getClientGuildId}`, ShardID: `${getClientShardId}`, BotID: `${getClientUserId}`, OAuthType: "none", Token: "0", Cooldown: "0" };
			// 	Set.notifyerByData("twitch_oauth", dataTwitchOAuth);
			// }
		}
	}
}
exports.SQLiteTableData = SQLiteTableData;
