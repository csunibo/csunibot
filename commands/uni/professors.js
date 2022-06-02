const { getProfessors } = require('../../util/scrapeUtil');
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
	name: "professors",
	usage: "/professors <course>",
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
	description: "Get information about the professors of a course from the official sites of UNIBO",
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

		const professorsList = await getProfessors(interaction.options.getString('course'))
		interaction.editReply({ content: "This may take some time..."})

		const maxEmbedsPerPage = 3;
		let pages = Math.ceil(professorsList.length / maxEmbedsPerPage);

		let embedArray = [];
		// default Page No.
		let pageNo = 0;
		// initial temporary array 
		let displayingProfessors = professorsList.slice(pageNo * maxEmbedsPerPage, (pageNo * maxEmbedsPerPage) + maxEmbedsPerPage);

		
		for (professor of displayingProfessors) {
			embedArray.push(
				new MessageEmbed()
				.setColor(client.config.embedColor)
				.setThumbnail(professor.image)
				.setTitle(professor.name)
				.setURL(professor.site)
				.setDescription(professor.role)
			)
		}

		let embed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({
			name: `Requested topics`,
			iconURL: client.config.iconURL,
		})
		.setTimestamp()
		.setFooter({text: `Page ${pageNo + 1} / ${pages}`});
		
		// Should convert this to a selct menu with numbered pages
		const message = await interaction.editReply({ embeds: embedArray, components: [getButtons(pageNo, pages)], fetchReply: true });
		const collector = message.createMessageComponentCollector({ filter, time: 600000, componentType: "BUTTON" });
		
		collector.on("collect", async (iter) => {
			if (iter.customId === "next_page") {
				pageNo++;
			} else if (iter.customId === "previous_page") {
				pageNo--;
			}
			
			embedArray = [];
			
			displayingProfessors = professorsList.slice(pageNo * maxEmbedsPerPage, (pageNo * maxEmbedsPerPage) + maxEmbedsPerPage);
			
			for (professor of displayingProfessors) {
				embedArray.push(
					new MessageEmbed()
					.setColor(client.config.embedColor)
					.setThumbnail(professor.image)
					.setTitle(professor.name)
					.setURL(professor.site)
					.setDescription(professor.role)
				)
			}
			interaction.editReply({ content: `**Page ${pageNo + 1} / ${pages}**`})
			await iter.update({ embeds: embedArray, components: [getButtons(pageNo, pages)], fetchReply: true });
		});
	},
}
