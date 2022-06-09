const { MessageEmbed } = require ('discord.js');

module.exports = {
	name: "clear-queue",
	description: "Clear the queue of songs",
	run: async (client, interaction) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) return;
		
		let player;
		if (client.manager) 
		player = client.manager.players.get(interaction.guild.id); 
		else return interaction.reply({ 
			embeds: [new MessageEmbed()
				.setColor("RED")
				.setDescription("Lavalink node is not connected")
			] 
		});
		
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
		
		if (!player.playing) {
			return interaction.reply({ 
				embeds: [
					new MessageEmbed()
					.setColor("RED")
					.setDescription("There's nothing playing.")
				], 
				ephemeral: true 
			});
		}
		
		if (!player.queue || !player.queue.length || player.queue.length === 0) {
			return interaction.reply({ 
				embeds: [
					new MessageEmbed()
					.setColor("RED")
					.setDescription("Not enough track to be cleared.")
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