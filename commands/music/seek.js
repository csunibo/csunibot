const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

const command = new SlashCommand()
.setName("seek")
.setDescription("Seek to a specific time in the current song.")
.addStringOption((option) =>
option
.setName("time")
.setDescription("Seek to time you want. Ex 2m | 10s | 53s")
.setRequired(true)
)
.setRun(async (client, interaction, options) => {
	let channel = await client.getChannel(client, interaction);
	if (!channel) return;
	
	let node = await client.getLavalink(client);
	if (!node) {
		return interaction.reply({embeds: [new MessageEmbed()
			.setColor("RED")
			.setDescription("Lavalink node is not connected")]
		});
	}
	
	let args = options.getString("time", true);
	let player;
	if(client.manager)
	player = client.createPlayer(interaction.channel, channel);
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
	
	if (!player) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("**There's nothing playing in the queue**")
			], 
			ephemeral: true 
		});
	}
	
	if (!interaction.member.voice.channel) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("**You must be in a voice channel to use this command.**")
			], 
			ephemeral: true 
		});
	}
	
	if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor("RED")
				.setDescription("**You must be in the same voice channel as me to use this command!**")
			], 
			ephemeral: true 
		});
	}
	await interaction.deferReply();
	
	const time = ms(args);
	const position = player.position;
	const duration = player.queue.current.duration;
	
	if (time <= duration) {
		player.seek(time);
		return interaction.editReply({ 
			embeds: [
				new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription(`⏩ | **${player.queue.current.title}** has been seeked to **${ms(time)}**`)
			] 
		});
	} else {
		return interaction.editReply({ 
			embeds: [
				new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription(`Cannot seek current playing track. This may happened because seek duration has exceeded track duration`)
			] 
		});
	}
});

module.exports = command;