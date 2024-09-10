require("dotenv").config();

module.exports = (guild) => {
	// SQLite
	const { Del } = require("../functions/sql/db.js");
	const getGuildId = guild.id;
	if (getGuildId === "100000000000000000") return;
	// CONFIG
	// Config
	Del.configAll("discord_bot", getGuildId);
	// OnOff
	// Commands
	Del.toggleAll("command_admin", getGuildId);
	Del.toggleAll("command_system", getGuildId);
	Del.toggleAll("notifyer", getGuildId);
	// ChannelRole
	// Channel
	Del.channelAll("channel_bot", getGuildId);
	Del.channelAll("channel_notifyer", getGuildId);
	// Role
	Del.roleAll("role_admin", getGuildId);
	Del.roleAll("role_nsfw", getGuildId);
	Del.roleAll("role_user", getGuildId);
	// Notifyer
	Del.notifyerAll("twitch_announcement", getGuildId);
	Del.notifyerAll("twitch_oauth", getGuildId);
};
