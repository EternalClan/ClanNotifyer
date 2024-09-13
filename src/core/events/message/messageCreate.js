// Require
// eslint-disable-next-line no-unused-vars
const { Events, Message, PermissionsBitField } = require("discord.js");
// Require dotenv as config (.env).
require("dotenv").config();
const prefix = process.env.PREFIX;

module.exports = {
	name: Events.MessageCreate,
	once: false,
	/**
     * @param {Message} message
     */
	async execute(message) {
		// console.log(message.content);
		// Check for Bot.
		if (!message.author || message.author.bot) return;

		// Get Arguments and Command Name from Message.
		const args = message.content.replace(prefix, "").split(/ +/);
		const commandName = args.shift().toLowerCase();
		if (!commandName) return;

		// Admin
		const permissions = message.member.permissions;
		if (permissions.has(PermissionsBitField.Flags.ViewAuditLog) || permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			// eslint-disable-next-line no-undef
			const getClientID = globalclient.user.id;
			const mentionIsClient = message.mentions.has(getClientID);
			const msgBot = message.content.toLowerCase();
			const argsBot = msgBot.split(/ +/);
			// Set Commands
			if (mentionIsClient === true && argsBot[1] === "run" && argsBot[2] === "command") {
				if (argsBot[3] === "local") {
					const rqir = require("../../../commands/system/deployment/localadd.js")(message, args);
					rqir;
				}
				if (argsBot[3] === "global") {
					const rqir2 = require("../../../commands/system/deployment/globaladd.js")(message, args);
					rqir2;
				}
			}
			// Delete Commands
			if (mentionIsClient === true && argsBot[1] === "remove" && argsBot[2] === "command") {
				if (argsBot[3] === "local") {
					const rqir3 = require("../../../commands/system/deployment/localremove.js")(message, args);
					rqir3;
				}
				if (argsBot[3] === "global") {
					const rqir4 = require("../../../commands/system/deployment/globalremove.js")(message, args);
					rqir4;
				}
			}
			// Prune left Servers
			if (mentionIsClient === true && argsBot[1] === "prune") {
				const rqir5 = require("../../../commands/system/data/prune.js")(message, args);
				rqir5;
			}
		}
	}
};
