const constants = require('../constants.js');
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

client.on('voiceStateUpdate', async(oldState, newState) => {
    if (oldState.member.user.bot) return;

    if (!oldState || !oldState.channelID) return;
    if (oldState.channelID && newState.channelID) return;

    if (voiceChannelPerGuild[oldState.guild.id] && voiceChannelPerGuild[oldState.guild.id]['voice_channel_id'] === oldState.channelID) {
        let member = oldState.member;

        if (!audioStreamPerGuild[oldState.guild.id]) return;

        if (audioStreamPerGuild[oldState.guild.id]["author_id"] !== member.user.id) return;

        let voiceChannel = await member.guild.channels.get(voiceChannelPerGuild[oldState.guild.id]['voice_channel_id']);
        await voiceChannel.parent.delete();
        await voiceChannel.delete();

        await member.send("You stopped recording.\n----------------");

        setTimeout(async() => {
            let recorder = audioStreamPerGuild[oldState.guild.id]['recorder'];
            await recorder.stopRecording(member.user);

            voiceChannelPerGuild[oldState.guild.id] = null;
        }, 2000);
    }
});
