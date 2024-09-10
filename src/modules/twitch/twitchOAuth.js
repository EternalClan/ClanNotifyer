/* eslint-disable no-console */
const axios = require("axios");
const fs = require("node:fs");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
const { Set } = require("../../tools/functions/sql/db.js");
require("dotenv").config();

class TwitchOAuth {
	static client_credentials(getBotConfigID, dataTwitchOAuth) {
		// if (process.env.TWITCH_CLIENT_ID === "<ID>") return;
		// if (process.env.TWITCH_CLIENT_SECRET === "<SECRET>") return;
		axios({
			method: "post",
			url: "https://id.twitch.tv/oauth2/token",
			json: true,
			data: {
				client_id: process.env.TWITCH_CLIENT_ID,
				client_secret: process.env.TWITCH_CLIENT_SECRET,
				grant_type: "client_credentials"
			}
		}).then(function(res) {
			const data = res.data;
			/* minutes: 1*/
			const timethen = DateTime.utc().plus({ days: 10 }).toISO();
			if (!fs.existsSync("./data/sqlite/twitchOAuth.json")) {
				const requestjsonread = {
					twitch_oauth_token: "0",
					twitch_oauth_cooldown: "0"
				};
				const datajsonrequest = JSON.stringify(requestjsonread, null, 2);
				fs.writeFileSync("./data/sqlite/twitchOAuth.json", datajsonrequest, function(err) {
					if (err) throw err;
					console.log(`[${DateTime.utc().toFormat(timeFormat)}][TwitchOAuth] ${err}`);
				});
			}
			// .json backup
			const requestjsonrawdata = fs.readFileSync("./data/sqlite/twitchOAuth.json");
			const requestjsonread = JSON.parse(requestjsonrawdata);
			requestjsonread.twitch_oauth_token = data.access_token;
			requestjsonread.twitch_oauth_cooldown = timethen;
			const datajsonrequest = JSON.stringify(requestjsonread, null, 2);
			fs.writeFileSync("./data/sqlite/twitchOAuth.json", datajsonrequest, function(err) {
				if (err) throw err;
				console.log(`[${DateTime.utc().toFormat(timeFormat)}][TwitchOAuth] ${err}`);
			});
			// sqlite
			dataTwitchOAuth = { NotifyerID: getBotConfigID, GuildID: `${dataTwitchOAuth.GuildID}`, ShardID: `${dataTwitchOAuth.ShardID}`, BotID: `${dataTwitchOAuth.BotID}`, OAuthType: `${dataTwitchOAuth.OAuthType}`, Token: `${data.access_token}`, Cooldown: `${timethen}` };
			Set.notifyerByData("twitch_oauth", dataTwitchOAuth);
			console.log(`[${DateTime.utc().toFormat(timeFormat)}][TwitchOAuth] New "client_credentials" Token for Twitch created, next request on '${timethen}'.`);
			const twitchRequestReset = true;
			global.globaltwitchready = twitchRequestReset;
		}).catch(function(err) {
			console.error(`[${DateTime.utc().toFormat(timeFormat)}][TwitchOAuth] ${err.stack}`);
		});
	}
}
module.exports.TwitchOAuth = TwitchOAuth;