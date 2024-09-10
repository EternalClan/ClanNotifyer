const { SystemChannelFlagsBitField, ChannelType, ApplicationCommandPermissionType } = require("discord.js");
require("dotenv").config;

class MiscConvert {
	static rateLimitPerUser(seconds) {
		return new Promise((resolve, reject) => {
			try {
				let rateLimit = "";
				if (seconds === 0) rateLimit = "OFF";
				if (seconds === 5) rateLimit = "5s";
				if (seconds === 10) rateLimit = "10s";
				if (seconds === 15) rateLimit = "15s";
				if (seconds === 30) rateLimit = "30s";
				if (seconds === 60) rateLimit = "1m";
				if (seconds === 120) rateLimit = "2m";
				if (seconds === 300) rateLimit = "5m";
				if (seconds === 600) rateLimit = "10m";
				if (seconds === 900) rateLimit = "15m";
				if (seconds === 1800) rateLimit = "30m";
				if (seconds === 3600) rateLimit = "1h";
				if (seconds === 7200) rateLimit = "2h";
				if (seconds === 21600) rateLimit = "6h";
				const rateLimitNew = rateLimit;
				resolve(rateLimitNew || "");
			} catch(err) {
				reject(err);
			}
		});
	}

	static defaultArchiveDuration(seconds) {
		return new Promise((resolve, reject) => {
			try {
				let archiveDuration = "";
				if (seconds === 60) archiveDuration = "1 Hour";
				if (seconds === 1440) archiveDuration = "24 Hours";
				if (seconds === 4320) archiveDuration = "3 Days";
				if (seconds === 10080) archiveDuration = "1 Week";
				const DAD = archiveDuration;
				resolve(DAD || "");
			} catch(err) {
				reject(err);
			}
		});
	}

	static systemChannelFlagsBitField(bitfield) {
		return new Promise((resolve, reject) => {
			try {
				let sysChanFlaBitfield = "";
				const bitfields = new SystemChannelFlagsBitField(bitfield);
				if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressGuildReminderNotifications)) {
					sysChanFlaBitfield += "Suppress Guild Reminder Notifications\n";
				}
				if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressJoinNotificationReplies) === true) {
					sysChanFlaBitfield += "Suppress Join Notification Replies\n";
				}
				if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressJoinNotifications) === true) {
					sysChanFlaBitfield += "Suppress Join Notifications\n";
				}
				if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressPremiumSubscriptions) === true) {
					sysChanFlaBitfield += "Suppress Premium Subscriptions\n";
				}
				if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressRoleSubscriptionPurchaseNotificationReplies) === true) {
					sysChanFlaBitfield += "Suppress Role Subscription Purchase Notification Replies\n";
				}
				if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressRoleSubscriptionPurchaseNotifications) === true) {
					sysChanFlaBitfield += "Suppress Role Subscription Purchase Notifications\n";
				}
				if (bitfields.has(SystemChannelFlagsBitField.Flags.SuppressGuildReminderNotifications) === false
				&& bitfields.has(SystemChannelFlagsBitField.Flags.SuppressJoinNotificationReplies) === false
				&& bitfields.has(SystemChannelFlagsBitField.Flags.SuppressJoinNotifications) === false
				&& bitfields.has(SystemChannelFlagsBitField.Flags.SuppressPremiumSubscriptions) === false
				&& bitfields.has(SystemChannelFlagsBitField.Flags.SuppressRoleSubscriptionPurchaseNotificationReplies) === false
				&& bitfields.has(SystemChannelFlagsBitField.Flags.SuppressRoleSubscriptionPurchaseNotifications) === false) {
					sysChanFlaBitfield += "None";
				}
				const sysChanFlaNew = sysChanFlaBitfield;
				resolve(sysChanFlaNew || "");
			} catch(err) {
				reject(err);
			}
		});
	}

	static channelTypeName(number) {
		return new Promise((resolve, reject) => {
			try {
				let chanTypeNumber = "";
				if (number == ChannelType.GuildText) chanTypeNumber = "Text Channel";
				if (number == ChannelType.DM) chanTypeNumber = "DM";
				if (number == ChannelType.GuildVoice) chanTypeNumber = "Voice Channel";
				if (number == ChannelType.GroupDM) chanTypeNumber = "Group DM";
				if (number == ChannelType.GuildCategory) chanTypeNumber = "Category";
				if (number == ChannelType.GuildAnnouncement) chanTypeNumber = "Announcement Channel";
				if (number == ChannelType.AnnouncementThread) chanTypeNumber = "Announcement Thread";
				if (number == ChannelType.PublicThread) chanTypeNumber = "Public Thread";
				if (number == ChannelType.PrivateThread) chanTypeNumber = "Private Thread";
				if (number == ChannelType.GuildStageVoice) chanTypeNumber = "Stage";
				if (number == ChannelType.GuildDirectory) chanTypeNumber = "Server Directory";
				if (number == ChannelType.GuildForum) chanTypeNumber = "Forum";
				// if (number == ChannelType.GuildMedia) chanTypeNumber = "Media Channel";
				const sysChanFlaNew = chanTypeNumber;
				resolve(sysChanFlaNew || "");
			} catch(err) {
				reject(err);
			}
		});
	}

	static commandPermissionType(number) {
		return new Promise((resolve, reject) => {
			try {
				let response = "";
				if (number == ApplicationCommandPermissionType.Role) response = "Role";
				if (number == ApplicationCommandPermissionType.User) response = "User";
				if (number == ApplicationCommandPermissionType.Channel) response = "Channel";
				const applicationCommandPermissionType = response;
				resolve(applicationCommandPermissionType || "");
			} catch(err) {
				reject(err);
			}
		});
	}

	static boolenToString(boolen, type) {
		let string = "";
		if (type === "onOff") {
			if (boolen === "true") string = "On";
			if (boolen === "false") string = "Off";
		} else if (type === "yesNo") {
			if (boolen === "true") string = "Yes";
			if (boolen === "false") string = "No";
		}
		const boolenstring = string;
		return boolenstring;
	}
}

exports.MiscConvert = MiscConvert;