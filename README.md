# PLEASE, NOTE!
**If you want to test the bot, join this official test Discord server https://discord.gg/KRrv2Bp (yeah, that's also for you, Discord Staff/Testers!).**


# About
HearMyVoice, or, as I like to call it, HMV, is a project that was only born to be a Discord Hack Week entry, but then I thought to expand it to a public bot.

The main purpose of this bot is to record voice of a single user, in a voice channel, and then to send it in a text channel as playable MP3.
It basically fulfills my dream to have voice messages on Discord, because that's a functionality that I see a lot in other messaging apps(Telegram, Whatsapp and every other messaging app :p).

# Setting Up
Setting up this bot isn't hard. But there are few things that you should remember.
First of all, the version of discord.js that should be installed is v12, currently master branch **(not stable)**.
Also, this bot requires the following modules, installable by npm:
  - discord.js(v12)
  - node-opus or opusscript
  - node-lame; remember that node-lame requires installing LAME, see in the "Lame" paragraph
  - hjson
Other modules are included in package.json but not required, and you can install them if you want.  
  
I recommend using Node v10.2.1(because that's the version that I used to test). But it should work too on newer versions, like Node v.11.15.0 or v12.4.0.
I don't know tho on older Node versions.
  
  
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

# Lame installation
As node-lame's documentation says, you can install Lame in different ways per OS.
#### Install on Debian
```$ sudo apt-get install lame```

#### Install on MacOS with brew
```$ brew install lame```

#### Install on Windows with choco
```$ choco install lame```

#### Install on Windows without choco
1. Go to the [official Lame page](https://lame.buanzo.org/#lamewindl) and download the .EXE or .ZIP file.
2. Navigate to the directory Lame was installed in (most commonly C:\Program Files (x86)\Lame For Audacity).
3. Add the directory to your `PATH` Environment Variable.

# Usage
**Default bot prefix: `v!`(not editable for now).**

**Bot voice message length limit: 15 minutes.**

**To use this bot, you must have direct messages enabled in the server you've added it. This bot uses a lot direct messages.**

**Also, to fully use this bot, give him administrator permissions.**

## How to use the bot

### Using the bot - first way(recommended)
In the channel where you want to send your voice message, use the command `v!voicemessage`.\
This command will create a voice channel in the very first position of the channel list.\
When you'll join this voice channel, after a second, the bot will start recording your voice.\
When you'll leave it, then, the bot will stop recording automatically and send the voice message in the channel where you used the command.\
This way is better than the second because it's easier, more orthodox, faster and more mobile-friendly.

### Using the bot - second way(if you don't like that the bot creates new channels)
Join a voice channel, use the command `v!record`, the bot will join the voice channel too. \
Do what the bot says and start talking when he says you can.\
When you've finished, stop talking, use the command `v!stop` in the text channel you want, and he'll send your voice message there.

## Commands

#### v!help
Lists commands and talks about the bot, in DM.
#### v!voicemessage
This command basically is the core of the bot.\
When you use it, the bot creates a voice channel in the first position of the channel list, and, when you join that voice channel, the bot will join too.\
Then, you can start talking. The bot will record everything you say.\
When you leave the channel, the bot will send your recorded voice message in the channel where you used this command.
#### v!record
Using this command when in a voice channel, basically, makes the bot join it to hear your voice and start recording it.\
Use this command in the channel where you want to send your voice message, because it'll be sent there.\
It will automatically tell you when to start talking, so follow the instructions in the chat sent by the bot.\
When you've finished recording, you can use `v!stop`.\
If you leave the voice channel mid-recording, the bot will leave the voice channel too.
#### v!stop
Just stops recording your voice, if you've started recording with `v!record`.\
Only the one who started recording, can stop recording.

#### If bot is stuck: v!stuck
Only for emergency cases.\
Please, don't abuse this command, because if you do, your server will be banned from the bot, and you won't never be able to invite it anymore.\
This command basically should unstuck bot from weird situations or uncaught bugs, like when the bot says he's recording when he isn't.\
When this command is used, bot leaves his voice channel, removes his custom-made voice channels and should then unstuck.

# Screenshot (idk why, just to make it look cooler)
<img src="https://media.giphy.com/media/W3OJtmWlSvmwullMnW/giphy.gif" alt="GIF of Voice Channel" width="250" height="250">
W.I.P.

# Licensing and Contributors
As the MIT license says, all the rights are granted to Daniele De Martino(DanielVip3, on Discord **DanielVip3#6167**).\
Please, respect the license.

#### Contributors
**DanielVip3#6167** head developer, database manager, bot manager and tester. Basically, jack of all trades(master of nothing :p).\
**Santuzzu93#9588** helped a lot by testing the bot with me, and it's thanks to him that now we have a right voice pitch(before it was all so freakin' deep, like hell).

# Data Usage
Notice that the bot won't record anything without your permissions.
When using any command, you're giving permission to record your voice and everything the bot will hear in vocal channel, until you tell him to stop recording.
You agree to the sequent treatment of your data, when you give permission to the bot to record you:
- The recording containing your voice will never be used externally from the bot.
- The recording will be sent in a text channel specified by you when using the command, so it's not bot's fault if you use command in wrong channel and someone who shouldn't, heard your voice message.
- The recording will be provided as is, without any modification or cutting in length.
- The recording will be, right after registered, saved in bot's recording folder, and then converted from .pmc to .mp3.
- The recording will be, right after being sent in the text channel, eliminated from bot's recording folder. The bot won't keep any trace of the recording, not even in database. So no one can recover it anymore if you delete it from the text channel where it was sent.

Any usage of the recordings recorder or sent by the bot isn't my responsibility.\

#
Also, remember that recordings shouldn't be considered as warranties for confirming someone's identity, neither as warranties of truth or anything.\
**They purely are recordings, that anyone can fake changing their microphone, changing their voice in Discord. Nothing more, nothing less.**

# To-do
- After finishing the bot, make a command v!setupserver, where a permanent voice channel is created and stored in the database. When someone joins that channel, the bot records its voice, and when he leaves, the voice message is sent in a text channel stored in the database.
- After finishing the bot, add permissions for admins to stop voice message recording and to create voice channels where you can't use recording messages.
- After finishing the bot, add permissions for admins to disable v!voicemessage, or v!record and v!stop commands.
