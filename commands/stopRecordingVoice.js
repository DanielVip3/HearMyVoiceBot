const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;

const Recorder = require("../utils/Recorder.js");

client.on('message', async(message) => {
	if (!message.author.bot && message.channel.type === "text" && message.content.startsWith(`${prefix}stop`)) {
		let member = await message.guild.member(message.author);
		
		if (!member) {
			await message.channel.send("There was an unknown error. We're sorry, but it looks like you're not in this server anymore!");
			return;
		}
		
		if (!audioStreamPerGuild[message.guild.id]) {
			await message.channel.send("It was impossible to stop recording because I wasn't recording anything.");
			return;
		}
		
		if (audioStreamPerGuild[message.guild.id]["author_id"] !== message.author.id) {
			await message.channel.send(`This voice recording was started by <@${audioStreamPerGuild[message.guild.id]["author_id"]}>, and so you're not allowed to stop it.`);
			return;
		}
		
		await message.author.send("You stopped recording.\n----------------");
		let stopMessage = await message.channel.send("Please, wait while I stop recording... (don't talk, I'm still recording)");
		await message.react("✅");
		
		setTimeout(async() => {
			let recorder = audioStreamPerGuild[message.guild.id]['recorder'];
			await recorder.stopRecording(message.author);
			await stopMessage.delete();
			await message.delete();
		}, 2000);
	}
});