// Gets the main class constructor and executes it
// 'IT' being the builder which can be foung in `./lib/InfoBot`
//						\/\/\/\/\/\/\/\/
const InfoBot = require('./lib/InfoBot');
const getConfig = require("./util/getConfig");
const { run } = require('./scripts/update');

getConfig().then((conf) => {
	if (conf.replId) {
		console.log("Replit system detected, initiating special `unhandledRejection` event listener")
		// Should probably check if it is actually an `unhandledRejection` that gets thrown or not
		process.on('unhandledRejection', (reason, promise) => {
			promise.catch((err) => {
				if (err.status) {
					console.log("something went wrong while logging in, resetting...");
					run("kill 1");
				}
			});
		});
	}
});
	
// Constructing the client class
const client = new InfoBot();

// This allows the bot client information to be used globally in all other files 
module.exports = client;