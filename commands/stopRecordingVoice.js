const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;

const embeds = require("../utils/embeds.js");

client.on('message', async(message) => {
	if (!message.author.bot && message.channel.type === "text" && message.content.startsWith(`${prefix}stop`)) {

		/* If bot can't write messages */
		if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

		let member = await message.guild.member(message.author);
		
		if (!member) {
			await message.author.send({
				embed: embeds.notInTheServer(message.author)
			});
			return;
		}

		/* If audioStreamPerGuild, for this guild, was not found */
		/* Means that no recording was started */
		if (!audioStreamPerGuild[message.guild.id]) {
			await message.channel.send({
				embed: embeds.notRecording(message.author)
			});
			return;
		}

		/* If the user who started the recording, in audioStreamPerGuild, is different from the user who used this command */
		/* Means that this user tried to stop recording, but he wasn't the one who started to record, so he can't */
		if (audioStreamPerGuild[message.guild.id]["author_id"] !== message.author.id) {
			await message.channel.send({
				embed: embeds.notStartedByYou(message.author, audioStreamPerGuild[message.guild.id]["author_id"])
			});
			return;
		}

		/* Let the user know that he stopped recording */
		await message.author.send({
			embed: embeds.stoppedRecording(message.author)
		});
		/* While stopping recording using this command, the bot continues to record for another 0.5 second, and so the bot informs the user about this, with this embed message */
		let stopMessage = await message.channel.send({
			embed: embeds.loadingStoppingRecord(message.author)
		});
		await message.react("✅");

		if (audioStreamPerGuild[message.guild.id]) {
			/* Gets the recorder and stops recording */
			let recorder = audioStreamPerGuild[message.guild.id]['recorder'];
			await recorder.stopRecording(message.author);
		}

		/* Deletes stop message sent in the guild, and the user's message that contains the command */
		await stopMessage.delete();
		await message.delete();
	}
});
