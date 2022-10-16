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

	/**
	 * 
	 * @returns String formatted date for logging
	 */
	time() {
		let d = new Date();
		return `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
	}
			
	/**
	 * logs a debug level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
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
			
	/**
	 * logs a warn level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
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
	
	/**
	 * logs an info level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
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
	
	/**
	 * logs an error level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
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
	
	/**
	 * logs a silly level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
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
	
	/**
	 * logs information from the API WS to the log file
	 * @param  {...any} data 
	 */
	debug(...data) {
		let time = this.time();
		this.logger.log({
			time: `${time}`,
			level: "info",
			message: "debug: " + JSON.stringify(data, null, 4),
		});
	}	
}
module.exports = Logger;
	