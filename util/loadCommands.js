const path = require("path");
const fs = require("fs");

const LoadCommands = () => {
	return new Promise(async (resolve) => {
		let slash = await LoadDirectory("slash");
		
		resolve({ slash });
	});
};

const LoadDirectory = () => {
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
