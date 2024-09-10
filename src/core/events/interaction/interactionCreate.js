// Require
// eslint-disable-next-line no-unused-vars
const { Events, Integration, Collection } = require("discord.js");
// Require dotenv as config (.env).
require("dotenv").config();

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
     * @param {Integration} interaction
     */
	async execute(interaction) {
		const { Get } = require("../../../tools/functions/sql/db.js");
		let dataLang = Get.configByID("discord_bot", `${interaction.guild.id}-${interaction.guild.shardId}`);
		if (dataLang == null) dataLang = { Lang: "en_US" };
		const langError = require(`../../../../data/lang/${dataLang.Lang}/error.json`);
		const { LanguageConvert } = require("../../../tools/functions/languageConvert");

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return;

			// Cooldown
			// eslint-disable-next-line no-undef
			const { cooldowns } = globalclient;

			if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Collection());

			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const defaultCooldownDuration = 3;
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const expiredTimestamp = Math.round(expirationTime / 1000);
					const prasInted = parseInt(expiredTimestamp);
					return interaction.reply({ content: LanguageConvert.lang(langError.command.cooldown, command.data.name), ephemeral: true });
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				await command.execute(interaction);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
				await interaction.reply({ content: langError.command.execute, ephemeral: true });
			}
		}
		if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
				await interaction.reply({ content: langError.command.execute, ephemeral: true });
			}
		}
	}
};
