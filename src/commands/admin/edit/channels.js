/* eslint-disable no-console */
/* eslint-disable max-len */
const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	cooldown: 5,
	admin: "true",
	nsfw: "false",
	data: new SlashCommandBuilder()
		.setName("channels")
		.setDescription("Setting/Removing Channels from Database.")
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
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("List set Channels.")
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("set")
				.setDescription("Set a Channel.")
				.addStringOption(option =>
					option
						.setName("setoptions")
						.setDescription("Set Options.")
						.setRequired(true)
						.addChoices(
							{ name: "Bot", value: "bot" },
							{ name: "Log", value: "log" }
						)
				)
				.addChannelOption(option =>
					option
						.setName("channel")
						.setDescription("The Channel")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("remove")
				.setDescription("Remove a Channel.")
				.addStringOption(option =>
					option
						.setName("removeoptions")
						.setDescription("Remove Options.")
						.setRequired(true)
						.addChoices(
							{ name: "Bot", value: "bot" },
							{ name: "Log", value: "log" }
						)
				)
				.addChannelOption(option =>
					option
						.setName("channel")
						.setDescription("The Channel")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("prune")
				.setDescription("Check if the set Channels still exists.")
				.addStringOption(option =>
					option
						.setName("pruneoptions")
						.setDescription("Prune Options.")
						.addChoices(
							{ name: "Bot", value: "bot" },
							{ name: "Log", value: "log" }
						)
				)
		),
	async execute(interaction) {
		if (interaction == null || interaction.channel.id == null || interaction.guild.id == null) return console.error(`[${DateTime.utc().toFormat(timeFormat)}][Bot] Interaction of Command 'channel' returned 'null / undefined'.`);

		const { Get, Set, Del } = require("../../../tools/functions/sql/db.js");
		const getGuildID = `${interaction.guild.id}`;
		const getClientID = `${interaction.client.user.id}`;
		const getShardID = `${interaction.guild.shard.id}`;
		const getChannelID = `${interaction.channel.id}`;
		const getBotConfigID = `${getGuildID}-${getShardID}`;
		const getChannelRoleID = `${getGuildID}-${getShardID}-${getChannelID}`;
		let dataLang = Get.configByID("discord_bot", getBotConfigID);
		let dataCommandAdmin = Get.toggleByID("command_admin", getBotConfigID);
		let dataChannelBot = Get.channelByID("channel_bot", getChannelRoleID);
		const dataChannelBotGuild = Get.costumGetOne("channel_bot", "GuildID", getGuildID);

		if (dataLang == null) dataLang = { Lang: "en_US" };
		if (dataCommandAdmin == null) dataCommandAdmin = { Channel: "true" };
		if (dataChannelBotGuild == null) dataChannelBot = { ChannelID: `${getChannelID}` };

		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const langChannel = lang.cmd.admin.channel;
		const { LanguageConvert } = require("../../../tools/functions/languageConvert");
		const permissions = interaction.member.permissions;
		if (dataCommandAdmin.Channel !== "true") return await interaction.reply({ content: LanguageConvert.lang(langError.command.disabled), ephemeral: true });
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permission.admin, ephemeral: true });
		if (!dataChannelBot || getChannelID !== dataChannelBot.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		const channelembed = new EmbedBuilder()
			.setColor("DarkGreen")
			.setTitle(`${langChannel.title}`);

		if (interaction.options.getSubcommand() === "help") {
			// \nc.channels edit <channel> <bot|nsfw|user|reaction|all>
			channelembed.addFields([
				{ name: langChannel.helpfield1, value: langChannel.helpfield2, inline: false }
			]);
			await interaction.reply({ embeds: [channelembed] });
		}
		if (interaction.options.getSubcommand() === "list") {
			const tables = ["bot", "notifyer"];
			tables.forEach(function (table) {
				let dataChannelList = Get.channelAll(`channel_${table}`, getGuildID);
				if (dataChannelList == null) dataChannelList = { ChannelID: null };
				const arrayOfStrings = dataChannelList.map(function (obj) {
					return obj.ChannelID;
				});
				let stringChannel = `<#${arrayOfStrings.toString().replace(/[,]/gi, ">\n<#")}>`;
				const channelRegrex = /^([a-z<#>]{3,})$/;
				if (stringChannel == null || channelRegrex.test(stringChannel)) stringChannel = `${langChannel.nodata}`;
				channelembed.addFields([
					{ name: `${langChannel[table]}`, value: `${stringChannel}`, inline: true },
				]);
			});
			channelembed.setDescription("<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>")
			await interaction.reply({ embeds: [channelembed] });
		}
		//
		// Add
		if (interaction.options.getSubcommand() === "set") {
			// Check if Channel exists in Server
			const stringChoicesValueSet = interaction.options.getString("setoptions");
			const stringGetChannel = interaction.options.getChannel("channel");
			const channelId = stringGetChannel.id;
			const cmdSetAllChannelID = `${getGuildID}-${getShardID}-${channelId}`;
			const cmdSetLogChannelID = `${getGuildID}-${getShardID}`;

			/**
			 * @param dataId - The Database table id of this entry
			 * @param type - The Channel Type/Group
			 * @param channelId - The Id of this channel
			 */
			async function channelSet(dataId, type, channelId) {
				let dataAddChannel = Get.channelByID(`channel_${type}`, dataId);
				if (dataAddChannel != null) {
					channelembed.setColor("Red")
						.setDescription(LanguageConvert.lang(langChannel.isset, stringGetChannel, langChannel[type]));
					await interaction.reply({ embeds: [channelembed] });
				}
				if (dataAddChannel == null) {
					dataAddChannel = { ChannelRoleID: `${dataId}`, GuildID: `${getGuildID}`, ShardID: `${getShardID}`, BotID: `${getClientID}`, ChannelID: `${channelId}` };
					Set.channelByData(`channel_${type}`, dataAddChannel);
					channelembed.setDescription(LanguageConvert.lang(langChannel.set, stringGetChannel, langChannel[type]));
					await interaction.reply({ embeds: [channelembed] });
				}
			};

			// Bot
			if (stringChoicesValueSet === "bot") {
				channelSet(cmdSetAllChannelID, stringChoicesValueSet, channelId);
			}
			// All
			if (stringChoicesValueSet === "all") {
				channelembed.setColor("Red")
					.setDescription(`${langChannel.noaddall}`);
				await interaction.reply({ embeds: [channelembed] });
			}
		}
		//
		// Remove
		if (interaction.options.getSubcommand() === "remove") {
			// Check if Channel exists in Server
			const stringChoicesValueRemove = interaction.options.getString("removeoptions");
			const stringGetChannel = interaction.options.getChannel("channel");
			const cmdRemoveAllChannelID = `${getGuildID}-${getShardID}-${stringGetChannel.id}`;
			const cmdRemoveLogChannelID = `${getGuildID}-${getShardID}`;

			/**
			 * @param dataId - The Database table id of this entry
			 * @param type - The Channel Type/Group
			 */
			async function channelRemove(dataId, type) {
				const dataRemoveChannel = Get.channelByID(`channel_${type}`, dataId);
				if (dataRemoveChannel == null) {
					channelembed.setColor("Red")
						.setDescription(`${langChannel.nochannelinlist}`);
					await interaction.reply({ embeds: [channelembed] });
				}
				if (dataRemoveChannel != null) {
					Del.channelByID(`channel_${type}`, dataId);
					channelembed.setDescription(LanguageConvert.lang(langChannel.remove, stringGetChannel, langChannel[type]));
					await interaction.reply({ embeds: [channelembed] });
				}
			};

			// Bot
			if (stringChoicesValueRemove === "bot") {
				channelRemove(cmdRemoveAllChannelID, stringChoicesValueRemove);
			}
			// All
			if (stringChoicesValueRemove === "all") {
				channelembed.setDescription(`${langChannel.noremoveall}`);
				await interaction.reply({ embeds: [channelembed] });
			}
		}

		if (interaction.options.getSubcommand() === "prune") {
			let stringChoicesValue = interaction.options.getString("pruneoptions");
			
			let countRemove = 0;
			let countKeep = 0;
			let countTotal = 0;

			/**
			 * @param guildId - The ID of the guild
			 * @param type - The Channel Type/Group
			 */
			async function channelValidate(guildId, type) {
				const dataValidateChannel = Get.channelAll(`channel_${type}`, guildId);
				if (dataValidateChannel == null) {
					channelembed.setColor("Red")
						.setDescription(`${langChannel.nochannelinlist}`);
					await interaction.reply({ embeds: [channelembed] });
				}
				if (dataValidateChannel != null) {
					dataValidateChannel.forEach(async data => {
						const channeId = data.ChannelID;
						const channel = await interaction.guild.channels.fetch(channeId);
						if (!channel) {
							const removeChannel = `${getBotConfigID}-${channeId}`
							Del.channelByID(`channel_${type}`, removeChannel)
							countRemove++;
							countTotal++;
						}
						if (channel) {
							countKeep++;
							countTotal++;
						}
					})
					channelembed.setDescription(LanguageConvert.lang(langChannel.prune, countRemove));
				}
			};
			
			if (!stringChoicesValue) {
				stringChoicesValue = ["bot","notifyer"];
				stringChoicesValue.forEach(type => {
					channelValidate(getGuildID, type);
				});
				await interaction.reply({ embeds: [channelembed] });
			} else if (stringChoicesValue) {
				channelValidate(getGuildID, stringChoicesValue);
				await interaction.reply({ embeds: [channelembed] });
			}
		}
	}
};
