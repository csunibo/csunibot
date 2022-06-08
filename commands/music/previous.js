const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
.setName("previous")
.setDescription("Go back to the previous song.")
.setRun(async (client, interaction) => {
	let player;
	if (client.manager) player = client.manager.players.get(interaction.guild.id); 
	else 
	return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription("Lavalink node is not connected")] });
	if (!player) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("There's nothing playing in the queue")
			], 
			ephemeral: true 
		});
	}
	
	if (!interaction.member.voice.channel) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("You must be in a voice channel to use this command.")
			], 
			ephemeral: true 
		});
	}
	
	if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("You must be in the same voice channel as me to use this command!")
			], 
			ephemeral: true 
		});
	}
	
	let previousSong = player.queue.previous;

	if (!previousSong)
	return interaction.reply({
		embeds: [
			new MessageEmbed()
			.setColor("RED")
			.setDescription("There is no previous song in the queue."),
		],
	});
	
	const currentSong = player.queue.current;
	player.play(previousSong);
	interaction.reply({
		embeds: [
			new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription(`⏮ | Previous song: **${previousSong.title}**\nRequested By: **${previousSong.requester.username}**`),
		],
	});
	
	previousSong = currentSong;
});

module.exports = command;
