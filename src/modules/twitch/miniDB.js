/* eslint-disable no-console */
require("dotenv").config();
const fs = require("fs");
const { DateTime } = require("luxon");
const timeFormat = "yyyy/LL/dd-h:mm:ss.SSS-a";

class MiniDB {
	constructor(name) {
		this.miniDBPath = `${__dirname}/miniDB`;
		this.basePath = `${__dirname}/miniDB/${name}`;

		if (!fs.existsSync(this.miniDBPath)) {
			fs.mkdirSync(this.miniDBPath);
		}

		if (!fs.existsSync(this.basePath)) {
			// console.log("[" + DateTime.utc().toFormat(timeFormat) + "][MiniDB]", "Create base directory:", this.basePath);
			fs.mkdirSync(this.basePath);
		}
	}

	get(id) {
		const filePath = `${this.basePath}/${id}.json`;

		try {
			if (fs.existsSync(filePath)) {
				const raw = fs.readFileSync(filePath, {
					encoding: "utf8",
					flag: "r"
				});
				return JSON.parse(raw) || null;
			}
		} catch (e) {
			console.error("[" + DateTime.utc().toFormat(timeFormat) + "][MiniDB]", "Read error:", filePath, e);
		}
		return null;
	}

	put(id, value) {
		const filePath = `${this.basePath}/${id}.json`;

		try {
			const raw = JSON.stringify(value);
			fs.writeFileSync(filePath, raw, {
				encoding: "utf8",
				mode: "666",
				flag: "w"
			});
			return true;
		} catch (e) {
			console.error("[" + DateTime.utc().toFormat(timeFormat) + "][MiniDB]", "Write error:", filePath, e);
			return false;
		}
	}
}

module.exports.MiniDB = MiniDB;