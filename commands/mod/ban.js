const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
.setName("ban")
.setDescription("Bans the user from the server")
.addUserOption((option) =>
	option
		.setName("user")
		.setDescription("The user you want to ban")
		.setRequired(true)
)
.addStringOption((option) =>
	option
		.setName("reason")
		.setDescription("The reason for banning the user")
		.setRequired(true)
)
.setPermissions(["BAN_MEMBERS"])
.setRun(async (client, interaction) => {
	const user = interaction.options.getUser("user");
	const reason = interaction.options.getString("reason");
	const embed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle("Banned")
		.setDescription(`You have been banned from ${interaction.guild.name}`)
		.addField("Reason", reason)
		.setTimestamp();
	await interaction.guild.members.ban(user, { reason: reason }).then(() => {
		interaction.reply({
			embeds: [new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription(`Banned ${user}`),
			], ephemeral: true,
		});
		user.send({ embeds: [embed] }).catch((err) => {
			interaction.user.send("I was unable to send the user a DM");
		});
	});
});

module.exports = command;