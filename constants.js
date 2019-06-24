const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./config.json"), 'utf8'));

const token = config.token;
const defaultPrefix = "v!";

const client = new Discord.Client();

module.exports = {
	token,
	prefix: defaultPrefix,
	client
};