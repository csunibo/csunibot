const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const os = require("os");

module.exports = {
	name: "stats",
	category: "utility",
	description: "Check the bot's stats! (This is a debug command available only to the developer of the bot)",
	ownerOnly: true,
	run: async (client, interaction) => {
		// get OS info
		const osver = os.platform() + " " + os.release();
		
		// Get nodejs version
		const nodeVersion = process.version;
		
		// get the uptime in a human readable format
		const runtime = moment
		.duration(client.uptime)
		.format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");
		// show lavalink uptime in a nice format
		const lavauptime = moment
		.duration(client.manager.nodes.values().next().value.stats.uptime)
		.format(" D[d], H[h], m[m]");
		// show lavalink memory usage in a nice format
		const lavaram = (client.manager.nodes.values().next().value.stats.memory.used /	1024 / 1024).toFixed(2);
		// sow lavalink memory alocated in a nice format
		const lavamemalocated = (client.manager.nodes.values().next().value.stats.memory.allocated / 1024 / 1024).toFixed(2);
		// show system uptime
		var sysuptime = moment
		.duration(os.uptime() * 1000)
		.format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");
		
		const statsEmbed = new MessageEmbed()
		.setTitle(`${client.user.username} Information`)
		.setColor(client.config.embedColor)
		.setDescription(`\`\`\`yml\nName: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nAPI: ${client.ws.ping}ms\nRuntime: ${runtime}\`\`\``)
		.setFields([
			{
				name: `Lavalink stats`,
				value: `\`\`\`yml\nUptime: ${lavauptime}\nRAM: ${lavaram} MB\nPlaying: ${client.manager.nodes.values().next().value.stats.playingPlayers} out of ${client.manager.nodes.values().next().value.stats.players}\`\`\``,
				inline: true,
			},
			{
				name: "Bot stats",
				value: `\`\`\`yml\nGuilds: ${client.guilds.cache.size} \nNodeJS: ${nodeVersion}\nInfoBot: v${require("../../package.json").version} \`\`\``,
				inline: true,
			},
			{
				name: "System stats",
				value: `\`\`\`yml\nOS: ${osver}\nUptime: ${sysuptime}\n\`\`\``,
				inline: false,
			},
		]);
		return interaction.reply({ embeds: [statsEmbed], ephemeral: true });
	},
};