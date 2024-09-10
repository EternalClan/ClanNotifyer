/* eslint-disable no-console */
const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { globSync } = require("glob");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	cooldown: 5,
	admin: "true",
	nsfw: "false",
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Reloads a command.")
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
		.addStringOption(option =>
			option.setName("command")
				.setDescription("The command to reload.")
				.setRequired(true)
				.setAutocomplete(true)
		),
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
		// console.log(focusedOption);
		let choices = [];

		if (focusedOption.name === 'command') {
			let cmds = [];
			interaction.client.commands.forEach(cmd => {
				cmds.push(cmd.data.name);
			});

			choices = cmds.filter(cmdName => cmdName.startsWith(focusedOption.value.toLowerCase()));
			if (choices.length > 25) choices = [];
		}

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction) {

		if (interaction == null
		|| interaction.channel.id == null) return console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'reload' returned 'null / undefined'.`);

		const { Get } = require("../../../tools/functions/sql/db.js");
		const getGuildID = `${interaction.guild.id}`;
		const getShardID = `${interaction.guild.shard.id}`;
		const getChannelID = `${interaction.channel.id}`;
		const getBotConfigID = `${getGuildID}-${getShardID}`;
		const getChannelRoleID = `${getGuildID}-${getShardID}-${getChannelID}`;
		let dataLang = Get.configByID("discord_bot", getBotConfigID);
		let dataCommandAdmin = Get.toggleByID("command_admin", getBotConfigID);
		let dataChannelAdmin = Get.channelByID("channel_bot", getChannelRoleID);
		const dataChannelAdminGuild = Get.costumGetOne("channel_bot", "GuildID", getGuildID);

		if (dataLang == null) dataLang = { Lang: "en_US" };
		if (dataCommandAdmin == null) return;
		if (dataCommandAdmin.Reload === "false") dataCommandAdmin = { Reload: "true" };
		if (dataChannelAdminGuild == null) dataChannelAdmin = { ChannelID: `${getChannelID}` };

		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const { LanguageConvert } = require("../../../tools/functions/languageConvert");
		const permissions = interaction.member.permissions;
		if (dataCommandAdmin.Reload !== "true") return await interaction.reply({ content: langError.command.disabled, ephemeral: true });
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permission.admin, ephemeral: true });
		if (!dataChannelAdmin || getChannelID !== dataChannelAdmin.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		const commandName = interaction.options.getString("command", true).toLowerCase();
		const command = interaction.client.commands.get(commandName);
		if (!command) {
			return interaction.reply(`${lang.cmd.admin.reload.nocmd} \`${commandName}\`!`);
		}

		const rawDir = globSync(`./src/commands/**/**/${command.data.name}.js`);
		const stringRawDir = rawDir.toString();
		const replacedRawDir = stringRawDir.replace(/\\/gi, "/");
		const dir1 = replacedRawDir.replace("src/commands", "../..");

		delete require.cache[require.resolve(`${dir1}`)];

		try {
			interaction.client.commands.delete(command.data.name);
			const newCommand = require(`${dir1}`);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(LanguageConvert.lang(lang.cmd.admin.reload.reloaded, newCommand.data.name));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
			await interaction.reply(LanguageConvert.lang(lang.cmd.admin.reload.reloaderror, command.data.name, error.message));
		}
	}
};