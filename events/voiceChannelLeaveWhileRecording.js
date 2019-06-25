const Discord = require('discord.js');

const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;

const Recorder = require("../utils/Recorder.js");

client.on('voiceStateUpdate', async(oldState, newState) => {
	if (oldState && oldState.channelID && oldState.channelID != newState.channelID) {
		let member = newState.member;
		
		if (audioStreamPerGuild[member.guild.id] && audioStreamPerGuild[member.guild.id].recorder) {
			
			let recorder = audioStreamPerGuild[member.guild.id].recorder;
			let userId = audioStreamPerGuild[member.guild.id].author_id;
			if (recorder.getIsRecording() && userId === member.user.id) {
				member.user.send("It looks like you left mid-recording. I couldn't record your voice anymore because you left the voice channel.\n----------------");
				member.guild.me.voice.channel.leave();
			}
		}
	}
});