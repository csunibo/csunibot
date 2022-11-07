const fs = require("fs");

// Loads all commands from the commands folder
const LoadCommands = () => {
	return new Promise(async (resolve) => {
		let slash = await LoadCommandsDir();
		
		resolve({ slash });
	});
};

// Needs to be updated to conform the method in InfoBot.js
// fills the commands array and resolves it to the calling function
const LoadCommandsDir = () => {
	return new Promise((resolve) => {
		let commands = [];
		let CommandsDir = fs.readdirSync("./commands") // Relative Path: "../commands"
		let i = 0,
		f = getFiles("./commands").length,
		r = false;
		
		for (const category of CommandsDir) {
			fs.readdir(`./commands/${category}`, (error, files) => {
				if (error) throw error;
				files.forEach((file) => {
					let command = require(`../commands/${category}/${file}`);
					i++; if (i == f) r = true;
					if (!command)
					return console.log(`Command failed deployment procedure: ${file}`);
					commands.push(command);
					if(r) resolve(commands);
				});
			});
		}		
	});
};

// Dunno where I found this function but I'm pretty sure it's not mine
// Reads all files of a dir and sub dirs
const getFiles = (dir, files_) => {
	files_ = files_ || [];
	let files = fs.readdirSync(dir);
	for (let i in files){
		let name = dir + '/' + files[i];
		if (fs.statSync(name).isDirectory()){
			getFiles(name, files_);
		} else {
			files_.push(name);
		}
	}
	return files_;
}

module.exports = LoadCommands;
