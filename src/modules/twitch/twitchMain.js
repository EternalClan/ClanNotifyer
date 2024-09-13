/* eslint-disable no-console */
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

module.exports = () => {
	const { TwitchOAuth } = require("./twitchOAuth.js");
	const { TwitchMonitor } = require("./twitchMonitor.js");
	const { TwitchEmbed } = require("./twitchEmbed.js");
	const { DiscordChannelSync } = require("./discordChannelSync.js");
	const { MiniDB } = require("./miniDB.js");
	const { Get } = require("../../tools/functions/sql/db.js");
	const { LanguageConvert } = require("../../tools/functions/languageConvert.js");
	// eslint-disable-next-line no-undef
	const dataConfig = Get.costumGet("Config", "SELECT * FROM discord_bot WHERE BotID = ?;", globalclient.user.id);
	// eslint-disable-next-line no-undef
	const getBotConfigID = `${globalclient.user.id}-${dataConfig.ShardID}`;
	const getGuildConfigID = `${dataConfig.GuildID}-${dataConfig.ShardID}`;

	// Language
	let dataLang;
	dataLang = Get.configByID("discord_bot", getGuildConfigID);
	if (dataLang == null) dataLang = { Lang: "en_US" };
	const lang = require(`../../../data/lang/${dataLang.Lang}/${dataLang.Lang}.json`);
	const langTwitch = lang.modules.notifyer.twitch;

	// Twitch Enabled
	let dataTwitch;
	dataTwitch = Get.toggleByID("notifyer", getGuildConfigID);
	if (dataTwitch == null) dataTwitch = { Twitch: "false" };

	// Twitch Oauth
	let dataTwitchOAuth;
	dataTwitchOAuth = Get.notifyerByID("twitch_oauth", getBotConfigID);
	// dataTwitchOAuth = Get.twitchOAuth(getBotConfigID);
	if (dataTwitchOAuth == null) dataTwitchOAuth = { NotifyerID: getBotConfigID, GuildID: dataConfig.GuildID, ShardID: dataConfig.ShardID, BotID: dataConfig.BotID, OAuthType: "client_credentials", Token: "0", Cooldown: "2020-01-04T18:15:32.640Z" };

	// Init Oauth request
	if (dataTwitchOAuth.Token === "0" || dataTwitchOAuth.Cooldown < DateTime.utc().toISO()) {
		TwitchOAuth.client_credentials(getBotConfigID, dataTwitchOAuth);
	}

	// Discord Channels
	let targetChannels;
	// eslint-disable-next-line no-inner-declarations
	function syncServerList (logMembership) {
		const dataTwitchDiscordChannel = Get.channelByID("channel_notifyer", `${getBotConfigID}-twitch`);
		if (dataTwitchDiscordChannel == null) return;
		// eslint-disable-next-line no-undef, no-return-assign
		return targetChannels = DiscordChannelSync.getChannelList(globalclient, dataTwitchDiscordChannel.ChannelID, logMembership);
	}

	// Activity updater
	class StreamActivity {
		/**
		 * Registers a channel that has come online, and updates the user activity.
		 */
		static setChannelOnline (stream) {
			this.onlineChannels[stream.user_name] = stream;
			this.updateActivity();
		}

		/**
		 * Marks a channel has having gone offline, and updates the user activity if needed.
		 */
		static setChannelOffline (stream) {
			delete this.onlineChannels[stream.user_name];
			this.updateActivity();
		}

		/**
		 * Fetches the channel that went online most recently, and is still currently online.
		 */
		static getMostRecentStreamInfo () {
			let lastChannel = null;
			for (const channelName in this.onlineChannels) {
				if (typeof channelName !== "undefined" && channelName) {
					lastChannel = this.onlineChannels[channelName];
				}
			}
			return lastChannel;
		}

		/**
		 * Updates the user activity on Discord.
		 * Either clears the activity if no channels are online, or sets it to "watching" if a stream is up.
		 */
		static updateActivity () {
			const streamInfo = this.getMostRecentStreamInfo();
			if (streamInfo) {
				// eslint-disable-next-line no-undef
				globalclient.user.setActivity(streamInfo.user_name, {
					url: `https://twitch.tv/${streamInfo.user_name.toLowerCase()}`,
					type: "STREAMING"
				});
				// eslint-disable-next-line max-len
				// console.log("[" + DateTime.utc().toFormat(timeFormat) + "][StreamActivity]", `Update current activity: watching ${streamInfo.user_name}.`);
			} else {
				// console.log("[" + DateTime.utc().toFormat(timeFormat) + "][StreamActivity]", "Cleared current activity.");
				// eslint-disable-next-line no-undef
				globalclient.user.setActivity(null);
			}
		}

		static init (discordClient) {
			this.discordClient = discordClient;
			this.onlineChannels = { };
			// Continue to update current stream activity every 5 minutes or so
			// We need to do this b/c Discord sometimes refuses to update for some reason
			// ...maybe this will help, hopefully
			const initInterval = setInterval(this.updateActivity.bind(this), 5 * 60 * 1000);
			// eslint-disable-next-line no-unused-expressions
			initInterval;
			// process.on("STOP", (signal) => clearInterval(initInterval));
		}
	}

	// First start
	if (dataTwitch.Twitch === "true") {
		// Init list of connected servers, and determine which channels we are announcing to
		syncServerList(true);

		// Keep our activity in the user list in sync
		// eslint-disable-next-line no-undef
		StreamActivity.init(globalclient);

		// Begin Twitch API polling
		TwitchMonitor.start();
	}

	if (dataTwitch.Twitch === "true") {
		// Oauth request
		const oauthintervalms = 1000 * 60 * 60 * 24;
		const oauthInterval = setInterval(() => {
			dataTwitchOAuth = Get.notifyerByID("twitch_oauth", getBotConfigID);
			if (dataTwitchOAuth == null) dataTwitchOAuth = { TwitchOAuthID: getBotConfigID, GuildID: dataConfig.GuildID, ShardID: dataConfig.ShardID, OAuthType: "client_credentials", Token: "0", Cooldown: "2020-01-04T18:15:32.640Z" };
			if (dataTwitchOAuth.Token === "0" || dataTwitchOAuth.Cooldown < DateTime.utc().toISO()) {
				TwitchOAuth.client_credentials(getBotConfigID, dataTwitchOAuth);
			}
		}, oauthintervalms);
		// eslint-disable-next-line no-unused-expressions
		oauthInterval;
		// Main Body

		// Discord Emojis
		const emojiCache = { };
		const getServerEmoji = (emojiName, asText) => {
			if (typeof emojiCache[emojiName] !== "undefined") {
				return emojiCache[emojiName];
			}
			try {
				// eslint-disable-next-line no-undef
				const emoji = globalclient.emojis.cache.find(e => e.name === emojiName);
				if (emoji) {
					emojiCache[emojiName] = emoji;
					if (asText) {
						return emoji.toString();
					} else {
						return emoji.id;
					}
				}
			} catch (e) {
				console.error("[" + DateTime.utc().toFormat(timeFormat) + "][Error]", e);
			}
			return null;
		};
		global.getServerEmoji = getServerEmoji;

		// Live events
		const liveMessageDb = new MiniDB("live-messages");
		const messageHistory = liveMessageDb.get("history") || { };
		TwitchMonitor.onChannelLiveUpdate(async (streamData) => {
			const isLive = streamData.type === "live";
			// Refresh channel list
			try {
				syncServerList(false);
			} catch (e) { console.warn(e.message); }
			// Update activity
			StreamActivity.setChannelOnline(streamData);
			// Generate message
			const msgFormatted = LanguageConvert.lang(langTwitch.wentlive, streamData.user_name);
			let msgEmbed = TwitchEmbed.create(streamData);

			// Broadcast to all target channels
			let anySent = false;
			for (let i = 0; i < targetChannels.length; i++) {
				const discordChannel = targetChannels[i];
				const liveMsgDiscrim = `${discordChannel.guild.id}_${discordChannel.name}_${streamData.id}`;
				if (discordChannel) {
					try {
						// Either send a new message, or update an old one
						const existingMsgId = messageHistory[liveMsgDiscrim] || null;
						if (existingMsgId) {
						// Fetch existing message
							await discordChannel.messages.fetch(existingMsgId)
								.then((existingMsg) => {
									if (!isLive) {
										msgEmbed = new EmbedBuilder();
										// console.log(existingMsg.embeds[0].data);return;
										const streamOffline = existingMsg.embeds[0].data;
										const streamUserName = streamOffline.url.replace("https://twitch.tv/", "");
										const embedFields = { title: "", game: "", uptime: "" };
										if (streamOffline.fields[0].name === langTwitch.title) { embedFields.title = `${streamOffline.fields[0].value}`; }
										if (streamOffline.fields[1].name === langTwitch.game) { embedFields.game = `${streamOffline.fields[1].value}`; }
										if (streamOffline.fields[3].name === langTwitch.uptime) { embedFields.uptime = `${streamOffline.fields[3].value}`; }
										// Add Thumbnail
										let thumbUrl = streamOffline.thumbnail.url;
										const allowBoxArt = true;
										if (allowBoxArt && streamOffline && streamOffline.thumbnail.url) {
											thumbUrl = streamOffline.thumbnail.url;
											thumbUrl = thumbUrl.replace("{width}", "288");
											thumbUrl = thumbUrl.replace("{height}", "384");
										}
										msgEmbed.setThumbnail(thumbUrl);
										// Add Title
										msgEmbed.setURL(`https://twitch.tv/${(streamUserName || streamUserName).toLowerCase()}`);
										msgEmbed.setTitle(`:white_circle: ${LanguageConvert.lang(langTwitch.notlivetitle, streamUserName)}`);
										// `was live on Twitch!`
										msgEmbed.addFields([{ name: langTwitch.title, value: embedFields.title, inline: false }]);

										// Add game
										if (streamData.game) {
											msgEmbed.addFields([{ name: langTwitch.game, value: embedFields.game, inline: true }]);
										}
										// Set main image (stream preview)
										let imageUrl = "https://static-cdn.jtvnw.net/ttv-static/404_preview-{width}x{height}.jpg";
										// let imageUrl = streamData.thumbnail_url;
										imageUrl = imageUrl.replace("{width}", "1280");
										imageUrl = imageUrl.replace("{height}", "720");
										msgEmbed.setImage(imageUrl);
										// Add uptime
										msgEmbed.addFields([{ name: langTwitch.uptime, value: embedFields.uptime, inline: true }]);
									}
									const getTwitchAnnounceID = `${getBotConfigID}-${streamData.user_name.toLowerCase()}`;
									const dataMentionName = Get.notifyerByID("twitch_announcement", getTwitchAnnounceID);
									let mentionMode = (dataMentionName && dataMentionName.MentionName) || null;
									if (mentionMode) {
										mentionMode = mentionMode.toLowerCase();
										if (mentionMode === "@everyone" || mentionMode === "here") {
										// Reserved @ keywords for discord that can be mentioned directly as text
											mentionMode = `${mentionMode}`;
										} else {
										// Most likely a role that needs to be translated to <@&id> format
											const roleData = discordChannel.guild.roles.cache.find((role) => {
												return (role.name.toLowerCase() === mentionMode);
											});
											if (roleData) {
												mentionMode = `<@&${roleData.id}>`;
											} else {
												console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", `Cannot mention role: ${mentionMode}`,
													`(does not exist on server ${discordChannel.guild.name})`);
												mentionMode = null;
											}
										}
									}
									let msgToSend = msgFormatted;
									if (mentionMode) {
										msgToSend = msgFormatted + ` ${mentionMode}`;
									}
									existingMsg.edit({ content: msgToSend, embeds: [msgEmbed] }).then(() => {
									// Clean up entry if no longer live
										if (!isLive) {
											const row = new ActionRowBuilder()
												.addComponents(
													new ButtonBuilder()
														.setLabel("Follow to not miss again!")
														.setURL(`https://twitch.tv/${streamData.user_name}`)
														.setStyle(ButtonStyle.Link)
												);
											existingMsg.edit({ content: msgToSend, embeds: [msgEmbed], components: [row] });
											delete messageHistory[liveMsgDiscrim];
											liveMessageDb.put("history", messageHistory);
										}
									});
								})
								.catch((e) => {
								// Unable to retrieve message object for editing
									if (e.message === "Unknown Message") {
									// Specific error: the message does not exist, most likely deleted.
										delete messageHistory[liveMsgDiscrim];
										liveMessageDb.put("history", messageHistory);
									// This will cause the message to be posted as new in the next update if needed.
									}
								});
						} else {
						// Sending a new message
							if (!isLive) {
							// We do not post "new" notifications for channels going/being offline
								continue;
							}
							// Expand the message with a @mention for "here" or "everyone"
							// We don't do this in updates because it causes some people to get spammed
							const getTwitchAnnounceID = `${getBotConfigID}-${streamData.user_name.toLowerCase()}`;
							const dataMentionName = Get.notifyerByID("twitch_announcement", getTwitchAnnounceID);
							let mentionMode = (dataMentionName && dataMentionName.MentionName) || null;
							if (mentionMode) {
								mentionMode = mentionMode.toLowerCase();
								if (mentionMode === "@everyone" || mentionMode === "here") {
								// Reserved @ keywords for discord that can be mentioned directly as text
									mentionMode = `${mentionMode}`;
								} else {
								// Most likely a role that needs to be translated to <@&id> format
									const roleData = discordChannel.guild.roles.cache.find((role) => {
										return (role.name.toLowerCase() === mentionMode);
									});
									if (roleData) {
										mentionMode = `<@&${roleData.id}>`;
									} else {
										console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", `Cannot mention role: ${mentionMode}`,
											`(does not exist on server ${discordChannel.guild.name})`);
										mentionMode = null;
									}
								}
							}
							let msgToSend = msgFormatted;
							if (mentionMode) {
								msgToSend = msgFormatted + ` ${mentionMode}`;
							}
							const row = new ActionRowBuilder()
								.addComponents(
									new ButtonBuilder()
										.setLabel("Watch it Now!")
										.setURL(`https://twitch.tv/${streamData.user_name}`)
										.setStyle(ButtonStyle.Link)
								);
							discordChannel.send({ content: msgToSend, embeds: [msgEmbed], components: [row] })
								.then((message) => {
									// eslint-disable-next-line max-len
									// console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", `Sent announce msg to #${discordChannel.name} on ${discordChannel.guild.name}`);
									// message.edit(msgToSend, {embeds: [msgEmbed]})
									messageHistory[liveMsgDiscrim] = message.id;
									liveMessageDb.put("history", messageHistory);
								})
								.catch((error) => {
									console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", `Could not send announce msg to #${discordChannel.name} on ${discordChannel.guild.name}:`, error);
								});
						}
						anySent = true;
					} catch (e) {
						console.warn("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", "Message send problem:", e);
					}
				}
			}
			liveMessageDb.put("history", messageHistory);
			return anySent;
		});

		TwitchMonitor.onChannelOffline((streamData) => {
			// Update activity
			StreamActivity.setChannelOffline(streamData);
		});
	}
};
