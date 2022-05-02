module.exports = {
	ownerID: ["AdminID"], //Admin of the bot
	token: process.env.token || "", //Bot's Token
	clientId: process.env.clientId || "", //ID of the bot
	clientSecret: process.env.clientSecret || "", //Client Secret of the bot
	scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
	serverDeafen: true, //If you want bot to stay deafened
	defaultVolume: 100, //Sets the default volume of the bot, You can change this number anywhere from 1 to 100
	permissions: 8, //Bot Inviting Permissions
	disconnectTime: 30000, //How long should the bot wait before disconnecting from the voice channel. in miliseconds. set to 1 for instant disconnect.
	alwaysplay: false, // when set to true music will always play no matter if theres no one in voice channel.
	debug: false, //Debug mode
	// Lavalink server; optional public lavalink -> https://lavalink-list.darrennathanael.com/
	nodes: [
		{
			//Or host one yourself -> https://github.com/freyacodes/Lavalink
			identifier: "Lavalink Connection Stable", // Used for indentifier in stats commands.
			host: "",
			port: 0,
			password: "password",
			retryAmount: 15, // The amount of times to retry connecting to the node if connection got dropped.
			retryDelay: 6000, // Delay between reconnect attempts if connection is lost.
			secure: false, // Can be either true or false. Only use true if ssl is enabled!
		},
	],
	embedColor: "RANDOM", //Color of the embeds, hex supported
	presence: {
		//PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
		status: "online", // You can have online, idle, and dnd(invisible too but it make people think the bot is offline)
		activities: [
			{
				name: "Computer science documentaries", //Status Text
				type: "WATCHING", // PLAYING, WATCHING, LISTENING, STREAMING
			},
		],
	},
	iconURL: "", //This icon will be in every embed's author field
};