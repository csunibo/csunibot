echo Started building protocol...
# basically sets some path variables for node to find the correct `bin`s and package.json and install the correct things
# pwd = print working directory
# NOTE THIS COMMAND ONLY WORKS ON LINUX FOR PIPELINE SEQUENCES `&&`
npm init -y && npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
# rebuilds with latest config
# you can see the latest config with `npm config ls -l` -l = "long", shows verbose output
npm rebuild
# install all dependencies from package.json
npm i
# uploads and sets the slash commands for the bot to all guilds which contain it
npm run deploy
echo Finished building!