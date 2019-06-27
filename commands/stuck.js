const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

/* Command that should be used ONLY if the bot is stuck or bugged */
client.on('message', async(message) => {
    if (!message.author.bot && message.channel.type === "text" && message.content.startsWith(`${prefix}stuck`)) {
        /* If bot can't write messages */
        if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

        await message.react("✅");
        message.channel.send("If you used this command, is because the bot is totally stuck or bugged. \nRemember that abusing this command will result in removing it from your server. \nEverything should be ok now.");

        /* If bot is in a voice channel, leave it */
        if (message.guild.me && message.guild.me.voice && message.guild.me.voice.channel) {
            await message.guild.me.voice.channel.leave();
        }

        /* If guild is in audioStreamPerGuild object, remove it */
        if (audioStreamPerGuild[message.guild.id]) {
            audioStreamPerGuild[message.guild.id] = null;
        }

        /* If guild is in voiceChannelPerGuild object, first of all remove voice channel and its category, then remove the guild from the object */
        if (voiceChannelPerGuild[message.guild.id]) {
            /* voiceChannel created by the bot */
            let voiceChannel = await message.guild.channels.find(channel => channel.id === voiceChannelPerGuild[message.guild.id]['voice_channel_id']);

            if (voiceChannel) {
                /* Deletes voice channel and its category */
                await voiceChannel.parent.delete();
                await voiceChannel.delete();
            }

            voiceChannelPerGuild[message.guild.id] = null;
        }
    }
});
