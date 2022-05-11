const { MessageEmbed } = require('discord.js');

// Ew spaghetti code :barf:... 
module.exports = {
	name: "notes",
	usage: "/notes",
	category: "misc",
	description: "Prints the latest notes for the course, brought to you by the students!",
	ownerOnly: false,
	run: async (client, interaction) => {
		await interaction.reply({ 
			embeds: [ 
				new MessageEmbed()
				.setTitle('Notion')
				.setThumbnail(client.config.iconURL)
				.setColor(client.config.embedColor)
				.setDescription("__Appunti:__" + 
					"\n**[Notion dei Notion]**(https://luizo.notion.site/Notion-dei-Notion-20c37e0ee4904a9c898680378f1a50b0)" +
					"\n__Primo anno__")
				.addField("🗒️Algebra e geometria", "**[Alex]**(https://www.notion.so/Algebra-a65a99336ccc499ead0637365a3bd0cd), **[Luizo]**(https://www.notion.so/Algebra-e-geometria-00d4b98a5d974879aaf39457ede3261a)")
				.addField("🗒️Algoritmi e strutture di dati", "**[Alex]**(https://www.notion.so/Algoritmi-e-strutture-dati-70a01e43fa034859bb0c8cd6d744e6d6), **[Luizo]**(https://www.notion.so/Algoritmi-e-Strutture-di-Dati-da9a9d634c6f433cb778cdd02bead894)")
				.addField("🗒️Analisi matematica", "**[Alex]**(https://www.notion.so/Analisi-1895389f8b9a465e98f2a868fc917c53), **[es. Fabrizio]**(https://www.notion.so/Analisi-Prova-unica-ab60229e9ac5455cb69b24b3c41fd0b1)")
				.addField("🗒️Architettura degli elaboratori", "**[Luizo]**(https://heavy-baron-6c1.notion.site/Architettura-degli-Elaboratori-5ef689db90a84cd4b59ff79a4e510d03)")
				.addField("🗒️Logica", "Alex **[1]**(https://www.notion.so/Logica-logico-1adfde3168d94cc5ac461da479d113ee) e **[2]**(https://www.notion.so/Preparazione-logica-3-CFU-8bf160d661d149f9939d5a48e72edf05), **[Andrea]**(https://www.notion.so/Ripasso-bc03206bfa034bed8f3f521778a61254)")
				.addField("🗒️Programmazione", "**[Andrea]**(https://www.notion.so/Appunti-784f6703da1447028ea95a52eda74f38)")
				.addField("🗒️Primo Modulo", "**[Brian]**(https://woolly-nickel-631.notion.site/woolly-nickel-631/b3d666b2bf474e28bff7084ad79abfa3)")
				.setTimestamp()
				.setFooter({ text: "If you think something is amiss, please contact a maintainer on the official GitHub from `/source`"})
			]
		});
	},
};