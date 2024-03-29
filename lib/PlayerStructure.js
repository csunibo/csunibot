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
	
	/**
	 * sets the current resume message pointer
	 * @param {Client} client 
	 * @param {Message} message 
	 * @returns pointer to the message which has just been set
	 */
	setResumeMessage(client, message) {
		if (this.pausedMessage && !client.isMessageDeleted(this.pausedMessage)) {
			this.pausedMessage.delete();
			client.markMessageAsDeleted(this.pausedMessage)
		}
		return (this.resumeMessage = message);
	}
	
	/**
	 * sets the current paused message pointer
	 * @param {Client} client 
	 * @param {Message} message 
	 * @returns pointer to the message which has just been set
	 */
	setPausedMessage(client, message) {
		if (this.resumeMessage && !client.isMessageDeleted(this.resumeMessage)) {
			this.resumeMessage.delete();
			client.markMessageAsDeleted(this.resumeMessage)
		}
		return (this.pausedMessage = message);
	}
	
	/**
	 * sets the now playing message pointer
	 * @param {Client} client 
	 * @param {Message} message 
	 * @returns pointer to the message which has just been set
	 */
	setNowplayingMessage(client, message) {
		if (this.nowPlayingMessage && !client.isMessageDeleted(this.nowPlayingMessage)) {
			this.nowPlayingMessage.delete();
			client.markMessageAsDeleted(this.nowPlayingMessage)
		}
		return (this.nowPlayingMessage = message);
	}
});