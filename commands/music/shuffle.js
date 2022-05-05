const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
.setName("shuffle")
.setDescription("Randomizes the queue")
.setRun(async (client, interaction, options) => {
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
	
	if (!player.queue || !player.queue.length || player.queue.length === 0) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("There are no songs in the queue.")
			], 
			ephemeral: true 
		});
	}
	
	//  if the queue is not empty, shuffle the entire queue
	player.queue.shuffle();
	return interaction.reply({ 
		embeds: [
			new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription("🔀 | **Successfully shuffled the queue.**")
		] 
	});
});

module.exports = command;
