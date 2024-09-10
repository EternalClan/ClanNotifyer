/* eslint-disable no-console */
const { Application } = require("./src/core/application/Application.js");

// Application Start
Application.init();
Application.start();

// Application stop
process.on("SIGINT", (signal) => Application.stop(signal));
process.on("SIGTERM", (signal) => Application.stop(signal));
process.on("exit", (signal) => Application.stop(signal));

// Error listener
process.on("shardError", (err) => {
	console.error(`[ERROR] A Websocket connection encountered errors: \n${err.stack}`);
});
process.on("unhandledRejection", (err) => {
	console.error(`[ERROR] Unhandled promise rejections: \n${err.stack}`);
});
process.on("uncaughtException", (err, errs) => {
	console.error(`[ERROR] Uncaught error: \n${err.stack}`);
	console.error(`[ERROR] Uncaught errors: \n${errs.stack}`);
	// process.exit(1); //mandatory (as per the Node.js docs)
});
//--------END--------//