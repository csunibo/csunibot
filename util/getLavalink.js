// This could also be useful to initially make the check in InfoBot.js
// checks if the lavalink nodes specified in `config.js` are valid
module.exports = async (client) => {
	if(client.manager) {
		return new Promise((resolve) => {
			for (let i = 0; i < client.manager.nodes.size; i++) {
				const node = client.manager.nodes.array()[i];
				if (node.connected) resolve(node);
			}
			resolve(undefined);
		});
	}
};
