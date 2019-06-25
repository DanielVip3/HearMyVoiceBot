const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

client.on('message', async(message) => {
    if (!message.author.bot && message.channel.type === "text" && message.content.startsWith(`${prefix}voicemessage`)) {
        if (audioStreamPerGuild[message.guild.id]) {
            await message.channel.send(`<@${message.author.id}>, I am already recording a voice message in another voice channel. Please wait until I finish.`);
            return;
        }

        let member = await message.guild.member(message.author);

        if (!member) {
            await message.channel.send("There was an unknown error. We're sorry, but it looks like you're not in this server anymore!");
            return;
        }

        if (voiceChannelPerGuild[message.guild.id] && voiceChannelPerGuild[message.guild.id]['voice_channel_id']) {
            await message.channel.send(`<@${message.author.id}>, I am already recording a voice message in another voice channel. Please wait until I finish.`);
            return;
        }

        let category = await message.guild.channels.create("Voice Message", {
            type: 'category',
            position: 0,
            reason: `Temporary voice message channel requested by ${message.author.username}`
        });
        await category.setPosition(0);

       let voiceChannel = await message.guild.channels.create("Official ⇝ Voice Message Recording", {
           type: 'voice',
           userLimit: 2,
           position: 0,
           parent: category,
           reason: `Temporary voice message channel requested by ${message.author.username}`
       });

        await message.author.send("Join the new voice channel and I'll start recording your voice.");
        await message.delete();
        voiceChannelPerGuild[message.guild.id] = {
            voice_channel_id: voiceChannel.id,
            text_channel_id: message.channel.id,
        };

        let interval = setInterval(async () => {
            let actualVoiceChannel = await message.guild.channels.get(voiceChannel.id);

            if (actualVoiceChannel) {
                if (actualVoiceChannel.members.size <= 1) {
                    await actualVoiceChannel.delete();
                    clearInterval(interval);
                }
            }
        }, 30000);
    }
});
