/* eslint-disable max-len */
/* eslint-disable no-console */
const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
const { existsSync, readFileSync, readdirSync } = require("node:fs");
const fs = require("node:fs");
require("dotenv").config();

module.exports = {
	cooldown: 5,
	admin: "true",
	nsfw: "false",
	data: new SlashCommandBuilder()
		.setName("language")
		.setDescription("editing lang")
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
				.setDescription("A List of Languages.")
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("set")
				.setDescription("Set the language.")
				.addStringOption(option =>
					option
						.setName("code")
						.setDescription("The language code")
						.setRequired(true)
						.setAutocomplete(true)
				)
		),
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
		let choices = [];

		if (focusedOption.name === "code") {
			const cmds = [];
			fs.readdirSync("./data/lang/").filter(file => file).forEach(patch => {
				cmds.push(patch);
			});

			choices = cmds.filter(cmdName => cmdName.startsWith(focusedOption.value.toLowerCase()));
			if (choices.length > 25) choices = [];
		}

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice }))
		);
	},
	async execute(interaction) {
		if (interaction == null ||
		interaction.channel.id == null) return console.error(`[${DateTime.utc().toFormat(timeFormat)}][Bot] Interaction of Command 'lanuage' returned 'null / undefined'.`);

		const { Get, Set } = require("../../../tools/functions/sql/db.js");
		const getGuildID = `${interaction.guild.id}`;
		const getShardID = `${interaction.guild.shard.id}`;
		const getChannelID = `${interaction.channel.id}`;
		const getBotConfigID = `${getGuildID}-${getShardID}`;
		const getChannelRoleID = `${getGuildID}-${getShardID}-${getChannelID}`;
		let dataLang = Get.configByID("discord_bot", getBotConfigID);
		const dataCommandAdmin = Get.toggleByID("command_admin", getBotConfigID);
		let dataChannelAdmin = Get.channelByID("channel_bot", getChannelRoleID);
		const dataChannelAdminGuild = Get.costumGetOne("channel_bot", "GuildID", getGuildID);

		if (dataLang == null) dataLang = { Lang: "en_US" };
		if (dataChannelAdminGuild == null) dataChannelAdmin = { ChannelID: `${getChannelID}` };

		const lang = require(`../../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const langLanguage = lang.cmd.admin.language;
		const { LanguageConvert } = require("../../../tools/functions/languageConvert");
		const permissions = interaction.member.permissions;
		if (dataCommandAdmin.Language !== "true") return await interaction.reply({ content: langError.command.disabled, ephemeral: true });
		if (!permissions.has(PermissionsBitField.Flags.ViewAuditLog) || !permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: langError.permission.admin, ephemeral: true });
		if (!dataChannelAdmin || getChannelID !== dataChannelAdmin.ChannelID) return await interaction.reply({ content: langError.channel.wrong, ephemeral: true });

		const configembed = new EmbedBuilder()
			.setColor("DarkGreen")
			.setTitle(`${langLanguage.title}`);
		if (interaction.options.getSubcommand() === "help") {
			configembed.addFields(
				{ name: `${langLanguage.helpname}`, value: `${langLanguage.helpvalue}`, inline: false }
			);
			await interaction.reply({ embeds: [configembed] });
		}
		if (interaction.options.getSubcommand() === "list") {
			const langDirs = readdirSync("./data/lang/").filter(dir => dir.includes("_"));
			const langFiles = { name: "", code: "" };
			for (const dir of langDirs) {
				if (!existsSync(`./data/lang/${dir}/${dir}.json`)) continue;
				const rawData = readFileSync(`./data/lang/${dir}/${dir}.json`);
				const langRead = JSON.parse(rawData);
				langFiles.name += langRead.name + "\n";
				langFiles.code += langRead.code + "\n";
			}
			if (langFiles.name === "") langFiles.name = `${langLanguage.nodate}`;
			if (langFiles.code === "") langFiles.code = `${langLanguage.nodate}`;
			configembed.setDescription(`${langLanguage.desclist}`)
				.addFields(
					{ name: `${langLanguage.listname1}`, value: `\`\`\`\n${langFiles.name}\`\`\``, inline: true },
					{ name: `${langLanguage.listname2}`, value: `\`\`\`\n${langFiles.code}\`\`\``, inline: true }
				);
			await interaction.reply({ embeds: [configembed] });
		}
		if (interaction.options.getSubcommand() === "set") {
			const stringChoicesValueset = interaction.options.getString("code");
			// let langFile;
			if (existsSync(`./data/lang/${stringChoicesValueset}/${stringChoicesValueset}.json`) !== true) return await interaction.reply({ content: `${langLanguage.nodate}`, ephemeral: true });
			const langcode = LanguageConvert.code(stringChoicesValueset);
			const langtext = LanguageConvert.lang(langLanguage.set, langcode);
			if (dataLang.Lang === `./data/lang/${stringChoicesValueset}/${stringChoicesValueset}.json`) return await interaction.reply({ content: langtext, ephemeral: true });
			// eslint-disable-next-line no-undef
			dataLang = { ConfigID: `${getBotConfigID}`, GuildID: `${getGuildID}`, ShardID: `${getShardID}`, BotID: `${globalclient.user.id}`, Lang: stringChoicesValueset };
			Set.configByData("discord_bot", dataLang);
			console.log("[" + DateTime.utc().toFormat(timeFormat) + "]" + lang.prefix.clanbot, langtext);
			configembed.setDescription(langtext);
			await interaction.reply({ embeds: [configembed] });
		}
	}
};
