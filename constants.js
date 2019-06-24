const Discord = require('discord.js');
const Hjson = require('hjson');
const fs = require('fs');
const path = require('path');

const config = Hjson.parse(fs.readFileSync(path.resolve(__dirname, "./config.hjson"), 'utf8'));

const {token} = config;
const defaultPrefix = "v!";

const client = new Discord.Client();

const audioStreamPerGuild = {};
/*
	audioStreamPerGuild = {
		guild_id: {
			stream: ReadableStream (audioStream)
			author_id: string (author id)
		},
	}
*/

module.exports = {
	token,
	prefix: defaultPrefix,
	client,
	audioStreamPerGuild
};