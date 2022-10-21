// Allows for .env files to be imported and used
require('dotenv').config()

// Allows for other files to see all the properties in this module
module.exports = {
	replId: process.env.REPL_ID, //Replit container ID, used to check if `unhandledRejection` listener is needed for 429 errors
	ownerId: process.env.DEVUID || ["AdminID"], //Admin of the bot
	token: process.env.TOKEN || "", //Bot's Token
	clientId: process.env.CLIENTID || "", //ID of the bot
	clientSecret: process.env.CLIENTSECRET || "", //Client Secret of the bot
	scopes: ["bot", "applications.commands"],
	serverDeafen: true,
	permissions: 0, // 8 = Administrator, 0 = Doesn't need permissions (uses slash commands)
	disconnectTime: 30000, // If nothing is playing wait : in milliseconds
	nonRepeatingSongsThreshold: 50, // Number of songs to log in order to avoid repeating in autoqueue
	alwaysplay: false, // ignore presence of members in voice channels
	devDebug: false,
	debug: true,
	// Lavalink server; optional public lavalink -> https://lavalink-list.darrennathanael.com/
	//Or host one yourself -> https://github.com/freyacodes/Lavalink 
	//--> https://github.com/melike2d/lavalink
	//--> https://darrennathanael.com/post/how-to-lavalink/
	nodes: [
		{
            identifier: "Fallback 1",
            host: "lavalink.oops.wtf",
            port: 443,
            password: "www.freelavalink.ga",
            retryAmount: 15, 
            retryDelay: 6000,
            secure: true,
        }, 
	],
	embedColor: "RANDOM", //Color of the embeds (can also be hex)
	presence: {
		//PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
		status: "online", // online, idle, dnd, invisible
		activities: [
			{
				name: "/help", //Status Text
				type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING
			},
			{
				name: "the best music!",
				type: "LISTENING",
			},
			{
				name: "all your favorite tracks!",
				type: "PLAYING",
			},
			{
				name: "out for those in need :)",
				type: "WATCHING",
			},
			{
				name: "you study O_O",
				type: "WATCHING",
			},
		],
	},
	iconURL: "https://cdn.discordapp.com/attachments/972036024790298644/972036386322534420/logo-unibo1-1.png", //This icon will be in every embed's author field
};

/*	Constant colors 
DEFAULT: 0x000000;
WHITE: 0xffffff;
AQUA: 0x1abc9c;
GREEN: 0x57f287;
BLUE: 0x3498db;
YELLOW: 0xfee75c;
PURPLE: 0x9b59b6;
LUMINOUS_VIVID_PINK: 0xe91e63;
FUCHSIA: 0xeb459e;
GOLD: 0xf1c40f;
ORANGE: 0xe67e22;
RED: 0xed4245;
GREY: 0x95a5a6;
NAVY: 0x34495e;
DARK_AQUA: 0x11806a;
DARK_GREEN: 0x1f8b4c;
DARK_BLUE: 0x206694;
DARK_PURPLE: 0x71368a;
DARK_VIVID_PINK: 0xad1457;
DARK_GOLD: 0xc27c0e;
DARK_ORANGE: 0xa84300;
DARK_RED: 0x992d22;
DARK_GREY: 0x979c9f;
DARKER_GREY: 0x7f8c8d;
LIGHT_GREY: 0xbcc0c0;
DARK_NAVY: 0x2c3e50;
BLURPLE: 0x5865f2;
GREYPLE: 0x99aab5;
DARK_BUT_NOT_BLACK: 0x2c2f33;
NOT_QUITE_BLACK: 0x23272a;
*/