// Require SQLite and Databases
const { SQL } = require("./SQL.js");

class Del {
	// Costum Del's

	/**
	 * Del a set of Data from an Database with the given parameters value.
	 * 
	 * @remarks
	 * You will need to created the SQL String yourself. better-sqlite3 is used here.
	 * @param database - The Database to be used
	 * @param sqlString - The SQL String to be used
	 * @param value - The Value's to be search for
	 */
	static costumDel(database, sqlString, value) {
		if (database === "Config") return SQL.config().prepare(sqlString).run(value);
		if (database === "Toggle") return SQL.toggle().prepare(sqlString).run(value);
		if (database === "ChannelRole") return SQL.channelRole().prepare(sqlString).run(value);
		if (database === "Twitch") return SQL.twitch().prepare(sqlString).run(value);
	}

	/**
	 * Del one set of Data from an Database with the given parameters value.
	 * 
	 * @param database - The Database to be used
	 * @param table - The Database Table to search in
	 * @param column - The Column to be search with
	 * @param value - The Value to be search for
	 */
	static costumDelOne(database, table, column, value) {
		const sqlString = `DELETE FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).run(value);
		if (database === "Toggle") return SQL.toggle().prepare(sqlString).run(value);
		if (database === "ChannelRole") return SQL.channelRole().prepare(sqlString).run(value);
		if (database === "Twitch") return SQL.twitch().prepare(sqlString).run(value);
	}

	/**
	 * Del all set's of Data from an Database with the given parameters value.
	 * 
	 * @param database - The Database to be used
	 * @param table - The Database Table to search in
	 * @param column - The Column to be search with
	 * @param value - The Value to be search for
	 */
	static costumDelAll(database, table, column, value) {
		const sqlString = `DELETE * FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).all(value);
		if (database === "Toggle") return SQL.toggle().prepare(sqlString).all(value);
		if (database === "ChannelRole") return SQL.channelRole().prepare(sqlString).all(value);
		if (database === "Twitch") return SQL.twitch().prepare(sqlString).all(value);
	}

	// Config
	// By ID

	/**
	 * Del the first matching Dataset of a Table in Database Config by the given ID.
	 * 
	 * @remarks
	 * The Config name is equel to the Databases table name.
	 * @param table - The Name of the config
	 * @param id - The Unique Entry ID to be search for
	 */
	static configByID(table, id) {
		return SQL.config().prepare(`DELETE FROM ${table} WHERE ConfigID = ?`).run(id);
	}

	// All

	/**
	 * Del all matching Dataset of a Table in Database Config by the given GuildID.
	 * 
	 * @remarks
	 * The Config name is equel to the Databases table name.
	 * @param table - The Name of the config
	 * @param guildId - The GuildID to be search for
	 */
	static configAll(table, guildId) {
		return SQL.config().prepare(`DELETE FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// Toggle
	// By ID

	/**
	 * Del the first matching Dataset of a Table in Database Toggle by the given ID.
	 * 
	 * @remarks
	 * The Toggle name is equel to the Databases table name.
	 * @param table - The Name of the toggle
	 * @param id - The Unique Entry ID to be search for
	 */
	static toggleByID(table, id) {
		return SQL.toggle().prepare(`DELETE FROM ${table} WHERE ToggleID = ?`).run(id);
	}

	// All

	/**
	 * Del all matching Dataset of a Table in Database Toggle by the given GuildID.
	 * 
	 * @remarks
	 * The Toggle name is equel to the Databases table name.
	 * @param table - The Name of the toggle
	 * @param guildId - The GuildID to be search for
	 */
	static toggleAll(table, guildId) {
		return SQL.toggle().prepare(`DELETE FROM ${table} WHERE GuildID = ?`).run(guildId);
	}

	// Channel
	// By ID

	/**
	 * Del the first matching Dataset of a Table in Database Channel by the given ID.
	 * 
	 * @remarks
	 * The Channel name is equel to the Databases table name.
	 * @param table - The Name of the channel
	 * @param id - The Unique Entry ID to be search for
	 */
	static channelByID(table, id) {
		return SQL.channelRole().prepare(`DELETE FROM ${table} WHERE ChannelRoleID = ?`).run(id);
	}

	// All

	/**
	 * Del all matching Dataset of a Table in Database Channel by the given GuildID.
	 * 
	 * @remarks
	 * The Channel name is equel to the Databases table name.
	 * @param table - The Name of the channel
	 * @param guildId - The GuildID to be search for
	 */
	static channelAll(table, guildId) {
		return SQL.channelRole().prepare(`DELETE FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// Role
	// By ID

	/**
	 * Del the first matching Dataset of a Table in Database Role by the given ID.
	 * 
	 * @remarks
	 * The Role name is equel to the Databases table name.
	 * @param table - The Name of the role
	 * @param id - The Unique Entry ID to be search for
	 */
	static roleByID(table, id) {
		return SQL.channelRole().prepare(`DELETE FROM ${table} WHERE ChannelRoleID = ?`).run(id);
	}

	// All

	/**
	 * Del all matching Dataset of a Table in Database Role by the given GuildID.
	 * 
	 * @remarks
	 * The Role name is equel to the Databases table name.
	 * @param table - The Name of the role
	 * @param guildId - The GuildID to be search for
	 */
	static roleAll(table, guildId) {
		return SQL.channelRole().prepare(`DELETE FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// Notifyer
	// By ID

	/**
	 * Del the first matching Dataset of a Table in Database Notifyer by the given ID.
	 * 
	 * @remarks
	 * The Notifyer name is equel to the Databases table name.
	 * @param table - The Name of the Notifyer
	 * @param id - The Unique Entry ID to be search for
	 */
	static notifyerByID(table, id) {
		return SQL.notifyer().prepare(`DELETE FROM ${table} WHERE NotifyerID = ?`).run(id);
	}

	// All

	/**
	 * Del all matching Dataset of a Table in Database Notifyer by the given GuildID.
	 * 
	 * @remarks
	 * The Notifyer name is equel to the Databases table name.
	 * @param table - The Name of the Notifyer
	 * @param guildId - The GuildID to be search for
	 */
	static notifyerAll(table, guildId) {
		return SQL.notifyer().prepare(`DELETE FROM ${table} WHERE GuildID = ?`).all(guildId);
	}
}

exports.Del = Del;