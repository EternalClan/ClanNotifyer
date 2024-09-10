/* eslint-disable no-console */
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
const { Get, SQL } = require("../../tools/functions/sql/db.js");
require("dotenv").config();

// eslint-disable-next-line no-undef
const dataConfig = Get.costumGet("Config", "SELECT * FROM discord_bot WHERE BotID = ?;", globalclient.user.id);
const getBotConfigID = `${dataConfig.GuildID}-${dataConfig.ShardID}`;

const { TwitchAPI } = require("./twitchAPI.js");
const { MiniDB } = require("./miniDB.js");

const dataTwitch = Get.toggleByID("notifyer", getBotConfigID);
if (dataTwitch == null) return;

class TwitchMonitor {
	static __init() {
		this._userDb = new MiniDB("twitch-users-v2");
		this._gameDb = new MiniDB("twitch-games");

		this._lastUserRefresh = this._userDb.get("last-update") || null;
		this._pendingUserRefresh = false;
		this._userData = this._userDb.get("user-list") || { };

		this._pendingGameRefresh = false;
		this._gameData = this._gameDb.get("game-list") || { };
		this._watchingGameIds = [];
	}

	static start() {
		// Load channel names from config
		this.channelNames = [];
		const dataTwitchAnnounce = SQL.notifyer().prepare("SELECT * FROM twitch_announcement WHERE GuildID = ? AND Announce = ?").all(dataConfig.GuildID, "true");
		// const dataTwitchAnnounce = Get.twitchAnnounceAllByGuildAndAnnounce(dataConfig.GuildID, "true");
		const newdata = dataTwitchAnnounce.map(function(obj) {
			return obj.TwitchChannelID;
		});
		const stringdata = newdata.toString();
		stringdata.split(",").forEach((channelName) => {
			if (channelName) this.channelNames.push(channelName.toLowerCase());
		});
		if (!this.channelNames.length) {
			console.warn("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]", "No channels configured");
			return;
		}

		// Configure polling interval
		let checkIntervalMs = parseInt(60000);
		if (isNaN(checkIntervalMs) || checkIntervalMs < TwitchMonitor.MIN_POLL_INTERVAL_MS) {
			// Enforce minimum poll interval to help avoid rate limits
			checkIntervalMs = TwitchMonitor.MIN_POLL_INTERVAL_MS;
		}
		var refreshInterval = setInterval(() => {
			if (dataTwitch.Twitch === "true") {
				this.refresh("Periodic refresh");
			}
			// console.log(globaltwitchready);
			// eslint-disable-next-line no-undef
			// if (globaltwitchready === true) {
			const twitchRequestReset = false;
			global.globaltwitchready = twitchRequestReset;
			// }
		}, checkIntervalMs + 1000);
		refreshInterval;
		// process.on("STOP", (signal) => clearInterval(refreshInterval));

		// Immediate refresh after startup
		setTimeout(() => {
			if(dataTwitch.Twitch === "true") {
				this.refresh("Initial refresh after start-up");
			}
		}, 1000);

		// Ready!
		// eslint-disable-next-line max-len
		// console.log("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]", "Configured stream status polling for channels:", this.channelNames.join(", "),
		// 	`(${checkIntervalMs}ms interval)`);
	}

	// eslint-disable-next-line no-unused-vars
	static refresh(reason) {
		const now = DateTime.now();
		// eslint-disable-next-line max-len
		// console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Twitch]", " ▪ ▪ ▪ ▪ ▪ ", `Refreshing now (${reason ? reason : "No reason"})`, " ▪ ▪ ▪ ▪ ▪ ");

		// Refresh all users periodically
		if (this._lastUserRefresh === null || now.diff(DateTime.now(this._lastUserRefresh), "minutes") >= 10) {
			this._pendingUserRefresh = true;
			TwitchAPI.fetchUsers(this.channelNames)
				.then((users) => {
					this.handleUserList(users);
				})
				.catch((err) => {
					console.warn("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]" + "Error in users refresh:", err);
				})
				.then(() => {
					if (this._pendingUserRefresh) {
						this._pendingUserRefresh = false;
						this.refresh("Got Twitch users, need to get streams");
					}
				});
		}

		// Refresh all games if needed
		if (this._pendingGameRefresh) {
			TwitchAPI.fetchGames(this._watchingGameIds)
				.then((games) => {
					this.handleGameList(games);
				})
				.catch((err) => {
					console.warn("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]", "Error in games refresh:", err);
				})
				.then(() => {
					if (this._pendingGameRefresh) {
						this._pendingGameRefresh = false;
					}
				});
		}

		// Refresh all streams
		if (!this._pendingUserRefresh && !this._pendingGameRefresh) {
			TwitchAPI.fetchStreams(this.channelNames)
				.then((channels) => {
					this.handleStreamList(channels);
				})
				.catch((err) => {
					console.warn("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]", "Error in streams refresh:\n", err);
				});
		}
	}

	static handleUserList(users) {
		const namesSeen = [];

		users.forEach((user) => {
			const prevUserData = this._userData[user.id] || { };
			this._userData[user.id] = Object.assign({ }, prevUserData, user);

			namesSeen.push(user.display_name);
		});

		if (namesSeen.length) {
			console.debug("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]", "Updated user info:", namesSeen.join(", "));
		}

		this._lastUserRefresh = DateTime.now();

		this._userDb.put("last-update", this._lastUserRefresh);
		this._userDb.put("user-list", this._userData);
	}

	static handleGameList(games) {
		const gotGameNames = [];

		games.forEach((game) => {
			const gameId = game.id;

			const prevGameData = this._gameData[gameId] || { };
			this._gameData[gameId] = Object.assign({ }, prevGameData, game);

			gotGameNames.push(`${game.id} → ${game.name}`);
		});

		if (gotGameNames.length) {
			console.debug("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]", "Updated game info:", gotGameNames.join(", "));
		}

		this._lastGameRefresh = DateTime.now();

		this._gameDb.put("last-update", this._lastGameRefresh);
		this._gameDb.put("game-list", this._gameData);
	}

	static handleStreamList(streams) {
		// Index channel data & build list of stream IDs now online
		const nextOnlineList = [];
		const nextGameIdList = [];

		streams.forEach((stream) => {
			const channelName = stream.user_name.toLowerCase();

			if (stream.type === "live") {
				nextOnlineList.push(channelName);
			}

			const userDataBase = this._userData[stream.user_id] || { };
			const prevStreamData = this.streamData[channelName] || { };

			this.streamData[channelName] = Object.assign({ }, userDataBase, prevStreamData, stream);
			this.streamData[channelName].game = (stream.game_id && this._gameData[stream.game_id]) || null;
			this.streamData[channelName].user = userDataBase;

			if (stream.game_id) {
				nextGameIdList.push(stream.game_id);
			}
		});

		// Find channels that are now online, but were not before
		let notifyFailed = false;

		for (let i = 0; i < nextOnlineList.length; i++) {
			const _chanName = nextOnlineList[i];

			if (this.activeStreams.indexOf(_chanName) === -1) {
				// Stream was not in the list before
				console.log("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]", "Stream channel has gone online:", _chanName);
			}

			if (!this.handleChannelLiveUpdate(this.streamData[_chanName], true)) {
				notifyFailed = true;
			}
		}

		// Find channels that are now offline, but were online before
		for (let i = 0; i < this.activeStreams.length; i++) {
			const _chanName = this.activeStreams[i];

			if (nextOnlineList.indexOf(_chanName) === -1) {
				// Stream was in the list before, but no longer
				console.log("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]", "Stream channel has gone offline:", _chanName);
				this.streamData[_chanName].type = "[]";
				this.handleChannelOffline(this.streamData[_chanName]);
			}
		}

		if (!notifyFailed) {
			// Notify OK, update list
			this.activeStreams = nextOnlineList;
		} else {
			console.log("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchMonitor]", "Could not notify channel, will try again next update.");
		}

		if (!this._watchingGameIds == nextGameIdList) {
			// We need to refresh game info
			this._watchingGameIds = nextGameIdList;
			this._pendingGameRefresh = true;
			this.refresh("Need to request game data");
		}
	}

	static handleChannelLiveUpdate(streamData, isOnline) {
		for (let i = 0; i < this.channelLiveCallbacks.length; i++) {
			const _callback = this.channelLiveCallbacks[i];

			if (_callback) {
				if (_callback(streamData, isOnline) === false) {
					return false;
				}
			}
		}

		return true;
	}

	static handleChannelOffline(streamData) {
		this.handleChannelLiveUpdate(streamData, false);

		for (let i = 0; i < this.channelOfflineCallbacks.length; i++) {
			const _callback = this.channelOfflineCallbacks[i];

			if (_callback) {
				if (_callback(streamData) === false) {
					return false;
				}
			}
		}

		return true;
	}

	static onChannelLiveUpdate(callback) {
		this.channelLiveCallbacks.push(callback);
	}

	static onChannelOffline(callback) {
		this.channelOfflineCallbacks.push(callback);
	}
}
TwitchMonitor.activeStreams = [];
TwitchMonitor.streamData = { };

TwitchMonitor.channelLiveCallbacks = [];
TwitchMonitor.channelOfflineCallbacks = [];

TwitchMonitor.MIN_POLL_INTERVAL_MS = 30000;

module.exports.TwitchMonitor = TwitchMonitor;

TwitchMonitor.__init();