const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "kick",
	category: "mod",
	usage: "/kick <user> <reason?>",
	description: "Kick user from the discord server",
	options: [
		{
			name: 'user',
			type: 6, // "USER"
			description: 'User you want to kick',
			required: true,
		},
		{
			name: 'reason',
			type: 3, // "STRING"
			description: "Reason for kicking",
			required: false,
		},
	],
	permissions: ["KICK_MEMBERS"],
	ownerOnly: false,
	run: async (client, interaction, options) => {
		const user = interaction.options.getUser("user");
		const reason = interaction.options.getString("reason") || "No reason provided";

		if (user.id === interaction.user.id)
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("You can't kick yourself"),
				],
				ephemeral: true,
			});

		if (user.id === client.user.id)
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("You can't kick me"),
				],
				ephemeral: true,
			});

		if (user.id === interaction.guild.ownerId)
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("You can't kick the server owner"),
				],
				ephemeral: true,
			});

		if (interaction.member.roles.highest.position <= interaction.guild.members.cache.get(user.id).roles.highest.position)
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("You can't kick a member who has a higher or equal role than you"),
				],
				ephemeral: true,
			});

		if (!interaction.guild.members.cache.get(user.id).kickable)
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("I can't kick this user"),
				],
				ephemeral: true,
			});

		await interaction.deferReply();

		interaction.guild.members.cache.get(user.id).kick
			({ reason: reason })
			.then(() => {
				interaction.editReply({
					embeds: [new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription(`**${user.tag}** has been kicked`),
					],
				});
			})
			.catch((err) => {
				interaction.editReply({
					embeds: [new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription("Something went wrong"),
					],
				});
			});
	},
};
