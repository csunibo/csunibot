// Gets the main class constructor and executes it
// 'IT' being the builder which can be foung in `./lib/InfoBot`
//						\/\/\/\/\/\/\/\/
const InfoBot = require('./lib/InfoBot');
// Constructing the client class
const client = new InfoBot();

// This allows the bot client information to be used globally in all other files 
module.exports = client;