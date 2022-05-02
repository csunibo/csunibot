module.exports = () => {
	return new Promise((re, rj) => {
		try {
			const config = require("../config");
			re(config);
		} catch {
			rj("No config file found.");
		}
	});
};
