// Main file that initializes everything, sets up the shard manager and initializes everything from the `bot.js`
// https://discordjs.guide/sharding/
// https://discord.com/developers/docs/topics/gateway#sharding
// This is just the shard manager, the actual client is in `bot.js`
// All this isn't really necessary if the bot resides in less than 2000 servers
// Bots, even without shard manager, reside on the 0 indexed shard either way
// If you want to remove sharding just delete this file and rename `bot.js` to `index.js`

const colors = require("colors");
const { exec } = require("child_process");
const getConfig = require("./util/getConfig");
const { ShardingManager } = require('discord.js');


try {
	getConfig().then((conf) => {
		if (conf.replId) {
			console.log("Replit system detected, initiating special `unhandledRejection` event listener | index.js:19")
			process.on('unhandledRejection', (reason, promise) => {
				promise.catch((err) => {
					if (err.status === 429) { 
						console.log("something went wrong while logging in, resetting..."); 
						exec("kill 1"); 
					}
				});
			}); 
		}
		const manager = new ShardingManager('./bot.js', { token: conf.token, respawn: true });
		manager.on('shardCreate', shard => {
			let d = new Date();
			let time = `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
			console.log(colors.gray(time) + colors.cyan(" | " + `Launched shard ${shard.id}`));
		});
		manager.spawn();
	})
} catch (err) {
	console.log(err) 
}