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
		.setName("adminhelp")
		.setDescription("admin help")
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
		),
	async execute(interaction) {
		if (interaction == null || interaction.channel.id == null
		|| interaction.guild.id == null) return console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'adminhelp' returned 'null / undefined'.`);

		const { Get } = require("../../../tools/functions/sql/db.js");
		const getGuildID = `${interaction.guild.id}`;
		const getShardID = `${interaction.guild.shard.id}`;
		const getChannelID = `${interaction.channel.id}`;
		const getBotConfigID = `${getGuildID}-${getShardID}`;
		const getChannelRoleID = `${getGuildID}-${getShardID}-${getChannelID}`;
		let dataLang = Get.configByID("discord_bot", getBotConfigID);
		let dataCommandAdmin = Get.toggleByID("command_admin", getBotConfigID);
		let dataChannelAdmin = Get.channelForAdmin(getChannelRoleID);
		const dataChannelAdminGuild = Get.costumGetOne("channel_bot", "GuildID", getGuildID);

		if (dataLang == null) dataLang = { Lang: "en_US" };
		if (dataCommandAdmin == null) dataCommandAdmin = { Help: "true" };
		if (dataChannelAdminGuild == null) dataChannelAdmin = { ChannelID: `${getChannelID}` };

		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const permissions = interaction.member.permissions;
		if (dataCommandAdmin.Help !== "true") return await interaction.reply({ content: langError.command.disabled, ephemeral: true });
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permission.admin, ephemeral: true });
		if (!dataChannelAdmin || getChannelID !== dataChannelAdmin.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		const dataNew = interaction.client.commands.filter(f => f.admin === "true");
		const dataPcName = dataNew.map(cmd =>{
			return `${cmd.data.name}`;
		});
		const dataPcDescription = dataNew.map(cmd =>{
			return `${cmd.data.description}`;
		});
		const stringPcName = dataPcName.toString();
		const stringPcDescription = dataPcDescription.toString();
		const replacePcName = stringPcName.replace(/[,]/gi, "\n");
		const replacePcDescrition = stringPcDescription.replace(/[,]/gi, "\n");
		const cmdembed = new EmbedBuilder()
			.setTitle(`${lang.cmd.admin.help.title}`)
			.setColor("Orange")
			.setDescription("<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>")
			.addFields(
				{ name: `${lang.cmd.admin.help.cmdlist}`, value: `${replacePcName}`, inline: true },
				{ name: `${lang.cmd.admin.help.cmddescription}`, value: `${replacePcDescrition}`, inline: true }
			);
		await interaction.reply({ embeds: [cmdembed] });
	}
};
