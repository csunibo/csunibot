const { spawnSync } = require("child_process");

/**
 * Runs a command through spawn and displays the output directly to the console.
 * Options are normalized to allow for EoA
 * 
 * @param {string} command command to execute through the shell using `child_process.spawnSync`
 * @param {string[]} argv arguments to pass to the command
 */
function run(command, argv) {
	spawnSync(command, argv, {
		stdio: "inherit", // display output directly to the console (Live)
		shell: true, // runs the command through the shell (This option is required for the command to run through on any shell)
		cwd: process.cwd(), // sets the current working directory to the project root (Arbitrary)
		env: process.env // sets the environment variables to the system PATH (Arbitrary)
	});
	console.log("Done!");
}

(() => {
	console.log("Updating and saving dependencies to package.json...");
	run("npm", ["update", "--save"]);

	console.log("Installing dependencies...");
	run("npm", ["install"]);
})();