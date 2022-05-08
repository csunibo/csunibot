// 4153 constant events
// (node_modules\discord.js\typings\rawDataTypes.d.ts)
module.exports = (client, data) => {
	if(client.manager)
	client.manager.updateVoiceState(data);
	else return;
};
