const constants = require('../constants.js');
const client = constants.client;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

/* When a voice channel is deleted, if it's bot's voice channel, just reset guild's object in voiceChannelPerGuild and in audioStreamPerGuild */
client.on('channelDelete', async(channel) => {
    /* If channel's type is voice */
    if (channel.type === 'voice') {
        /* If guild is included in voiceChannelPerGuild */
        if (voiceChannelPerGuild[channel.guild.id]) {
            /* If voice channel in voiceChannelPerGuild is the same as the deleted voice channel */
            if (voiceChannelPerGuild[channel.guild.id]['voice_channel_id'] === channel.id) {

                /* Reset guild in voiceChanneLPerGuild */
                voiceChannelPerGuild[channel.guild.id] = null;
            }
        }
    }
});
