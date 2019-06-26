const Discord = require('discord.js');
const Hjson = require('hjson');
/* const mongoose = require('mongoose'); */
const fs = require('fs');
const path = require('path');

/* Config file */
const config = Hjson.parse(fs.readFileSync(path.resolve(__dirname, "./config.hjson"), 'utf8'));

/* Bot token */
const {token} = config;

/* Default bot prefix */
const defaultPrefix = "v!";

/* Discord Client */
const client = new Discord.Client();

/* Database login */
/*
const { databaseName, databaseClusterName, databaseClusterUserName, databaseClusterUserPassword } = config;
const databaseURL = `mongodb+srv://${databaseClusterUserName}:${databaseClusterUserPassword}@${databaseClusterName}.gcp.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
mongoose.connect(databaseURL, {useNewUrlParser: true});
*/

/* Object that contains every guild's recorder, stream and recording author id. The guild object is resetted when not recording, and is full when recording. */
const audioStreamPerGuild = {};
/*
	audioStreamPerGuild = {
		guild_id: {
			recorder: Recorder (recorder)
			stream: ReadableStream (audioStream)
			author_id: string (author id)
		},
	}
*/

/* Object that contains every guild's temporary voice channel, made by the bot, for the command v!voicemessage. Also, it contains the text channel where the command was used. When the voice channel doesn't exist, the guild object is resetted. */
const voiceChannelPerGuild = {};
/*
	voiceChannelPerGuild = {
		guild_id: {
			voice_channel_id: string (voice channel id)
			text_channel_id: string (text channel id)
		}
	}
*/

module.exports = {
	token,
	prefix: defaultPrefix,
	client,
	audioStreamPerGuild,
	voiceChannelPerGuild
};
