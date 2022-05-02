const { Structure } = require('erela.js');
const { Message } = require('discord.js');

Structure.extend("Player", (Player) => class extends Player {
	constructor(...props) {
		super(...props);
		this.twentyFourSeven = false;
	}
	
	setNowplayingMessage(message) {
		if (this.nowPlayingMessage && !this.nowPlayingMessage.deleted)
		//Message#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091
		this.nowPlayingMessage.delete();
		return (this.nowPlayingMessage = message);
	}
});