/* eslint-disable no-async-promise-executor */
require("dotenv").config;

class DevCheck {
	// Bot Masters
	static BotMaster(message) {
		return new Promise((resolve, reject) => {
			try {
				let master;
				let msgAuthor;
				let serverOwnerList;
				let botMasterList;
				if (!process.env.SERVER_OWNER) serverOwnerList = [""];
				if (!process.env.BOT_MASTER) botMasterList = [""];
				if (!message.author) msgAuthor = [""];
				if (message.author) msgAuthor = message.author.id;
				if (process.env.SERVER_OWNER) serverOwnerList = process.env.SERVER_OWNER.split(/,+/g);
				if (process.env.BOT_MASTER) botMasterList = process.env.BOT_MASTER.split(/,+/g);
				const serverOwnerArray = serverOwnerList.map(obj => {
					return obj.trim();
				});
				const botMasterArray = botMasterList.map(obj => {
					return obj.trim();
				});
				const serverOwner = serverOwnerArray.filter(obj => obj === msgAuthor).toString();
				const botMaster = botMasterArray.filter(obj => obj === msgAuthor).toString();
				if (msgAuthor === serverOwner || msgAuthor === botMaster) master = true;
				const isMaster = master;
				resolve(isMaster || false);
			} catch(err) {
				reject(err);
			}
		});
	}
	// Bot Master Role
	static BotMasterRole(message) {
		return new Promise(async (resolve, reject) => {
			try {
				let masterRole;
				const guild = await message.client.guilds.fetch(process.env.SERVER_ID);
				const member = await guild.members.fetch(message.author.id);
				const role = await member.roles.cache.get(process.env.BOT_MASTER_ROLE);
				if (role != null) masterRole = true;
				const hasRole = masterRole;
				resolve(hasRole || false);
			} catch(err) {
				reject(err);
			}
		});
	}
	// Bot Channel
	static BotChannel(message) {
		return new Promise((resolve, reject) => {
			try {
				let channel;
				const msgChannel = message.channelId;
				const botChannelList = process.env.BOT_CHANNEL.split(/,+/g);
				const botChannelArray = botChannelList.map(obj => {
					return obj.trim();
				});
				const botChannel = botChannelArray.filter(obj => obj === msgChannel).toString();
				if (msgChannel === botChannel) channel = true;
				const isChannel = channel;
				// if (firstChannel !== process.env.SERVER_ID) return;
				resolve(isChannel || false);
			} catch(err) {
				reject(err);
			}
		});
	}
	// Log Channel
	static LogChannel(guildId) {
		return new Promise(async (resolve, reject) => {
			try {
				const { Get } = require("../../tools/functions/sql/db.js");
				let dataChannellog;
				// eslint-disable-next-line no-undef
				const guild = await globalclient.guilds.fetch(guildId);
				const getBotConfigID = `${guild.id}-${guild.shard.id}`;
				// eslint-disable-next-line prefer-const
				dataChannellog = Get.channelByID("channel_log", getBotConfigID);
				if (dataChannellog == null) {
					// eslint-disable-next-line no-console
					console.log("No logging Channel in database");
					return;
				}
				const logChannel = dataChannellog.ChannelID;
				resolve(logChannel || "0");
			} catch(err) {
				reject(err);
			}
		});
	}
	// Server
	// static IsServer(guildId) {
	// 	return new Promise((resolve, reject) => {
	// 		try {
	// 			let server;
	// 			let serverList;
	// 			if (!process.env.SERVER_ID) serverList = [""];

	// 			if (process.env.SERVER_ID) serverList = process.env.SERVER_ID.split(/,+/g);
	// 			const serverListArray = serverList.map(obj => {
	// 				return obj.trim();
	// 			});
	// 			const serverId = serverListArray.filter(obj => obj === guildId).toString();
	// 			if (guildId === serverId) {
	// 				server = serverId;
	// 			}
	// 			const isServer = server;
	// 			resolve(isServer || false);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }
}

module.exports.DevCheck = DevCheck;