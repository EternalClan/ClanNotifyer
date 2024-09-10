/* eslint-disable no-console */
const axios = require("axios");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

class TwitchAPI {
	static requestOptions() {
		const { Get } = require("../../tools/functions/sql/db.js");
		// eslint-disable-next-line no-undef
		const dataConfig = Get.costumGet("Config", "SELECT * FROM discord_bot WHERE BotID = ?;", globalclient.user.id);
		const getBotConfigID = `${globalclient.user.id}-${dataConfig.ShardID}`;
		const dataTwitchOAuth = Get.notifyerByID("twitch_oauth", getBotConfigID);
		if (dataTwitchOAuth == null) return null;
		// Remove "oauth:" prefix if present
		const oauthPrefix = "oauth:";
		let oauthBearer = dataTwitchOAuth.Token;
		if (oauthBearer.startsWith(oauthPrefix)) {
			oauthBearer = oauthBearer.substr(oauthPrefix.length);
		}
		// Construct default request options
		return {
			baseURL: "https://api.twitch.tv/helix/",
			headers: {
				"Client-ID": process.env.TWITCH_CLIENT_ID,
				"Authorization": `Bearer ${oauthBearer}`
			}
		};
	}

	static fetchStreams(channelNames) {
		return new Promise((resolve, reject) => {
			axios.get(`/streams?user_login=${channelNames.join("&user_login=")}`, this.requestOptions())
				.then((res) => {
					resolve(res.data.data || []);
				})
				.catch((err) => {
					this.apiErrorHandler(err);
					reject(err);
				});
		});
	}

	static fetchUsers(channelNames) {
		return new Promise((resolve, reject) => {
			axios.get(`/users?login=${channelNames.join("&login=")}`, this.requestOptions())
				.then((res) => {
					resolve(res.data.data || []);
				})
				.catch((err) => {
					this.apiErrorHandler(err);
					reject(err);
				});
		});
	}

	static fetchGames(gameIds) {
		return new Promise((resolve, reject) => {
			axios.get(`/games?id=${gameIds.join("&id=")}`, this.requestOptions())
				.then((res) => {
					resolve(res.data.data || []);
				})
				.catch((err) => {
					this.apiErrorHandler(err);
					reject(err);
				});
		});
	}

	static apiErrorHandler(err) {
		const res = err.response || { };

		if (res.data && res.data.message) {
			console.error("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchApi]", "API request failed with Helix error:", res.data.message, `(${res.data.error}/${res.data.status})`);
		} else if (this.requestOptions() == null) {
			console.error("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchApi]", "API request failed:", "Received null in config. baseURL or headers are missing.");
		} else {
			console.error("[" + DateTime.utc().toFormat(timeFormat) + "][TwitchApi]", "API request failed with error:", err.message || err);
		}
	}
}
module.exports.TwitchAPI = TwitchAPI;