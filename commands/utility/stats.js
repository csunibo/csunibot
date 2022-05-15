const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const os = require("os");

module.exports = {
	name: "stats",
	category: "utility",
	description: "Check the bot's stats! (This is a debug command available only to the developer of the bot)",
	ownerOnly: false,
	run: async (client, interaction) => {
		let lavauptime, lavaram, lavaclientstats;
		if(client.manager) {
			lavaclientstats = client.manager.nodes.values().next().value.stats;
			lavauptime = moment
			.duration(lavaclientstats.uptime)
			.format(" D[d], H[h], m[m]");
			lavaram = (lavaclientstats.memory.used / 1024 / 1024).toFixed(2);
		}
		const osver = os.platform() + " " + os.release();
		const nodeVersion = process.version;
		const runtime = moment
		.duration(client.uptime)
		.format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");
		
		var sysuptime = moment
		.duration(os.uptime() * 1000)
		.format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");
		
		const statsEmbed = new MessageEmbed()
		.setTitle(`${client.user.username} Information`)
		.setColor(client.config.embedColor)
		.setDescription(`\`\`\`yml\nName: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nAPI: ${client.ws.ping}ms\nRuntime: ${runtime}\n\`\`\``)
		.setFields([
			{
				name: "Bot stats",
				value: `\`\`\`yml\nGuilds: ${client.guilds.cache.size} \nNodeJS: ${nodeVersion}\nInfoBot: v${require("../../package.json").version}\n\`\`\``,
				inline: true,
			},
			{
				name: "System stats",
				value: `\`\`\`yml\nOS: ${osver}\nUptime: ${sysuptime}\nShards: ${client.ws.totalShards}\nOn: ${interaction.member.guild.shardId}\n\`\`\``,
				inline: false,
			},
		]);
		
		if (client.manager) {
			statsEmbed.addField( `Lavalink stats`,
			`\`\`\`yml\nUptime: ${lavauptime}\nRAM: ${lavaram} MB\nPlaying: ${lavaclientstats.playingPlayers} out of ${client.manager.nodes.values().next().value.stats.players}\n\`\`\``, true,
			)
		}
		return interaction.reply({ embeds: [statsEmbed], ephemeral: true });
	},
};