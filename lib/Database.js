const Sequelize = require('sequelize');

// Database connection and initialization
// https://discordjs.guide/sequelize/#storing-data-with-sequelize
module.exports = (client) => {

	client.warn("Loading Database...");

	return new Sequelize(client.denom, client.config.dbUser, client.config.dbPass, {
		host: 'localhost',
		dialect: 'sqlite',
		logging: client.config.devDebug ? (...log) => client.debug(log) : false,
		storage: '../database.sqlite',
	});
}