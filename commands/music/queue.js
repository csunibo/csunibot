const ms = require("pretty-ms");
const { MessageEmbed } = require(`discord.js`);
module.exports = {
	name: `queue`,
	category: `music`,
	description: `Shows the current queue of tracks`,
	ownerOnly: false,
	run: async (client, interaction) => {
		let player;
		if (client.manager) player = client.manager.players.get(interaction.guild.id); 
else 
return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription("Lavalink node is not connected")] });
		
		if (!player) {
			const queueEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription("There's nothing playing in the queue");
			return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
		}
		
		if (!player.playing) {
			const queueEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription("There's nothing playing.");
			return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
		}
		
		//get the right tracks of the current tracks
		const tracks = player.queue;
		//if there are no other tracks, information
		if (!tracks.length)
		return interaction.reply({
			embeds: [new MessageEmbed().setColor(client.config.embedColor)
				.setAuthor({ name: 'Now Playing' })
				.setTitle(`${player.queue.current.title}`)
				.setURL(`${player.queue.current.uri}`)
				.setThumbnail(player.queue.current.thumbnail)
				.addFields({
					name: "Duration",
					value: `\`${ms(player.position, { colonNotation: true })} / ${ms(player.queue.current.duration, { colonNotation: true })}\``,
					inline: true,
				},
				{
					name: "Volume",
					value: `\`${player.volume}\``,
					inline: true,
				},
				{
					name: "Total Tracks",
					value: `\`${player.queue.totalSize}\``,
					colonNotation: true,
					inline: true,
				})
			]
		})
	}
};
