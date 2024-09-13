/* eslint-disable max-len */
/* eslint-disable no-console */
const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	cooldown: 5,
	admin: "true",
	nsfw: "false",
	data: new SlashCommandBuilder()
		.setName("sleep")
		.setDescription("Sends the bot to sleep (shutdown)")
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
		),
	async execute(interaction) {
		if (interaction == null ||
		interaction.channel.id == null) return console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'shutdown' returned 'null / undefined'.`);

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
		if (dataCommandAdmin.Sleep === "false") dataCommandAdmin = { Sleep: "true" };
		if (dataChannelAdminGuild == null) dataChannelAdmin = { ChannelID: `${getChannelID}` };

		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const permissions = interaction.member.permissions;
		if (dataCommandAdmin.Sleep !== "true") return await interaction.reply({ content: langError.command.disabled, ephemeral: true });
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permission.admin, ephemeral: true });
		if (!dataChannelAdmin || getChannelID !== dataChannelAdmin.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		console.info(`[${DateTime.utc().toFormat(timeFormat)}] Shutting down.`);
		await interaction.reply({ content: `${lang.cmd.admin.sleep.stopping}`, ephemeral: false });
		const { Application } = require("../../../core/application/Application.js");
		Application.stop("STOP");
	}
};
