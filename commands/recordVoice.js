const Discord = require('discord.js');

const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;

const Recorder = require("../utils/Recorder.js");

client.on('message', async(message) => {
	if (!message.author.bot && message.channel.type === "text" && message.content.startsWith(`${prefix}record`)) {
		if (audioStreamPerGuild[message.guild.id]) {
			await message.channel.send(`<@${message.author.id}>, I am already recording a voice message in another voice channel. Please wait until I finish.`);
			return;
		}
		
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
		
		let loadingMessage = await message.channel.send("Loading, please wait...");
		await message.react("✅");
		
		voiceChannel.join()
			.then(async(connection) => {
				await Recorder.prepareToRecord(connection);
				
				await message.delete();
				let listeningMessage = await message.author.send(`I'm now recording your voice, **send \`${prefix}stop\` in the channel you want to stop recording and send your voice message.**`);
				
				const receiver = connection.receiver;
				
				await loadingMessage.delete();
			
				let recorder = new Recorder(message.guild, receiver);
				
				await recorder.startRecording(message.author, async(mp3FileName) => {
					listeningMessage.delete();
					
					connection.disconnect();
					
					let embed = await new Discord.MessageEmbed()
						.setTitle(`Voice Message from ${message.author.username}`)
						.setDescription(`Recorded in voice channel "${voiceChannel.name}"`)
						.setColor(0x00FA9A)
						.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
						.setThumbnail(message.author.displayAvatarURL())
						.setTimestamp();
					
					await message.channel.send({embed});
					await message.channel.send({
						files: [{
							attachment: mp3FileName,
							name: `Voice Message by ${message.author.username} | ${Date.now().toString()}.mp3`
						}],
					});
				});
				
				audioStreamPerGuild[message.guild.id]['recorder'] = recorder;
			})
			.catch(async(error) => {
				console.error(error);
				await message.channel.send("There was an unknown error. It could be related to the voice channel: may it be because I haven't permissions to join it? Else, the error should be a bug. Please feel free to contact the developer DanielVip3#6167.");
			});
	}
});
