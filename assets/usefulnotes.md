# Useful structures

# Table of contents

- [Messages](#messages)
  - [Base Message](#base-message)
  - [Message Embed](#message-embed)
- [Interactions](#interactions)
  - [Base Interaction Class](#base-interaction-class)
  - [Autocomplete Option Structure](#autocomplete-option-structure)
  - [Autocomplete Interaction](#autocomplete-interaction)
- [Events](#events)
  - [Base Client Events](#base-client-events)
- [Shard Manager](#shard-manager)
  - [Base ShardingManager EventEmitter Structure](#base-shardingmanager-eventemitter-structure)
  - [Client events with sharding](#client-events-with-sharding)
- [Node structures](#node-structures)
  - [Node](#node)
  - [Node Manager](#node-manager)
  - [Node Manager Players](#node-manager-players)
- [Client](#client)
  - [Client Structure](#client-structure)

## Messages

### Base Message

```ts
class Message<Cached extends boolean = boolean> extends Base {
	private readonly _cacheType: Cached;
	private constructor(client: Client, data: RawMessageData);
	private _patch(data: RawPartialMessageData | RawMessageData): void;

	public activity: MessageActivity | null;
	public applicationId: Snowflake | null;
	public attachments: Collection<Snowflake, MessageAttachment>;
	public author: User;
	public readonly channel: If<Cached, GuildTextBasedChannel, TextBasedChannel>;
	public channelId: Snowflake;
	public readonly cleanContent: string;
	public components: MessageActionRow[];
	public content: string;
	public readonly createdAt: Date;
	public createdTimestamp: number;
	public readonly crosspostable: boolean;
	public readonly deletable: boolean;
	/** @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091 */
	public deleted: boolean;
	public readonly editable: boolean;
	public readonly editedAt: Date | null;
	public editedTimestamp: number | null;
	public embeds: MessageEmbed[];
	public groupActivityApplication: ClientApplication | null;
	public guildId: If<Cached, Snowflake>;
	public readonly guild: If<Cached, Guild>;
	public readonly hasThread: boolean;
	public id: Snowflake;
	public interaction: MessageInteraction | null;
	public readonly member: GuildMember | null;
	public mentions: MessageMentions;
	public nonce: string | number | null;
	public readonly partial: false;
	public readonly pinnable: boolean;
	public pinned: boolean;
	public reactions: ReactionManager;
	public stickers: Collection<Snowflake, Sticker>;
	public system: boolean;
	public readonly thread: ThreadChannel | null;
	public tts: boolean;
	public type: MessageType;
	public readonly url: string;
	public webhookId: Snowflake | null;
	public flags: Readonly<MessageFlags>;
	public reference: MessageReference | null;
	public awaitMessageComponent<T extends MessageComponentTypeResolvable = 'ACTION_ROW'>(
	options?: AwaitMessageCollectorOptionsParams<T, Cached>,
	): Promise<MappedInteractionTypes<Cached>[T]>;
	public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>>;
	public createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector;
	public createMessageComponentCollector<T extends MessageComponentTypeResolvable = 'ACTION_ROW'>(
	options?: MessageCollectorOptionsParams<T, Cached>,
	): InteractionCollector<MappedInteractionTypes<Cached>[T]>;
	public delete(): Promise<Message>;
	public edit(content: string | MessageEditOptions | MessagePayload): Promise<Message>;
	public equals(message: Message, rawData: unknown): boolean;
	public fetchReference(): Promise<Message>;
	public fetchWebhook(): Promise<Webhook>;
	public crosspost(): Promise<Message>;
	public fetch(force?: boolean): Promise<Message>;
	public pin(): Promise<Message>;
	public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
	public removeAttachments(): Promise<Message>;
	public reply(options: string | MessagePayload | ReplyMessageOptions): Promise<Message>;
	public resolveComponent(customId: string): MessageActionRowComponent | null;
	public startThread(options: StartThreadOptions): Promise<ThreadChannel>;
	public suppressEmbeds(suppress?: boolean): Promise<Message>;
	public toJSON(): unknown;
	public toString(): string;
	public unpin(): Promise<Message>;
	public inGuild(): this is Message<true> & this;
}
```

### Message Embed

```ts
class MessageEmbed {
	private _fieldEquals(field: EmbedField, other: EmbedField): boolean;

	public constructor(data?: MessageEmbed | MessageEmbedOptions | APIEmbed);
	public author: MessageEmbedAuthor | null;
	public color: number | null;
	public readonly createdAt: Date | null;
	public description: string | null;
	public fields: EmbedField[];
	public footer: MessageEmbedFooter | null;
	public readonly hexColor: HexColorString | null;
	public image: MessageEmbedImage | null;
	public readonly length: number;
	public provider: MessageEmbedProvider | null;
	public thumbnail: MessageEmbedThumbnail | null;
	public timestamp: number | null;
	public title: string | null;
	/** @deprecated */
	public type: string;
	public url: string | null;
	public readonly video: MessageEmbedVideo | null;
	public addField(name: string, value: string, inline?: boolean): this;
	public addFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
	public setFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
	public setAuthor(options: EmbedAuthorData | null): this;
	/** @deprecated Supply a lone object of interface {@link EmbedAuthorData} instead. */
	public setAuthor(name: string, iconURL?: string, url?: string): this;
	public setColor(color: ColorResolvable): this;
	public setDescription(description: string): this;
	public setFooter(options: EmbedFooterData | null): this;
	/** @deprecated Supply a lone object of interface {@link EmbedFooterData} instead. */
	public setFooter(text: string, iconURL?: string): this;
	public setImage(url: string): this;
	public setThumbnail(url: string): this;
	public setTimestamp(timestamp?: Date | number | null): this;
	public setTitle(title: string): this;
	public setURL(url: string): this;
	public spliceFields(index: number, deleteCount: number, ...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
	public equals(embed: MessageEmbed | APIEmbed): boolean;
	public toJSON(): APIEmbed;

	public static normalizeField(name: string, value: string, inline?: boolean): Required<EmbedFieldData>;
	public static normalizeFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): Required<EmbedFieldData>[];
}
```

## Interactions

### Base Interaction Class

```ts
class Interaction<Cached extends CacheType = CacheType> extends Base {
	// This a technique used to brand different cached types. Or else we'll get `never` errors on typeguard checks.
	private readonly _cacheType: Cached;
	protected constructor(client: Client, data: RawInteractionData);
	public applicationId: Snowflake;
	public readonly channel: CacheTypeReducer<
		Cached,
		GuildTextBasedChannel | null,
		GuildTextBasedChannel | null,
		GuildTextBasedChannel | null,
		TextBasedChannel | null
	>;
	public channelId: Snowflake | null;
	public readonly createdAt: Date;
	public readonly createdTimestamp: number;
	public readonly guild: CacheTypeReducer<Cached, Guild, null>;
	public guildId: CacheTypeReducer<Cached, Snowflake>;
	public id: Snowflake;
	public member: CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
	public readonly token: string;
	public type: InteractionType;
	public user: User;
	public version: number;
	public memberPermissions: CacheTypeReducer<Cached, Readonly<Permissions>>;
	public locale: string;
	public guildLocale: CacheTypeReducer<Cached, string, string, string>;
	public inGuild(): this is Interaction<'present'>;
	public inCachedGuild(): this is Interaction<'cached'>;
	public inRawGuild(): this is Interaction<'raw'>;
	public isApplicationCommand(): this is BaseCommandInteraction<Cached>;
	public isButton(): this is ButtonInteraction<Cached>;
	public isCommand(): this is CommandInteraction<Cached>;
	public isAutocomplete(): this is AutocompleteInteraction<Cached>;
	public isContextMenu(): this is ContextMenuInteraction<Cached>;
	public isUserContextMenu(): this is UserContextMenuInteraction<Cached>;
	public isMessageContextMenu(): this is MessageContextMenuInteraction<Cached>;
	public isMessageComponent(): this is MessageComponentInteraction<Cached>;
	public isSelectMenu(): this is SelectMenuInteraction<Cached>;
}
```

### Autocomplete Option Structure

```ts
CommandInteractionOptionResolver {
	_group: null,
	_subcommand: null,
	_hoistedOptions: [
		{
			name: 'option',
			type: 'STRING',
			value: 'typin',
			focused: true
		}
	]
}
```

### Autocomplete Interaction

```ts
class AutocompleteInteraction extends Interaction {
	constructor(client, data) {
		super(client, data);

		/**
		 * The id of the channel this interaction was sent in
		 * @type {Snowflake}
		 * @name AutocompleteInteraction#channelId
		 */

		/**
		 * The invoked application command's id
		 * @type {Snowflake}
		 */
		this.commandId = data.data.id;

		/**
		 * The invoked application command's name
		 * @type {string}
		 */
		this.commandName = data.data.name;

		/**
		 * Whether this interaction has already received a response
		 * @type {boolean}
		 */
		this.responded = false;

		/**
		 * The options passed to the command
		 * @type {CommandInteractionOptionResolver}
		 */
		this.options = new CommandInteractionOptionResolver(
			this.client,
			data.data.options?.map(option => this.transformOption(option, data.data.resolved)) ?? [],
		);
	}

	/**
	 * The invoked application command, if it was fetched before
	 * @type {?ApplicationCommand}
	 */
	get command() {
		const id = this.commandId;
		return this.guild?.commands.cache.get(id) ?? this.client.application.commands.cache.get(id) ?? null;
	}

	/**
	 * Transforms an option received from the API.
	 * @param {APIApplicationCommandOption} option The received option
	 * @returns {CommandInteractionOption}
	 * @private
	 */
	transformOption(option) {
		const result = {
			name: option.name,
			type: ApplicationCommandOptionTypes[option.type],
		};

		if ('value' in option) result.value = option.value;
		if ('options' in option) result.options = option.options.map(opt => this.transformOption(opt));
		if ('focused' in option) result.focused = option.focused;

		return result;
	}

	/**
	 * Sends results for the autocomplete of this interaction.
	 * @param {ApplicationCommandOptionChoice[]} options The options for the autocomplete
	 * @returns {Promise<void>}
	 * @example
	 * // respond to autocomplete interaction
	 * interaction.respond([
	 *	{
	 *	name: 'Option 1',
	 *	value: 'option1',
	 *	},
	 * ])
	 *	.then(console.log)
	 *	.catch(console.error);
	 */
	async respond(options) {
		if (this.responded) throw new Error('INTERACTION_ALREADY_REPLIED');

		await this.client.api.interactions(this.id, this.token).callback.post({
			data: {
				type: InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
				data: {
					choices: options,
				},
			},
			auth: false,
		});
		this.responded = true;
	}
}
```

## Events

### Base Client Events

```ts
_events: [Object: null prototype] {
	shardDisconnect: [Function (anonymous)],
	ready: [Function: bound ],
	interactionCreate: [Function: bound ] AsyncFunction,
	messageCreate: [Function: bound ] AsyncFunction,
	raw: [Function: bound ],
	voiceStateUpdate: [Function: bound ] AsyncFunction
},
```

## Shard Manager

### Base ShardingManager EventEmitter Structure

```ts
class ShardingManager extends EventEmitter {
	public constructor(file: string, options?: ShardingManagerOptions);
	private _performOnShards(method: string, args: unknown[]): Promise<unknown[]>;
	private _performOnShards(method: string, args: unknown[], shard: number): Promise<unknown>;

	public file: string;
	public respawn: boolean;
	public shardArgs: string[];
	public shards: Collection<number, Shard>;
	public token: string | null;
	public totalShards: number | 'auto';
	public shardList: number[] | 'auto';
	public broadcast(message: unknown): Promise<Shard[]>;
	public broadcastEval<T>(fn: (client: Client) => Awaitable<T>): Promise<Serialized<T>[]>;
	public broadcastEval<T>(fn: (client: Client) => Awaitable<T>, options: { shard: number }): Promise<Serialized<T>>;
	public broadcastEval<T, P>(
		fn: (client: Client, context: Serialized<P>) => Awaitable<T>,
		options: { context: P },
	): Promise<Serialized<T>[]>;
	public broadcastEval<T, P>(
		fn: (client: Client, context: Serialized<P>) => Awaitable<T>,
		options: { context: P; shard: number },
	): Promise<Serialized<T>>;
	public createShard(id: number): Shard;
	public fetchClientValues(prop: string): Promise<unknown[]>;
	public fetchClientValues(prop: string, shard: number): Promise<unknown>;
	public respawnAll(options?: MultipleShardRespawnOptions): Promise<Collection<number, Shard>>;
	public spawn(options?: MultipleShardSpawnOptions): Promise<Collection<number, Shard>>;

	public on(event: 'shardCreate', listener: (shard: Shard) => Awaitable<void>): this;

	public once(event: 'shardCreate', listener: (shard: Shard) => Awaitable<void>): this;
}
```

### Client events with sharding

```js
_events: [Object: null prototype] {
	shardDisconnect: [Function (anonymous)],
	ready: [Array],
	disconnect: [Function (anonymous)],
	reconnecting: [Function (anonymous)],
	interactionCreate: [Function: bound ] AsyncFunction,
	messageCreate: [Function: bound ] AsyncFunction,
	raw: [Function: bound ],
	voiceStateUpdate: [Function: bound ] AsyncFunction
},
```

## Node structures

### Node

```ts
Node {
	options: {
	port: 443,
	password: 'password',
	secure: true,
	retryAmount: 15,
	retryDelay: 6000,
	identifier: 'Lavalink 1',
	host: 'url'
	},
	socket: WebSocket {
	_events: [Object: null prototype] {
		open: [Function: bound open],
		close: [Function: bound close],
		message: [Function: bound message],
		error: [Function: bound error]
	},
	_eventsCount: 4,
	_maxListeners: undefined,
	_binaryType: 'nodebuffer',
	_closeCode: 1006,
	_closeFrameReceived: false,
	_closeFrameSent: false,
	_closeMessage: '',
	_closeTimer: null,
	_extensions: {},
	_protocol: '',
	_readyState: 3,
	_receiver: null,
	_sender: null,
	_socket: null,
	_bufferedAmount: 0,
	_isServer: false,
	_redirects: 0,
	_url: 'wss://url:port/',
	_req: ClientRequest {
		_events: [Object: null prototype],
		_eventsCount: 4,
		_maxListeners: undefined,
		outputData: [],
		outputSize: 0,
		writable: true,
		destroyed: true,
		_last: true,
		chunkedEncoding: false,
		shouldKeepAlive: true,
		maxRequestsOnConnectionReached: false,
		_defaultKeepAlive: true,
		useChunkedEncodingByDefault: false,
		sendDate: false,
		_removedConnection: false,
		_removedContLen: false,
		_removedTE: false,
		_contentLength: 0,
		_hasBody: true,
		_trailer: '',
		finished: true,
		_headerSent: true,
		_closed: false,
		socket: [TLSSocket],
		_header: 'GET / HTTP/1.1\r\n' +
		'Sec-WebSocket-Version: 13\r\n' +
		'Sec-WebSocket-Key: abcdefghi000000000000001\r\n' +
		'Connection: Upgrade\r\n' +
		'Upgrade: websocket\r\n' +
		'Authorization: password\r\n' +
		'Num-Shards: 1\r\n' +
		'User-Id: 000000000000000001\r\n' +
		'Client-Name: Bot/v1.0.0 (Bot: 000000000000000001)\r\n' +	 
		'Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits\r\n' +
		'Host: url\r\n' +
		'\r\n',
		_keepAliveTimeout: 0,
		_onPendingData: [Function: nop],
		agent: undefined,
		socketPath: undefined,
		method: 'GET',
		maxHeaderSize: undefined,
		insecureHTTPParser: undefined,
		path: '/',
		_ended: false,
		res: [IncomingMessage],
		aborted: true,
		timeoutCb: null,
		upgradeOrConnect: false,
		parser: [HTTPParser],
		maxHeadersCount: null,
		reusedSocket: false,
		host: 'url',
		protocol: 'https:',
		[Symbol(kCapture)]: false,
		[Symbol(kNeedDrain)]: false,
		[Symbol(corked)]: 0,
		[Symbol(kOutHeaders)]: [Object: null prototype],
		[Symbol(kError)]: undefined
	},
	[Symbol(kCapture)]: false
	},
	calls: 1,
	reconnectAttempts: 2,
	manager: Manager {
	_events: [Object: null prototype] {
		nodeConnect: [Function (anonymous)],
		nodeReconnect: [Function (anonymous)],
		nodeDestroy: [Function (anonymous)],
		nodeDisconnect: [Function (anonymous)],
		nodeError: [Function (anonymous)],
		trackError: [Function (anonymous)],
		trackStuck: [Function (anonymous)],
		playerMove: [Function (anonymous)],
		playerCreate: [Function (anonymous)],
		playerDestroy: [Function (anonymous)],
		loadFailed: [Function (anonymous)],
		trackStart: [AsyncFunction (anonymous)],
		queueEnd: [Function (anonymous)]
	},
	_eventsCount: 13,
	_maxListeners: undefined,
	players: Collection(1) [Map] { '000000000000000001' => [Player] },	
	nodes: Collection(2) [Map] {
		'Lavalink 1' => [Circular *1],
		'Lavalink 2' => [Node]
	},
	initiated: true,
	options: {
		plugins: [Array],
		nodes: [Array],
		shards: 1,
		autoPlay: true,
		clientName: 'Bot/v1.0.0 (Bot: 000000000000000001)',
		retryDelay: undefined,
		retryAmount: undefined,
		send: [Function: send],
		clientId: '000000000000000001'
	},
	search: [Function: bound search],
	[Symbol(kCapture)]: false
	},
	stats: {
	playingPlayers: 0,
	memory: {
		reservable: 1073741824,
		used: 24156016,
		free: 54487184,
		allocated: 78643200
	},
	players: 0,
	cpu: { cores: 4, systemLoad: 0, lavalinkLoad: 0.13332523091881382 },
	uptime: 155926
	},
	reconnectTimeout: Timeout {
	_idleTimeout: 6000,
	_idlePrev: null,
	_idleNext: null,
	_idleStart: 37043,
	_onTimeout: [Function (anonymous)],
	_timerArgs: undefined,
	_repeat: null,
	_destroyed: true,
	[Symbol(refed)]: true,
	[Symbol(kHasPrimitive)]: false,
	[Symbol(asyncId)]: 939,
	[Symbol(triggerId)]: 154
	}
}
```

### Node Manager

```ts
Manager {
	_events: [Object: null prototype] {
	nodeConnect: [Function (anonymous)],
	nodeReconnect: [Function (anonymous)],
	nodeDestroy: [Function (anonymous)],
	nodeDisconnect: [Function (anonymous)],
	nodeError: [Function (anonymous)],
	trackError: [Function (anonymous)],
	trackStuck: [Function (anonymous)],
	playerMove: [Function (anonymous)],
	playerCreate: [Function (anonymous)],
	playerDestroy: [Function (anonymous)],
	loadFailed: [Function (anonymous)],
	trackStart: [AsyncFunction (anonymous)],
	queueEnd: [Function (anonymous)]
	},
	_eventsCount: 13,
	_maxListeners: undefined,
	players: Collection(1) [Map] {
	'000000000000000001' => Player {
		options: [Object],
		queue: [Queue],
		trackRepeat: false,
		queueRepeat: false,
		position: 19120,
		playing: true,
		paused: false,
		voiceChannel: '000000000000000001',
		textChannel: '000000000000000001',
		state: 'CONNECTED',
		bands: [Array],
		voiceState: [Object],
		data: {},
		manager: [Circular *1],
		guild: '000000000000000001',
		node: [Node],
		volume: 100,
		twentyFourSeven: false,
		nowPlayingMessage: [Message]
	}
	},
	nodes: Collection(2) [Map] {
	'Lavalink 1' => Node {
		options: [Object],
		socket: [WebSocket],
		calls: 1,
		reconnectAttempts: 2,
		manager: [Circular *1],
		stats: [Object],
		reconnectTimeout: Timeout {
		_idleTimeout: 6000,
		_idlePrev: null,
		_idleNext: null,
		_idleStart: 37043,
		_onTimeout: [Function (anonymous)],
		_timerArgs: undefined,
		_repeat: null,
		_destroyed: true,
		[Symbol(refed)]: true,
		[Symbol(kHasPrimitive)]: false,
		[Symbol(asyncId)]: 939,
		[Symbol(triggerId)]: 154
		}
	},
	'Lavalink 2' => Node {
		options: [Object],
		socket: [WebSocket],
		calls: 0,
		reconnectAttempts: 1,
		manager: [Circular *1],
		stats: [Object]
	}
	},
	initiated: true,
	options: {
	plugins: [ [Deezer], [AppleMusic], [Spotify], [Facebook] ],
	nodes: [ [Object], [Object] ],
	shards: 1,
	autoPlay: true,
	clientName: 'Bot/v1.0.0 (Bot: 000000000000000001)',
	retryDelay: undefined,
	retryAmount: undefined,
	send: [Function: send],
	clientId: '000000000000000001'
	},
	search: [Function: bound search],
	[Symbol(kCapture)]: false
}
```

### Node Manager Players

```ts
Collection(1) [Map] {
	'000000000000000001' => Player {
	options: {
		guild: '000000000000000001',
		voiceChannel: '000000000000000001',
		textChannel: '000000000000000001',
		selfDeafen: true,
		volume: 100
	},
	queue: Queue(0) [ current: [Object], previous: null ],
	trackRepeat: false,
	queueRepeat: false,
	position: 19120,
	playing: true,
	paused: false,
	voiceChannel: '000000000000000001',
	textChannel: '000000000000000001',
	state: 'CONNECTED',
	bands: [
		0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0,
		0, 0, 0
	],
	voiceState: {
		sessionId: 'abcdefghijklmnopq000000000000001',
		op: 'voiceUpdate',
		guildId: '000000000000000001',
		event: [Object]
	},
	data: {},
	manager: Manager {
		_events: [Object: null prototype],
		_eventsCount: 13,
		_maxListeners: undefined,
		players: [Circular *1],
		nodes: [Collection [Map]],
		initiated: true,
		options: [Object],
		search: [Function: bound search],
		[Symbol(kCapture)]: false
	},
	guild: '000000000000000001',
	node: Node {
		options: [Object],
		socket: [WebSocket],
		calls: 1,
		reconnectAttempts: 2,
		manager: [Manager],
		stats: [Object],
		reconnectTimeout: Timeout {
		_idleTimeout: 6000,
		_idlePrev: null,
		_idleNext: null,
		_idleStart: 37043,
		_onTimeout: [Function (anonymous)],
		_timerArgs: undefined,
		_repeat: null,
		_destroyed: true,
		[Symbol(refed)]: true,
		[Symbol(kHasPrimitive)]: false,
		[Symbol(asyncId)]: 939,
		[Symbol(triggerId)]: 154
		}
	},
	volume: 100,
	twentyFourSeven: false,
	nowPlayingMessage: Message {
		channelId: '000000000000000001',
		guildId: '000000000000000001',
		id: '000000000000000001',
		createdTimestamp: 1653769689837,
		type: 'DEFAULT',
		system: false,
		content: '',
		author: [ClientUser],
		pinned: false,
		tts: false,
		nonce: null,
		embeds: [Array],
		components: [],
		attachments: Collection(0) [Map] {},
		stickers: Collection(0) [Map] {},
		editedTimestamp: null,
		reactions: [ReactionManager],
		mentions: [MessageMentions],
		webhookId: null,
		groupActivityApplication: null,
		applicationId: null,
		activity: null,
		flags: [MessageFlags],
		reference: null,
		interaction: null
	}
	}
}
```

## Client

### Client Structure

```ts
<ref *1> Bot {
	_events: [Object: null prototype] {
	shardDisconnect: [Function (anonymous)],
	ready: [ [Function (anonymous)], [Function: bound ] ],
	disconnect: [Function (anonymous)],
	reconnecting: [Function (anonymous)],
	interactionCreate: [Function: bound ] AsyncFunction,
	messageCreate: [Function: bound ] AsyncFunction,		
	raw: [Function: bound ],
	voiceStateUpdate: [Function: bound ] AsyncFunction	
	},
	_eventsCount: 8,
	_maxListeners: undefined,
	options: {
	intents: 641,
	waitGuildTimeout: 15000,
	shardCount: 1,
	makeCache: [Function (anonymous)],
	messageCacheLifetime: 0,
	messageSweepInterval: 0,
	invalidRequestWarningInterval: 0,
	partials: [],
	restWsBridgeTimeout: 5000,
	restRequestTimeout: 15000,
	restGlobalRateLimit: 0,
	retryLimit: 1,
	restTimeOffset: 500,
	restSweepInterval: 60,
	failIfNotExists: true,
	userAgentSuffix: [],
	presence: { status: 'online', user: [Object] },		 
	sweepers: {},
	ws: {
		large_threshold: 50,
		compress: false,
		properties: [Object],
		version: 9,
		presence: [Object]
	},
	http: {
		agent: {},
		version: 9,
		api: 'https://discord.com/api',
		cdn: 'https://cdn.discordapp.com',
		invite: 'https://discord.gg',
		template: 'https://discord.new',
		scheduledEvent: 'https://discord.com/events'			
	},
	shards: [ 0 ]
	},
	rest: RESTManager {
	client: [Circular *1],
	handlers: Collection(2) [Map] {
		'/gateway/bot' => [RequestHandler],
		'/applications/:id/commands' => [RequestHandler]	
	},
	versioned: true,
	globalLimit: Infinity,
	globalRemaining: Infinity,
	globalReset: 1654356317221,
	globalDelay: null,
	sweepInterval: Timeout {
		_idleTimeout: 60000,
		_idlePrev: [Timeout],
		_idleNext: [TimersList],
		_idleStart: 2008,
		_onTimeout: [Function (anonymous)],
		_timerArgs: undefined,
		_repeat: 60000,
		_destroyed: false,
		[Symbol(refed)]: false,
		[Symbol(kHasPrimitive)]: false,
		[Symbol(asyncId)]: 11,
		[Symbol(triggerId)]: 1
	}
	},
	_cleanups: Set(4) {
	[Function: bound ],
	[Function: bound ],
	[Function: bound ],
	[Function: bound ]
	},
	_finalizers: FinalizationRegistry {},
	ws: WebSocketManager {
	_events: [Object: null prototype] {},
	_eventsCount: 0,
	_maxListeners: undefined,
	gateway: 'wss://gateway.discord.gg/',
	totalShards: 1,
	shards: Collection(1) [Map] { 0 => [WebSocketShard] },
	status: 0,
	destroyed: false,
	reconnecting: false,
	[Symbol(kCapture)]: false
	},
	actions: ActionsManager {
	client: [Circular *1],
	ChannelCreate: ChannelCreateAction { client: [Circular *1] },
	ChannelDelete: ChannelDeleteAction { client: [Circular *1], deleted: Map(0) {} },
	ChannelUpdate: ChannelUpdateAction { client: [Circular *1] },
	GuildBanAdd: GuildBanAdd { client: [Circular *1] }, 
	GuildBanRemove: GuildBanRemove { client: [Circular *1] },
	GuildChannelsPositionUpdate: GuildChannelsPositionUpdate { client: [Circular *1] },
	GuildDelete: GuildDeleteAction { client: [Circular *1], deleted: Map(0) {} },
	GuildEmojiCreate: GuildEmojiCreateAction { client: [Circular *1] },
	GuildEmojiDelete: GuildEmojiDeleteAction { client: [Circular *1] },
	GuildEmojiUpdate: GuildEmojiUpdateAction { client: [Circular *1] },
	GuildEmojisUpdate: GuildEmojisUpdateAction { client:
 [Circular *1] },
	GuildIntegrationsUpdate: GuildIntegrationsUpdate { client: [Circular *1] },
	GuildMemberRemove: GuildMemberRemoveAction { client:
 [Circular *1] },
	GuildMemberUpdate: GuildMemberUpdateAction { client:
 [Circular *1] },
	GuildRoleCreate: GuildRoleCreate { client: [Circular *1] },
	GuildRoleDelete: GuildRoleDeleteAction { client: [Circular *1] },
	GuildRoleUpdate: GuildRoleUpdateAction { client: [Circular *1] },
	GuildRolesPositionUpdate: GuildRolesPositionUpdate { client: [Circular *1] },
	GuildScheduledEventCreate: GuildScheduledEventCreateAction { client: [Circular *1] },
	GuildScheduledEventDelete: GuildScheduledEventDeleteAction { client: [Circular *1] },
	GuildScheduledEventUpdate: GuildScheduledEventUpdateAction { client: [Circular *1] },
	GuildScheduledEventUserAdd: GuildScheduledEventUserAddAction { client: [Circular *1] },
	GuildScheduledEventUserRemove: GuildScheduledEventUserRemoveAction { client: [Circular *1] },
	GuildStickerCreate: GuildStickerCreateAction { client: [Circular *1] },
	GuildStickerDelete: GuildStickerDeleteAction { client: [Circular *1] },
	GuildStickerUpdate: GuildStickerUpdateAction { client: [Circular *1] },
	GuildStickersUpdate: GuildStickersUpdateAction { client: [Circular *1] },
	GuildUpdate: GuildUpdateAction { client: [Circular *1] },
	InteractionCreate: InteractionCreateAction { client:
 [Circular *1] },
	InviteCreate: InviteCreateAction { client: [Circular *1] },
	InviteDelete: InviteDeleteAction { client: [Circular *1] },
	MessageCreate: MessageCreateAction { client: [Circular *1] },
	MessageDelete: MessageDeleteAction { client: [Circular *1] },
	MessageDeleteBulk: MessageDeleteBulkAction { client:
 [Circular *1] },
	MessageReactionAdd: MessageReactionAdd { client: [Circular *1] },
	MessageReactionRemove: MessageReactionRemove { client: [Circular *1] },
	MessageReactionRemoveAll: MessageReactionRemoveAll { client: [Circular *1] },
	MessageReactionRemoveEmoji: MessageReactionRemoveEmoji { client: [Circular *1] },
	MessageUpdate: MessageUpdateAction { client: [Circular *1] },
	PresenceUpdate: PresenceUpdateAction { client: [Circular *1] },
	StageInstanceCreate: StageInstanceCreateAction { client: [Circular *1] },
	StageInstanceDelete: StageInstanceDeleteAction { client: [Circular *1] },
	StageInstanceUpdate: StageInstanceUpdateAction { client: [Circular *1] },
	ThreadCreate: ThreadCreateAction { client: [Circular *1] },
	ThreadDelete: ThreadDeleteAction { client: [Circular *1] },
	ThreadListSync: ThreadListSyncAction { client: [Circular *1] },
	ThreadMemberUpdate: ThreadMemberUpdateAction { client: [Circular *1] },
	ThreadMembersUpdate: ThreadMembersUpdateAction { client: [Circular *1] },
	TypingStart: TypingStart { client: [Circular *1] }, 
	UserUpdate: UserUpdateAction { client: [Circular *1] },
	VoiceStateUpdate: VoiceStateUpdate { client: [Circular *1] },
	WebhooksUpdate: WebhooksUpdate { client: [Circular *1] }
	},
	voice: ClientVoiceManager { adapters: Map(0) {} },		
	shard: ShardClientUtil {
	client: [Circular *1],
	mode: 'process',
	parentPort: null
	},
	users: UserManager {},
	guilds: GuildManager {},
	channels: ChannelManager {},
	sweepers: Sweepers {
	options: {},
	intervals: {
		applicationCommands: null,
		bans: null,
		emojis: null,
		invites: null,
		guildMembers: null,
		messages: null,
		presences: null,
		reactions: null,
		stageInstances: null,
		stickers: null,
		threadMembers: null,
		threads: null,
		users: null,
		voiceStates: null
	}
	},
	presence: ClientPresence {
	userId: null,
	guild: null,
	status: 'online',
	activities: [ [Activity] ],
	clientStatus: null
	},
	user: ClientUser {
	id: '000000000000000001',
	bot: true,
	system: false,
	flags: null,
	username: 'username',
	discriminator: '0001',
	avatar: 'avatar',
	banner: undefined,
	accentColor: undefined,
	verified: true,
	mfaEnabled: true
	},
	application: ClientApplication {
	id: '000000000000000001',
	name: null,
	description: null,
	icon: null,
	flags: ApplicationFlags { bitfield: 2916352 },			
	cover: null,
	rpcOrigins: [],
	botRequireCodeGrant: null,
	botPublic: null,
	owner: null,
	commands: ApplicationCommandManager {
		permissions: [ApplicationCommandPermissionsManager]
	}
	},
	readyAt: 2022-06-04T15:25:16.184Z,
	slash: Collection(/* Number of Commands */ 2) [Map] {
	'command' => {
		name: 'command',
		usage: '/command <command>',
		options: [Array],
		autocompleteOptions: [Function: autocompleteOptions],
		category: 'category',
		description: 'command description',
		property: prototype.property,
		run: [AsyncFunction: run]
	},
	'command2' => {
		name: 'command2',
		usage: '/command2 <command>',
		options: [Array],
		autocompleteOptions: [Function: autocompleteOptions],
		category: 'category',
		description: 'command description',
		property: prototype.property,
		run: [AsyncFunction: run]
	},
	},
	logger: Logger {
	logger: DerivedLogger {
		_readableState: [ReadableState],
		readable: true,
		_events: [Object: null prototype],
		_eventsCount: 3,
		_maxListeners: undefined,
		_writableState: [WritableState],
		writable: true,
		allowHalfOpen: true,
		_transformState: [Object],
		silent: undefined,
		format: [Format],
		defaultMeta: null,
		levels: [Object],
		level: 'info',
		exceptions: [ExceptionHandler],
		rejections: [RejectionHandler],
		profilers: {},
		exitOnError: true,
		[Symbol(kCapture)]: false
	}
	},
	ms: [Function (anonymous)],
	getChannel: [AsyncFunction (anonymous)],
	getLavalink: [AsyncFunction (anonymous)],
	config: {
	ownerID: '000000000000000001',
	token: 'TOKEN',
	serverDeafen: true,
	defaultVolume: 100,
	permissions: 0,
	disconnectTime: 30000,
	alwaysplay: false,
	debug: true,
	nodes: [ [Object], [Object], [Object] ],
	embedColor: 'RANDOM',
	presence: { status: 'online', activities: [Array] },
	iconURL: 'iconURL'
	},
	manager: Manager {
	_events: [Object: null prototype] {
		nodeConnect: [Function (anonymous)],
		nodeReconnect: [Function (anonymous)],
		nodeDestroy: [Function (anonymous)],
		nodeDisconnect: [Function (anonymous)],
		nodeError: [Function (anonymous)],
		trackError: [Function (anonymous)],
		trackStuck: [Function (anonymous)],
		playerMove: [Function (anonymous)],
		playerCreate: [Function (anonymous)],
		playerDestroy: [Function (anonymous)],
		loadFailed: [Function (anonymous)],
		trackStart: [AsyncFunction (anonymous)],
		queueEnd: [Function (anonymous)]
	},
	_eventsCount: 13,
	_maxListeners: undefined,
	players: Collection(0) [Map] {},
	nodes: Collection(3) [Map] {
		'Lavalink 1' => [Node],
		'Lavaliin 2' => [Node],
		'Lavalink 3' => [Node]
	},
	initiated: true,
	options: {
		plugins: [Array],
		nodes: [Array],
		shards: 1,
		autoPlay: true,
		clientName: 'Bot/v1.0.0 (Bot: 000000000000000001)',
		retryDelay: undefined,
		retryAmount: undefined,
		send: [Function: send],
		clientId: '000000000000000001'
	},
	search: [Function: bound search],
	[Symbol(kCapture)]: false
	},
	[Symbol(kCapture)]: false
}
```