// Promise based module to get and return the contents of `config.js`
module.exports = () => {
	return new Promise((re, rj) => {
		try {
			const config = require("../config");
			re(config);
		} catch {
			rj("No config file found.");
		}
	}).catch(err => {
		console.log(err);
	});
};
