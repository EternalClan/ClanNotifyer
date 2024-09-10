const { readdirSync } = require("fs");
const { REST, Routes } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = (message) => {
	const getGuildID = message.guild.id;
	const getBotConfigID = `${message.guild.id}-${message.guild.shardId}`;
	const { Get } = require("../../../tools/functions/sql/db.js");
	let dataLang;
	dataLang = Get.configByID("discord_bot", getBotConfigID);
	if (dataLang == null) dataLang = { Lang: "en_US" };
	const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
	// const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
	const langDev = lang.cmd.dev;
	const { LanguageConvert } = require("../../../tools/functions/languageConvert.js");

	// const dataToggle = Get.toggleByID("command_system", getBotConfigID);
	// if (dataToggle == null || dataToggle.LocalRemove !== "true") {
	// 	message.reply({ content: langError.command.disabled });
	// 	return;
	// }

	// eslint-disable-next-line no-undef
	const getClientID = globalclient.user.id;
	const commands = [];
	const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
	// Getting Directory name from list and filter out .js filesin to a string.
	const load_dir = (mainDirs, subDirs) => {
		const commandFiles = readdirSync(`./src/commands/${mainDirs}/${subDirs}`).filter(cmdFile => cmdFile.endsWith(".js"));
		// Grabs files out of the string, one by one (for loop) and Sets Command in the Collection.
		for (const cmdFile of commandFiles) {
			const command = require(`../../${mainDirs}/${subDirs}/${cmdFile}`);
			if (command == null) return;
			if (command.data.name) commands.push(command.data.toJSON());
			// If Name is undefined or Admin False, continue (for loop).
			if (!command.data.name) continue;
		}
	};
	// Directory name array list.
	const mainCmdDirs = [ "admin" ];
	mainCmdDirs.forEach(mainDir => {
		const subCmdDirs = readdirSync(`./src/commands/${mainDir}`);
		subCmdDirs.forEach(subDir => load_dir(mainDir, subDir));
	});
	(async () => {
		try {
			// eslint-disable-next-line no-console
			console.log(`[${DateTime.utc().toFormat(timeFormat)}] Started refreshing ${commands.length} guild (/) commands.`);
			const data = await rest.put(
				// Local commands
				Routes.applicationGuildCommands(getClientID, getGuildID),
				{ body: commands }
			);
			const conMsg = `[${DateTime.utc().toFormat(timeFormat)}] Successfully reloaded ${data.length} guild (/) commands.`;
			const replyMsg = LanguageConvert.lang(langDev.deploy.localadd, data.length);
			// eslint-disable-next-line no-console
			console.log(conMsg);
			message.reply({ content: replyMsg, ephemeral: true });
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	})();
};
