# Useful structures

## Table of contents

- [Messages](#messages)
  - [Base Message](#base-message)
  - [Message Embed](#message-embed)
- [Interactions](#interactions)
  - [Base Interaction Class](#base-interaction-class)
  - [Autocomplete Option Structure](#autocomplete-option-structure)
  - [Autocomplete Interaction](#autocomplete-interaction)
- [Events](#events)
  - [Client events with sharding](#client-events-with-sharding)
  - [Client events without sharding](#client-events-without-sharding)

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

### Client events without sharding

```js
_events: [Object: null prototype] {
	shardDisconnect: [Function (anonymous)],
	ready: [Function: bound ],
	interactionCreate: [Function: bound ] AsyncFunction,
	messageCreate: [Function: bound ] AsyncFunction,
	raw: [Function: bound ],
	voiceStateUpdate: [Function: bound ] AsyncFunction
},
```