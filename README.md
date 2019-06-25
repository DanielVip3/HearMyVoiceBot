# About
HearMyVoice, or, as I like to call it, HMV, is a project that is born to be a Discord Hack Week entry, but then I thought to expand it to a public bot.

The main purpose of this bot is to record voice of a single user, in a voice channel, and then to send it in a text channel as playable MP3.
It basically fulfills my dream to have voice messages on Discord, because that's a functionality that I see a lot in other messaging apps(Telegram, Whatsapp and every other messaging app :p).

# Setting Up
Setting up this bot isn't hard. But there are few things that you should remember.
First of all, the version of discord.js that should be installed is v12, currently master branch **(not stable)**.
Also, this bot requires the following modules, installable by npm:
  - discord.js(v12)
  - node-lame
  - mongoose
  - hjson
  
The actual repo also contains a file, config.hjson, that is .gitignored because it contains tokens and database informations that shouldn't be known to the public. So no one can access this file, but it's needed to setup the bot.
You can recreate this file in this way
`config.hjson`, in master branch, main folder
```json
{
  token: [bot-token]
  
  // There should also be database cluster name, database user name, database user password and database host, but hey, who cares, that's a bot for the Discord Hack Week for now, so we don't need any database
}
```
obviously replacing bot-token with the bot-token(lol).

Database isn't currently used but is included in code, and it will be used the bot's future(when it'll be public). So, I'll just comment database main functions for now.

# To-do
- Comment database functions (see under "setting up").
- Make a voice-message-only voice channel, so that when a user joins the bot joins and starts recording, and when the user leaves, the bot leaves too and sends the message in a text channel.
- Make it more user-friendly, easier to use, with a good interface and easier to use when on mobile without the possibility to write text.
- Commands documentation.
- Code splitting and commenting.
- Screenshots ?

# Documentation

W.I.P.

# Screenshots

W.I.P.

# Contributors
As the MIT license says, all the rights are granted to Daniele De Martino(DanielVip3, on Discord DanielVip3#6167).
Please, respect the license.
