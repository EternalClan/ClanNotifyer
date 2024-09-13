/* eslint-disable no-console */
const fs = require("node:fs");

class TextFileReader {
	static read(txtfile, message) {
		const { Get } = require("../functions/sql/db.js");
		const getBotConfigID = `${message.guild.id}-${message.guild.shardId}`;
		let dataLang;
		dataLang = Get.configByID("discord_bot", getBotConfigID);
		if (dataLang == null) dataLang = { Lang: "en_US" };
		const filePath = `data/lang/${dataLang.Lang}/${txtfile}.txt`;
		function readed (file, callback) {
			fs.readFile(file, "utf8", function (err, data) {
				if (err) {
					console.log(err);
				}
				callback(data);
			});
		}
		return new Promise((resolve, reject) => {
			try {
				let mention = message.author.id;
				if (mention !== null) mention = `<@${message.author.id}>`;
				if (mention == null) mention = "User";
				readed(filePath, async function (data) {
					let dataIn = data.replace("%s", mention);

					if (dataIn.length >= 1999) dataIn = dataIn.split("\n\n");
					// handle crlf line endings
					if (dataIn.length === 1) dataIn = dataIn[0].split("\r\n\r\n");

					resolve(dataIn || "");
				});
			} catch (err) {
				reject(err);
			}
		});
	}
}
module.exports.TextFileReader = TextFileReader;
