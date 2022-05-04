const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const load = require("lodash");
const fetch = require("node-fetch");

const command = new SlashCommand()
.setName("lyrics")
.setDescription("Prints the lyrics of a song")
// get user input
.addStringOption((option) =>
option
.setName("song")
.setDescription("The song to get lyrics for")
.setRequired(false)
)
.setRun(async (client, interaction, options) => {
	await interaction.reply({
		embeds: [new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription(":mag_right: **Searching...**")
		],
	});
	
	const args = interaction.options.getString("song");
	
	let player;
	if (client.manager) player = client.manager.players.get(interaction.guild.id); 
else 
return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription("Lavalink node is not connected")] });
	
	if (!args && !player)
	return interaction.editReply({
		embeds: [client.ErrorEmbed("**There's nothing playing**")],
	});
	
	let search = args ? args : player.queue.current.title;
	// Lavalink api for lyrics
	let url = `https://api.darrennathanael.com/lyrics?song=${search}`;
	
	let lyrics = await fetch(url).then((res) => res.json());
	// If the status is not ok return
	if (lyrics.response !== 200) {
		return interaction.editReply({ embeds: [new MessageEmbed()
			.setColor("RED")
			.setDescription(`❌ | No lyrics found for ${search}!`)]
		});
	}
	
	let text = lyrics.lyrics;
	let lyricsEmbed = new MessageEmbed()
	.setColor(client.config.embedColor)
	.setTitle(`${lyrics.full_title}`)
	.setURL(lyrics.url)
	.setThumbnail(lyrics.thumbnail)
	.setDescription(text);
	
	if(text.length > 4096){
		text = text.substring(0, 4090) + '[...]';
		lyricsEmbed
		.setDescription(text)
		.setFooter({text: "Truncated, the lyrics were too long."});
	}
	
	return interaction.editReply({ embeds: [lyricsEmbed] });
});

module.exports = command;