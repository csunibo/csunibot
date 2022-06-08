const { SlashCommandBuilder } = require("@discordjs/builders");
// https://discordjs.guide/popular-topics/builders.html#slash-command-builders

// Extending the main discord.js slash command builder class to facilitate the
// construction of commands using methods instead of properties
class SlashCommand extends SlashCommandBuilder {
	constructor() {
		super();
		this.type = 1; // "CHAT_INPUT"
		return this;
	}
	
	// sets the `run:` property of the command using a method
	setRun(callback) {
		this.run = callback;
		return this;
	}

	// sets a command to be owner accessible only
	setOwnerOnly() {
		this.ownerOnly = true;
		return this;
	}
}

module.exports = SlashCommand;