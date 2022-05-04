module.exports = (client, data) => {
	if(client.manager)
	client.manager.updateVoiceState(data);
	else return;
};
