const fs = require('fs');
const {getCourses, getProfessors, getTopics } = require('../../util/getUninfo');

module.exports = {
	name: "info",
	usage: "/info <lom?> <professors?> <topics?>",
	options: [
		{
			name: 'lom',
			type: 3, // "STRING"
			description: "bachelor's / master's",
			required: false,
			choices: [
				{
					name: "bachelor",
					value: "bachelor"
				},
				{
					name: "master",
					value: "master"
				},
			],
		},
		{
			name: 'professors',
			type: 3, // "STRING"
			description: "url of a course",
			required: false,
		},
		{
			name: 'topics',
			type: 3, // "STRING"
			description: "url of a course",
			required: false,
		},
	],
	category: "utility",
	description: "Get information from the official sites of UNIBO",
	ownerOnly: false,
	run: async (client, interaction) => {
		await interaction.deferReply().catch((_) => {});
		interaction.editReply({ content: "This may take some time..."})

		let laureaEntries;
		let magistraleEntries;
		let topics;
		let professors;
		
		if (interaction.options.getString('lom') === 'bachelor')
			laureaEntries = getCourses(`https://corsi.unibo.it/laurea/`);
		else if (interaction.options.getString('lom') === 'master')
			magistraleEntries = getCourses(`https://corsi.unibo.it/magistrale/`);
		if (interaction.options.getString('professors'))
			professors = getProfessors(interaction.options.getString('professors'))
		if (interaction.options.getString('topics'))
			topics = getTopics(interaction.options.getString('topics'));

		if (interaction.options.getString('lom') === 'bachelor')
		fs.writeFile('./scraped/bachelor_courses.json', JSON.stringify(await laureaEntries, null, 4), err => {
			if (err) {
				console.error(err)
				return
			}
			interaction.channel.send({ files: [
				{
					name: './scraped/bachelor_courses.json',
					attachment: './scraped/bachelor_courses.json',
					description: "bachelor_courses.json",
				}
			] })
		})

		else if (interaction.options.getString('lom') === 'master')
		fs.writeFile('./scraped/master_courses.json', JSON.stringify(await magistraleEntries, null, 4), err => {
			if (err) {
				console.error(err)
				return
			}
			interaction.channel.send({ files: [
				{
					name: './scraped/master_courses.json',
					attachment: './scraped/master_courses.json',
					description: "master_courses.json",
				}
			] })
		})

		if (interaction.options.getString('professors'))
		fs.writeFile('./scraped/professors.json', JSON.stringify(await professors, null, 4), err => {
			if (err) {
				console.error(err)
				return
			}
			interaction.channel.send({ files: [
				{
					name: './scraped/professors.json',
					attachment: './scraped/professors.json',
					description: "professors.json",
				}
			] })
		})

		if (interaction.options.getString('topics'))
		fs.writeFile('./scraped/topics.json', JSON.stringify(await topics, null, 4), err => {
			if (err) {
				console.error(err)
				return
			}
			interaction.channel.send({ files: [
				{
					name: './scraped/topics.json',
					attachment: './scraped/topics.json',
					description: "topics.json",
				}
			] })
		})
		interaction.editReply({ content: "Here are the requested files"})
	},
}
