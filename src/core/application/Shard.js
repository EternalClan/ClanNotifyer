/* eslint-disable no-console */
require("dotenv").config();
const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./src/core/application/ClanNotifyer.js", {
	totalShards: "auto",
	shardList: "auto",
	token: process.env.TOKEN
});

manager.on("shardCreate", shard => console.log(`Shard ${shard.id} Launched.`));

manager.spawn();
