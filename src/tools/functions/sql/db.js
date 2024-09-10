// Require SQLite functions
const { Create } = require("./Create.js");
const { Get } = require("./Get.js");
const { Set } = require("./Set.js");
const { Del } = require("./Del.js");
const { SQL } = require("./SQL.js");

// Export SQLite functions
exports.Create = Create;
exports.Get = Get;
exports.Set = Set;
exports.Del = Del;
exports.SQL = SQL;