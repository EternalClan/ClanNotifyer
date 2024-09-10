// Require SQLite and Databases
const { SQL } = require("./SQL.js");

class Get {
	// Costum Get's

	/**
	 * Get a set of Data from an Database by the given parameters value.
	 * 
	 * @remarks
	 * You will need to created the SQL String yourself. better-sqlite3 is used here.
	 * @param database - The Database to be used
	 * @param sqlString - The SQL String to be used
	 * @param value - The Value's to be search for
	 */
	static costumGet(database, sqlString, value) {
		if (database === "Config") return SQL.config().prepare(sqlString).get(value);
		if (database === "Toggle") return SQL.toggle().prepare(sqlString).get(value);
		if (database === "ChannelRole") return SQL.channelRole().prepare(sqlString).get(value);
		if (database === "Notifyer") return SQL.notifyer().prepare(sqlString).get(value);
	}

	/**
	 * Get one set of Data from an Database by the given parameters value.
	 * 
	 * @param database - The Database to be used
	 * @param table - The Database Table to search in
	 * @param column - The Column to be search with
	 * @param value - The Value to be search for
	 */
	static costumGetOne(database, table, column, value) {
		const sqlString = `SELECT * FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).get(value);
		if (database === "Toggle") return SQL.toggle().prepare(sqlString).get(value);
		if (database === "ChannelRole") return SQL.channelRole().prepare(sqlString).get(value);
		if (database === "Notifyer") return SQL.notifyer().prepare(sqlString).get(value);
	}

	/**
	 * Get all set's of Data from an Database by the given parameters value.
	 * 
	 * @param database - The Database to be used
	 * @param table - The Database Table to search in
	 * @param column - The Column to be search with
	 * @param value - The Value to be search for
	 */
	static costumGetAll(database, table, column, value) {
		const sqlString = `SELECT * FROM ${table} WHERE ${column} = ?`;
		if (database === "Config") return SQL.config().prepare(sqlString).all(value);
		if (database === "Toggle") return SQL.toggle().prepare(sqlString).all(value);
		if (database === "ChannelRole") return SQL.channelRole().prepare(sqlString).all(value);
		if (database === "Notifyer") return SQL.notifyer().prepare(sqlString).all(value);
	}

	// Config
	// By ID

	/**
	 * Get the first matching Dataset of a Table in Database Config by the given ID.
	 * 
	 * @remarks
	 * The Config name is equel to the Databases table name.
	 * @param table - The Name of the config
	 * @param id - The Unique Entry ID to be search for
	 */
	static configByID(table, id) {
		return SQL.config().prepare(`SELECT * FROM ${table} WHERE ConfigID = ?`).get(id);
	}

	// All

	/**
	 * Get all matching Dataset of a Table in Database Config by the given GuildID.
	 * 
	 * @remarks
	 * The Config name is equel to the Databases table name.
	 * @param table - The Name of the config
	 * @param guildId - The GuildID to be search for
	 */
	static configAll(table, guildId) {
		return SQL.config().prepare(`SELECT * FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// Toggle
	// By ID

	/**
	 * Get the first matching Dataset of a Table in Database Toggle by the given ID.
	 * 
	 * @remarks
	 * The Toggle name is equel to the Databases table name.
	 * @param table - The Name of the toggle
	 * @param id - The Unique Entry ID to be search for
	 */
	static toggleByID(table, id) {
		return SQL.toggle().prepare(`SELECT * FROM ${table} WHERE ToggleID = ?`).get(id);
	}

	// All

	/**
	 * Get all matching Dataset of a Table in Database Toggle by the given GuildID.
	 * 
	 * @remarks
	 * The Toggle name is equel to the Databases table name.
	 * @param table - The Name of the toggle
	 * @param guildId - The GuildID to be search for
	 */
	static toggleAll(table, guildId) {
		return SQL.toggle().prepare(`SELECT * FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// Channel
	// By ID

	/**
	 * Get the first matching Dataset of a Table in Database Channel by the given ID.
	 * 
	 * @remarks
	 * The Channel name is equel to the Databases table name.
	 * @param table - The Name of the channel
	 * @param id - The Unique Entry ID to be search for
	 */
	static channelByID(table, id) {
		return SQL.channelRole().prepare(`SELECT * FROM ${table} WHERE ChannelRoleID = ?`).get(id);
	}

	// All

	/**
	 * Get all matching Dataset of a Table in Database Channel by the given GuildID.
	 * 
	 * @remarks
	 * The Channel name is equel to the Databases table name.
	 * @param table - The Name of the channel
	 * @param guildId - The GuildID to be search for
	 */
	static channelAll(table, guildId) {
		return SQL.channelRole().prepare(`SELECT * FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// Role
	// By ID

	/**
	 * Get the first matching Dataset of a Table in Database Role by the given ID.
	 * 
	 * @remarks
	 * The Role name is equel to the Databases table name.
	 * @param table - The Name of the role
	 * @param id - The Unique Entry ID to be search for
	 */
	static roleByID(table, id) {
		return SQL.channelRole().prepare(`SELECT * FROM ${table} WHERE ChannelRoleID = ?`).get(id);
	}

	// All

	/**
	 * Get all matching Dataset of a Table in Database Role by the given GuildID.
	 * 
	 * @remarks
	 * The Role name is equel to the Databases table name.
	 * @param table - The Name of the role
	 * @param guildId - The GuildID to be search for
	 */
	static roleAll(table, guildId) {
		return SQL.channelRole().prepare(`SELECT * FROM ${table} WHERE GuildID = ?`).all(guildId);
	}

	// Notifyer
	// By ID

	/**
	 * Get the first matching Dataset of a Table in Database Notifyer by the given ID.
	 * 
	 * @remarks
	 * The Notifyer name is equel to the Databases table name.
	 * @param table - The Name of the Notifyer
	 * @param id - The Unique Entry ID to be search for
	 */
	static notifyerByID(table, id) {
		return SQL.notifyer().prepare(`SELECT * FROM ${table} WHERE NotifyerID = ?`).get(id);
	}

	// All

	/**
	 * Get all matching Dataset of a Table in Database Notifyer by the given GuildID.
	 * 
	 * @remarks
	 * The Notifyer name is equel to the Databases table name.
	 * @param table - The Name of the Notifyer
	 * @param guildId - The GuildID to be search for
	 */
	static notifyerAll(table, guildId) {
		return SQL.notifyer().prepare(`SELECT * FROM ${table} WHERE GuildID = ?`).all(guildId);
	}
}

exports.Get = Get;