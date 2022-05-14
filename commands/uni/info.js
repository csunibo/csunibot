const fs = require('fs');
const {getCourses, getProfessors, getTopics } = require('../../util/getUninfo');

module.exports = {
	name: "info",
	usage: "/info <lom?> <professors?> <topics?>",
	options: [
		{
			name: 'lom',
			type: 3, // "STRING"
			description: "bachelor's / master's / all",
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
				{
					name: "all",
					value: "all"
				},
			],
		},
		{
			name: 'professors',
			type: 3, // "STRING"
			description: "Select a course from the list",
			required: false,
			autocomplete: true,
		},
		{
			name: 'topics',
			type: 3, // "STRING"
			description: "Select a course from the list",
			required: false,
			autocomplete: true,
		},
	],
	autocompleteOptions: async () => require('../../scraped/courses.json')
	.map(course => {
		return { name: course.name, value: course.link }
	}),
	category: "utility",
	description: "Get information from the official sites of UNIBO",
	ownerOnly: false,
	run: async (client, interaction) => {
		await interaction.deferReply().catch((_) => {});
		interaction.editReply({ content: "This may take some time..."})
		let option = interaction.options.getString('lom');
		
		let laureaEntries;
		let magistraleEntries;
		let allCourses;
		let topics;
		let professors;
		
		if (option === 'bachelor' || option === 'all')
		laureaEntries = getCourses(`https://corsi.unibo.it/laurea/`);
		if (option === 'master' || option === 'all')
		magistraleEntries = getCourses(`https://corsi.unibo.it/magistrale/`);
		if (interaction.options.getString('professors'))
		professors = getProfessors(interaction.options.getString('professors'))
		if (interaction.options.getString('topics'))
		topics = getTopics(interaction.options.getString('topics'));
		
		if (option === 'bachelor')
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
		
		else if (option === 'master')
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
		
		else if (option === 'all') {
			allCourses = await magistraleEntries;
			allCourses = allCourses.concat(await laureaEntries);
			fs.writeFile('./scraped/courses.json', JSON.stringify(allCourses, null, 4), err => {
				if (err) {
					console.error(err)
					return
				}
				interaction.channel.send({ files: [
					{
						name: './scraped/courses.json',
						attachment: './scraped/courses.json',
						description: "courses.json",
					}
				] })
			})
		}
		
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
