const constants = require('../constants.js');
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

const embeds = require("../utils/embeds.js");

const Recorder = require("../utils/Recorder.js");

client.on('voiceStateUpdate', async(oldState, newState) => {
    try {
        /* If newState doesn't exist, means that user left a channel, instead of joining, so return */
        if (!newState || !newState.channelID) return;
        /* If oldState and newState channels are equal, means that the user didn't join any channel but just muted/unmuted */
        if (oldState.channelID === newState.channelID) return;

        console.log(newState.member.user.username);

        if (newState.member.user.bot) return;

        /* If joined channel is the one that the bot created, saved in voiceChannelPerGuild */
        if (voiceChannelPerGuild[newState.guild.id] && voiceChannelPerGuild[newState.guild.id]['voice_channel_id'] === newState.channelID) {
            let member = newState.member;

            /* If recorder already exists */
            if (audioStreamPerGuild[member.guild.id] && audioStreamPerGuild[member.guild.id].recorder) {
                let recorder = audioStreamPerGuild[member.guild.id].recorder;

                /* If the already existing recorder is recording, means that the bot is already recording someone else */
                if (recorder.getIsRecording()) {
                    await member.user.send({
                        embed: embeds.alreadyRecording(member.user)
                    });
                    return;
                }
            }

            /* Gets bot-created voice channel and the text channel where the user used the voice message command*/
            let voiceChannel = await member.guild.channels.get(voiceChannelPerGuild[newState.guild.id]['voice_channel_id']);
            let textChannel = await member.guild.channels.get(voiceChannelPerGuild[newState.guild.id]['text_channel_id']);

            /* Joins the voice channel together with the user */
            voiceChannel.join()
                .then(async (connection) => {
                    /* Prepares to record, so plays Silence for the entire duration of the recording */
                    await Recorder.prepareToRecord(connection);

                    /* Tells to the user that he's now recording his voice, and to leave when he wants to stop */
                    await member.user.send({
                        embed: embeds.startedRecordingWithVVoiceMessage(member.user)
                    });

                    const receiver = connection.receiver;

                    let recorder = new Recorder(member.guild, receiver);

                    /* Starts recording */
                    await recorder.startRecording(member.user, async (mp3FilePath, timeLimitReached) => { // mp3FilePath is the full file path to the recorded .mp3 file, timeLimitReached is a boolean that is true if the time limit(15min) was reached, else is false
                        /*
                        * ALL OF THIS JUST HAPPENS AFTER THE MP3 FILE IS CREATED AND JUST BEFORE THE MP3 FILE IS DELETED.
                        */

                        /* Disconnects from voice channel */
                        connection.disconnect();

                        let embed = await embeds.sendRecording(member.user, voiceChannel);

                        /* If time limit is reached, use the correct embed */
                        if (timeLimitReached) embed = embeds.sendRecordingTimeLimitReached(member.user, voiceChannel);

                        /* Sends voice message in the channel */
                        await textChannel.send({embed});
                        await textChannel.send({
                            files: [{
                                attachment: mp3FilePath,
                                name: `Voice Message by ${member.user.username} | ${Date.now().toString()}.mp3`
                            }],
                        });
                    });

                    /* Adds recorder to audioStreamPerGuild for the current guild */
                    audioStreamPerGuild[member.guild.id]['recorder'] = recorder;
                })
                .catch(async (error) => {
                    console.error(error);
                    await textChannel.send({
                        embed: embeds.unknownErrorNoPermissionMaybe(member.user)
                    });
                });
            }
    } catch(err) {
        console.error(err);
    }
});
