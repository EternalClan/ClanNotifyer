/* eslint-disable no-undef */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const { ActivityType, Events } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const { Application } = require("../../application/Application.js");
		// Set Client (Bot) Activity.
		client.user.setActivity("Network Mischief", { type: ActivityType.Playing });
		console.log(`[${DateTime.utc().toFormat(timeFormat)}][Discord] logged in as ${client.user.tag}.`);
		global.globalclient = client;

		Application.database();
		console.log(`[${DateTime.utc().toFormat(timeFormat)}] ▪ ▪ ▪  Module Start  ▪ ▪ ▪ `);

		global.globaltwitchready = false;
		const handlerList = ["command_handler", "twitch_handler"];
		handlerList.forEach(modulesHandler => {
			require(`../../handler/${modulesHandler}`)(globalclient);
		});

		console.log(`[Time] ${DateTime.utc().toFormat(timeFormat)} [UTC]`);
		console.log("[NodeJS] ▪ ▪ ▪ ▪ ▪  DiscordBot Ready  ▪ ▪ ▪ ▪ ▪ ");
	}
};
/*
0   PLAYING     "Playing {name}"
1   STREAMING   "Streaming {details}"   Only Twitch and YouTube urls work.
2   LISTENING   "Listening to {name}"
3   WATCHING    "Watching {name}"
4   CUSTOM      "{emoji} {name}"
5   COMPETING   "Competing in {name}"
*/
