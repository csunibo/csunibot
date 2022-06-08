const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
.setName("autoqueue")
.setDescription("Automatically add songs to the queue (toggle)")
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
	await interaction.deferReply();
	let embed = new MessageEmbed().setColor(client.config.embedColor);
	const autoQueue = player.get("autoQueue");
	
	if (!autoQueue || autoQueue === false) {
		player.set("autoQueue", true);
	} else {
		player.set("autoQueue", false);
	}
	embed.setDescription(`Auto Queue is \`${(!autoQueue ? "ON" : "OFF")}\``)
	return interaction.editReply({ embeds: [embed] });
});

module.exports = command;