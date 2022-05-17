const fs = require('fs');
const {getCourses, getProfessors, getTopics } = require('../../util/getUninfo');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

const getButtons = (pageNo, maxPages) => {
	return new MessageActionRow()
	.addComponents(
		new MessageButton()
		.setCustomId("previous_page")
		.setEmoji("◀️")
		.setStyle("PRIMARY")
		.setDisabled(pageNo == 0),
		new MessageButton()
		.setCustomId("next_page")
		.setEmoji("▶️")
		.setStyle("PRIMARY")
		.setDisabled(pageNo == (maxPages - 1)),
	);
};

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

				
		const filter = (i) => {
			if(i.user.id === interaction.user.id) return true;
			return i.reply({embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("This Button Isn't For You")
			], 
			ephemeral: true});
		};

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
			let pages = Math.ceil(allCourses.length / 20);
			
			// default Page No.
			let pageNo = 0;
			
			let embed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setAuthor({
				name: `All UNIBO courses`,
				iconURL: client.config.iconURL,
			})
			.setTimestamp()
			.setFooter({text: `Page ${pageNo + 1} / ${pages}`});
			
			// initial temporary array 
			let displayingCourses = allCourses.slice(pageNo * 20, (pageNo * 20) + 20);
			
			displayingCourses.forEach(course => {
				embed.addField(`​`, `**[${course.name}](${course.link})**`)
			});
				
			// Should convert this to a selct menu with numbered pages
			const message = await interaction.editReply({ embeds: [embed], components: [getButtons(pageNo, pages)], fetchReply: true });
			const collector = message.createMessageComponentCollector({ filter, time: 600000, componentType: "BUTTON" });

			collector.on("collect", async (iter) => {
				if (iter.customId === "next_page") {
					pageNo++;
				} else if (iter.customId === "previous_page") {
					pageNo--;
				}
				
				embed.fields = [];
				
				displayingCourses = allCourses.slice(pageNo * 20, (pageNo * 20) + 20);
				
				displayingCourses.forEach(course => {
					embed.addField(`​`, `**[${course.name}](${course.link})**`)
					.setFooter({text: `Page ${pageNo + 1} / ${pages}`});
				});
				await iter.update({ embeds: [embed], components: [getButtons(pageNo, pages)], fetchReply: true });
			});
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
