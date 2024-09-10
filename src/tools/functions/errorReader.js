/* eslint-disable no-console */
const fs = require("node:fs");

class ErrorFileReader {

	static read(txtPara, message) {
		function readed(file, callback) {
			fs.readFile(file, "utf8", function(err, data) {
				if (err) {
					console.log(err);
				}
				callback(data);
			});
		}
		return new Promise((resolve, reject) => {
			try {
				const { Get } = require("../functions/sql/db.js");
				const getBotConfigID = `${message.guild.id}-${message.guild.shardId}`;
				let dataLang;
				dataLang = Get.configByID("discord_bot", getBotConfigID);
				if (dataLang == null) dataLang = { Lang: "en_US" };
				const file_path = `data/lang/${dataLang.Lang}/${txtfile}.txt`;
				let mention = message.author.id;
				if (mention !== null) mention = `<@${message.author.id}>`;
				if (mention == null) mention = "User";
				readed(file_path, async function(data) {
					let data_in = data.replace("%s", mention);

					data_in = data_in.split("\n\n");
					// handle crlf line endings
					data_in = data_in[0].split("\r\n\r\n");


					// eslint-disable-next-line no-undef
					const fetch_dm_user = await globalclient.users.fetch(message.author.id);
					if (!Array.isArray(data_in)) fetch_dm_user.send({ content: data_in });

					if (Array.isArray(data_in)) {
						let text;
						data_in.forEach(async (item) => {

							if (item.startsWith(txtPara)) text = item;
							if (!item.startsWith(txtPara)) text = "";

							if (text.length >= 1999) console.error("Text Paragraph too long.");

							if (text.startsWith(txtPara)) {
								text = text.replace(txtPara, "");
								resolve(text || "");
							}
						});
					}
				});
			} catch(err) {
				reject(err);
			}
		});
	}
}
module.exports.ErrorFileReader = ErrorFileReader;