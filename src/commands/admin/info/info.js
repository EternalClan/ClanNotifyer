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
		.setName("info")
		.setDescription("Get Information on an subject.")
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
				.setDescription("Infos on You and other Members.")
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("bot")
				.setDescription("Infos to this bot.")
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("member")
				.setDescription("Infos on You and other Members.")
				.addUserOption(option =>
					option
						.setName("member")
						.setDescription("The Member")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("server")
				.setDescription("Infos on This Server.")
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("channel")
				.setDescription("Infos on this and other Channel.")
				.addChannelOption(option =>
					option
						.setName("channel")
						.setDescription("The Channel")
						.setRequired(true)
				)
		),
	async execute(interaction) {
		if (interaction == null || interaction.channel.id == null
		|| interaction.guild.id == null) return console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command 'info' returned 'null / undefined'.`);

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
		if (dataCommandAdmin == null) dataCommandAdmin = { Info: "true" };
		if (dataChannelAdminGuild == null) dataChannelAdmin = { ChannelID: `${getChannelID}` };

		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`)
		const langInfo = lang.cmd.admin.info;
		const permissions = interaction.member.permissions;
		if (dataCommandAdmin.Info !== "true") return await interaction.reply({ content: langError.command.disabled, ephemeral: true });
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permission.admin, ephemeral: true });
		if (!dataChannelAdmin || getChannelID !== dataChannelAdmin.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		const infoEmbed = new EmbedBuilder()
			.setColor("DarkGreen");
		if (interaction.options.getSubcommand() === "help") {
			infoEmbed.setTitle(`${langInfo.titlehelp}`)
				.addFields([
					{ name: `${langInfo.helpname}`, value: `${langInfo.helpvalue}`, inline: false }
				]);
			await interaction.reply({ embeds: [infoEmbed] });
		}

		if (interaction.options.getSubcommand() === "bot") {
			infoEmbed.setTitle(`${langInfo.titlebot}`)
				.addFields([
					{ name: `${langInfo.botname1}`, value: `${langInfo.botvalue1}`, inline: false },
					// { name: `${langInfo.botname2}`, value: `${versions.update.id}`, inline: true },
					// { name: `${langInfo.botname3}`, value: `${versions.update.name}`, inline: true },
					// { name: '\u200B', value: '\u200B', inline: false },
					{ name: `${langInfo.botname4}`, value: "ㅤ/", inline: true },
					{ name: `${langInfo.id}`, value: `${interaction.guild.shardId}`, inline: true },
					{ name: `${langInfo.id}`, value: `${interaction.user.id}`, inline: true }
				]);
			await interaction.reply({ embeds: [infoEmbed] });
		}

		if (interaction.options.getSubcommand() === "channel") {
			// infoEmbed.setTitle(`${langInfo.titlechannel}`);
			const stringGetChannel = interaction.options.getChannel("channel");
			const guild = interaction.client.guilds.cache.get(getGuildID);
			const category = guild.channels.cache.get(stringGetChannel.parentId);
			let icon2 = guild.iconURL({ dynamic: true, size: 512 });
			if (guild.icon == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			infoEmbed.setAuthor({ name: langInfo.titlechannel, iconURL: icon2 })
				.setThumbnail(icon2)
				.addFields([
					{ name: `${langInfo.id}`, value: `${stringGetChannel.id}`, inline: false },
					{ name: `${langInfo.chname1}`, value: `<#${stringGetChannel.id}>`, inline: true },
					{ name: `${langInfo.chname5}`, value: `<t:${parseInt(stringGetChannel.createdTimestamp / 1000)}:R>`, inline: true }
				]);
			if (category) {
				infoEmbed.addFields([
					{ name: `${langInfo.chname2}`, value: `${category.name}`, inline: true }
				]);
			}
			infoEmbed.addFields([
				{ name: `${langInfo.chname4}`, value: `${stringGetChannel.nsfw}`, inline: true },
				{ name: `${langInfo.chname3}`, value: `${stringGetChannel.topic || `${langInfo.none}`}`, inline: false }
			]);
			await interaction.reply({ embeds: [infoEmbed] });
		}

		if (interaction.options.getSubcommand() === "member") {
			// infoEmbed.setTitle(`${langInfo.titleuser}`);
			const stringGetUser = interaction.options.getUser("member");
			if (stringGetUser) {
				const guild = interaction.client.guilds.cache.get(getGuildID);
				const member = guild.members.cache.get(stringGetUser.id);
				let icon2 = stringGetUser.avatarURL();
				if (stringGetUser.avatar == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
				infoEmbed.setAuthor({ name: langInfo.titleuser, iconURL: icon2 })
					.setThumbnail(icon2)
					.addFields([
						{ name: `${langInfo.usrname1}`, value: `${stringGetUser}`, inline: false },
						{ name: `${langInfo.id}`, value: `${stringGetUser.id}`, inline: false },
						{ name: `${langInfo.usrname2}`, value: `${member.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || `${langInfo.none}`}`, inline: false },
						{ name: `${langInfo.usrname3}`, value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
						{ name: `${langInfo.usrname4}`, value: `<t:${parseInt(stringGetUser.createdTimestamp / 1000)}:R>`, inline: true }
					]);
				await interaction.reply({ embeds: [infoEmbed] });
			}
		}

		if (interaction.options.getSubcommand() === "server") {
			infoEmbed.setTitle(`${langInfo.titleserver}`);
			const guild = interaction.client.guilds.cache.get(getGuildID);
			const owner = guild.members.cache.get(guild.ownerId);
			let icon2 = guild.iconURL({ dynamic: true, size: 512 });
			if (guild.icon == null) icon2 = "https://i.imgur.com/CN6k8gB.png";
			infoEmbed.setAuthor({ name: guild.name, iconURL: icon2 })
				.setThumbnail(icon2)
				.addFields([
					{ name: `${langInfo.id}`, value: `${guild.id}`, inline: false },
					{ name: `${langInfo.svrname1}`, value: `${owner}`, inline: false },
					{ name: `${langInfo.svrname3}`, value: `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`, inline: true },
					{ name: `${langInfo.svrname2}`, value: `${guild.memberCount}`, inline: true }
				]);
			await interaction.reply({ embeds: [infoEmbed] });
		}
	}
};