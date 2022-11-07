const Sequelize = require('sequelize');

// More research needs to be done but the premise of using
// Sequelize is to allow for the user to use and sync with any database
// service and provider, with their dialects of choice
// giving them all the liberty they want. 
// This is a good start but I'm not sure if it's
// the best way to do it, since IDK if sequelize actually works as
// a local DB

// Database connection and initialization
// https://discordjs.guide/sequelize/#storing-data-with-sequelize
module.exports = (client) => {

	client.warn("Loading Database...");

	return new Sequelize(client.denom, client.config.dbUser, client.config.dbPass, {
		host: 'localhost',
		dialect: 'sqlite',
		logging: client.config.devDebug ? (...log) => client.debug(log) : false,
		storage: client.config.dbUser,
	});
}