const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
.setName("leave")
.setDescription("Stops whatever the bot is playing and leaves the voice channel\n(This command will clear the queue)")
.setRun(async (client, interaction, options) => {
	let player;
	if (client.manager) player = client.manager.players.get(interaction.guild.id); 
else 
return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription("Lavalink node is not connected")] });
	if (!player)
	return interaction.reply({embeds: [new MessageEmbed()
		.setColor("RED")
		.setDescription("❌ | **I'm not in a channel.**")],
	});
	
	if (!interaction.member.voice.channel) {
		const joinEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setDescription("❌ | **You must be in a voice channel to use this command!**");
		return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
	}
	
	if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
		const sameEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setDescription("❌ | **You must be in the same voice channel as me to use this command!**");
		return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
	}
	
	player.destroy();
	
	interaction.reply({
		embeds: [new MessageEmbed().setColor(client.config.embedColor).setDescription(`:wave: | **Bye Bye!**`)],
	});
});

module.exports = command;
