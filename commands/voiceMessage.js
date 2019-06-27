const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

const embeds = require("../utils/embeds.js");

client.on('message', async(message) => {
    if (!message.author.bot && message.channel.type === "text" && message.content.startsWith(`${prefix}voicemessage`)) {

        /* If bot can't write messages */
        if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

        if (audioStreamPerGuild[message.guild.id]) {
            await message.channel.send({
                embed: embeds.alreadyRecording(message.author)
            });
            return;
        }

        let member = await message.guild.member(message.author);

        if (!member) {
            await message.author.send({
                embed: embeds.notInTheServer(message.author)
            });
            return;
        }

        if (voiceChannelPerGuild[message.guild.id] && voiceChannelPerGuild[message.guild.id]['voice_channel_id']) {
            await message.channel.send({
                embed: embeds.alreadyRecording(message.author)
            });
            return;
        }

        /* Creates a category for the voice message channel */
        let category = await message.guild.channels.create("Voice Message", {
            type: 'category',
            position: 0,
            reason: `Temporary voice message channel requested by ${message.author.username}`
        });
        await category.setPosition(0);

        /* Creates the voice message channel and puts it in the first position in the channel list */
       let voiceChannel = await message.guild.channels.create("Official ⇝ Voice Message Recording", {
           type: 'voice',
           userLimit: 2,
           position: 0,
           parent: category,
           reason: `Temporary voice message channel requested by ${message.author.username}`
       });

        /* Tells to the user that if he joins the new voice channel, the recorder will start recording */
        await message.author.send({
            embed: embeds.joinTheNewVoiceChannel(message.author)
        });
        /* Deletes the command's message */
        await message.delete();

        /* Inserts the newly created voice channel in the voiceChannelPerGuild object, for the events voiceRecordingChannelJoin and voiceRecordingChannelLeave*/
        voiceChannelPerGuild[message.guild.id] = {
            voice_channel_id: voiceChannel.id,
            text_channel_id: message.channel.id,
        };

        /* Every 30 seconds, checks if the voice channel is empty. If it is, just remove it, because no one joined to record. */
        let interval = setInterval(async () => {
            let actualVoiceChannel = await message.guild.channels.get(voiceChannel.id);

            /* If voice channel exists */
            if (actualVoiceChannel) {
                /* If no one is in */
                if (actualVoiceChannel.members.size <= 1) {
                    /* Remove voice channel, category and leave */
                    if (actualVoiceChannel.parent) await actualVoiceChannel.parent.delete();
                    await actualVoiceChannel.delete();

                    /* Stop checking every 30 seconds */
                    clearInterval(interval);
                }
            }
        }, 30000);
    }
});
