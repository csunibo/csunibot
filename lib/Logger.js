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
			
	log(Text) {
		let d = new Date();
		let time = `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
		this.logger.log({
			time: `${time}`,
			level: "debug",
			message: "info: " + Text,
		});
		console.log(
			colors.gray(time) + colors.green(" | " + Text)
		);
	}
					
	warn(Text) {
		let d = new Date();
		let time = `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
		this.logger.log({
			time: `${time}`,
			level: "warn",
			message: "warn: " + Text,
		});
		console.log(
			colors.gray(time) + colors.yellow(" | " + Text)
		);
	}
	
	info(Text) {
		let d = new Date();
		let time = `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
		this.logger.log({
			time: `${time}`,
			level: "info",
			message: "info: " + Text,
		});
		console.log(
			colors.gray(time) + colors.blue(" | " + Text)
		);
	}
	
	error(Text) {
		let d = new Date();
		let time = `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
		this.logger.log({
			time: `${time}`,
			level: "error",
			message: "error: " + Text,
		});
		console.log(
			colors.gray(time) + colors.red(" | " + Text)
		);
	}
	
	silly(Text) {
		let d = new Date();
		let time = `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`;
		this.logger.log({
			time: `${time}`,
			level: "silly",
			message: "success: " + Text,
		});
		console.log(
			colors.gray(time) + colors.rainbow(" | " + Text)
		);
	}
}
module.exports = Logger;
	