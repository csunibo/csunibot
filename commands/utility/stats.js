const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const os = require("os");

module.exports = {
	name: "stats",
	category: "utility",
	description: "Check the bot's stats!",
	ownerOnly: false,
	run: async (client, interaction) => {
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
		.setDescription(`\`\`\`yml\nName: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nRuntime: ${runtime}\n\`\`\``)
		.setFields([
			{
				name: "Bot stats",
				value: `\`\`\`yml\nGuilds: ${client.guilds.cache.size} \nNodeJS: ${nodeVersion}\nInfoBot: v${require("../../package.json").version}\n\`\`\``,
				inline: true,
			},
			{
				name: "System stats",
				value: `\`\`\`yml\nOS: ${osver}\nUptime: ${sysuptime}\nShards: ${client.ws.totalShards}\nIndex: ${interaction.member.guild.shardId}\n\`\`\``,
				inline: false,
			},
		]);
		return interaction.reply({ embeds: [statsEmbed], ephemeral: true });
	},
};