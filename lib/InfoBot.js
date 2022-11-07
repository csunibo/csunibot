const {
	Client,
	Intents,
	Collection,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const Logger = require("./Logger");
const Database = require('./Database');
const MusicClient = require("./MusicClient");
const getConfig = require("../util/getConfig");
const prettyMilliseconds = require("pretty-ms");
const getChannel = require("../util/getChannel");
const getLavalink = require("../util/getLavalink");
const { LoadDebugListeners, LoadErrorHandler } = require("../util/debug");


/**
 * The class groups some useful functions for the client in order to facilitate expandability, maintenance and manageability
 * as well as initialize the bot through it's proprietary methods
 */
class InfoBot extends Client {
	// https://discordjs.guide/popular-topics/intents.html#privileged-intents
	// https://discord.com/developers/docs/topics/gateway
	constructor(props = {
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_VOICE_STATES,
		]
	}) 
	// This is really the only thing that the DJS API needs to start and log in to
	// the bot application (with the login method in `this.build`),
	// all the other methods and functions are for commodity and EoA

	{
		super(props); //Construct
		//Get config.js properties
		getConfig().then((conf) => {
			this.config = conf;

			this.boot();
			//load "../schedules"
			this.LoadSchedules(this.config);
			//load "../commands"
			this.LoadCommands(this.config);
			//load "../events"
			this.LoadEvents(this.config);
		}).catch((err) => {
			throw Error(err);
		});
		//instantiate slash command collection
		this.slash = new Collection();
		//Initialize logger for session
		this.logger = new Logger(path.join(__dirname, "..", "logs.log"));

		this.ms = prettyMilliseconds;
		this.getChannel = getChannel;
		this.getLavalink = getLavalink;
		this.deletedMessages = new WeakSet;
	}


	//Console logging => "../logs.log"
	// Refer to `./Logger.js`
	log(text) {
		this.logger.log(text);
	}
	warn(text) {
		// A lot of commands make use of this function 
		// as to to reduce clutter it has been paired with the debug clause
		if (this.config.debug === true) this.logger.warn(text);
	}
	info(text) {
		this.logger.info(text);
	}
	error(text) {
		this.logger.error(text);
	}
	silly(text) {
		this.logger.silly(text);
	}
	debug(...args) {
		this.logger.debug(...args);
	}

	printInfo() {
		// Denomination (name) of the bot
		this.denom = `${this.config.name}/v${require("../package.json").version} (ID: ${this.config.clientId})`;
		this.config.debug ? this.error("Debug mode is [ENABLED]!") : this.log("Debug mode is [DISABLED].");
		this.config.devDebug ? this.error("Dev mode [ENABLED]!\n\t`logs.log` for inspections") : this.warn("Dev mode [DISABLED].");
		
	}
	
	// Main build function, checks for lavalink, 
	// initializes Music client and discord client, loads listeners and handlers
	boot() {
		this.warn("Booting up the bot...\n\t" + this.denom);
		
		// Prints some information about the bot
		this.printInfo();

		// Enables error listeners for inspection
		LoadErrorHandler(this);
		
		// Load debugging listeners for the DISCORD API WS
		LoadDebugListeners(this);
		
		// Initialize Database
		this.db = Database(this);
		this.info(`Loaded Database!`);
		
		// Logs the bot into the discord API application
		this.login(this.config.token);		

		//checking if all nodes are filled in correctly before passing them to the music client constructor
		//this should prevent the building process from halting if there are invalid nodes
		let nodeChecks = [];
		for (const node of this.config.nodes) {
			if (!node.host || !node.port) this.warn(node.identifier + " Is not filled in correctly");
			else nodeChecks.push(1);
		}
		// If all the checks pass (the array is filled only with `1`) then the Music client can be initialized
		if (nodeChecks.length && nodeChecks.every((status) => status === 1)) {
			this.manager = MusicClient(this);
			this.info(`Loaded Music Client!`);
		}
	}

	isMessageDeleted(message) {
		return this.deletedMessages.has(message);
	}

	markMessageAsDeleted(message) {
		this.deletedMessages.add(message);
	}

	LoadEvents(config) {
		let EventsDir = path.join(__dirname, "..", "events"); // Relative Path: "../events"
		fs.readdir(EventsDir, (err, files) => {
			if (err) { return this.error(err); }
			else
				files.forEach((file) => {
					const event = require(EventsDir + "/" + file);
					this.on(file.split(".")[0], event.bind(null, this));
					if (config.devDebug === true)
						this.log("Event Loaded: " + file.split(".")[0]);
				});
			this.info("Event listeners have been loaded.")
		});
	}

	LoadSchedules(config) {
		let SchedulesDir = path.join(__dirname, "..", "schedules"); // Relative Path: "../schedules"
		fs.readdir(SchedulesDir, (err, files) => {
			if (err) { return this.error(err); }
			else
				files.forEach((file) => {
					const schedule = require(SchedulesDir + "/" + file);
					this.once("ready", schedule.bind(null, this));
					if (config.devDebug === true)
						this.log("Schedule Loaded: " + file.split(".")[0]);
				});
			this.info("Schedules have been loaded.");
		});
	}

	LoadCommands(config) {
		let CommandsDir = fs.readdirSync("./commands") // Relative Path: "../commands"
		for (const category of CommandsDir) {
			const commandFiles = fs
				.readdirSync(`./commands/${category}`)
				.filter((file) => file.endsWith(".js"));
			for (const file of commandFiles) {
				const command = require(`../commands/${category}/${file}`);
				if (!command || !command.run || !command.name) {
					this.error(`Unable to load command: ${file} in [${category.toUpperCase()}] is not a valid command with run function or name`);
				} else {
					try {
						this.slash.set(command.name, command);
					} catch (err) {
						return this.error(err);
					}
					if (config.devDebug === true) this.log(`Slash Command Loaded: ${file} from [${category.toUpperCase()}]`);
				}
			}
		}
		this.info("Slash commands have been loaded. Waiting for bot to finish initializing...");
		// Once the Bot is finished loading all it's stuff this will push all slash commands to the application at once
		this.once("ready", async () => {
			try {
				await this.application.commands.set(this.slash);
			} catch (err) {
				return this.error(err);
			}
			this.info("Slash commands have been pushed to application");
			this.silly(this.denom + " is online!");
		});
	}

	createPlayer(textChannel, voiceChannel) {
		return this.manager.create({
			// needs to be changed to 
			// Also check for `this.manager.leastLoadNodes[]` 
			// and `Node` class for statistics `this.manager.leastXNodes[n].stats` (`NodeStats` interface)
			// Makes a set for both and compares with the lowest usage and player statistics and orders them from
			// least used to most used (globally) thus the form should be maintaned for `[0]`
			node: this.manager.leastUsedNodes[0],
			guild: textChannel.guild.id,
			voiceChannel: voiceChannel.id,
			textChannel: textChannel.id,
			selfDeafen: this.config.serverDeafen,
			volume: 100,
		});
	}
}

module.exports = InfoBot;
