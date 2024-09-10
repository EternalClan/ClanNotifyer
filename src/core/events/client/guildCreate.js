const { Events } = require("discord.js");

module.exports = {
	name: Events.GuildCreate,
	description: "Log Bot Joining Servers.",
	once: true,
	async execute(guild) {
		// eslint-disable-next-line no-console
		console.log(`The Bot Joined a new server: ${guild.name}`);
		["join"].forEach(systemHandler => {
			require(`../../../tools/data/${systemHandler}.js`)(guild);
		});
	}
};
