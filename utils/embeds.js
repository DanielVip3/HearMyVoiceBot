const { client } = require('../constants.js');
const { MessageEmbed } = require('discord.js');



/* Normal */

function joinTheNewVoiceChannel(user) {
    return new MessageEmbed()
        .setTitle(`How to start recording`)
        .setDescription(`Join the newly created voice channel and I'll start recording your voice. \nThe voice channel is called "Official ⇝ Voice Message Recording", at the top of the channels list.`)
        .setColor(0x4a48db)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function startedRecordingWithVVoiceMessage(user) {
    return new MessageEmbed()
        .setTitle(`Started recording`)
        .setDescription(`I'm now recording your voice, leave this voice channel when you want to stop recording and send your voice message.`)
        .setColor(0x48db79)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function startedRecordingWithVRecord(user, prefix) {
    return new MessageEmbed()
        .setTitle(`Started recording`)
        .setDescription(`I'm now recording your voice, **send \`${prefix}stop\` in the channel you want to stop recording and send your voice message.**`)
        .setColor(0x48db79)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function stoppedRecording(user) {
    return new MessageEmbed()
        .setTitle(`Stopped recording`)
        .setDescription(`I stopped recording your voice. I sent your voice message in the channel you specified.`)
        .setColor(0xef8009)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function stoppedRecordingTimeLimitReached(user) {
    return new MessageEmbed()
        .setTitle(`Stopped recording for time limit`)
        .setDescription(`I stopped recording your voice, because your voice message reached 15 minutes, the maximum length that I can handle. I sent your voice message in the channel you specified.`)
        .setColor(0xef8009)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function sendRecording(user, voiceChannel) {
    return new MessageEmbed()
        .setTitle(`Voice Message from ${user.username}`)
        .setDescription(`Recorded in voice channel "${voiceChannel.name}"`)
        .setColor(0x57ddf2)
        .setAuthor(`${user.username}#${user.discriminator}`, user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function sendRecordingTimeLimitReached(user, voiceChannel) {
    return new MessageEmbed()
        .setTitle(`Voice Message from ${user.username}`)
        .setDescription(`Recorded in voice channel "${voiceChannel.name}"`)
        .addField("Time limit reached", "The voice message was stopped at 15 minutes because it reached the time limit.")
        .setColor(0x57ddf2)
        .setAuthor(`${user.username}#${user.discriminator}`, user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}







/* Loading */

function loadingStartingRecord(user) {
    return new MessageEmbed()
        .setTitle(`Loading`)
        .setDescription(`Loading before recording, please wait...`)
        .setColor(0x4a48db)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function loadingStoppingRecord(user) {
    return new MessageEmbed()
        .setTitle(`Loading`)
        .setDescription(`Please, wait while I stop recording...`)
        .setColor(0x4a48db)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setFooter("Note: DON'T talk. While stopping, I'm still recording, so your voice will be heard in the voice message.")
        .setTimestamp();
}






/* Errors about recording */

function alreadyRecording(user) {
    return new MessageEmbed()
        .setTitle(`Already recording!`)
        .setDescription(`I am already recording a voice message for you or for someone else. Please wait until I finish.`)
        .setColor(0xf45042)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function notRecording(user) {
    return new MessageEmbed()
        .setTitle(`Currently not recording!`)
        .setDescription(`It's impossible to stop recording because I'm not recording anything(with \`v!record\`, at least).`)
        .setColor(0xf45042)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function notStartedByYou(user, startedFromUserID) {
    return new MessageEmbed()
        .setTitle(`Not allowed to stop recording!`)
        .setDescription(`This voice recording was started by <@${startedFromUserID}>, and so you're not allowed to stop it.`)
        .setColor(0xf45042)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function leftMidRecording(user) {
    return new MessageEmbed()
        .setTitle(`Left mid-recording!`)
        .setDescription(`It looks like you left mid-recording. I couldn't record your voice anymore because you left the voice channel.`)
        .setColor(0xf45042)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function unknownErrorNoPermissionMaybe(user) {
    return new MessageEmbed()
        .setTitle(`Error! Is it because I haven't permissions?`)
        .setDescription(`There's an unknown error. It could be related to the voice channel: may it be because I haven't permissions to join it? \nElse, the error should be a bug. Please feel free to contact the developer DanielVip3#6167.`)
        .setColor(0xf45042)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setFooter("Don't assume that this error's prevision is correct. The cause of the error is still unknown.")
        .setTimestamp();
}






/* Errors about member or voice channel */

function notInTheServer(user) {
    return new MessageEmbed()
        .setTitle(`Not in the server!`)
        .setDescription(`There's an unknown error. I'm sorry, but it looks like you're not in this server anymore!`)
        .setColor(0x141111)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setFooter("Don't assume that this error's prevision is correct. The cause of the error is still unknown.")
        .setTimestamp();
}

function notInAVoiceChannel(user) {
    return new MessageEmbed()
        .setTitle(`Not in a voice channel!`)
        .setDescription(`It looks like you're not in a voice channel. You must join one, which I have permissions to join, before using this command.`)
        .setColor(0x141111)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}

function anotherServerVoiceChannel(user) {
    return new MessageEmbed()
        .setTitle(`Not in a voice channel of this server!`)
        .setDescription(`It looks like you're in another server's voice channel. You must join a voice channel of this server, which I have permissions to join, before using this command.`)
        .setColor(0x141111)
        .setAuthor(`${client.user.username}#${client.user.discriminator}`, client.user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp();
}




module.exports = {
    joinTheNewVoiceChannel,
    startedRecordingWithVVoiceMessage,
    startedRecordingWithVRecord,
    stoppedRecording,
    stoppedRecordingTimeLimitReached,
    sendRecording,
    sendRecordingTimeLimitReached,
    loadingStartingRecord,
    loadingStoppingRecord,
    alreadyRecording,
    notRecording,
    notStartedByYou,
    leftMidRecording,
    unknownErrorNoPermissionMaybe,
    notInTheServer,
    notInAVoiceChannel,
    anotherServerVoiceChannel
};
