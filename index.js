// Main file that initializes everything, sets up the shard manager and initializes everything from the `bot.js`
// https://discordjs.guide/sharding/
// https://discord.com/developers/docs/topics/gateway#sharding
// This is just the shard manager, the actual client is in `bot.js`
// All this isn't really necessary if the bot resides in less than 2000 servers
// Bots, even without shard manager, reside on the 0 indexed shard either way
// If you want to remove sharding just delete this file and rename `bot.js` to `index.js`

const colors = require("colors");
const ConfigFetcher = require("./util/getConfig");
const { ShardingManager } = require('discord.js');

ConfigFetcher().then((conf) => {
	const manager = new ShardingManager('./bot.js', { token: conf.token });
	
	manager.on('shardCreate', shard => {
		let d = new Date();
		let time = `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
		console.log(colors.gray(time) + colors.cyan(" | " + `Launched shard ${shard.id}`));
	});
	manager.spawn();
})