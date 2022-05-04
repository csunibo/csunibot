const {
	Client,
	Intents,
	Collection,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const Logger = require("./Logger");
const MusicClient = require("./MusicClient");
const prettyMilliseconds = require("pretty-ms");
const getChannel = require("../util/getChannel");
const getLavalink = require("../util/getLavalink");
const ConfigFetcher = require("../util/getConfig");

class InfoBot extends Client {
	// https://discordjs.guide/popular-topics/intents.html#privileged-intents
	// https://discord.com/developers/docs/topics/gateway
	constructor(props = {intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
	]})
	{
		super(props); //Construct
		//Get config.js properties
		ConfigFetcher().then((conf) => {
			this.config = conf;
			this.build(); 
		}).catch((err) => {
			throw Error(err);
		});
		//Load slash command collection
		this.slash = new Collection();		
		//Initialize logger for session
		this.logger = new Logger(path.join(__dirname, "..", "logs.log"));
		
		//load "../schedules"
		this.LoadSchedules();
		//load "../commands"
		this.loadCommands();
		//load "../events"
		this.LoadEvents();
		
		this.ms = prettyMilliseconds;
		this.getChannel = getChannel;
		this.getLavalink = getLavalink;
	}
	
	
	//Console logging => "../logs.log"
	// Refer to `./Logger.js`
	log(text) {
		this.logger.log(text);
	}
	warn(text) {
		// Comment to reduce clutter in console
		this.logger.warn(text);
	}
	info(text) {
		this.logger.info(text);
	}
	error(text) {
		this.logger.error(text);
	}
	
	// Main build function, checks for lavalink, initializes Music client and discord client
	build() {
		this.warn("Started the bot...");
		// Logs the bot into the discord API application
		this.login(this.config.token);
		if (this.config.debug === true) {
			this.warn("Debug mode is enabled!");
			process.on("unhandledRejection", (error) => {
				this.error(`[FATAL] Possibly Unhandled Rejection:\nerror: ${error}\n`); 
				console.log(error);
			});
			process.on("uncaughtException", (error) => this.error(error));
		} else {
			process.on("unhandledRejection", (error) => console.log());
			process.on("uncaughtException", (error) => console.log());
		}
		//checking if all nodes are filled in correctly before passing them to the music client constructor
		//this should prevent the building process from halting if there are invalid nodes
		let nodeChecks = [];
		for (const node of this.config.nodes) {
			if(!node.host || !node.port) this.warn(node.identifier + " Is not filled in correctly");
			else nodeChecks.push(1);
		}
		if (nodeChecks.length && nodeChecks.every((status) => status === 1)) this.manager = MusicClient(this);
	}
	
	LoadEvents() {
		let EventsDir = path.join(__dirname, "..", "events"); // Relative Path: "../events"
		fs.readdir(EventsDir, (err, files) => {
			if (err) throw err;
			else
			files.forEach((file) => {
				const event = require(EventsDir + "/" + file);
				this.on(file.split(".")[0], event.bind(null, this));
				this.warn("Event Loaded: " + file.split(".")[0]);
			});
		});
	}
	
	LoadSchedules() {
		let SchedulesDir = path.join(__dirname, "..", "schedules"); // Relative Path: "../schedules"
		fs.readdir(SchedulesDir, (err, files) => {
			if (err) throw err;
			else
			files.forEach((file) => {
				const schedule = require(SchedulesDir + "/" + file);
				this.once("ready", schedule.bind(null, this));
				this.info("Schedule Loaded: " + file.split(".")[0]);
			});
		});
	}
	
	loadCommands() {
		let CommandsDir = fs.readdirSync("./commands") // Relative Path: "../commands"
		for (const category of CommandsDir) {
			const commandFiles = fs
			.readdirSync(`./commands/${category}`)
			.filter((file) => file.endsWith(".js"));
			for (const file of commandFiles) {
				const command = require(`../commands/${category}/${file}`);
				if (!command || !command.run || !command.name) {
					return this.error(`Unable to load command: ${file} does not have a valid command with run function or name`);
				}
				this.slash.set(command.name, command);
				this.log(`Slash Command Loaded: ${file} from ${category}`);
			}
		}
		this.once("ready", async() => {
			await this.application.commands.set(this.slash)
			this.info("Slash commands have been pushed to application");
		});
	}
	
	createPlayer(textChannel, voiceChannel) {
		return this.manager.create({
			guild: textChannel.guild.id,
			voiceChannel: voiceChannel.id,
			textChannel: textChannel.id,
			selfDeafen: this.config.serverDeafen,
			volume: this.config.defaultVolume,
		});
	}
}

module.exports = InfoBot;
