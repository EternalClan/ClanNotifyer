/* eslint-disable no-console */
const { readdirSync } = require("fs");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";

module.exports = (globalclient) => {
	// Getting Directory name from list and filter out .js filesin to a string.
	const loadDir = (mainDirs, subDirs) => {
		const commandFiles = readdirSync(`./src/commands/${mainDirs}/${subDirs}`).filter(cmdFile => cmdFile.endsWith(".js"));
		// Grabs files out of the string, one by one (for loop) and Sets Command in the Collection.
		for (const cmdFile of commandFiles) {
			const command = require(`../../commands/${mainDirs}/${subDirs}/${cmdFile}`);
			if (command == null) return;
			if (command.data.name) globalclient.commands.set(command.data.name, command);
			// If Name is undefined or Admin False, continue (for loop).
			if (!command.data.name) continue;
		}
	};
	// Directory name array list.
	const mainCmdDirs = ["admin"];
	mainCmdDirs.forEach(mainDir => {
		const subCmdDirs = readdirSync(`./src/commands/${mainDir}`);
		subCmdDirs.forEach(subDir => loadDir(mainDir, subDir));
	});
	console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", "Command Handler loaded");
};
