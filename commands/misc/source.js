const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "source",
	usage: "/source",
	category: "misc",
	description: "Get the source code for the bot!!",
	ownerOnly: false,
	run: async (client, interaction) => {
		await interaction.reply({ 
			embeds: [ 
				new MessageEmbed()
				.setTitle('Here are some useful links!!')
				.setThumbnail(client.config.iconURL)
				.setColor(client.config.embedColor)
				.setDescription("This bot is supposed to be a public project, allowing those who are interested to easily learn js while doing something fun!" +
				"\nAll contributors are heartily welcomed and appreciated! Suggestions keep the project going, so be sure to report anything you would like to be seen added to the bot!")
				.addField("GitHub", "[**Check out the GitHub repo**](https://github.com/csunibo/csunibot#readme)" + 
				"\nBe sure to leave a star if you like it or find it useful!")
				.setTimestamp()
			] 
		});
	},
};