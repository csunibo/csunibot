const fuzzysort = require('fuzzysort')
const { getPosition, levDistance } = require('../util/stringUtil');

// Defines whenever a "interactionCreate" event is fired, basically whenever a user writes a slash command in 
// a server in which the bot is present

// node_modules\discord.js\typings\index.d.ts:3971
// @interactionCreate: [interaction: Interaction];
// This module checks some properties of the command and determines if it should be ran for that user or not
module.exports = async (client, interaction) => {
	
	// Autocomplete handler, takes autocomplete options specified in the command properties 
	// and shows them to the user
	// node_modules\discord.js\src\structures\AutocompleteInteraction.js
	if (interaction.isAutocomplete()) {
		let input = interaction.options.getFocused() || " ";
		// Gets the autocomplete options provided by the command
		let options = await client.slash.get(interaction.commandName).autocompleteOptions(input);
		
		// This should make the algorithm faster by pre preparing the array, but no noticable changes
		// options.forEach(option => option.filePrepared = fuzzysort.prepare(option.name)); 
		// options.map(option => option.filePrepared);

		fuzzysort.go(input, options, {
			threshold: -100, // Don't return matches worse than this (higher is faster)
			limit: 24, // Don't return more results than this (lower is faster)
			all: false, // If true, returns all results for an empty search
		  
			key: 'name', // For when targets are objects (see its example usage)
			// keys: null, // For when targets are objects (see its example usage)
			// scoreFn: null, // For use with `keys` (see its example usage)
		})
		
		// Avoiding calculating levenshteing distances if it's not needed
		if (options.length > 1) {
			// Assigns Levenshtein distances for each option based on what the user is currently typing
			for (let option of options) { // I use '⟨⟨' and '⟩⟩' to delimit some "additional information" for options, 
				// which shouldn't be looked at in the search, so I only base the levenshtein distanc on everything
				// before those characters
				option.levenshteinDistance = levDistance(option.name.substring(0, getPosition(option.name, '⟨')), input);
			}
			// Sorts the array of options and displays it according to the Levenshtein distance from the typed value
			options.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance)
		}

		interaction.respond(options.slice(0, 24));
	}
	
	// Gets general info from a command during execution, if sent then check the guards
	// run only if everything is valid
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