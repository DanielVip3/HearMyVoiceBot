# About
HearMyVoice, or, as I like to call it, HMV, is a project that was only born to be a Discord Hack Week entry, but then I thought to expand it to a public bot.

The main purpose of this bot is to record voice of a single user, in a voice channel, and then to send it in a text channel as playable MP3.
It basically fulfills my dream to have voice messages on Discord, because that's a functionality that I see a lot in other messaging apps(Telegram, Whatsapp and every other messaging app :p).

# Setting Up
Setting up this bot isn't hard. But there are few things that you should remember.
First of all, the version of discord.js that should be installed is v12, currently master branch **(not stable)**.
Also, this bot requires the following modules, installable by npm:
  - discord.js(v12)
  - node-lame
  - hjson
  
The actual repo also contains a file, config.hjson, that is .gitignored because it contains tokens and database informations that shouldn't be known to the public. So no one can access this file, but it's needed to setup the bot.
You can recreate this file in this way
`config.hjson`, in master branch, main folder
```
{
  token: [bot-token]
  
  // There should also be database cluster name, database user name, database user password and database host, but hey, who cares, that's a bot for the Discord Hack Week for now, so we don't need any database
}
```
obviously replacing bot-token with the bot-token(lol).

Database isn't currently used but is included in code, and it will be used the bot's future(when it'll be public). So, all database functions are commented/not utilized. You can use this bot without setupping a database.

# To-do
- Make a v!voicemessage to set-up a temporary voice channel only to record voice messages, where, when you join, it starts recording, and when you leave, it stops. Make the channel uneditable/unremovable.
- Add a maximum voice message duration.
- Make it more user-friendly, easier to use, with a good interface and easier to use when on mobile without the possibility to write text.
- Fix on-ready bot name.
- Further commands documentation.
- Code splitting and commenting.
- Screenshots ?
- After finishing the bot, make a command v!setupserver, where a permanent voice channel is created and stored in the database. When someone joins that channel, the bot records its voice, and when he leaves, the voice message is sent in a text channel stored in the database.

# Documentation
**Default bot prefix: `v!`**
**To use this bot, you must have direct messages enabled in the server you've added it. This bot uses a lot direct messages.**

### How to use the bot
Join a voice channel, use the command `v!record`, the bot will join the voice channel too. 
Do what the bot says and start talking when he says you can. 
When you've finished, stop talking, use the command `v!stop` in the text channel you want, and he'll send your voice message there.

##### v!record
  Using this command when in a voice channel, basically, makes the bot join it to hear your voice and start recording it.
  It will automatically tell you when to start talking, so follow the instructions in the chat sent by the bot.
  When you've finished recording, you can use `v!stop`.
  If you leave the voice channel mid-recording, the bot will leave the voice channel too.
##### v!stop
  Just stops recording your voice, if in a voice channel. Only the one who started recording, can stop recording.
  Use this command in the channel where you want to send your voice message, because it'll be sent there.

# Screenshots

W.I.P.

# Licensing and Contributors
As the MIT license says, all the rights are granted to Daniele De Martino(DanielVip3, on Discord DanielVip3#6167).
Please, respect the license.