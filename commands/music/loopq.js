const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
.setName("loopq")
.setDescription("Loop the current song queue")
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
				.setDescription("There is no music playing.")
			],
		});
	}
	if (!interaction.member.voice.channel) {
		
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("You need to join voice channel first before you can use this command.")
			], 
			ephemeral: true 
		});
	}
	
	if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
		
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("You must be in the same voice channel as me.")
			], 
			ephemeral: true 
		});
	}
	if (player.setQueueRepeat(!player.queueRepeat));
	const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
	
	interaction.reply({ 
		embeds: [
			new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription(`:thumbsup: | **Loop queue is now \`${queueRepeat}\`**`)
		] 
	});
});

module.exports = command;
