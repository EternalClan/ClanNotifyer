/* eslint-disable no-console */
const { readdirSync } = require("fs");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";

module.exports = (client) => {
	// Grabs folders and files out of the strings, one by one (for loop).
	const load_dir = (mainDirs) => {
		const eventFiles = readdirSync(`./src/core/events/${mainDirs}`).filter(files => files.endsWith(".js"));
		for (const file of eventFiles) {
			const event = require(`../events/${mainDirs}/${file}`);
			// Calls files as an event once or on.
			if (event == null || event.once == null) continue;
			if (event.once === true) client.once(event.name, (...args) => event.execute(...args));
			if (event.once === false) client.on(event.name, (...args) => event.execute(...args));
		}
	};
	const mainCmdDirs = readdirSync("./src/core/events");
	mainCmdDirs.forEach(mainDir => load_dir(mainDir));
	console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", "Event Handler loaded");
};