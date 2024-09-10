/* eslint-disable no-console */
/* eslint-disable no-multi-spaces */
/* eslint-disable no-inline-comments */
// DiscordJS
const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, Collection } = Discord;
require("dotenv").config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.User,                  // The partial to receive uncached users.
		Partials.Channel,               // The partial to receive uncached channels. This is required to receive direct messages.
		Partials.GuildMember,           // The partial to receive uncached guild members.
		Partials.Message,               // The partial to receive uncached messages.
		Partials.Reaction               // The partial to receive uncached reactions.
	]
});
// Discord const
const fs = require("node:fs");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
const { DateTime } = require("luxon");
console.log(`[Time] ${DateTime.utc().toFormat(timeFormat)} [UTC]`);

// Start
console.log("[NodeJS] ▪ ▪ ▪ ▪ ▪  DiscordBot Start  ▪ ▪ ▪ ▪ ▪ ");

// Command Event Database handler
client.cooldowns = new Collection();
client.commands = new Collection();
["event_handler"].forEach(handler => {
	require(`../handler/${handler}.js`)(client, Discord, fs);
});
// Login
client.login(process.env.TOKEN);

// //--------END--------//