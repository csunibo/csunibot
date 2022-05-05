// Allows for .env files to be imported and used
require('dotenv').config()

// Allows for other files to see all the properties in this module
module.exports = {
	ownerID: ["AdminID"], //Admin of the bot
	token: process.env.TOKEN || "", //Bot's Token
	clientId: process.env.CLIENTID || "", //ID of the bot
	clientSecret: process.env.CLIENTSECRET || "", //Client Secret of the bot
	scopes: ["bot", "applications.commands"],
	serverDeafen: true,
	defaultVolume: 100, 
	permissions: 8, // 8 = Administrator
	disconnectTime: 30000, // If nothing is playing wait : in milliseconds
	alwaysplay: false, // ignore presence of members in voice channels
	debug: true,
	// Lavalink server; optional public lavalink -> https://lavalink-list.darrennathanael.com/
	nodes: [
		{
			//Or host one yourself -> https://github.com/freyacodes/Lavalink 
			//--> https://github.com/melike2d/lavalink
			//--> https://darrennathanael.com/post/how-to-lavalink/
			identifier: "Lavalink 1", // log id string
			host: "lavalink.darrenofficial.com",
			port: 80,
			password: "password",
			retryAmount: 15, // for lavalink connection attempts
			retryDelay: 6000, // Delay between reconnect attempts if connection is lost.
			secure: false, // if SSL lavalink
		},
	],
	embedColor: "RANDOM", //Color of the embeds (can also be hex)
	presence: {
		//PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
		status: "online", // online, idle, dnd, invisible
		activities: [
			{
				name: "Computer science documentaries", //Status Text
				type: "WATCHING", // PLAYING, WATCHING, LISTENING, STREAMING
			},
		],
	},
	iconURL: "", //This icon will be in every embed's author field
};