/* eslint-disable max-len */
const { PermissionsBitField } = require("discord.js");
// eslint-disable-next-line no-unused-expressions
require("dotenv").config;

class PermissionConvert {
	static permissionsNames(bitfield) {
		return new Promise((resolve, reject) => {
			try {
				let permBitfield = "";
				if (bitfield != null || bitfield !== 0n) {
					const bitfieldIn = new PermissionsBitField(bitfield);
					// General Server Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.ViewChannel) === true) permBitfield += "View Channels\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageChannels) === true) permBitfield += "Manage Channels\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageRoles) === true) permBitfield += "Manage Roles\n";
					// if (bitfieldIn.has(PermissionsBitField.Flags.CreateGuildExpressions) === true) permBitfield += "Create Expressions\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageGuildExpressions) === true) permBitfield += "Manage Expressions\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ViewAuditLog) === true) permBitfield += "View Audit Log\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ViewGuildInsights) === true) permBitfield += "View Server Insights\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageWebhooks) === true) permBitfield += "Manage Webhooks\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageGuild) === true) permBitfield += "Manage Server\n";
					// Membership Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.CreateInstantInvite) === true) permBitfield += "Create Invite\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ChangeNickname) === true) permBitfield += "Change Nickname\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageNicknames) === true) permBitfield += "Manage Nicknames\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.KickMembers) === true) permBitfield += "Kick Members\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.BanMembers) === true) permBitfield += "Ban Members\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ModerateMembers) === true) permBitfield += "Timeout Members\n";
					// Text Channel Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.SendMessages) === true) permBitfield += "Send Messages and Create Posts\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.SendMessagesInThreads) === true) permBitfield += "Send Messages in Threads and Posts\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.CreatePublicThreads) === true) permBitfield += "Create Public Threads\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.CreatePrivateThreads) === true) permBitfield += "Create Private Threads\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.EmbedLinks) === true) permBitfield += "Embed Links\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.AttachFiles) === true) permBitfield += "Attach Files\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.AddReactions) === true) permBitfield += "Add Reactions\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseExternalEmojis) === true) permBitfield += "Use External Emojis\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseExternalStickers) === true) permBitfield += "Use External Stickers\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.MentionEveryone) === true) permBitfield += "Mention @everyone, @here, and All Roles\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageMessages) === true) permBitfield += "Manage Messages\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageThreads) === true) permBitfield += "Manage Threads and Posts\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ReadMessageHistory) === true) permBitfield += "Read Message History\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.SendTTSMessages) === true) permBitfield += "Send Text-to-Speech Messages\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.SendVoiceMessages) === true) permBitfield += "Send Voice Messages\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.SendPolls) === true) permBitfield += "Create Polls\n";
					// Voice Channel Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.Connect) === true) permBitfield += "Connect\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.Speak) === true) permBitfield += "Speak\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.Stream) === true) permBitfield += "Video\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseSoundboard) === true) permBitfield += "Use Soundboard\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseExternalSounds) === true) permBitfield += "Use External Sounds\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseVAD) === true) permBitfield += "Use Voice Activity\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.PrioritySpeaker) === true) permBitfield += "Priority Speaker\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.MuteMembers) === true) permBitfield += "Mute Members\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.DeafenMembers) === true) permBitfield += "Deafe nMembers\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.MoveMembers) === true) permBitfield += "Move Members\n";
					// if (bitfieldIn.has(PermissionsBitField.Flags.SetVoiceChannelStatus) === true) permBitfield += "Set Voice Channel Status\n"; // Not in Discords API?
					// Apps Permisssions
					if (bitfieldIn.has(PermissionsBitField.Flags.UseApplicationCommands) === true) permBitfield += "Use Application Commands\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseEmbeddedActivities) === true) permBitfield += "User Activities\n";
					// if (bitfieldIn.has(PermissionsBitField.Flags.UseExternalApps) === true) permBitfield += "Use External Apps\n"; // Not in discord.js
					// Stage Channel Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.RequestToSpeak) === true) permBitfield += "Request to Speak\n";
					// Events Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.CreateEvents) === true) permBitfield += "Create Events\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageEvents) === true) permBitfield += "Manage Events\n";
					// Advanced Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.Administrator) === true) permBitfield += "Administrator\n";
					// Placeholder
					if (bitfieldIn.has(PermissionsBitField.Flags.ViewCreatorMonetizationAnalytics) === true) permBitfield += "View Monetization\n";
				}
				const permNew = permBitfield;
				resolve(permNew || "None");
			} catch (err) {
				reject(err);
			}
		});
	}

	static permissionsBitfields(bitfield) {
		return new Promise((resolve, reject) => {
			try {
				let permBitfield = "";
				if (bitfield != null || bitfield !== 0n) {
					const bitfieldIn = new PermissionsBitField(bitfield);
					// General Server Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.ViewChannel) === true) permBitfield += "1024n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageChannels) === true) permBitfield += "16n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageRoles) === true) permBitfield += "268435456n\n";
					// if (bitfieldIn.has(PermissionsBitField.Flags.CreateGuildExpressions) === true) permBitfield += "8796093022208n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageGuildExpressions) === true) permBitfield += "1073741824n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ViewAuditLog) === true) permBitfield += "128n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ViewGuildInsights) === true) permBitfield += "524288n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageWebhooks) === true) permBitfield += "536870912n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageGuild) === true) permBitfield += "32n\n";
					// Membership Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.CreateInstantInvite) === true) permBitfield += "1n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ChangeNickname) === true) permBitfield += "67108864n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageNicknames) === true) permBitfield += "134217728n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.KickMembers) === true) permBitfield += "2n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.BanMembers) === true) permBitfield += "4n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageEvents) === true) permBitfield += "8589934592n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ModerateMembers) === true) permBitfield += "1099511627776n\n";
					// Text Channel Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.SendMessages) === true) permBitfield += "2048n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.SendMessagesInThreads) === true) permBitfield += "274877906944n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.CreatePublicThreads) === true) permBitfield += "34359738368n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.CreatePrivateThreads) === true) permBitfield += "68719476736n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.EmbedLinks) === true) permBitfield += "16384n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.AttachFiles) === true) permBitfield += "32768n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.AddReactions) === true) permBitfield += "64n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseExternalEmojis) === true) permBitfield += "262144n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseExternalStickers) === true) permBitfield += "137438953472n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.MentionEveryone) === true) permBitfield += "131072n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageMessages) === true) permBitfield += "8192n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageThreads) === true) permBitfield += "17179869184n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ReadMessageHistory) === true) permBitfield += "65536n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.SendTTSMessages) === true) permBitfield += "4096n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseApplicationCommands) === true) permBitfield += "2147483648n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.SendVoiceMessages) === true) permBitfield += "70368744177664n\n";
					// Voice Channel Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.Connect) === true) permBitfield += "1048576n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.Speak) === true) permBitfield += "2097152n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.Stream) === true) permBitfield += "512n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseEmbeddedActivities) === true) permBitfield += "549755813888n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseSoundboard) === true) permBitfield += "4398046511104n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseExternalSounds) === true) permBitfield += "35184372088832n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.UseVAD) === true) permBitfield += "33554432n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.PrioritySpeaker) === true) permBitfield += "256n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.MuteMembers) === true) permBitfield += "4194304n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.DeafenMembers) === true) permBitfield += "8388608n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.MoveMembers) === true) permBitfield += "16777216n\n";
					// if (bitfieldIn.has(PermissionsBitField.Flags.VoiceChannelStatus) === true) permBitfield += "n\n";
					// Stage Channel Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.RequestToSpeak) === true) permBitfield += "4294967296n\n";
					// Events Permissions
					// if (bitfieldIn.has(PermissionsBitField.Flags.CreateEvents) === true) permBitfield += "17592186044416n\n";
					if (bitfieldIn.has(PermissionsBitField.Flags.ManageEvents) === true) permBitfield += "8589934592n\n";
					// Advanced Permissions
					if (bitfieldIn.has(PermissionsBitField.Flags.Administrator) === true) permBitfield += "8n\n";
					// Placeholder
					// if (bitfieldIn.has(PermissionsBitField.Flags.ViewCreatorMonetizationAnalytics) === true) permBitfield += "2199023255552n\n";
				}
				const permNew = permBitfield;
				resolve(permNew || "None");
			} catch (err) {
				reject(err);
			}
		});
	}

	static permissions(bitfieldOld, bitfieldNew) {
		return new Promise((resolve, reject) => {
			try {
				if (bitfieldOld == null) bitfieldOld = 0n;
				if (bitfieldNew == null) bitfieldNew = 0n;
				const permissionsOld = new PermissionsBitField(bitfieldOld);
				const permissionsNew = new PermissionsBitField(bitfieldNew);

				// Revoked
				const permOld = permissionsOld.remove(bitfieldNew);
				// Granted
				const permNew = permissionsNew.remove(bitfieldOld);

				const perms = { granted: permNew.bitfield, revoked: permOld.bitfield };
				resolve(perms || "None");
			} catch (err) {
				reject(err);
			}
		});
	}
}

module.exports = PermissionConvert;

/**
    1  AddReactions:
    2  Administrator:
    3  AttachFiles:
    4  BanMembers:
    5  ChangeNickname:
    6  Connect:
    7  CreateInstantInvite:
    8  CreatePrivateThreads:
    9  CreatePublicThreads:
    10 DeafenMembers:
    11 EmbedLinks:
    12 KickMembers:
    13 ManageChannels:
    14 ManageExpressions:
    15 ManageEvents:
    16 ManageGuild:
    17 ManageMessages:
    18 ManageNicknames:
    19 ManageRoles:
    20 ManageThreads:
    21 ManageWebhooks:
    22 MentionEveryone:
    23 ModerateMembers:
    24 MoveMembers:
    25 MuteMembers:
    26 PrioritySpeaker:
    27 ReadMessageHistory:
    28 RequestToSpeak:
    29 SendMessages:
    30 SendMessagesInThreads:
    31 SendTTSMessages:
    32 Speak:
    33 Stream:
    34 UseApplicationCommands:
    35 UseEmbeddedActivities:
    36 UseExternalEmojis:
    37 UseExternalStickers:
    38 UseVAD:
    39 ViewAuditLog:
    40 ViewChannel:
    42 ViewGuildInsights:
 */
