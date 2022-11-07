const Sequelize = require('sequelize');

module.exports = (client) => {

	client.warn("Loading Database...");

	return new Sequelize(client.denom, client.config.dbUser, client.config.dbPass, {
		host: 'localhost',
		dialect: 'sqlite',
		logging: client.config.devDebug ? (...log) => client.debug(log) : false,
		storage: '../database.sqlite',
	});
}