# ClanNotifyer
[![Discord server](https://img.shields.io/discord/720746186788831323?color=%237289da&label=discord%20server&logo=discord)](https://discord.gg/cFyC9pmanj)

🤖 **A simple, customizable Discord bot that announces Twitch streams (plus a bunch of silly extras).**

![ClanNotifyer](https://user-images.githubusercontent.com/6772638/90008127-2ca15180-dc9c-11ea-97bc-d3a655717e42.png)

## Features

 - 📢 Monitor and announce Twitch channels going live with customizable `@mentions`.
 - 🔴 Live stream card that is automatically updated with the stream status, current game and viewership statistics.

## Installation and setup

### Prerequisites

This bot is built on Node.js. If you do not yet have Node installed, download and install version 18.18.2 from the official website for your platform:

https://nodejs.org/en/download/

**Node.js, version 18.18.2 is required.**

### Installation

To set up ClanNotifyer, download the latest [repository ZIP](https://github.com/TamaniWolf/ClanNotifyer/archive/main.zip) or clone it using `git`:

    git clone git@github.com:TamaniWolf/ClanNotifyer.git
    
Once downloaded, enter the directory and install the dependencies:

    cd ClanNotifyer
    npm install -global pnpm@8.6.6 pm2
    pnpm update

### Getting required tokens

#### Discord bot application
Your Discord bot needs to be registered as an application, and you will need a bot token  (`TOKEN` in ClanNotifyer's .env).

Follow [this guide](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) for more information.

#### Twitch token
👉 **I recommend using https://twitchtokengenerator.com/ to create an OAuth token for the API.**

You can also begin the authorization flow by completing the authorization prompt yourself:
 
```
https://id.twitch.tv/oauth2/authorize?client_id=<YOUR_CLIENT_ID_HERE>&response_type=token&redirect_uri=http://localhost
```

Alternatively, you can register your own application in the [Twitch Developers Console](https://dev.twitch.tv/console/apps).

Please note that your OAuth token is always tied to a specific Client ID.

### Configuration
 
To configure ClanNotifyer, customize the included `#.env` and enter this:

```.env
// For Settings in .env use (process.env.) 
TOKEN = <TOKEN>
PREFIX = cn.
SHARDED = false
BOTLANG = en_US

// Twitch
TWITCH_CLIENT_ID = <ID>
TWITCH_CLIENT_SECRET = <SECRET>
```

### Starting ClanNotifyer

Once the application has been configured, start it using `node` from the installation directory:

    node .

Or with the proccess Manager `pm2`.
For the first time:

    pm2 start main.js --name "Name" --max-memory-restart 250M

After adding to to pm2:

    pm2 start Name
  
### Inviting ClanNotifyer

Send the following link to the admin of a Discord server to let them invite the Bot:

  `https://discordapp.com/oauth2/authorize?client_id=BOT_CLIENT_ID&scope=bot`
  
Swap `BOT_CLIENT_ID` in the URL above for your Discord app's client id, which you can find in the app details.
