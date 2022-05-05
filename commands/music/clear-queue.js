const { MessageEmbed } = require ('discord.js');

module.exports = {
	name: "clear-queue",
	description: "Clear the queue of songs",
	run: async (client, interaction) => {
		let player;
		if (client.manager) player = client.manager.players.get(interaction.guild.id); 
		else 
		return interaction.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription("Lavalink node is not connected")] });
		
		if (!player) {
			return interaction.reply({ 
				embeds: [
					new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("There's nothing playing in the queue")
				], 
				ephemeral: true 
			});
		}
		
		if (!player.playing) {
			return interaction.reply({ 
				embeds: [
					new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("There's nothing playing.")
				], 
				ephemeral: true 
			});
		}
		
		if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
			return interaction.reply({ 
				embeds: [
					new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("You must be in the same voice channel as me to use this command!")
				], 
				ephemeral: true 
			});
		}
		
		if (!player.queue || !player.queue.length || player.queue.length === 0) {
			return interaction.reply({ 
				embeds: [
					new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("Invalid, Not enough track to be cleared.")
				], 
				ephemeral: true
			});
		}
		
		player.queue.clear();
		
		return interaction.reply({ 
			embeds: [
				new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription(`✅ | **Cleared the queue!**`)
			] 
		})
	}
}