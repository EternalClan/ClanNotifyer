// Require SQLite and Databases
const { SQL } = require("./SQL.js");

class Set {
	// Costum Set's

	/**
	 * Set a set of Data from an Database by the given parameters value.
	 * 
	 * @remarks
	 * You will need to created the SQL String yourself. better-sqlite3 is used here.
	 * @param database - The Database to be used
	 * @param sqlString - The SQL String to be used
	 * @param value - The Value's to be search for
	 */
	static costumSet(database, sqlString, value) {
		if (database === "Config") return SQL.config().prepare(sqlString).run(value);
		if (database === "Toggle") return SQL.toggle().prepare(sqlString).run(value);
		if (database === "ChannelRole") return SQL.channelRole().prepare(sqlString).run(value);
		if (database === "Notifyer") return SQL.notifyer().prepare(sqlString).run(value);
	}

	/**
	 * Set one set of Data from an Database by the given parameters value.
	 * 
	 * @param database - The Database to be used
	 * @param table - The Database Table to search in
	 * @param column - The Column to be search with
	 * @param value - The Value to be search for
	 */
	static costumSetOne(database, table, column, value) {
		const sqlString = `SELECT * FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).run(value);
		if (database === "Toggle") return SQL.toggle().prepare(sqlString).run(value);
		if (database === "ChannelRole") return SQL.channelRole().prepare(sqlString).run(value);
		if (database === "Notifyer") return SQL.notifyer().prepare(sqlString).run(value);
	}

	// Config
	// By Data

	/**
	 * Set the provided Dataset in a Table in Database Config.
	 * 
	 * @remarks
	 * The Config name is equel to the Databases table.
	 * @param table - The Name of the config
	 * @param data - The Data to be inserted
	 */
	static configByData(table, data) {
		let columns = "(DataID, GuildID, ShardID) VALUES (@DataID, @GuildID, @ShardID)";
		if (table === "discord_bot") columns = "(ConfigID, GuildID, ShardID, BotID, Lang) VALUES (@ConfigID, @GuildID, @ShardID, @BotID, @Lang)"
		return SQL.config().prepare(`INSERT OR REPLACE INTO ${table} ${columns};`).run(data);
	}

	// Toggle
	// By Data

	/**
	 * Set the first matching Dataset of a Table in Database Toggle by the given ID.
	 * 
	 * @remarks
	 * The Toggle name is equel to the Databases table name.
	 * @param table - The Name of the toggle
	 * @param data - The Data to be inserted
	 */
	static toggleByData(table, data) {
		let columns = "(DataID, GuildID, ShardID) VALUES (@DataID, @GuildID, @ShardID)";
		if (table === "command_system") columns = "(ToggleID, GuildID, ShardID, GlobalAdd, GlobalRemove, LocalAdd, LocalRemove) VALUES (@ToggleID, @GuildID, @ShardID, @GlobalAdd, @GlobalRemove, @LocalAdd, @LocalRemove)";
		if (table === "command_admin") columns = "(ToggleID, GuildID, ShardID, Channel, Config, Language, Roles, Help, Info, Ping, Reload, Restart, Sleep, Test) VALUES (@ToggleID, @GuildID, @ShardID, @Channel, @Config, @Language, @Roles, @Help, @Info, @Ping, @Reload, @Restart, @Sleep, @Test)";
		if (table === "notifyer") columns = "(ToggleID, GuildID, ShardID, Twitch, YouTube, TikTok) VALUES (@ToggleID, @GuildID, @ShardID, @Twitch, @YouTube, @TikTok)";
		return SQL.toggle().prepare(`INSERT OR REPLACE INTO ${table} ${columns};`).run(data);
	}

	// Channel
	// By Data

	/**
	 * Set the first matching Dataset of a Table in Database Channel by the given ID.
	 * 
	 * @remarks
	 * The Channel name is equel to the Databases table name.
	 * @param table - The Name of the channel
	 * @param data - The Data to be inserted
	 */
	static channelByData(table, data) {
		let columns = "(DataID, GuildID, ShardID) VALUES (@DataID, @GuildID, @ShardID)";
		if (table === "channel_bot") columns = "(ChannelRoleID, GuildID, ShardID, BotID, ChannelID) VALUES (@ChannelRoleID, @GuildID, @ShardID, @BotID, @ChannelID)";
		if (table === "channel_notifyer") columns = "(ChannelRoleID, GuildID, ShardID, BotID, ChannelID) VALUES (@ChannelRoleID, @GuildID, @ShardID, @BotID, @ChannelID)";
		return SQL.channelRole().prepare(`INSERT OR REPLACE INTO ${table} ${columns};`).run(data);
	}

	// Role
	// By Data

	/**
	 * Set the first matching Dataset of a Table in Database Role by the given ID.
	 * 
	 * @remarks
	 * The Role name is equel to the Databases table name.
	 * @param table - The Name of the role
	 * @param data - The Data to be inserted
	 */
	static roleByData(table, data) {
		let columns = "(DataID, GuildID, ShardID) VALUES (@DataID, @GuildID, @ShardID)";
		if (table === "role_admin") columns = "(ChannelRoleID, GuildID, ShardID, BotID, RoleID) VALUES (@ChannelRoleID, @GuildID, @ShardID, @BotID, @RoleID)";
		if (table === "role_nsfw") columns = "(ChannelRoleID, GuildID, ShardID, BotID, RoleID) VALUES (@ChannelRoleID, @GuildID, @ShardID, @BotID, @RoleID)";
		if (table === "role_user") columns = "(ChannelRoleID, GuildID, ShardID, BotID, RoleID) VALUES (@ChannelRoleID, @GuildID, @ShardID, @BotID, @RoleID)";
		return SQL.channelRole().prepare(`INSERT OR REPLACE INTO ${table} ${columns};`).run(data);
	}

	// Notifyer
	// By Data

	/**
	 * Set the first matching Dataset of a Table in Database Notifyer by the given ID.
	 * 
	 * @remarks
	 * The Notifyer name is equel to the Databases table name.
	 * @param table - The Name of the Notifyer
	 * @param data - The Data to be inserted
	 */
	static notifyerByData(table, data) {
		let columns = "(DataID, GuildID, ShardID) VALUES (@DataID, @GuildID, @ShardID)";
		if (table === "twitch_announcement") columns = "(NotifyerID, GuildID, ShardID, BotID, TwitchChannelID, Announce, Mention) VALUES (@NotifyerID, @GuildID, @ShardID, @BotID, @TwitchChannelID, @Announce, @Mention)";
		if (table === "twitch_oauth") columns = "(NotifyerID, GuildID, ShardID, BotID, OAuthType, Token, Cooldown) VALUES (@NotifyerID, @GuildID, @ShardID, @BotID, @OAuthType, @Token, @Cooldown)";
		return SQL.notifyer().prepare(`INSERT OR REPLACE INTO ${table} ${columns};`).run(data);
	}
}

exports.Set = Set;