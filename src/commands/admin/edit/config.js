/* eslint-disable no-console */
const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	cooldown: 5,
	admin: "true",
	nsfw: "false",
	data: new SlashCommandBuilder()
		.setName("config")
		.setDescription("editing config")
		.setDMPermission(false)
		.setDefaultMemberPermissions(
			PermissionsBitField.Flags.ViewAuditLog
            | PermissionsBitField.Flags.KickMembers
            | PermissionsBitField.Flags.ManageChannels
            | PermissionsBitField.Flags.ManageGuildExpressions
            | PermissionsBitField.Flags.ManageGuild
            | PermissionsBitField.Flags.ManageMessages
            | PermissionsBitField.Flags.ManageRoles
            | PermissionsBitField.Flags.ModerateMembers
            | PermissionsBitField.Flags.ManageThreads
            | PermissionsBitField.Flags.ManageWebhooks
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("help")
				.setDescription("A Help text.")
		)
		.addSubcommandGroup(subcommandgroup =>
			subcommandgroup
				.setName("command")
				.setDescription("commands")
				.addSubcommand(subcommand =>
					subcommand
						.setName("admin")
						.setDescription("Admin commands")
						.addStringOption(option =>
							option
								.setName("admin-command")
								.setDescription("Admin command")
								.setRequired(true)
								.addChoices(
									{ name: "Channels", value: "admin1-Channels" },
									{ name: "Config", value: "admin1-Config" },
									{ name: "Language", value: "admin1-Language" },
									{ name: "Roles", value: "admin1-Roles" },
									{ name: "Help", value: "admin1-Help" },
									{ name: "Info", value: "admin1-Info" },
									{ name: "Ping", value: "admin1-Ping" },
									{ name: "Reload", value: "admin1-Reload" },
									{ name: "Restart", value: "admin1-Restart" },
									{ name: "Sleep", value: "admin1-Sleep" },
									{ name: "Notifyer", value: "admin1-Notifyer"}
								)
						)
						.addStringOption(option =>
							option
								.setName("toggle")
								.setDescription("ON/OFF")
								.setRequired(true)
								.addChoices(
									{ name: "ON", value: "true" },
									{ name: "OFF", value: "false" }
								)
						)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("notifyer")
				.setDescription("Notifyer")
				.addStringOption(option =>
					option
						.setName("notifyeroptions")
						.setDescription("Notifyer Options")
						.setRequired(true)
						.addChoices(
							{ name: "Twitch", value: "notifyer-Twitch" },
							{ name: "YouTube", value: "notifyer-YouTube" },
							{ name: "TikTok", value: "notifyer-TikTok" }
						)
				)
				.addStringOption(option =>
					option
						.setName("toggle")
						.setDescription("ON/OFF")
						.setRequired(true)
						.addChoices(
							{ name: "ON", value: "true" },
							{ name: "OFF", value: "false" }
						)
				)
		),
	async execute(interaction) {
		if (interaction == null
		|| interaction.channel.id == null) return console.error(`[${DateTime.utc().toFormat(timeFormat)}][Bot] Interaction of Command 'config' returned 'null / undefined'.`);

		const { Get, Set } = require("../../../tools/functions/sql/db.js");
		const getGuildID = `${interaction.guild.id}`;
		const getShardID = `${interaction.guild.shard.id}`;
		const getChannelID = `${interaction.channel.id}`;
		const getBotConfigID = `${getGuildID}-${getShardID}`;
		const getChannelRoleID = `${getBotConfigID}-${getChannelID}`;
		let dataLang = Get.configByID("discord_bot", getBotConfigID);
		let dataCommandAdmin = Get.toggleByID("command_admin", getBotConfigID);
		let dataChannelAdmin = Get.channelByID("channel_bot", getChannelRoleID);
		const dataChannelAdminGuild = Get.costumGetOne("channel_bot", "GuildID", getGuildID);

		if (dataLang == null) dataLang = { Lang: "en_US" };
		if (dataCommandAdmin == null) dataCommandAdmin = { Config: "true" };
		if (dataChannelAdminGuild == null) dataChannelAdmin = { ChannelID: `${getChannelID}` };

		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const configLang = lang.cmd.admin.config;
		const { LanguageConvert } = require("../../../tools/functions/languageConvert");
		const permissions = interaction.member.permissions;
		if (dataCommandAdmin.Config !== "true") return await interaction.reply({ content: langError.command.disabled, ephemeral: true });
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permission.admin, ephemeral: true });
		if (!dataChannelAdmin || getChannelID !== dataChannelAdmin.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		const configembed = new EmbedBuilder()
			.setColor("DarkGreen")
			.setTitle(`${configLang.title}`);
		if (interaction.options.getSubcommand() === "help") {
			configembed.addFields([
				{ name: `${configLang.name}`, value: `${configLang.value}`, inline: false }
			]);
			await interaction.reply({ embeds: [configembed] });
		}
		// Command
		if (interaction.options.getSubcommandGroup() === "command") {
			// Admin
			if (interaction.options.getSubcommand() === "admin") {
				const stringGetToggle = interaction.options.getString("toggle");
				const stringGetCommandAdmin = interaction.options.getString("admin-command");
				const dataCommandAdmin = { ToggleID: `${getBotConfigID}`, GuildID: `${getGuildID}`, ShardID: `${getShardID}`, Channel: "true", Config: "true", Language: "false", Notifyer: "true", Roles: "true", Help: "true", Info: "true", Ping: "true", Reload: "true", Restart: "true", Sleep: "true", Test: "true" };
				toggleConfig(getBotConfigID, "command_admin", stringGetCommandAdmin, stringGetToggle, dataCommandAdmin);
			}
		}
		// Notifyer
		if (interaction.options.getSubcommand() === "notifyer") {
			const stringGetToggle = interaction.options.getString("toggle");
			const stringGetNotifyer = interaction.options.getString("notifyeroptions");
			const dataNotifyer = { ToggleID: `${getBotConfigID}`, GuildID: `${getGuildID}`, ShardID: `${getShardID}`, Twitch: "false", YouTube: "false", TikTok: "false" };
			toggleConfig(getBotConfigID, "notifyer", stringGetNotifyer, stringGetToggle, dataNotifyer);
		}
		
		/**
		 * @param dataId - The Database table ID (ToggleID)
		 * @param table - The Table to be used
		 * @param configSet - The Config option to be toggled
		 * @param toggle - The Toggle
		 * @param nullData - The DataSet to be used if database is null
		 * @returns 
		 */
		async function toggleConfig(dataId, table, configSet, toggle, nullData) {
			let dataToggle = Get.toggleByID(table, dataId);
			if (dataToggle == null) { dataToggle = nullData; }
			const splitSGR = configSet.split("-");
			if (dataToggle[splitSGR[1]] === toggle) return await interaction.reply({ content: LanguageConvert.lang(configLang.isset, configLang[toggle]), ephemeral: true });
			dataToggle[splitSGR[1]] = toggle;
			Set.toggleByData(table, dataToggle);
			await interaction.reply({ content: LanguageConvert.lang(configLang.set, configLang[toggle]), ephemeral: true });
		}
	}
};