const { Structure } = require('erela.js');
// https://guides.menudocs.org/topics/erelajs/updating.html
// Original Music Client Structure from -> https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5 <-
// This sets up the player structure for erela.js and gives an extra method to work out if there have been some
// async problems with sent messages while trying to set the new playing song's message
// If you want you can try finding a method to fix the deprecated version
//Message#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091
Structure.extend("Player", (Player) => class extends Player {
	constructor(...props) {
		super(...props);
		this.twentyFourSeven = false;
	}
	
	setNowplayingMessage(message) {
		if (this.nowPlayingMessage /* && !this.nowPlayingMessage.deleted */)
		this.nowPlayingMessage.delete();
		return (this.nowPlayingMessage = message);
	}
});