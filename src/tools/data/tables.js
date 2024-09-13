/* eslint-disable max-len */
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
const { DateTime } = require("luxon");
require("dotenv").config();

module.exports = () => {
	const { Create } = require("../functions/sql/db.js");
	// Config
	Create.tableWithColums("Config", "discord_bot", "ConfigID", "GuildID VARCHAR, ShardID VARCHAR, BotID VARCHAR, Lang TEXT");
	// ChannelRole
	Create.tableWithColums("ChannelRole", "channel_bot", "ChannelRoleID", "GuildID VARCHAR, ShardID VARCHAR, BotID VARCHAR, ChannelID VARCHAR");
	Create.tableWithColums("ChannelRole", "channel_notifyer", "ChannelRoleID", "GuildID VARCHAR, ShardID VARCHAR, BotID VARCHAR, ChannelID VARCHAR");
	Create.tableWithColums("ChannelRole", "role_admin", "ChannelRoleID", "GuildID VARCHAR, ShardID VARCHAR, BotID VARCHAR, RoleID VARCHAR");
	Create.tableWithColums("ChannelRole", "role_user", "ChannelRoleID", "GuildID VARCHAR, ShardID VARCHAR, BotID VARCHAR, RoleID VARCHAR");
	Create.tableWithColums("ChannelRole", "role_nsfw", "ChannelRoleID", "GuildID VARCHAR, ShardID VARCHAR, BotID VARCHAR, RoleID VARCHAR");
	// Toggle
	Create.tableWithColums("Toggle", "command_system", "ToggleID", "GuildID VARCHAR, ShardID VARCHAR, GlobalAdd TEXT, GlobalRemove TEXT, LocalAdd TEXT, LocalRemove TEXT");
	Create.tableWithColums("Toggle", "command_admin", "ToggleID", "GuildID VARCHAR, ShardID VARCHAR, Channel TEXT, Config TEXT, Language TEXT, Notifyer TEXT, Roles TEXT, Help TEXT, Info TEXT, Patchnotes TEXT, Ping TEXT, Reload TEXT, Restart TEXT, Sleep TEXT, Test TEXT");
	Create.tableWithColums("Toggle", "notifyer", "ToggleID", "GuildID VARCHAR, ShardID VARCHAR, Twitch VARCHAR, YouTube VARCHAR, TikTok VARCHAR");
	// Notifyer
	Create.tableWithColums("Notifyer", "twitch_announcement", "NotifyerID", "GuildID VARCHAR, ShardID VARCHAR, BotID VARCHAR, TwitchChannelID VARCHAR, ChannelID VARCHAR, Announce VARCHAR, Mention VARCHAR");
	Create.tableWithColums("Notifyer", "twitch_oauth", "NotifyerID", "GuildID VARCHAR, ShardID VARCHAR, BotID VARCHAR, OAuthType VARCHAR, Token VARCHAR, Cooldown VARCHAR");

	// Get Guilds data and pass it on.
	// eslint-disable-next-line prefer-const, no-undef
	const guildsCache = globalclient.guilds.cache.size;
	if (guildsCache !== 0) {
		// eslint-disable-next-line no-undef
		globalclient.guilds.cache.each(guild => {
			const { SQLiteTableData } = require("./startData.js");
			SQLiteTableData.data(guild);
		});
	}
	// eslint-disable-next-line no-console
	console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] Database created.`);
};
