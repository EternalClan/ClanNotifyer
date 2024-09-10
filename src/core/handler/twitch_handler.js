/* eslint-disable no-console */
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";
require("dotenv").config();

// eslint-disable-next-line no-unused-vars
module.exports = (client) => {
	require("../../modules/twitch/twitchMain.js")();
	console.log("[" + DateTime.utc().toFormat(timeFormat) + "][Discord]", "Twitch Handler loaded");
};