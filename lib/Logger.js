const winston = require("winston");
const colors = require("colors");

class Logger {
	// Creates a class constructor for winston logging module
	// https://www.npmjs.com/package/winston
	constructor(file) {
		this.logger = winston.createLogger({
			transports: [
				new winston.transports.File({ filename: file })
			],
		});
	}

	time() {
		let d = new Date();
		return `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
	}
			
	log(text) {
		let time = this.time();
		this.logger.log({
			time: `${time}`,
			level: "debug",
			message: "info: " + text,
		});
		console.log(
			colors.gray(time) + colors.green(" | " + text)
		);
	}
					
	warn(text) {
		let time = this.time();
		this.logger.log({
			time: `${time}`,
			level: "warn",
			message: "warn: " + text,
		});
		console.log(
			colors.gray(time) + colors.yellow(" | " + text)
		);
	}
	
	info(text) {
		let time = this.time();
		this.logger.log({
			time: `${time}`,
			level: "info",
			message: "info: " + text,
		});
		console.log(
			colors.gray(time) + colors.blue(" | " + text)
		);
	}
	
	error(text) {
		let time = this.time();
		this.logger.log({
			time: `${time}`,
			level: "error",
			message: "error: " + text,
		});
		console.log(
			colors.gray(time) + colors.red(" | " + text)
		);
	}
	
	silly(text) {
		let time = this.time();
		this.logger.log({
			time: `${time}`,
			level: "silly",
			message: "success: " + text,
		});
		console.log(
			colors.gray(time) + colors.rainbow(" | " + text)
		);
	}
}
module.exports = Logger;
	