/* eslint-disable no-console */
/* eslint-disable max-len */
const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	cooldown: 5,
	admin: "true",
	nsfw: "true",
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Testing commands and little functions")
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ViewAuditLog),
	async execute(interaction) {
		if (interaction == null || interaction.channel.id == null ||
		interaction.guild.id == null) return console.error(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'test' returned 'null / undefined'.`);

		const { Get } = require("../../../tools/functions/sql/db");
		const getGuildID = `${interaction.guild.id}`;
		const getShardID = `${interaction.guild.shard.id}`;
		const getChannelID = `${interaction.channel.id}`;
		const getBotConfigID = `${getGuildID}-${getShardID}`;
		const getChannelRoleID = `${getGuildID}-${getShardID}-${getChannelID}`;
		// const getGuildOwnerID = `${interaction.member.guild.ownerId}`;
		// const getUserID = `${interaction.member.user.id}`;
		let dataLang = Get.configByID("discord_bot", getBotConfigID);
		let dataCommandAdmin = Get.toggleByID("command_admin", getBotConfigID);
		let dataChannelBot = Get.channelByID("channel_bot", getChannelRoleID);
		const dataChannelBotGuild = Get.costumGetOne("channel_bot", "GuildID", getGuildID);

		if (dataLang == null) dataLang = { Lang: "en_US" };
		if (dataCommandAdmin == null) dataCommandAdmin = { Test: "true" };
		if (dataChannelBotGuild == null) dataChannelBot = { ChannelID: `${getChannelID}` };

		// const { LanguageConvert } = require("../../../tools/functions/languageConvert.js");
		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const permissions = interaction.member.permissions;
		// console.log(getGuildOwnerID);
		// console.log(getUserID);
		// console.log(dataChannelBot);
		if (dataCommandAdmin.Test !== "true") return await interaction.reply({ content: langError.command.disabled, ephemeral: true });
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permission.admin, ephemeral: true });
		if (!dataChannelBot || getChannelID !== dataChannelBot.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		// eslint-disable-next-line no-console
		// console.log(interaction.member.guild.ownerId);
		// Get Permission Bitfield/Bitwise
		// const bit = [ 0x0000400000000000 ];
		// console.log(bit.toString(16));

		// Context

		await interaction.reply({ content: `${lang.cmd.admin.test.executed}`, ephemeral: true });
	}
};
