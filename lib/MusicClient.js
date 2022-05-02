const colors = require("colors");
const { Manager } = require("erela.js");
const deezer = require("erela.js-deezer");
const facebook = require("erela.js-facebook");
const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require("pretty-ms");
const spotify = require("better-erela.js-spotify").default;
const { default: AppleMusic } = require("better-erela.js-apple");

require('./PlayerStructure');

module.exports = (client) => {
	return new Manager({
		plugins: [
			new deezer(),
			new AppleMusic(),
			new spotify(),
			new facebook(),
		],
		nodes: client.config.nodes,
		retryDelay: client.config.retryDelay,
		retryAmount: client.config.retryAmount,
		autoPlay: true,
		clientName: `InfoBot/v${require("../package.json").version} (Bot: ${client.config.clientId})`,
		send: (id, payload) => {
			let guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
	})
	.on("nodeConnect", (node) =>
	client.log(`Node: ${node.options.identifier} | Lavalink node is connected.`))
	.on("nodeReconnect", (node) =>
	client.warn(`Node: ${node.options.identifier} | Lavalink node is reconnecting.`))
	.on("nodeDestroy", (node) =>
	client.warn(`Node: ${node.options.identifier} | Lavalink node is destroyed.`))
	.on("nodeDisconnect", (node) =>
	client.warn(`Node: ${node.options.identifier} | Lavalink node is disconnected.`))
	.on("nodeError", (player, node, err) => {
		client.error(err);
		let errorEmbed = new MessageEmbed()
		.setColor("RED")
		.setTitle("Node error!")
		.setDescription(`\`\`\`${err.error}\`\`\``)
		client.channels.cache
		.get(player.textChannel)
		.send({ embeds: [errorEmbed] });
	})
	// on track error warn and create embed
	.on("trackError", (player, node, err) => {
		client.warn(`Track has an error: ${err.error}`);
		//console.log(err);
		let errorEmbed = new MessageEmbed()
		.setColor("RED")
		.setTitle("Playback error!")
		.setDescription(`\`\`\`${err.error}\`\`\``)
		client.channels.cache
		.get(player.textChannel)
		.send({ embeds: [errorEmbed] });
	})
	.on("trackStuck", (player, track, threshold) => {
		client.warn(`Track has an error: ${err.error}`);
		//console.log(err);
		let errorEmbed = new MessageEmbed()
		.setColor("RED")
		.setTitle("Track error!")
		.setDescription(`\`\`\`${err.error}\`\`\``)
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
				embeds: [new MessageEmbed()
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
	// on LOAD_FAILED send error message
	.on("loadFailed", (node, type, error) =>
	client.warn(`Node: ${node.options.identifier} | Failed to load ${type}: ${error.message}`))
	// on TRACK_START send message
	.on("trackStart", async (player, track) => {
		client.warn(`Player: ${player.options.guild} | Track has started playing [${colors.blue(track.title)}]`);
		
		let trackStartedEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({ name: "Now playing", iconURL: client.config.iconURL })
		.setDescription(`[${track.title}](${track.uri})` || "No Descriptions")
		.addField("Requested by", `${track.requester}`, true)
		.addField("Duration", track.isStream ? `\`LIVE\`` : `\`${prettyMilliseconds(track.duration, {colonNotation: true,})}\``, true);
		try {
			trackStartedEmbed.setThumbnail(track.displayThumbnail("maxresdefault"));
		} catch (err) {
			trackStartedEmbed.setThumbnail(track.thumbnail);
		}
		let nowPlaying = await client.channels.cache
		.get(player.textChannel)
		.send({	embeds: [trackStartedEmbed], components: [client.createController(player.options.guild)], })
		.catch(client.warn);
		player.setNowplayingMessage(nowPlaying);
	})
	.on("queueEnd", (player) => {
		client.warn(`Player: ${player.options.guild} | Queue has ended`);
		let queueEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setAuthor({ name: "The queue has ended", iconURL: client.config.iconURL, })
		.setFooter({ text: "Queue ended" })
		.setTimestamp();
		client.channels.cache
		.get(player.textChannel)
		.send({ embeds: [queueEmbed] });
		// check the config for how much time to wait before disconnecting the bot
		try {
			if (!player.playing && !player.twentyFourSeven) {
				setTimeout(() => {
					if (!player.playing && player.state !== "DISCONNECTED") {
						let disconnectedEmbed = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setAuthor({
							name: "Disconnected",
							iconURL: client.config.iconURL,
						})
						.setDescription(`The player has been disconnected due to inactivity.`);
						client.channels.cache
						.get(player.textChannel)
						.send({ embeds: [disconnectedEmbed] });
						player.destroy();
					} else if (player.playing) {
						client.warn(`Player: ${player.options.guild} | Still playing`);
					}
				}, client.config.disconnectTime);
			} else if (player.playing || player.twentyFourSeven) {
				client.warn(`Player: ${player.options.guild} | Still playing and 24/7 is active`);
			}
		} catch (err) {
			client.warn(err);
		}
	});
}