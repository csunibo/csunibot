"use strict";

/*
UNUSED EVENTS
[
	'applicationCommandCreate',
	'applicationCommandDelete',
	'applicationCommandUpdate',
	'guildCreate',
	'guildDelete',
	'guildUpdate',
	'guildUnavailable',
	'guildMemberAdd',
	'guildMemberRemove',
	'guildMemberUpdate',
	'guildMemberAvailable',
	'guildMembersChunk',
	'guildIntegrationsUpdate',
	'roleCreate',
	'roleDelete',
	'inviteCreate',
	'inviteDelete',
	'roleUpdate',
	'voiceServerUpdate',
	'guildBanAdd',
	'guildBanRemove',
	'channelCreate',
	'channelDelete',
	'channelUpdate',
	'channelPinsUpdate',
	'messageCreate',
	'messageDelete',
	'messageUpdate',
	'messageDeleteBulk',
	'messageReactionAdd',
	'messageReactionRemove',
	'messageReactionRemoveAll',
	'messageReactionRemoveEmoji',
	'threadCreate',
	'threadDelete',
	'threadUpdate',
	'threadListSync',
	'threadMemberUpdate',
	'threadMembersUpdate',
	'userUpdate',
	'guildScheduledEventCreate',
	'guildScheduledEventUpdate',
	'guildScheduledEventDelete',
	'guildScheduledEventUserAdd',
	'guildScheduledEventUserRemove',
	'stageInstanceCreate',
	'stageInstanceUpdate',
	'stageInstanceDelete',
	'voiceStateUpdate',
	'presenceUpdate',
	'emojiCreate',
	'emojiDelete',
	'emojiUpdate',
	'cacheSweep',
	'raw',
	'webhookUpdate',
	'shardReconnecting',
	'shardDisconnect',
	'shardError',
	'interactionCreate',
	'typingStart',
	'stickerCreate',
	'stickerDelete',
	'stickerUpdate',
	'ready',
]
*/

/* 
await guild.fetchAuditLogs().then(audit => client.warn(JSON.stringify(audit.entries.first())))
*/

const events = [
	'warn',
	'error',
	'debug',
	'rateLimit',
	'apiRequest',
	'shardReady',
	'shardResume',
	'invalidated',
	'apiResponse',
	'invalidRequestWarning',
]

const LoadDebugListeners = (client) => {
	for (const listener of events) {
		client.on(listener, (...data) => {
			client.debug("> devDebug", listener, ...data);
		})
	}
};

module.exports = {
	LoadDebugListeners,
}