// this fires once on the bot being launched, initializes all the main client constructors

// @ready: [client: Client<true>];
module.exports = (client) => {
	if(client.manager)
	client.manager.init(client.user.id);
	client.user.setPresence(client.config.presence);
	client.log("Successfully logged in as " + client.user.tag);
};