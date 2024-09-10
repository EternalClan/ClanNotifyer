/* eslint-disable no-console */
const Discord = require("discord.js");
const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = Discord;
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = {
	cooldown: 5,
	admin: "true",
	nsfw: "false",
	data: new SlashCommandBuilder()
		.setName("notifyer")
		.setDescription("Editing Notifyers from Database.")
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
		.addSubcommandGroup(subcommandgroup =>
			subcommandgroup
				.setName("twitch")
				.setDescription("twitch")
				.addSubcommand(subcommand =>
					subcommand
						.setName("help")
						.setDescription("The Help text for this Command.")
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName("list")
						.setDescription("List the set Twitch Announcements.")
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName("set")
						.setDescription("Set's the Twitch Announcement.")
						.addStringOption(option =>
							option
								.setName("twitchchannelid")
								.setDescription("Twitch Channel ID. (The URL)")
								.setRequired(true)
						)
						.addStringOption(option =>
							option
								.setName("announce")
								.setDescription("Toggle Announces.")
								.setRequired(true)
								.addChoices(
									{ name: "Yes", value: "true" },
									{ name: "No", value: "false" }
								)
						)
						.addRoleOption(option =>
							option
								.setName("mention")
								.setDescription("Set's the Mention a Role")
								.setRequired(false)
						)
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName("setchannel")
						.setDescription("Set Channel")
						.addChannelOption(option =>
							option
								.setName("channel")
								.setDescription("Channel")
								.setRequired(true)
						)
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName("edit")
						.setDescription("Edit's the Twitch Announcement")
						.addStringOption(option =>
							option
								.setName("twitchchannelid")
								.setDescription("Twitch Channel ID. (the URL)")
								.setRequired(true)
								.setAutocomplete(true)
						)
						.addStringOption(option =>
							option
								.setName("announce")
								.setDescription("Toggle Announces.")
								.setRequired(false)
								.addChoices(
									{ name: "Yes", value: "true" },
									{ name: "No", value: "false" }
								)
						)
						.addRoleOption(option =>
							option
								.setName("mention")
								.setDescription("Set's the Mention a Role")
								.setRequired(false)
						)
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName("remove")
						.setDescription("Remove the Twitch Announcement.")
						.addStringOption(option =>
							option
								.setName("twitchchannelid")
								.setDescription("Twitch Channel ID. (the URL)")
								.setRequired(true)
								.setAutocomplete(true)
						)
				)
		),
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
		let choices = [];

		const { Get } = require("../../../tools/functions/sql/db.js");
		const getGuildID = `${interaction.guild.id}`;

		// Twitch
		const twitchAnnouncements = Get.notifyerAll("twitch_announcement", getGuildID);
		let twitchChannelIds = [];
		twitchAnnouncements.forEach(twitch => {
			twitchChannelIds.push(twitch.TwitchChannelID);
		})
		if (focusedOption.name === 'twitchchannelid') {
			choices = twitchChannelIds.filter(rName => rName.startsWith(focusedOption.value));
			if (choices.length > 25) choices = [];
		}

		// Response
		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction) {
		if (interaction == null || interaction.channel.id == null
		|| interaction.guild.id == null) return console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command '${this.data.name}' returned 'null / undefined'.`);

		// Require and Get
		const { Get, Set, Del } = require("../../../tools/functions/sql/db.js");
		const { LanguageConvert } = require("../../../tools/functions/languageConvert.js");
		const getClientID = `${globalclient.user.id}`;
		const getGuildID = `${interaction.guild.id}`;
		const getShardID = `${interaction.guild.shardId}`;
		const getChannelID = `${interaction.channel.id}`;
		const getBotConfigID = `${getClientID}-${getShardID}`;
		const getChannelRoleID = `${getGuildID}-${getShardID}-${getChannelID}`;

		// Language
		let dataLang;
		dataLang = Get.configByID("discord_bot", getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "en_US" };
		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const langNotifyer = lang.cmd.admin.notifyers.all;
		const langTwitch = lang.cmd.admin.notifyers.twitch;

		// Commands Admin
		let dataCommandAdmin;
		dataCommandAdmin = Get.toggleByID("command_admin", getBotConfigID);
		if (dataCommandAdmin == null) dataCommandAdmin = { Channels: "true" };
		if (dataCommandAdmin.Test === "false") return await interaction.reply({ content: langError.command.disabled, ephemeral: true });
		
		// Channels Admin
		let dataChannelAdmin;
		dataChannelAdmin = Get.channelByID("channel_bot", getChannelRoleID);
		if (dataChannelAdmin == null) dataChannelAdmin = { ChannelID: `${interaction.channel.id}` };
		if (!dataChannelAdmin || interaction.channel.id !== dataChannelAdmin.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		// Permissions
		const permissions = interaction.member.permissions;
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permissions.admin, ephemeral: true });

		const { TwitchAPI } = require("../../../modules/twitch/twitchAPI.js");
		const configembed = new EmbedBuilder()
			.setColor("DarkGreen")
			.setTitle(langTwitch.title);
		const twitchembed = new EmbedBuilder()
			.setColor("Red");
		//
		// Twitch
		if (interaction.options.getSubcommandGroup() === "twitch") {
			//
			// Help
			if(interaction.options.getSubcommand() === "help") {
				// \nc.channels edit <channel> <admin|user|all>
				configembed.addFields(
					{ name: langTwitch.twitch.helptitle, value: langTwitch.helpvalue, inline: false }
				);
				await interaction.reply({ embeds: [configembed] });
			}
			//
			// List
			if (interaction.options.getSubcommand() === "list") {
				// Getting Database
				let dataTwitchAnnounceList = Get.notifyerAll("twitch_announcement", getGuildID);
				// Return if Data is 'undefined' or 'null'.
				if (dataTwitchAnnounceList == null) dataTwitchAnnounceList = { TwitchAnnounceID: "guildId-shardId-twitchChannelId", GuildID: "guildId", ShardID: "shardId", BotID: "botId", TwitchChannelID: "twitchChannelId", Announce: "false", MentionName: "here" };
				let twitchAnnounce = [];
				let twitchChannel = [];
				let twitchMention = [];
				dataTwitchAnnounceList.forEach(twitchAnnouncement => {
					twitchAnnounce.push(twitchAnnouncement.Announce);
					twitchChannel.push(twitchAnnouncement.TwitchChannelID);
					twitchMention.push(twitchAnnouncement.Mention);
				});
				let newTwitchAnnounce = twitchAnnounce.toString().replace(", ","\n");
				let newTwitchChannel = twitchChannel.toString().replace(", ","\n");
				let newTwitchMention = twitchMention.toString().replace(", ","\n");
				if (newTwitchAnnounce === "") newTwitchAnnounce = langTwitch.norecordfound;
				if (newTwitchChannel === "") newTwitchChannel = langTwitch.norecordfound;
				if (newTwitchMention === "") newTwitchMention = langTwitch.norecordfound;
				const twitchlistembed = new EmbedBuilder()
					.setColor("DarkGreen")
					.setDescription(`${langTwitch.listofchannels}\n<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>..<<..>>`)
					.addFields([
						{ name: langTwitch.twitchchannelid, value: `${newTwitchChannel}`, inline: true },
						{ name: langTwitch.mentions, value: `${newTwitchMention}`, inline: true },
						{ name: langTwitch.announce, value: `${newTwitchAnnounce}`, inline: true }
					]);
				await interaction.reply({ embeds: [twitchlistembed] });
			}
			//
			// Set
			if (interaction.options.getSubcommand() === "set") {
				const stringTwitchChannelID = interaction.options.getString("twitchchannelid");
				const stringChoisAnnounce = interaction.options.getString("announce");
				const stringMentionRole = interaction.options.getRole("mention");
				let role = "here";
				if (stringMentionRole != null) {
					role = stringMentionRole.name;
				}
				const channelNames = [];
				if (stringTwitchChannelID) {
					channelNames.push(stringTwitchChannelID.toLowerCase());
				}
				let cue;
				const dataTwitchOAuth = Get.notifyerByID("twitch_oauth", `${getClientID}-${getShardID}`);
				if (dataTwitchOAuth == null) return console.log(langTwitch.notoken);
				const oauthBearer = dataTwitchOAuth.Token;
				if (oauthBearer == null || oauthBearer === "0" || DateTime.utc().toISO() > dataTwitchOAuth.Cooldown) {
					await interaction.reply({ content: langTwitch.tokenneeded, ephemeral: true });return;
				}
				await TwitchAPI.fetchUsers(channelNames, getShardID)
					.then((users) => {
						cue = users;
					})
					.catch((err) => {
						console.warn("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchCommand]" + "Error in users request:", err);
					});
				if (cue == null) {interaction.reply({ content: LanguageConvert.lang(langTwitch.notatwitchchannel, stringTwitchChannelID), ephemeral: true });return;}
				const getTwitchAnnounceID = `${getGuildID}-${getShardID}-${channelNames}`;
				let dataAddTwitchAnnounce;
				dataAddTwitchAnnounce = Get.notifyerByID("twitch_announcement", getTwitchAnnounceID);
				if (dataAddTwitchAnnounce != null) {
					twitchembed.setDescription(langTwitch.isalreadyset);
					await interaction.reply({ embeds: [twitchembed] });
				} else if (dataAddTwitchAnnounce == null) {
					dataAddTwitchAnnounce = { NotifyerID: `${getTwitchAnnounceID}`, GuildID: `${getGuildID}`, ShardID: `${getShardID}`, BotID: `${getClientID}`, TwitchChannelID: `${stringTwitchChannelID}`, Announce: `${stringChoisAnnounce}`, Mention: `${role}` };
					Set.notifyerByData("twitch_announcement", dataAddTwitchAnnounce);
					twitchembed.setColor("DarkGreen")
						.setDescription(LanguageConvert.lang(langTwitch.announcementset, stringTwitchChannelID, stringChoisAnnounce, role));
					await interaction.reply({ embeds: [twitchembed] });
				} else {
					return console.error("[" + DateTime.utc().toFormat(timeFormat) + "] There was a problem adding an Twitch Announcement to the database: dataAddTwitchAnnounce could not return \"undefined / null\" nor \"no undefined / no null\" in \"... /edit/twitch.js\"");
				}
			}
			if (interaction.options.getSubcommand() === "setchannel") {
				const channel = interaction.options.getChannel("channel");
				const getChannelID = `${getBotConfigID}-twitch`;
				const type = "notifyer";
				let dataChannelTwitch = Get.channelByID("channel_notifyer", `${getBotConfigID}-twitch`);
				if (dataChannelTwitch == null) {
					dataChannelTwitch = { ChannelRoleID: getChannelID, GuildID: getGuildID, ShardID: getShardID, BotID: getClientID, ChannelID: channel.name };
					Set.channelByData("channel_notifyer", dataChannelTwitch);
					twitchembed.setColor("DarkGreen")
						.setDescription(LanguageConvert.lang(lang.cmd.admin.channel.set, channel, lang.cmd.admin.channel[type]));
					await interaction.reply({ embeds: [twitchembed] });
				} else if (dataChannelTwitch != null) {
					dataChannelTwitch = { ChannelRoleID: dataChannelTwitch.ChannelRoleID, GuildID: dataChannelTwitch.GuildID, ShardID: dataChannelTwitch.ShardID, BotID: dataChannelTwitch.BotID, ChannelID: channel.name };
					Set.channelByData("channel_notifyer", dataChannelTwitch);
					twitchembed.setColor("DarkGreen")
						.setDescription(LanguageConvert.lang(lang.cmd.admin.channel.set, channel, lang.cmd.admin.channel[type]));
					await interaction.reply({ embeds: [twitchembed] });
				}
			}
			//
			// Edit
			if(interaction.options.getSubcommand() === "edit") {
				const stringTwitchChannelID = interaction.options.getString("twitchchannelid");
				const stringChoisAnnounce = interaction.options.getString("announce");
				const stringMentionRole = interaction.options.getRole("mention");
				let role = dataEditTwitchAnnounce.MentionName;
				let announce = dataEditTwitchAnnounce.Announce;
				const getTwitchAnnounceID = `${getGuildID}-${getShardID}-${stringTwitchChannelID}`;
				let dataEditTwitchAnnounce;
				dataEditTwitchAnnounce = Get.notifyerByID("twitch_announcement", getTwitchAnnounceID);
				if (dataEditTwitchAnnounce == null) {
					twitchembed.setDescription(langTwitch.channelnotfound);
					await interaction.reply({ embeds: [twitchembed] });
				} else if (dataEditTwitchAnnounce != null) {
					if (stringMentionRole != null) {
						role = stringMentionRole.name;
					}
					if (stringChoisAnnounce != null) {
						announce = stringChoisAnnounce;
					}
					dataEditTwitchAnnounce = { TwitchAnnounceID: `${dataEditTwitchAnnounce.TwitchAnnounceID}`, GuildID: `${dataEditTwitchAnnounce.GuildID}`, TwitchChannelID: `${dataEditTwitchAnnounce.TwitchChannelID}`, Announce: `${announce}`, MentionName: `${role}` };
					Set.twitchAnnounce(dataEditTwitchAnnounce);
					twitchembed.setColor("DarkGreen")
						.setDescription(LanguageConvert.lang(langTwitch.announcementupdated, stringTwitchChannelID, stringChoisAnnounce, role));
					await interaction.reply({ embeds: [twitchembed] });
				} else {
					return console.error("[" + DateTime.utc().toFormat(timeFormat) + "] There was a problem updating an Twitch Announcement in the database: dataEditTwitchAnnounce could not return \"undefined / null\" nor \"no undefined / no null\" in \"... /edit/twitch.js\"");
				}
			}
			//
			// Remove
			if(interaction.options.getSubcommand() === "remove") {
				const stringTwitchChannelID = interaction.options.getString("twitchchannelid");
				const getTwitchAnnounceID = `${getGuildID}-${getShardID}-${stringTwitchChannelID}`;
				const dataRemoveTwitchAnnounce = Get.notifyerByID("twitch_announcement", getTwitchAnnounceID);
				if (dataRemoveTwitchAnnounce == null) {
					twitchembed.setDescription(langTwitch.idnotfound);
					await interaction.reply({ embeds: [twitchembed] });
				} else if (dataRemoveTwitchAnnounce != null) {
					Del.twitchAnnounce(getTwitchAnnounceID);
					twitchembed.setColor("DarkGreen")
						.setDescription(LanguageConvert.lang(langTwitch.annoncementremoved, stringTwitchChannelID));
					await interaction.reply({ embeds: [twitchembed] });
				} else {
					return console.error("[" + DateTime.utc().toFormat(timeFormat) + "] There was a problem removing an Twitch Announcement from the database: dataRemoveTwitchAnnounce could not return \"undefined / null\" nor \"no undefined / no null\" in \"... /edit/twitch.js\"");
				}
			}
		}
		//
		// 
	}
};
