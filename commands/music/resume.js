const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
.setName("resume")
.setDescription("Resume current track")
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
				.setDescription("Nothing is playing right now...")
			], 
			ephemeral: true 
		});
	}
	
	if (!interaction.member.voice.channel) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("You must be in the same voice channel as me to use this command!")
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
	
	if (!player.paused) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("Current track is already resumed")
			], 
			ephemeral: true 
		});
	}
	player.pause(false);
	return interaction.reply({ 
		embeds: [
			new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription(`⏯ **Resumed!**`)
		] 
	});
});

module.exports = command;
