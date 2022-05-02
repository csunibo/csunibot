<h1 align="left"><img src="./assets/Seal_of_the_University_of_Bologna.svg.png" width="30px"> InfoBot </h1>

A completeley modular Discord Bot made for and by Computer Science student's of the University of Bologna as ease of access to utility styled commands for notes, lessons, music, time tables and more...
The bot hopes to allow the student's to be more efficient and sociable as a means of use in the appropriate Discord servers.
The commands are completely modular and can be created with little to no knowledge of JS or Discord.js, as examples there are a lot of differently styled commands in the `./commands` sub-folders.
Any folder and file within can be removed or added freely and will automatically be integrated into the structure of the bot.

## ⛔ | Prerequisites

- [Node.js 16+](https://nodejs.org/en/download/)
- [Lavalink Server](https://github.com/freyacodes/Lavalink) (If you want music functionalities)

## 🏃‍♂ | Installing and running the bot

### First of all you'll need to create a new bot application for your discord bot client:
  - Go to [Discord Developer Portal](https://discord.com/developers/applications/)
  - Click on the button "New Application" and give it a name
    - On the main page you can messa around and give your bot a description, tags and a Profile picture
  - Click on "Bot" in the panel on the left and "Add Bot" to create a new Discord Bot Client
    - Here you can enable some really neat API features for your bot, the one's you'll be needing are: "Server Member Intent" and "Message Content Intent" (Also disable "Public Bot" if you want)
  - Now go to the "OAuth2" section and press on the "URL Generator" Tab
    - Select the "bot" and "applications.commands" scopes (A new table should open upon clicking on the "bot" scope)
    - In the "Bot Permissions" table you can select what permissions your bot will ask to have upon entering a new server, as you're setting it up it might be useful to give it "Administrator"
  - Now a link will have generated at the bottom which you can copy and paste in your browser search bar, this will allow you to invite the first instance of the bot in your server
(It should look something like `https://discord.com/oauth2/authorize?client_id={clientId}&permissions={permissions}&scope=bot%20applications.commands` Obviously remove the {variables} if you intend to write it out yourself)

### Now that everything is set up on the discord side of things:
  - To actually set up the bot and get it running you can run
```bash
bash kickstart.sh
```
to install all required dependencies and automatically post slash commands to the discord bot application.
  - You will need to fill in all the blanks in the `config.js` with the appropriate contents of your discord bot application
  - To run the bot:
```bash
node run start
```

[OG Music bot structure credits](https://github.com/SudhanPlayz/Discord-MusicBot)
