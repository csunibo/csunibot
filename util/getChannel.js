const {MessageEmbed} = require('discord.js');

// Module checks if you meet the channel requirements to use music commands
module.exports = async (client, interaction) => {
	return new Promise(async (resolve) => {
		if (!interaction.member.voice.channel) {
			await interaction.reply({
				embeds: [new MessageEmbed()
					.setColor("RED")
					.setDescription("You must be in a voice channel to use this command!"),
				],
				ephemeral: true
			});
			return resolve(false);
		}
		if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {		
			await interaction.reply({ 
				embeds: [
					new MessageEmbed()
					.setColor("RED")
					.setDescription("You must be in the same voice channel as me.")
				], 
				ephemeral: true 
			});
			return resolve(false);
		}
		if (!interaction.member.voice.channel.joinable) {
			await interaction.reply({
				embeds: [new MessageEmbed()
					.setColor("RED")
					.setDescription("I don't have enough permission to join your voice channel!"),
				],
			});
			return resolve(false);
		}
		resolve(interaction.member.voice.channel);
	});
};
