const constants = require('../constants.js');
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

const embeds = require("../utils/embeds.js");

client.on('voiceStateUpdate', async(oldState, newState) => {
    /* If oldState doesn't exist, means that user joined a channel, instead of leaving, so return */
    if (!oldState || !oldState.channelID) return;
    /* If oldState and newState channels are equal, means that the user didn't join any channel but just muted/unmuted */
    if (oldState.channelID === newState.channelID) return;

    if (oldState.member.user.bot) return;

    /* If left channel is the one that the bot created, saved in voiceChannelPerGuild */
    if (voiceChannelPerGuild[oldState.guild.id] && voiceChannelPerGuild[oldState.guild.id]['voice_channel_id'] === oldState.channelID) {
        let member = oldState.member;

        if (!audioStreamPerGuild[oldState.guild.id]) return;
        /* If the one who left the channel isn't the one who started to record, return */
        if (audioStreamPerGuild[oldState.guild.id]["author_id"] !== member.user.id) return;

        /* Gets voice channel created by the bot */
        let voiceChannel = await member.guild.channels.get(voiceChannelPerGuild[oldState.guild.id]['voice_channel_id']);

        /* Deletes voice channel and its category*/
        if (voiceChannel.parent) await voiceChannel.parent.delete();
        await voiceChannel.delete();

        /* Let the user know that he stopped recording */
        await member.send({
            embed: embeds.stoppedRecording(member.user)
        });

        /* Gets the recorder and stops recording */
        let recorder = audioStreamPerGuild[oldState.guild.id]['recorder'];
        await recorder.stopRecording(member.user);

        voiceChannelPerGuild[oldState.guild.id] = null;
    }
});
