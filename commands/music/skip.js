const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require('discord.js');

const command = new SlashCommand()
.setName("skip")
.setDescription("Skip the current song")
.setRun(async (client, interaction, options) => {
	let channel = await client.getChannel(client, interaction);
	if (!channel) return;
	let player;
	if (client.manager) player = client.manager.players.get(interaction.guild.id); 
	else 
	return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription("Lavalink node is not connected")] });
	if (!player)
	return interaction.reply({
		embeds: [
			new MessageEmbed()
			.setColor("RED")
			.setDescription("There's nothing to skip!")
		],
	});
	
	if (!interaction.member.voice.channel) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("You must be in a voice channel to use this command!")
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
	player.stop();
	interaction.reply({ 
		embeds: [
			new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription("✅ | **Skipped!**")
		] 
	});
});

module.exports = command;
