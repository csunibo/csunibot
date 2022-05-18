// const {getCourses, getProfessors, getTopics } = require('../../util/getUninfo');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

const getButtons = (pageNo, maxPages) => {
	return new MessageActionRow().addComponents(
		new MessageButton().setCustomId("previous_page").setEmoji("◀️").setStyle("PRIMARY").setDisabled(pageNo == 0),
		new MessageButton().setCustomId("next_page").setEmoji("▶️").setStyle("PRIMARY").setDisabled(pageNo == (maxPages - 1)),
	);
};

module.exports = {
	name: "courses",
	usage: "/courses <lom>",
	options: [
		{
			name: 'lom',
			type: 3, // "STRING"
			description: "get the list of courses offered by the University of Bologna",
			required: true,
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
	],
	category: "uni",
	description: "See all the available courses offered by UNIBO",
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
		
		interaction.editReply({ content: "This may take some time..."});
		const option = interaction.options.getString('lom');

		let courses;
		const maxElementsPerPage = 10;
		
		if (option === 'bachelor')
		courses = require('../../scraped/bachelor_courses.json')
		if (option === 'master')
		courses = require('../../scraped/master_courses.json')
		/* 
		courses = await getCourses(`https://corsi.unibo.it/laurea/`);
		courses = await getCourses(`https://corsi.unibo.it/magistrale/`);
		*/
		let pages = Math.ceil(courses.length / maxElementsPerPage);
		
		// default Page No.
		let pageNo = 0;
		
		let embed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({
			name: `Requested courses`,
			iconURL: client.config.iconURL,
		})
		.setTimestamp()
		.setFooter({text: `Page ${pageNo + 1} / ${pages}`});
		
		// initial temporary array 
		let displayingCourses = courses.slice(pageNo * maxElementsPerPage, (pageNo * maxElementsPerPage) + maxElementsPerPage);
		
		displayingCourses.forEach(course => {
			embed.addField(`${course.name}`, `**[Sito](${course.link})**`)
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
			
			displayingCourses = courses.slice(pageNo * maxElementsPerPage, (pageNo * maxElementsPerPage) + maxElementsPerPage);
			
			displayingCourses.forEach(course => {
				embed.addField(`${course.name}`, `**[Sito](${course.link})**`)
				.setFooter({text: `Page ${pageNo + 1} / ${pages}`});
			});
			await iter.update({ embeds: [embed], components: [getButtons(pageNo, pages)], fetchReply: true });
		});
		interaction.editReply({ content: `Done!` })
	},
}