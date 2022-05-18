const { getTopics } = require('../../util/getUninfo');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const courses = require('./courses');

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
		const topics = await getTopics(interaction.options.getString('course'));

		if (!topics.length) {
			return interaction.editReply({ 
				embeds: [
					new MessageEmbed()
					.setDescription("No topics found for this course")
					.addField(`Please check the site:`, `[Here](${interaction.options.getString('course')})`)
				] 
			})
		}

		const maxElementsPerPage = 10;
		let pages = Math.ceil(topics.length / maxElementsPerPage);
		
		// default Page No.
		let pageNo = 0;
		
		let embed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({
			name: `Requested topics`,
			iconURL: client.config.iconURL,
		})
		.setTimestamp()
		.setFooter({text: `Page ${pageNo + 1} / ${pages}`});
		
		// initial temporary array 
		let displayingTopics = topics.slice(pageNo * maxElementsPerPage, (pageNo * maxElementsPerPage) + maxElementsPerPage);
		
		displayingTopics.forEach(topic => {
			let fieldText;
			if (topic.virtuale) {
				fieldText = `**Codice: **[${topic.code}](${topic.site})\n[Link virtuale](${topic.virtuale})`;
			} else {
				fieldText = `**Codice: **[${topic.code}](${topic.site})`;
			}
			embed.addField(`${topic.title}`, fieldText);
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
			
			displayingTopics = topics.slice(pageNo * maxElementsPerPage, (pageNo * maxElementsPerPage) + maxElementsPerPage);
			
			displayingTopics.forEach(topic => {
				let fieldText;
				if (topic.virtuale) {
					fieldText = `**Codice: **[${topic.code}](${topic.site})\n[Link virtuale](${topic.virtuale})`;
				} else {
					fieldText = `**Codice: **[${topic.code}](${topic.site})`;
				}
				embed.addField(`${topic.title}`, fieldText)
				.setFooter({text: `Page ${pageNo + 1} / ${pages}`});
			});
			await iter.update({ embeds: [embed], components: [getButtons(pageNo, pages)], fetchReply: true });
		});
		interaction.editReply({ content: `Done!` })
	},
}
