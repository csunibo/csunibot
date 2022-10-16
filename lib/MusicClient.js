const colors = require("colors");
const { Manager } = require("erela.js"); // <---
const deezer = require("erela.js-deezer"); // <---
const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require("pretty-ms");
const spotify = require("better-erela.js-spotify").default; // <---
const { default: AppleMusic } = require("better-erela.js-apple"); // <---

require('./PlayerStructure');
/**
* https://guides.menudocs.org/topics/erelajs/updating.html
* Original Music Client Structure from -> https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5 <-
* This module makes a bunch of checks to see what is going on with the lavalink
* The `.on(...)` methods check for emitted signals from the process and act accordingly to the
* callback function on said signal, The signals caught here are from Erela.js or sub-node-modules
* https://www.npmjs.com/package/erela.js-vk
*/
module.exports = (client) => {
	let errorEmbed = new MessageEmbed()
	.setColor("RED")
	
	client.playedTracks = [];
	
	return new Manager({
		// If the lavalink allows it, these plugins (check the imports) will
		// be constructed and used by the music client (player) manager to search
		// grab and play music
		plugins: [
			new deezer(),
			new AppleMusic(),
			new spotify(),
		],
		// Gets the inserted nodes from the `config.js`
		nodes: client.config.nodes,
		// Delay between reconnect attempts if connection is lost.
		retryDelay: client.config.retryDelay,
		// for lavalink connection attempts
		retryAmount: client.config.retryAmount,
		// If the player should play automatically once something is searched up or a song in enqueued
		autoPlay: true,
		// If the player should automatically add songs to the queue after the queue has ended
		autoQueue: false,
		// This is the identification name on the lavalink for the client being created
		clientName: `InfoBot/v${require("../package.json").version} (Bot: ${client.config.clientId})`,
		// Sends data to websocket (node_modules\erela.js\typings\index.d.ts)
		send: (id, payload) => {
			let guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
	})
	// Most of the code here is pretty straight forward, If you interpret the `.on(...)` as an 
	// "If(paramater) happened along the code" and the "=>" as the reactions to this clause, you can make it out yourself
	
	//https://github.com/MenuDocs/erela.js/blob/master/src/structures/Manager.ts
	//node_modules\erela.js\dist\structures\Node.js
	.on("nodeConnect", (node) =>
	client.log(`Node: ${node.options.identifier} | Lavalink node is connected.`))
	
	.on("nodeReconnect", (node) =>
	client.warn(`Node: ${node.options.identifier} | Lavalink node is reconnecting.`))
	
	.on("nodeDestroy", (node) =>
	client.warn(`Node: ${node.options.identifier} | Lavalink node is destroyed.`))
	
	.on("nodeDisconnect", (node) =>
	client.warn(`Node: ${node.options.identifier} | Lavalink node is disconnected.`))
	
	.on("nodeError", (player, err) => {
		client.error(`Node had an error: ${JSON.stringify(err)}`);
		
		errorEmbed
		.setTitle("Node error!")
		.setDescription(`\`\`\`${err}\`\`\``)
		
		const channel = client.channels.cache
		.get(player.textChannel)
		
		if (channel)
		channel.send({ embeds: [errorEmbed] });
	})
	
	.on("trackError", (player, track, error) => {
		client.error(`Track has an error: ${JSON.stringify(error)}`);
		errorEmbed
		.setTitle(`Playback error! ${error.exception?.severity}`)
		.setDescription(`\`\`\`${error.error ? error.error : "Track not available at this moment"}\`\`\``)
		
		client.channels.cache
		.get(player.textChannel)
		.send({ embeds: [errorEmbed] });
	})
	
	.on("trackStuck", (player, track, payload) => {
		client.warn(`Track got stuck: ${JSON.stringify(payload)}`);
		errorEmbed
		.setTitle("Track error!")
		.setDescription(`\`\`\`${payload}\`\`\``)
		
		client.channels.cache
		.get(player.textChannel)
		.send({ embeds: [errorEmbed] });
	})
	
	.on("playerMove", (player, oldChannel, newChannel) => {
		const guild = client.guilds.cache.get(player.guild);
		if (!guild) return;
		const channel = guild.channels.cache.get(player.textChannel);
		if (oldChannel === newChannel) return;
		if (newChannel === null || !newChannel) {
			if (!player) return;
			if (channel)
			channel.send({
				embeds: [
					new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(`Disconnected from <#${oldChannel}>`),
				],
			});
			return player.destroy();
		} else {
			player.voiceChannel = newChannel;
			setTimeout(() => player.pause(false), 1000);
			return undefined;
		}
	})
	
	.on("playerCreate", (player) =>
	client.warn(`Player: ${player.options.guild} | A music player has been created in ${client.guilds.cache.get(player.options.guild) ? client.guilds.cache.get(player.options.guild).name : "a guild"}`))
	
	.on("playerDestroy", (player) =>
	client.warn(`Player: ${player.options.guild} | A music player has been destroyed in ${client.guilds.cache.get(player.options.guild) ? client.guilds.cache.get(player.options.guild).name : "a guild"}`))
	
	.on("loadFailed", (node, type, error) =>
	client.warn(`Node: ${node.options.identifier} | Failed to load ${type}: ${error.message}`))
	
	.on("trackStart", async (player, track) => {
		let playedTracks = client.playedTracks;
		if (playedTracks.length >= client.config.nonRepeatingSongsThreshold)
		playedTracks.shift();
		if (!playedTracks.includes(track))
		playedTracks.push(track);

		let activeProperties = [
			player.get("autoQueue") ? "autoqueue" : null,
			player.get("twentyFourSeven") ? "24/7" : null,
		]
		
		let trackStartedEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({ name: "Now playing", iconURL: client.config.iconURL })
		.setDescription(`[${track.title}](${track.uri})`)
		.addField("Requested by", `${track.requester}`, true)
		.addField("Duration", track.isStream ? `\`LIVE\`` : `\`${prettyMilliseconds(track.duration, {secondsDecimalDigits: 0,})}\``, true)
		.setFooter({ text: `${activeProperties.filter(e=>e).join(" • ")}` });
		
		try {
			trackStartedEmbed.setThumbnail(track.displayThumbnail("maxresdefault"));
		} catch (err) {
			trackStartedEmbed.setThumbnail(track.thumbnail);
		}
		
		let nowPlaying = await client.channels.cache
		.get(player.textChannel)
		.send({	embeds: [trackStartedEmbed] })
		.catch(client.warn);
		
		player.setNowplayingMessage(client, nowPlaying);
		client.warn(`Player: ${player.options.guild} | Track has started playing [${colors.blue(track.title)}]`);
	})
	
	.on("queueEnd", async (player, track) => {
		const autoQueue = player.get("autoQueue");
		
		if (autoQueue) {
			const requester = player.get("requester");
			const identifier = track.identifier;
			const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
			const res = await player.search(search, requester).catch(err => console.log(err));
			let nextTrackIndex;

			const identifierMap = client.playedTracks.map(track => track.identifier)
			res.tracks.some((track, index) => {
				nextTrackIndex = index;
				return !identifierMap.includes(track.identifier)
			})
			
			if (res.exception) {
				client.channels.cache.get(player.textChannel)
				.send({ 
					embeds: [new MessageEmbed()
						.setColor("RED")
						.setAuthor({
							name: `${res.exception.severity}`,
							iconURL: client.config.iconURL,
						})
						.setDescription(`Could not load track.\n**ERR:** ${res.exception.message}`)
					] 
				});
				return player.destroy();
			}
			
			player.play(res.tracks[nextTrackIndex]);
			player.queue.previous = track;
		} else {
			const twentyFourSeven = player.get("twentyFourSeven");

			let queueEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setAuthor({ name: `The queue has ended ${(twentyFourSeven) ? "but 24/7 is on!" : ""}`, iconURL: client.config.iconURL, })
			.setDescription(`${(twentyFourSeven) ? "The bot will not exit the VC since 24/7 mode has been enabled" : ""}`)
			.setFooter({ text: "If you wish for the queue to never end use `/autoqueue`" })
			.setTimestamp();
			
			client.channels.cache
			.get(player.textChannel)
			.send({ embeds: [queueEmbed] });
			
			try {
				if (!player.playing && !twentyFourSeven) {
					setTimeout(() => {
						if (!player.playing && player.state !== "DISCONNECTED") {
							client.channels.cache.get(player.textChannel)
							.send({ 
								embeds: [new MessageEmbed()
									.setColor(client.config.embedColor)
									.setAuthor({
										name: "Disconnected",
										iconURL: client.config.iconURL,
									})
									.setDescription(`The player has been disconnected due to inactivity.`)
								] 
							});
							player.destroy();
						} else if (player.playing) {
							client.warn(`Player: ${player.options.guild} | A new song was added during the timeout`);
						}
					}, client.config.disconnectTime);
				} else if (!player.playing && twentyFourSeven) {
					client.warn(`Player: ${player.options.guild} | Queue has ended [${colors.blue("24/7 ENABLED")}]`);
				}
			} catch (err) {
				client.error(err);
			}
		}
	});
}