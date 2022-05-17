const fs = require('fs');
const {getCourses, getTopics } = require('../../util/getUninfo');
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
	name: "topics",
	usage: "/topics <course>",
	options: [
		{
			name: 'course',
			type: 3, // "STRING"
			description: "Select a course from the list",
			required: true,
			autocomplete: true,
		},
	],
	autocompleteOptions: async () => require('../../scraped/courses.json')
	.map(course => {
		return { name: course.name, value: course.link }
	}),
	category: "uni",
	description: "Get information about the topics of a course from the official sites of UNIBO",
	ownerOnly: false,
	run: async (client, interaction) => {
		await interaction.deferReply().catch((_) => {});

		let topics = getTopics(interaction.options.getString('course'));
		interaction.editReply({ content: "This may take some time..."});

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
