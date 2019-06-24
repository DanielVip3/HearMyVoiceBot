const Discord = require('discord.js');

const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;

const fs = require('fs');
const path = require('path');
const Lame = require("node-lame").Lame;

let audioFilePath = path.join(__dirname, '..', `/audio`);

function generateFileName(channel, member) {
	let pathvar = path.join(__dirname, '..', `/recordings`);
	const fileName = pathvar+`/${channel.id}-${member.id}-${Date.now()}.pcm`;
	return fileName;
}

client.on('message', async(message) => {
	if (!message.author.bot && message.channel.type === "text" && message.content.startsWith(`${prefix}record`)) {
		let member = await message.guild.member(message.author);
		
		if (!member) {
			await message.channel.send("There was an unknown error. We're sorry, but it looks like you're not in this server anymore!");
			return;
		}
		
		if (!member.voice || !member.voice.channel) {
			await message.channel.send("It looks like you're not in a voice channel. You must join one before using this command.");
			return;
		}
		
		let voiceChannel = await message.guild.channels.find(channel => channel.id === member.voice.channelID);
		
		if (voiceChannel.guild.id !== message.guild.id) {
			await message.channel.send("It looks like you're in another server's voice channel. You must join a voice channel of this server before using this command.");
			return;
		}
		
		voiceChannel.join()
			.then(async(connection) => {
				await connection.play(audioFilePath);
				await message.channel.send("Listening.");
				const receiver = connection.receiver;
				
				let audioStream = await receiver.createStream(message.author, {mode: 'pcm', end: 'silence'});
				
				const fileName = generateFileName(voiceChannel, message.author);
				const outputStream = fs.createWriteStream(fileName, {flags: "w"});
						
				audioStream.pipe(outputStream);
				
				audioStream.on('close', () => {
					connection.disconnect();
					
					let mp3FileName = fileName.replace('.pcm', '.mp3');
					
					const encoder = new Lame({
						output: mp3FileName,
						raw: true,
						bitrate: 192
					}).setFile(fileName);
					
					encoder
						.encode()
						.then(async() => {
							await message.channel.send(`Voice message by <@${message.author.id}>`);
							await message.channel.send({
								files: [mp3FileName],
							});
						})
						.catch(error => {
							console.error(error);
						});
				});
			})
			.catch(async(error) => {
				console.error(error);
				await message.channel.send("There was an unknown error. It could be related to the voice channel: may it be because I haven't permissions to join it? Else, the error should be a bug. Please feel free to contact the developer DanielVip3#6167.");
				return;
			});
	}
});