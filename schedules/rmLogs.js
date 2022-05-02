const cron = require('cron');
const fs = require('fs');
const path = require('path');
const Logger = require("../lib/Logger");

module.exports = (client) => {
	const rmLogsSchedule = new cron.CronJob('0 0 * * 0', () => {
		let d = new Date();
		// Relative Path: "../logs.log"
		const logsPath = path.join(__dirname, "..", "logs.log");
		fs.unlink(logsPath, err => {
			if (err) throw err;
			client.logger = new Logger(path.join(logsPath));
			client.logger.info("'logs.log' has been purged");
		});
	});
	rmLogsSchedule.start()
};