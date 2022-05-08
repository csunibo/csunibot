// Defines whenever a "interactionCreate" event is fired, basically whenever a user writes a slash command in 
// a server in which the bot is present

// Determines the Levenshtein distance between two given strings
// This could be moved in a separate util file if needed
const levDistance = (S = '', T = '') => {
	let i, j;
	const n = S.length, m = T.length;
	let L = Array(n+1).fill().map(() => Array(m+1).fill());
	for (i=0; i < n+1; i++) {
		for (j=0; j < m+1; j++) {
			if (i == 0 || j == 0) {
				L[i][j] = Math.max(i, j);
			} else {
				L[i][j] = Math.min(L[i-1][j] + 1, L[i][j-1] + 1, L[i-1][j-1] + (S.charAt(i-1) != T.charAt(j-1) ? 1 : 0));
			}
		}
	}
	return L[n][m];
}


// node_modules\discord.js\typings\index.d.ts:3971
// @interactionCreate: [interaction: Interaction];
// This module checks some properties of the command and determines if it should be ran for that user or not
module.exports = async (client, interaction) => {
	
	// Autocomplete handler, takes autocomplete options specified in the command properties 
	// and shows them to the user
	// node_modules\discord.js\src\structures\AutocompleteInteraction.js
	if (interaction.isAutocomplete()) {
		// Gets the autocomplete options provided by the command
		let options = await client.slash.get(interaction.commandName).autocompleteOptions;
		// Assigns Levenshtein distances for each option based on what the user is currently typing
		for (let option of options) {
			option.levenshteinDistance = levDistance(option.name, interaction.options._hoistedOptions[0].value);
		}
		// Sorts the array of options and displays it according to the Levenshtein distance from the typed value
		options.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance)
		interaction.respond(options);
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