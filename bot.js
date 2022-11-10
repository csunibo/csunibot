// Gets the main class constructor and executes it
// 'IT' being the constructor which can be foung in `./lib/InfoBot`
const InfoBot = require('./lib/InfoBot');
const getConfig = require("./util/getConfig");
const { run } = require('./util/common');

// Gets the config file and passes it (as if returned) to the function in `.then( () => {} )`
getConfig().then((conf) => {
	if (conf.replId) {
		console.log("Replit system detected, initiating special `unhandledRejection` event listener")
		// Should probably check if it is actually an `unhandledRejection` that gets thrown or not
		// This is a workaround for Replit's `rate limit` issue. Do note that this is not a fix, but a workaround.
		// also, the error is indeed a 429 and could be listened upon directly, but I'm not sure how the error is being thrown
		// so I'm just listening to all the unhandled rejections and resetting if anything goes wrong
		// This is just a temporary listener and will be overwritten once the bot is ready
		process.on('unhandledRejection', (reason, promise) => {
			promise.catch((err) => {
				if (err.status) {
					console.log("something went wrong with replit while booting up, resetting...");
					run("kill 1");
				}
			});
		});
	}
});
	
// Constructing the client as a new class (refer to `./lib/InfoBot`)
const client = new InfoBot();

// This allows the bot client information to be used globally in all other files once it has been initialized
// `module.exports` functions as an implicit header which allows for objects to be exported and be used by other files
module.exports = client;