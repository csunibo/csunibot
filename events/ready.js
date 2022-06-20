// this fires once on the bot being launched, initializes the music client on the client ID, sets the presence for the bot

// @ready: [client: Client<true>];
module.exports = (client) => {
	if(client.manager)
	client.manager.init(client.user.id);

	const activities = client.config.presence.activities;
	setInterval(() => {
		const index = Math.floor(Math.random() * (activities.length - 1));
		client.user.setActivity({
			name: activities[index].name, 
			type: activities[index].type
		});
	}, 10000);
	client.log("Successfully logged in as " + client.user.tag);
};