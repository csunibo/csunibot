const cron = require('cron');
const fs = require('fs');
const path = require('path');
const Logger = require("../lib/Logger");

module.exports = (client) => {
	const rmLogsSchedule = new cron.CronJob('0 0 * * 0', () => {
		// Relative Path: "../logs.log"
		const logsPath = path.join(__dirname, "..", "logs.log");
		fs.writeFile(logsPath, '', function(){client.info("'logs.log' has been purged.")})
	});
	rmLogsSchedule.start()
};