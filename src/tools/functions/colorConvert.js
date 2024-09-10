require("dotenv").config;

class ColorConvert {
	// Int to Hex
	static IntToHex(integer) {
		return new Promise((resolve, reject) => {
			try {
				let colorHexInt;
				colorHexInt = Number(integer).toString(16);
				if (colorHexInt === "0") colorHexInt = "#000000";
				const colorHex = colorHexInt;
				resolve(colorHex || "");
			} catch(err) {
				reject(err);
			}
		});
	}
	// Hex to Int
	static HexToInt(hexadecimal) {
		return new Promise((resolve, reject) => {
			try {
				let colorIntHex;
				colorIntHex = parseInt(hexadecimal, 16);
				if (isNaN(colorIntHex)) colorIntHex = "0";
				const colorInt = colorIntHex;
				resolve(colorInt || "");
			} catch(err) {
				reject(err);
			}
		});
	}
}

module.exports = ColorConvert;