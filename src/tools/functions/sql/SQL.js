// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sql_Config = new SQLite("./data/sqlite/config.sqlite");
const sql_Toggle = new SQLite("./data/sqlite/toggle.sqlite");
const sql_ChannelRole = new SQLite("./data/sqlite/channelRole.sqlite");
const sql_Notifyer = new SQLite("./data/sqlite/notifyer.sqlite");

class SQL {
	// Config
	static config() {
		return sql_Config;
	}
	static toggle() {
		return sql_Toggle;
	}
	static channelRole() {
		return sql_ChannelRole;
	}
	static notifyer() {
		return sql_Notifyer;
	}
}

exports.SQL = SQL;