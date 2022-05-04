const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
.setName("loop")
.setDescription("Loops the current song")
.setRun(async (client, interaction, options) => {
	let player;
	if (client.manager) player = client.manager.players.get(interaction.guild.id); 
else 
return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription("Lavalink node is not connected")] });
	if (!player) {
		return interaction.reply({
			embeds: [client.ErrorEmbed("❌ | **Nothing is playing right now...**")],
		});
	}
	if (!interaction.member.voice.channel) {
		const joinEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setDescription("❌ | **You must be in a voice channel to use this command.**");
		return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
	}
	
	if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
		const sameEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setDescription("❌ | **You must be in the same voice channel as me to use this command!**");
		return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
	}
	if (player.setTrackRepeat(!player.trackRepeat));
	const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
	
	let loopembed = new MessageEmbed()
	.setColor(client.config.embedColor)
	.setDescription(`👍 | **Loop has been \`${trackRepeat}\`**`);
	interaction.reply({ embeds: [loopembed] });
});

module.exports = command;
