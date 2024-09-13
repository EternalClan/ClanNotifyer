/* eslint-disable max-len */
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
		.setName("roles")
		.setDescription("editing stuff")
		.setDMPermission(false)
		.setDefaultMemberPermissions(
			PermissionsBitField.Flags.ViewAuditLog |
            PermissionsBitField.Flags.KickMembers |
            PermissionsBitField.Flags.ManageChannels |
            PermissionsBitField.Flags.ManageGuildExpressions |
            PermissionsBitField.Flags.ManageGuild |
            PermissionsBitField.Flags.ManageMessages |
            PermissionsBitField.Flags.ManageRoles |
            PermissionsBitField.Flags.ModerateMembers |
            PermissionsBitField.Flags.ManageThreads |
            PermissionsBitField.Flags.ManageWebhooks
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("help")
				.setDescription("A Help text.")
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("List of set roles")
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("set")
				.setDescription("Set a role.")
				.addStringOption(option =>
					option
						.setName("setoptions")
						.setDescription("Set Options")
						.setRequired(true)
						.addChoices(
							{ name: "Admin", value: "admin" },
							{ name: "User", value: "user" },
							{ name: "Nsfw", value: "nsfw" }
						)
				)
				.addRoleOption(option =>
					option
						.setName("roleid")
						.setDescription("Role ID")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("remove")
				.setDescription("Remove a role.")
				.addStringOption(option =>
					option
						.setName("removeoptions")
						.setDescription("Remove Options")
						.setRequired(true)
						.addChoices(
							{ name: "Admin", value: "admin" },
							{ name: "User", value: "user" },
							{ name: "Nsfw", value: "nsfw" }
						)
				)
				.addRoleOption(option =>
					option
						.setName("roleid")
						.setDescription("Role ID")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("prune")
				.setDescription("Check if the set Roles still exists.")
				.addStringOption(option =>
					option
						.setName("pruneoptions")
						.setDescription("Prune Options.")
						.addChoices(
							{ name: "Admin", value: "admin" },
							{ name: "User", value: "user" },
							{ name: "NSFW", value: "nsfw" }
						)
				)
		),
	async execute(interaction) {
		if (interaction == null ||
		interaction.channel.id == null) return console.error(`[${DateTime.utc().toFormat(timeFormat)}][Bot] Interaction of Command 'roles' returned 'null / undefined'.`);

		const { Get, Set, Del } = require("../../../tools/functions/sql/db.js");
		const getGuildID = `${interaction.guild.id}`;
		const getClientID = `${interaction.client.user.id}`;
		const getShardID = `${interaction.guild.shard.id}`;
		const getChannelID = `${interaction.channel.id}`;
		const getBotConfigID = `${getGuildID}-${getShardID}`;
		const getChannelRoleID = `${getGuildID}-${getShardID}-${getChannelID}`;
		let dataLang = Get.configByID("discord_bot", getBotConfigID);
		let dataCommandAdmin = Get.toggleByID("command_admin", getBotConfigID);
		let dataChannelAdmin = Get.channelByID("channel_bot", getChannelRoleID);
		const dataChannelAdminGuild = Get.costumGetOne("channel_bot", "GuildID", getGuildID);

		if (dataLang == null) dataLang = { Lang: "en_US" };
		if (dataCommandAdmin == null) dataCommandAdmin = { Roles: "true" };
		if (dataChannelAdminGuild == null) { dataChannelAdmin = { ChannelID: `${getChannelID}` }; console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Command 'channel' executed outside the admin channels.`); }

		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const langRoles = lang.cmd.admin.roles;
		const { LanguageConvert } = require("../../../tools/functions/languageConvert");
		const permissions = interaction.member.permissions;
		if (dataCommandAdmin.Roles !== "true") return await interaction.reply({ content: langError.command.disabled, ephemeral: true });
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permission.admin, ephemeral: true });
		if (!dataChannelAdmin || getChannelID !== dataChannelAdmin.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		const roleembed = new EmbedBuilder()
			.setColor("DarkGreen")
			.setTitle(`${langRoles.title}`);
		if (interaction.options.getSubcommand() === "help") {
			roleembed.addFields(
				{ name: `${langRoles.helpname1}`, value: `${langRoles.helpvalue2}`, inline: false }
			);
			await interaction.reply({ embeds: [roleembed] });
		}
		if (interaction.options.getSubcommand() === "list") {
			const tables = ["role_admin", "role_user", "role_nsfw"];
			tables.forEach(function(table) {
				let dataRoleList = Get.roleAll(table, getGuildID);
				if (dataRoleList == null) dataRoleList = { RoleID: null };
				const arrayOfStrings = dataRoleList.map(function(obj) {
					return obj.RoleID;
				});
				let stringRole = `<@&${arrayOfStrings.toString().replace(/[,]/gi, ">\n<@&")}>`;
				const roleRegrex = /^([a-z<@&>]{4,})$/;
				if (stringRole == null || roleRegrex.test(stringRole)) stringRole = `${langRoles.nodata}`;
				roleembed.addFields([
					{ name: `${langRoles[table.replace("role_", "")]}`, value: `${stringRole}`, inline: true }
				]);
			});
			roleembed.setDescription("<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>");
			await interaction.reply({ embeds: [roleembed] });
		}
		// Add
		if (interaction.options.getSubcommand() === "set") {
			// Check if argument is a Role
			// Check if Role exists in Server.
			const stringGetRole = interaction.options.getRole("roleid");
			const roleId = stringGetRole.id;
			const channelRoleId = `${getBotConfigID}-${roleId}`;
			if (roleId == null) {
				roleembed.setDescription(`${langRoles.noroleserver}`);
				await interaction.reply({ embeds: [roleembed] });
			}

			/**
			 * @param dataId - The Database table id of this entry
			 * @param type - The Role Type/Group
			 * @param roleId - The Id of this role
			 */
			// eslint-disable-next-line no-inner-declarations
			async function setRole(dataId, type, roleId) {
				let dataAddRole = Get.roleByID(`role_${type}`, dataId);
				if (dataAddRole != null) {
					roleembed.setColor("Red")
						.setDescription(LanguageConvert.lang(langRoles.isset, stringGetRole, langRoles[type]));
					await interaction.reply({ embeds: [roleembed] });
				}
				if (dataAddRole === undefined || dataAddRole === null) {
					dataAddRole = { ChannelRoleID: `${dataId}`, GuildID: `${getGuildID}`, ShardID: `${getShardID}`, BotID: `${getClientID}`, RoleID: `${roleId}` };
					Set.roleByData(`role_${type}`, dataAddRole);
					roleembed.setDescription(LanguageConvert.lang(langRoles.set, stringGetRole, langRoles[type]));
					await interaction.reply({ embeds: [roleembed] });
				}
			}

			// Check if argument is Admin.
			const stringChoicesValueSet = interaction.options.getString("setoptions");
			if (stringChoicesValueSet === "admin") {
				setRole(channelRoleId, stringChoicesValueSet, roleId);
			}
			// Check if argument is User.
			if (stringChoicesValueSet === "user") {
				setRole(channelRoleId, stringChoicesValueSet, roleId);
			}
			// Check if argument is Nsfw.
			if (stringChoicesValueSet === "nsfw") {
				setRole(channelRoleId, stringChoicesValueSet, roleId);
			}
			// Check if argument is All.
			if (stringChoicesValueSet === "all") {
				roleembed.setColor("Red")
					.setDescription(`${langRoles.nomassadd}`);
				await interaction.reply({ embeds: [roleembed] });
			}
		}
		// Remove
		if (interaction.options.getSubcommand() === "remove") {
			// Check if argument is a Role
			// Check if Role is in database.
			const stringGetRole = interaction.options.getRole("roleid");
			const newStringGetRole = stringGetRole.id;
			const roleString = newStringGetRole.replace(/[<@&>]/, "");
			const channelRoleId = `${getGuildID}-${getShardID}-${roleString}`;
			if (roleString == null) {
				roleembed.setDescription(`${langRoles.noroleserver}`);
				await interaction.reply({ embeds: [roleembed] });
			}

			/**
			 * @param dataId - The Database table id of this entry
			 * @param type - The Role Type/Group
			 */
			// eslint-disable-next-line no-inner-declarations
			async function removeRole(dataId, type) {
				const dataRemoveRole = Get.roleByID(`role_${type}`, dataId);
				if (dataRemoveRole == null) {
					roleembed.setColor("Red")
						.setDescription(`${langRoles.norolelist}`);
					await interaction.reply({ embeds: [roleembed] });
				}
				if (dataRemoveRole != null) {
					Del.roleByID(`role_${type}`, dataRemoveRole);
					roleembed.setDescription(LanguageConvert.lang(langRoles.remove, stringGetRole, langRoles[type]));
					await interaction.reply({ embeds: [roleembed] });
				}
			}

			// Check if argument is Admin.
			const stringChoicesValueRemove = interaction.options.getString("removeoptions");
			if (stringChoicesValueRemove === "admin") {
				removeRole(channelRoleId, stringChoicesValueRemove);
			}
			// Check if argument is User.
			if (stringChoicesValueRemove === "user") {
				removeRole(channelRoleId, stringChoicesValueRemove);
			}
			// Check if argument is Nsfw.
			if (stringChoicesValueRemove === "nsfw") {
				removeRole(channelRoleId, stringChoicesValueRemove);
			}
			// Check if argument is All.
			if (stringChoicesValueRemove === "all") {
				roleembed.setColor("Red")
					.setDescription(`${langRoles.nomassremove}`);
				await interaction.reply({ embeds: [roleembed] });
			}
		}

		if (interaction.options.getSubcommand() === "prune") {
			let stringChoicesValue = interaction.options.getString("validateoptions");

			let countRemove = 0;
			// eslint-disable-next-line no-unused-vars
			let countKeep = 0;
			// eslint-disable-next-line no-unused-vars
			let countTotal = 0;

			/**
			 * @param guildId - The ID of the guild
			 * @param type - The Role Type/Group
			 */
			// eslint-disable-next-line no-inner-declarations
			async function roleValidate(guildId, type) {
				const dataValidateChannel = Get.roleAll(`role_${type}`, guildId);
				if (dataValidateChannel == null) {
					roleembed.setColor("Red")
						.setDescription(`${langRoles.norolelist}`);
					await interaction.reply({ embeds: [roleembed] });
				}
				if (dataValidateChannel != null) {
					dataValidateChannel.forEach(async data => {
						const channeId = data.ChannelID;
						const channel = await interaction.guild.channels.fetch(channeId);
						if (!channel) {
							const removeChannel = `${getBotConfigID}-${channeId}`;
							Del.roleByID(`role_${type}`, removeChannel);
							countRemove++;
							countTotal++;
						}
						if (channel) {
							countKeep++;
							countTotal++;
						}
					});
					roleembed.setDescription(LanguageConvert.lang(langRoles.prune, countRemove));
				}
			}

			if (!stringChoicesValue) {
				stringChoicesValue = ["admin", "user", "nsfw"];
				stringChoicesValue.forEach(type => {
					roleValidate(getGuildID, type);
				});
				await interaction.reply({ embeds: [roleembed] });
			} else if (stringChoicesValue) {
				roleValidate(getGuildID, stringChoicesValue);
				await interaction.reply({ embeds: [roleembed] });
			}
		}
	}
};
