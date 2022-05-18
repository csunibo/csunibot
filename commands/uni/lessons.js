const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { thisWeek } = require('../../util/dateFetcher');


module.exports = {
	name: "lessons",
	usage: "/lessons <course> <year> <date>",
	options: [
		{
			name: "course",
			type: 3, // "STRING"
			description: 'What course are you looking for',
			required: true,
			autocomplete: true,
		},
		{
			name: 'year',
			type: 4, // "INTEGER"
			description: 'What year are you looking for',
			required: true,
			// TUrn this autocomplete
			choices: [
				{
					name: "First Year",
					value: 1
				},
				{
					name: "Second Year",
					value: 2
				},
				{
					name: "Third Year",
					value: 3
				},
			],
		},
		{
			name: 'date',
			type: 3, // "STRING"
			description: "Date range for the lessons to look up",
			required: true,
			choices: [
				{
					name: "Today",
					value: "today"
				},
				{
					name: "Tomorrow",
					value: "tomorrow"
				},
			],
		},
	],
	autocompleteOptions: async () => require('../../scraped/courses.json')
	.map(course => {
		return { name: course.name, value: course.link }
	}),
	category: "uni",
	description: "Check the lessons",
	ownerOnly: false,
	run: async (client, interaction) => {
		const year = interaction.options.getInteger("year");
		// Added week to have smaller interval on which to iterate everything, should speed up the search
		const week = thisWeek();
		let url = `${interaction.options.getString('course')}/orario-lezioni/@@orario_reale_json?anno=${year}&start=${week[0]}&end=${week[1]}`
	
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
