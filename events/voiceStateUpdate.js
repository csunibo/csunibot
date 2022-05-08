const { MessageEmbed } = require('discord.js');

//node_modules\discord.js\src\structures\VoiceState.js
//node_modules\discord.js\typings\index.d.ts:3968
// @voiceStateUpdate: [oldState: VoiceState, newState: VoiceState];
module.exports = async (client, oldState, newState) => {
	let guildId = newState.guild.id;

	//Checks if the music manager is setup correctly in order to use it's update functions
	if(client.manager) {
		//gets player for the guild where the new voiceStateUpdate happened
		const player = client.manager.get(guildId);
		
		// check if the bot is active
		if (!player || player.state !== "CONNECTED") return;
		
		const stateChange = {};
		// get the state changes
		if (oldState.channel === null && newState.channel !== null)
		stateChange.type = "JOIN";
		if (oldState.channel !== null && newState.channel === null)
		stateChange.type = "LEAVE";
		if (oldState.channel !== null && newState.channel !== null)
		stateChange.type = "MOVE";
		if (oldState.channel === null && newState.channel === null) return;
		if (newState.serverMute == true && oldState.serverMute == false && newState.id === client.config.clientId)
		return player.pause(true);
		if (newState.serverMute == false && oldState.serverMute == true && newState.id === client.config.clientId)
		return player.pause(false);
		// move check first as it changes type
		if (stateChange.type === "MOVE") {
			if (oldState.channel.id === player.voiceChannel) stateChange.type = "LEAVE";
			if (newState.channel.id === player.voiceChannel) stateChange.type = "JOIN";
		}
		// double triggered for MOVE events
		if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
		if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;
		
		if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel)
		return;
		
		stateChange.members = stateChange.channel.members.filter((member) => !member.user.bot);
		
		switch (stateChange.type) {
			case "JOIN":
			if (client.config.alwaysplay === false) {
				if (stateChange.members.size === 1 && player.paused) {
					let playerResumed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Resumed!`, client.config.iconURL)
					.setFooter({ text: `The current song has been resumed.` });
					await client.channels.cache
					.get(player.textChannel)
					.send({ embeds: [playerResumed] });
					
					let playerPlaying = await client.channels.cache
					.get(player.textChannel)
					.send({embeds: [player.nowPlayingMessage.embeds[0]] });
					player.setNowplayingMessage(playerPlaying);
					player.pause(false);
				}
			}
			break;
			case "LEAVE":
			if (client.config.alwaysplay === false) {
				if (stateChange.members.size === 0 && !player.paused && player.playing) {
					player.pause(true);
					
					let playerPaused = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Paused!`, client.config.iconURL)
					.setFooter({text: `The current song has been paused because theres no one in the voice channel.`});
					await client.channels.cache
					.get(player.textChannel)
					.send({ embeds: [playerPaused] });
				}
			}
			break;
		}
	}
};