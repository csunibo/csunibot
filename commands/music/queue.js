const ms = require("pretty-ms");
const { MessageEmbed, MessageActionRow, MessageButton } = require(`discord.js`);

// Buttons function in case the embed needs more pages
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
	name: `queue`,
	category: `music`,
	description: `Shows the current queue of tracks`,
	usage: "/queue",
	ownerOnly: false,
	run: async (client, interaction) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) return;
		
		let player;
		if (client.manager) 
		player = client.manager.players.get(interaction.guild.id); 
		else return interaction.reply({ 
			embeds: [new MessageEmbed()
				.setColor("RED")
				.setDescription("Lavalink node is not connected")
			] 
		});
		
		if (!player) {
			return interaction.reply({ 
				embeds: [
					new MessageEmbed()
					.setColor("RED")
					.setDescription("There is nothing playing in the queue.")
				], 
				ephemeral: true 
			});
		}
		
		if (!player.playing) {
			return interaction.reply({ 
				embeds: [
					new MessageEmbed()
					.setColor("RED")
					.setDescription("There's nothing playing.")
				], 
				ephemeral: true 
			});
		}
		
		const tracks = player.queue;
		//if there are no other tracks, information
		if (!tracks.length) {
			return interaction.reply({ 
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
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
		
		await interaction.deferReply().catch((_) => {});
		
		const offset = 10
		let maxPages = Math.ceil(tracks.size / offset);
		// If there are enough songs, make an embed list of them
		let pageNo = 0;
		let currentPageSlice = tracks.slice(pageNo * offset, (pageNo * offset) + offset)
		
		let queuePageEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({ name: `Queue list | ${pageNo + 1} of ${maxPages} (${tracks.size})`, iconURL: client.config.iconURL})
		.setTimestamp()
		.setTitle(`Currently playing: ${player.queue.current.title}`)
		.setURL(`${player.queue.current.uri}`)
		.setThumbnail(player.queue.current.thumbnail)
		.setDescription(`Playing: \`${ms(player.position, { colonNotation: true })} / ${ms(player.queue.current.duration, { colonNotation: true })}\`\n
		**__Coming up:__**`);
		for (const [index, track] of currentPageSlice.entries()) {
			queuePageEmbed.addField(`​`, `[${track.title}](${track.uri}) || \`${ms(track.duration, {colonNotation: true})}\`\n**Requested by: **${track.requester}`);
		}
		
		const pageEmbed = await interaction.editReply({ 
			embeds: [queuePageEmbed], 
			components: [getButtons(pageNo, maxPages)], 
			fetchReply: true
		});
		
		// If the songs surpass the offset, update the pages on button clicks
		if (maxPages > 1) {
			
			const collector = pageEmbed.createMessageComponentCollector({ time: 60000, componentType: "BUTTON" });
			
			collector.on("collect", async (buttonInteraction) => {
				if (buttonInteraction.customId === "queue_next_page") {
					pageNo++;
				} else if (buttonInteraction.customId === "queue_previous_page") {
					pageNo--;
				}
				
				// epmtying, refilling the fields to update the latest occurences in the queue
				queuePageEmbed.fields = [];
				queuePageEmbed
				.setAuthor({ name: `Queue list | ${pageNo + 1} of ${maxPages} (${tracks.size})`, iconURL: client.config.iconURL})
				.setTitle(`Currently playing: ${player.queue.current.title}`)
				.setURL(`${player.queue.current.uri}`)
				.setThumbnail(player.queue.current.thumbnail)
				.setDescription(`Playing: \`${ms(player.position, { colonNotation: true })} / ${ms(player.queue.current.duration, { colonNotation: true })}\`\n
				**__Coming up:__**`);			
				currentPageSlice = tracks.slice(pageNo * offset, (pageNo * offset) + offset);
				for (const [index, track] of currentPageSlice.entries()) {
					queuePageEmbed.addField(`​`, `[${track.title}](${track.uri}) || \`${ms(track.duration, {colonNotation: true})}\`\n**Requested by: **${track.requester}`);
				}
				await buttonInteraction.update({ embeds: [queuePageEmbed], components: [getButtons(pageNo, maxPages)], fetchReply: true });
			});
		}
	}
};