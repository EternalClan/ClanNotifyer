// Require SQLite and Databases
const SQLite = require("better-sqlite3");
const sqlConfig = new SQLite("./data/sqlite/config.sqlite");
const sqlToggle = new SQLite("./data/sqlite/toggle.sqlite");
const sqlChannelRole = new SQLite("./data/sqlite/channelRole.sqlite");
const sqlNotifyer = new SQLite("./data/sqlite/notifyer.sqlite");

class SQL {
	// Config
	static config() {
		return sqlConfig;
	}

	static toggle() {
		return sqlToggle;
	}

	static channelRole() {
		return sqlChannelRole;
	}

	static notifyer() {
		return sqlNotifyer;
	}
}

exports.SQL = SQL;
