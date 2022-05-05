const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
	name: "lessons",
	usage: "/lessons <year> <date?>",
	options: [
		{
			type: 4, // "INTEGER"
			name: 'year',
			description: 'What year are you looking for',
			required: true,
			choices: [
				{
					name: "Primo Anno / First Year",
					value: 1
				},
				{
					name: "Secondo Anno / Second Year",
					value: 2
				},
				{
					name: "Terzo Anno / Third Year",
					value: 3
				},
			]
		},
		{
			type: 3, // "STRING"
			name: 'date',
			description: "Date range for the lessons to look up (Leaving this blank will give you today's lessons)",
			required: true,
			choices: [
				{
					name: "Oggi / Today",
					value: "today"
				},
				{
					name: "Domani / Tomorrow",
					value: "tomorrow"
				},
			]
		}
	],
	category: "media",
	description: "Check the lessons",
	ownerOnly: false,
	run: async (client, interaction) => {
		const year = interaction.options.getInteger("year");
		let url = `https://corsi.unibo.it/laurea/informatica/orario-lezioni/@@orario_reale_json?anno=${year}`
	
		let validLessons = [];
		let date = new Date();
		if(interaction.options.getString("date") === "tomorrow") {
			date.setDate(date.getDate() + 1);
		}
		// Copied from the telegram bot lul
		await axios.get(url).then((res) => {
			for(element of res.data) {
				let start = new Date(element.start);
				if(date.getFullYear() == start.getFullYear() &&
				date.getMonth() == start.getMonth() &&
				date.getDate() == start.getDate()) {
					validLessons.push(element);
				}
			}
			if(!validLessons.length) {
				return interaction.reply({ 
					embeds: [new MessageEmbed()
					.setColor("RED")
					.addField("EN", "No lessons found for this date")
					.addField("IT", "Nessuna lezione trovata per questa data")] 
				});
			}
			// Date objects have zero indexed months
			let resultDate = `${date.toDateString()}`;
			let lessonsEmbed = new MessageEmbed().setColor(client.config.embedColor).setTitle(`Here are the lessons for ${resultDate}`);
			for(element of validLessons) {
				lessonsEmbed
				.addField(`${element.time} | ${element.title}`, 
				`**Prof:**\n${element.docente}\n**In:**\n${element.aule[0].des_edificio}\n${element.aule[0].des_indirizzo}\n**[Teams](${element.teams})**`)
			}
			return interaction.reply({ 
				embeds: [lessonsEmbed]
			})
		});
	},
};
