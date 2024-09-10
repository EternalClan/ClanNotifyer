const { Events } = require("discord.js");

module.exports = {
	name: Events.GuildDelete,
	description: "Log Bot Lefting Servers.",
	once: true,
	async execute(guild) {
		// eslint-disable-next-line no-console
		console.log(`The Bot left a server: ${guild.name}`);
		["leave"].forEach(systemHandler => {
			require(`../../../tools/data/${systemHandler}.js`)(guild);
		});
	}
};
