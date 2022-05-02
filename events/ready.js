module.exports = (client) => {
	client.manager.init(client.user.id);
	client.user.setPresence(client.config.presence);
	client.log("Successfully logged in as " + client.user.tag);
};