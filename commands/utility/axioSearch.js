const fs = require('fs');
const {getCourses, getProfessors, getTopics, getHTML } = require('../../util/getUninfo');
const { MessageAttachment } = require('discord.js')


module.exports = {
	name: "axios",
	usage: "null",
	options: [
		{
			name: 'lom',
			type: 3, // "STRING"
			description: "laurea / magistrale",
			required: false,
			choices: [
				{
					name: "laurea",
					value: "laurea"
				},
				{
					name: "magistrale",
					value: "magistrale"
				},
			],
		},
		{
			name: 'html',
			type: 3, // "STRING"
			description: "Url di una pagina",
			required: false,
		},
		{
			name: 'docenti',
			type: 3, // "STRING"
			description: "url di un corso (es. 'https://corsi.unibo.it/laurea/informatica'",
			required: false,
		},
		{
			name: 'materie',
			type: 3, // "STRING"
			description: "url di un corso (es. 'https://corsi.unibo.it/laurea/informatica'",
			required: false,
		},
	],
	category: "utility",
	description: "Test command",
	ownerOnly: false,
	run: async (client, interaction) => {
		await interaction.deferReply().catch((_) => {});
		interaction.editReply({ content: "This may take some time..."})

		let laureaEntries;
		let magistraleEntries;
		let HTMLgrabber;
		let topics;
		let docenti;
		
		if (interaction.options.getString('lom') === 'laurea')
			laureaEntries = getCourses(`https://corsi.unibo.it/laurea/`);
		else if (interaction.options.getString('lom') === 'magistrale')
			magistraleEntries = getCourses(`https://corsi.unibo.it/magistrale/`);
		if (interaction.options.getString('docenti'))
			docenti = getProfessors(interaction.options.getString('docenti'))
		if (interaction.options.getString('materie'))
			topics = getTopics(interaction.options.getString('materie'));
		if (interaction.options.getString('html'))
			HTMLgrabber = getHTML(interaction.options.getString('html'));
		
		if (interaction.options.getString('html'))
		fs.writeFile('./scraped/GrabbedHTML.html', await HTMLgrabber, err => {
			if (err) {
				console.error(err)
				return
			}
			interaction.channel.send({ files: [
				{
					name: './scraped/GrabbedHTML.html',
					attachment: './scraped/GrabbedHTML.html',
					description: "GrabbedHTML.html",
				}
			] })
		})

		if (interaction.options.getString('lom') === 'laurea')
		fs.writeFile('./scraped/corsi_di_laurea.json', JSON.stringify(await laureaEntries, null, 4), err => {
			if (err) {
				console.error(err)
				return
			}
			interaction.channel.send({ files: [
				{
					name: './scraped/corsi_di_laurea.json',
					attachment: './scraped/corsi_di_laurea.json',
					description: "corsi_di_laurea.json",
				}
			] })
		})

		else if (interaction.options.getString('lom') === 'magistrale')
		fs.writeFile('./scraped/corsi_magistrali.json', JSON.stringify(await magistraleEntries, null, 4), err => {
			if (err) {
				console.error(err)
				return
			}
			interaction.channel.send({ files: [
				{
					name: './scraped/corsi_magistrali.json',
					attachment: './scraped/corsi_magistrali.json',
					description: "corsi_magistrali.json",
				}
			] })
		})

		if (interaction.options.getString('docenti'))
		fs.writeFile('./scraped/docenti.json', JSON.stringify(await docenti, null, 4), err => {
			if (err) {
				console.error(err)
				return
			}
			interaction.channel.send({ files: [
				{
					name: './scraped/docenti.json',
					attachment: './scraped/docenti.json',
					description: "docenti.json",
				}
			] })
		})

		if (interaction.options.getString('materie'))
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
