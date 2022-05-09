const {
	MessageEmbed, 
	MessageActionRow, 
	MessageSelectMenu 
} = require("discord.js");
const fs = require("fs");
const LoadCommands = require("../../util/loadCommands");


module.exports = {
	name: "help",
	usage: '/help <command>',
	options: [
		{
			type: 3, // "STRING"
			name: 'command',
			description: 'What command do you want to view',
			required: false,
			autocomplete: true,
		}
	],
	autocompleteOptions: () => LoadCommands().then((cmds) => {
		return cmds.slash.map(cmd => {
			return { name: cmd.name, value: cmd.name }
		});
	}),
	category: "misc",
	description: "Return all commands, or one specific command!",
	ownerOnly: false,
	run: async (client, interaction) => {
		const commandArg = interaction.options.getString("command");
		if (commandArg && !client.slash.has(commandArg)) {
			return interaction.reply({ 
				embeds: [new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle("Are you sure you wrote that correctly?")
				.setDescription("No command by that name exists\nUse `/help` to get a full list of the commands")],
				ephemeral: true
			})
		} else if (client.slash.has(commandArg)) {
			return interaction.reply({ 
				embeds: [new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(commandArg)
				.setDescription(`${(client.slash.get(commandArg).ownerOnly ? "**(Owner Only)**" : "")}\n**Description:**\n${client.slash.get(commandArg).description}\n${(client.slash.get(commandArg).usage ? "**Usage:**\n" + client.slash.get(commandArg).usage : "")}`)
				.setFooter({ text: "For a more complete list of the available commands use `/help` without any arguments."})]
			})
		}
		const filter = i => {i.deferUpdate();
			return i.user.id === interaction.user.id && i.isSelectMenu();
		};
		await interaction.deferReply().catch((_) => {});
		let initialEmbed = new MessageEmbed()
		.setTitle("Slash Commands")
		.setDescription("Here's a basic list of all the commands to orient yourself on the functionalities of the bot:")
		.setColor(client.config.embedColor);
		let helpMenuActionRow = new MessageActionRow();
		let helpSelectMenu = new MessageSelectMenu()
		.setCustomId("helpSelectMenu")
		.setPlaceholder("No Category Selected")
		.addOptions([{label: "Commands Overview", value: "overview"}]);
		let categoryDir = fs.readdirSync("./commands");
		for (const category of categoryDir) {
			let commands = fs.readdirSync(`./commands/${category}`);
			if(commands.length) {
				commands.forEach((command, index) => {
					commands[index] = "`/" + command.split(".")[0] + "`";
				});
				initialEmbed.addField(category.charAt(0).toUpperCase() + category.substring(1).toLowerCase(), commands.toString().replace(/,/g, ", "));
				helpSelectMenu.addOptions([
					{
						label: `${category.charAt(0).toUpperCase() + category.substring(1).toLowerCase()} commands`,
						value: category
					}
				]);
			}
		}
		helpMenuActionRow.addComponents(helpSelectMenu);
		
		const menuSelectEmbed = await interaction.editReply({ embeds: [initialEmbed], components: [helpMenuActionRow] });
		const collector = menuSelectEmbed.createMessageComponentCollector({ filter, componentType: "SELECT_MENU" });
	
		collector.on("collect", async (category) => {
			category = category.values[0];
			let helpCategoryEmbed = new MessageEmbed();
			if(category === "overview") {
				helpCategoryEmbed = initialEmbed;
			} else {
				const commandFiles = fs
				.readdirSync(`./commands/${category}`)
				.filter((file) => file.endsWith(".js"));
				if(!commandFiles.length) {
					return interaction.editReply({ embeds: [new MessageEmbed()
					.setDescription(`No commands found for ${category} category...
					Please select something else.`)] });
				}
				helpCategoryEmbed
				.setColor(client.config.embedColor)
				.setTitle(`${category.charAt(0).toUpperCase() + category.substring(1).toLowerCase()} Commands`);

				for (let command of commandFiles) {
					command = command.split(".")[0];
					helpCategoryEmbed.addField(`${command}`, client.slash.get(command).description);
				}
			}
		
			await interaction.editReply({ embeds: [helpCategoryEmbed] });
		});
	}
};