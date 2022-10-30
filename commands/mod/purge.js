const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "purge",
	category: "utility",
	usage: "/purge <#of messages> <user?>",
	description: "Bulk delete messages in the channel",
	options: [
		{
			name: 'amount',
			type: 4, // "INTEGER"
			description: 'Amount of message you want to delete. Available amount: 1-100',
			required: true,
		},
		{
			name: 'user',
			type: 6, // "USER"
			description: "Delete messages from a user",
			required: false,
		},
	],
	permissions: ["MANAGE_MESSAGES"],
	ownerOnly: false,
	run: async (client, interaction, options) => {
		const amount = interaction.options.getInteger("amount");
		const target = interaction.options.getUser("user");

		if (amount > 100)
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("The maximum amount of messages you can delete is **100**"),
				],
				ephemeral: true,
			});

		if (amount < 1)
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("The minimum amount of messages you can delete is **1**"),
				],
				ephemeral: true,
			});

		await interaction.deferReply();

		if (target) {
			let i = 0;
			const filtered = [];
			const Message = await interaction.channel.messages.fetch();
			(await Message).filter((m) => {
				if (m.author.id === target.id && amount > i) {
					filtered.push(m);
					i++;
				}
			});

			interaction.channel.bulkDelete(filtered, true).then((messages) => {
				return interaction.editReply({
					embeds: [new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription(`Purged ${amount} messages sent by ${target.username}`),
					],
				});
			});
		} else {
			interaction.channel.bulkDelete(amount, true).then((messages) => {
				return;
			});
		}
	}
}