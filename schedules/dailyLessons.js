const cron = require('cron');
const axios = require('axios');
const { MessageEmbed } = require("discord.js");

// https://crontab.guru/
// https://cronitor.io/cron-reference?utm_source=crontabguru&utm_campaign=cron_reference
// https://cron-job.org/en/
// https://it.wikipedia.org/wiki/Crontab

// module is just a cron job which gets loaded on startup and executes on cron tab syntax `30 6 * * 1-5`
module.exports = async (client) => {
	const embed = new MessageEmbed()
	.setColor(client.config.embedColor)
	.setTitle(`Today's Lessons!`);

	let url = `https://corsi.unibo.it/laurea/informatica/orario-lezioni/@@orario_reale_json?anno=1`
	
	let validLessons = [];
	let date = new Date();
	await axios.get(url).then((res) => {
		for(element of res.data) {
			let start = new Date(element.start);
			if(date.getFullYear() == start.getFullYear() &&
			date.getMonth() == start.getMonth() &&
			date.getDate() == start.getDate()) {
				validLessons.push(element);
			}
		}
		// Date objects have zero indexed months
		for(element of validLessons) {
			embed
			.addField(`${element.time} | ${element.title}`, 
			`**Prof:**\n${element.docente}\n**In:**\n${element.aule[0].des_edificio}\n${element.aule[0].des_indirizzo}\n**[Teams](${element.teams})**`)
		}
	})
	
	const dailyLessons = new cron.CronJob('30 6 * * 1-5', () => {
		// You got to change these according to where you want to sen the message
		const guild = client.guilds.cache.get('872001318800203846');
		const channel = guild.channels.cache.get('872064345218088982');
		channel.send({embeds: [embed]})
	});
	dailyLessons.start()
};