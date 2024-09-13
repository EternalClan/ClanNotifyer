/* eslint-disable no-undef */
/* eslint-disable no-console */
const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { Client } = Discord;
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

/**
 * Helper class for syncing discord target channels.
 */
class DiscordChannelSync {
	/**
     * @param {Client} client Discord.js client.
     * @param {string} channelName Name of the Discord channel we are looking for on each server (e.g. `config.discord_announce_channel`).
     * @param {boolean} verbose If true, log guild membership info to stdout (debug / info purposes).
     * @return {Channel[]} List of Discord.js channels
     */
	static getChannelList(client, channelName, verbose) {
		const { Get } = require("../../tools/functions/sql/db.js");
		const dataConfig = Get.costumGet("Config", "SELECT * FROM discord_bot WHERE BotID = ?;", client.user.id);
		const guild = client.guilds.cache.get(dataConfig.GuildID);
		const getBotConfigID = `${dataConfig.GuildID}-${guild.shard.id}`;
		const dataTwitch = Get.toggleByID("notifyer", getBotConfigID);
		if (dataTwitch == null) {
			return;
		}
		const nextTargetChannels = [];

		client.guilds.cache.forEach((guild) => {
			const targetChannel = guild.channels.cache.find(g => g.name === channelName);

			if (!targetChannel) {
				if (verbose) {
					console.warn("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", "Configuration problem /!\\", `Guild ${guild.name} does not have a #${channelName} channel!`);
				}
			} else {
				const permissions = targetChannel.permissionsFor(client.user.id);

				if (verbose) {
					// eslint-disable-next-line max-len
					// console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", " --> ", `Member of server ${guild.name}, target channel is #${targetChannel.name}`);
				}
				if (!permissions.has([Discord.PermissionsBitField.Flags.SendMessages])) {
					if (verbose) {
						console.warn("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", "Permission problem /!\\", `I do not have SEND_MESSAGES permission on channel #${targetChannel.name} on ${guild.name}: announcement sends will fail.`);
					}
				}

				nextTargetChannels.push(targetChannel);
			}
		});

		if (verbose) {
			// eslint-disable-next-line max-len
			// console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", `Discovered ${nextTargetChannels.length} channels to announce to for ${channelName}.`);
		}

		return nextTargetChannels;
	}
}

module.exports.DiscordChannelSync = DiscordChannelSync;
