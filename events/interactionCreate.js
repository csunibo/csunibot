// Defines whenever a "interactionCreate" event is fired, basically whenever a user writes a slash command in 
// a server in which the bot is present
// This module checks some properties of the command and determines if it should be ran for that user or not
module.exports = (client, interaction) => {
	if (interaction.isCommand()) {
		const command = client.slash.get(interaction.commandName);
		if (!command || !command.run)
		return interaction.reply("Sorry the command you used doesn't have any run function");
		if (command.ownerOnly && !client.config.ownerID.includes(interaction.user.id)){
			return interaction.reply({ content: "This command is only for the bot developers!", ephemeral: true });
		}
		
		const args = [];
		for (let option of interaction.options.data) {
			if (option.type === 'SUB_COMMAND') {
				if (option.name) args.push(option.name);
				option.options?.forEach(x => {
					if (x.value) args.push(x.value);
				});
			} else if (option.value) args.push(option.value);
		}
		try {
			command.run(client, interaction, interaction.options);
		} catch (err) {
			interaction.reply({ content: err.message });
		}
	}
}