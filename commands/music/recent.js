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
	name: "recent",
	category: "music",
	usage: "/recent",
	description: "See what songs the bot has played recently!",
	run: async (client, interaction, options) => {
		let playedTracks = client.playedTracks;
		await interaction.deferReply().catch((_) => {});

		let stringedTracks = [];

		for (track of playedTracks) {
			stringedTracks.push(`[${track.title}](${track.uri})\n`)
		}
		return interaction.editReply({ 
			embeds: [new MessageEmbed()
				.setDescription(stringedTracks.join('\n'))
			]
		});
	}
}