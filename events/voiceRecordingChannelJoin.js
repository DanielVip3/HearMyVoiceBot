const Discord = require('discord.js');

const constants = require('../constants.js');
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

const Recorder = require("../utils/Recorder.js");

client.on('voiceStateUpdate', async(oldState, newState) => {
    if (newState.member.user.bot) return;

    if (!newState || !newState.channelID) return;
    if (oldState.channelID && newState.channelID) return;

    if (voiceChannelPerGuild[newState.guild.id] && voiceChannelPerGuild[newState.guild.id]['voice_channel_id'] === newState.channelID) {
        let member = newState.member;

        if (audioStreamPerGuild[member.guild.id] && audioStreamPerGuild[member.guild.id].recorder) {
            let recorder = audioStreamPerGuild[member.guild.id].recorder;

            if (recorder.getIsRecording()) {
                await member.user.send(`I am already recording a voice message in another voice channel. Please wait until I finish.`);
                return;
            }
        }

        let voiceChannel = await member.guild.channels.get(voiceChannelPerGuild[newState.guild.id]['voice_channel_id']);
        let textChannel = await member.guild.channels.get(voiceChannelPerGuild[newState.guild.id]['text_channel_id']);

        voiceChannel.join()
            .then(async(connection) => {
                await Recorder.prepareToRecord(connection);

                let listeningMessage = await member.user.send(`I'm now recording your voice, leave this voice channel when you want to stop recording and send your voice message.`);

                const receiver = connection.receiver;

                let recorder = new Recorder(member.guild, receiver);

                await recorder.startRecording(member.user, async(mp3FileName) => {
                    listeningMessage.delete();

                    connection.disconnect();

                    let embed = await new Discord.MessageEmbed()
                        .setTitle(`Voice Message from ${member.user.username}`)
                        .setDescription(`Recorded in voice channel "${voiceChannel.name}"`)
                        .setColor(0x00FA9A)
                        .setAuthor(`${member.user.username}#${member.user.discriminator}`, member.user.displayAvatarURL())
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp();

                    await textChannel.send({embed});
                    await textChannel.send({
                        files: [{
                            attachment: mp3FileName,
                            name: `Voice Message by ${member.user.username} | ${Date.now().toString()}.mp3`
                        }],
                    });
                });

                audioStreamPerGuild[member.guild.id]['recorder'] = recorder;
            })
            .catch(async(error) => {
                console.error(error);
                await textChannel.send("There was an unknown error. It could be related to the voice channel: may it be because I haven't permissions to join it? Else, the error should be a bug. Please feel free to contact the developer DanielVip3#6167.");
            });
    }
});
