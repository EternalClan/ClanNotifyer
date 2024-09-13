# ClanNotifyer
[![Discord server](https://img.shields.io/discord/720746186788831323?color=%237289da&label=discord%20server&logo=discord)](https://discord.gg/cFyC9pmanj)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![LICENSE](https://img.shields.io/github/license/EternalClan/ClanNotifyer?style=flat-square)](LICENSE)
[![release](https://img.shields.io/github/v/release/EternalClan/ClanNotifyer?include_prereleases&display_name=release&style=flat-square)](releases)
[![Build Status](https://github.com/EternalClan/ClanNotifyer/workflows/Node.js%20CI/badge.svg)](https://github.com/EternalClan/ClanNotifyer/actions)
[![Maintenance](https://img.shields.io/maintenance/yes/2024?style=flat-square)](https://github.com/EternalClan/ClanNotifyer/graphs/commit-activity)

🤖 **A simple, customizable Discord bot that announces Twitch streams (plus a bunch of silly extras).**

## Features

 - 📢 Monitor and announce Twitch channels going live with customizable `@mentions`.
 - 🔴 Live stream card that is automatically updated with the stream status, current game and viewership statistics.

## Installation and setup

### Prerequisites

This bot is built on Node.js. If you do not yet have Node installed, download and install the latest LTS version from the official website for your platform:

[Nodejs.org/downloads/](https://nodejs.org/en/download/)

> [!IMPORTANT]
> **Node.js, version 18 or higher is required.**

### Installation

To set up ClanNotifyer, download the latest [Release](https://github.com/EternalClan/ClanNotifyer/releases) or clone it using `git`:

    git clone git@github.com:TamaniWolf/ClanNotifyer.git
    
Once downloaded, extract it from the zip file if needed and enter the directory to install the dependencies:

    cd ClanNotifyer
    npm install -global pnpm pm2
    pnpm update

### Configuration
 
To configure ClanNotifyer, rename the included `#.env` to `.env`. It should look like this in there:

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

### Getting required tokens

#### Discord bot application
Your Discord bot needs to be registered as an application, and you will need a bot token  (`TOKEN` in ClanNotifyer's .env).

Follow [this guide](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) to create your own Bot User/Application.

<!--
#### Twitch token - Manually
> [!NOTE]
> This part is only for Educational use and is not necessary for the operation of the bot.

There are two ways to get your token from Twitch.
1. Using https://twitchtokengenerator.com/ to create an OAuth token for the API.**

2. Using.
You can also begin the authorization flow by completing the authorization prompt yourself:
 
```
https://id.twitch.tv/oauth2/authorize?client_id=<YOUR_CLIENT_ID_HERE>&response_type=token&redirect_uri=http://localhost
```

Alternatively, you can register your own application in the [Twitch Developers Console](https://dev.twitch.tv/console/apps).

Please note that your OAuth token is always tied to a specific Client ID.
-->
#### Twitch Token
With the bot doing the Token creation itself we only need to provide it with Twitch's Client ID and Client Secret.

To get both we need to register our own application.
1. Open [Twitch's Developers Console](https://dev.twitch.tv/console/apps) and click on `Register Your Application`.
2. Enter the name of your application.
3. Under `OAuth Redirect URLs` enter `https://localhost`.
4. Select a Category and Client type, i recommend `Confidential`.
5. Fillout the captcha and click create.

Now click on Manage and copy the Client ID in to the bots .env file.
To get the Client Secret click on New Secret and also copy this to the .env file.

### Starting ClanNotifyer

Once the application has been configured, start it using `node` from the installation directory:

    node .

Or with the proccess Manager `pm2`.
For the first time:

    pm2 start main.js --name "Name" --max-memory-restart 250M

After adding to pm2 you can start it with the process number or the name:

    pm2 start 1
    pm2 start Name
  
### Inviting ClanNotifyer

Send the following link to the admin of a Discord server to let them invite the Bot:

  `https://discordapp.com/oauth2/authorize?client_id=BOT_CLIENT_ID&scope=bot&permissions=962341628992`
  
Swap `BOT_CLIENT_ID` in the URL above for your Discord app's client id, which you can find in the app details.
