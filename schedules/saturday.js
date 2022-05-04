const { MessageEmbed } = require("discord.js");
const cron = require('cron');


// https://crontab.guru/
// https://cronitor.io/cron-reference?utm_source=crontabguru&utm_campaign=cron_reference
// https://cron-job.org/en/
// https://it.wikipedia.org/wiki/Crontab

// Sends a message every saturday 
module.exports = (client) => {
	const embed = new MessageEmbed()
	.setColor(client.config.embedColor)
	.setTitle(`It's Saturday~`)
	.setImage("https://cdn.discordapp.com/attachments/969278840373391400/969285095129251860/unknown.png");
	
	const saturdaySchedule = new cron.CronJob('0 0 * * 6', () => {
		const guild = client.guilds.cache.get('968969977631764611');
		const channel = guild.channels.cache.get('968969977631764614');
		channel.send({embeds: [embed]})
	});
	saturdaySchedule.start();
};