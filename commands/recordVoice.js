const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;
const audioStreamPerGuild = constants.audioStreamPerGuild;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

const embeds = require("../utils/embeds.js");

const Recorder = require("../utils/Recorder.js");

client.on('message', async(message) => {
	if (!message.author.bot && message.channel.type === "text" && message.content.startsWith(`${prefix}record`)) {

		/* If bot can't write messages */
		if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

		if (audioStreamPerGuild[message.guild.id]) {
			await message.channel.send({
				embed: embeds.alreadyRecording(member.user)
			});
			return;
		}

		if (voiceChannelPerGuild[message.guild.id] && voiceChannelPerGuild[message.guild.id]['voice_channel_id']) {
			await message.channel.send({
				embed: embeds.alreadyRecording(message.author)
			});
			return;
		}
		
		let member = await message.guild.member(message.author);
		
		if (!member) {
			await message.author.send({
				embed: embeds.notInTheServer(message.author)
			});
			return;
		}
		
		if (!member.voice || !member.voice.channel) {
			await message.channel.send({
				embed: embeds.notInAVoiceChannel(message.author)
			});
			return;
		}

		/* Member's actual voice channel */
		let voiceChannel = member.voice.channel;

		/* If voiceChannel's guild id is different from this command's guild id, means that the user is in a voice channel, but in another server */
		if (message.guild.id !== voiceChannel.guild.id) {
			await message.channel.send({
				embed: embeds.anotherServerVoiceChannel(message.author)
			});
			return;
		}

		/* A loading message before starting to record */
		let loadingMessage = await message.channel.send({
			embed: embeds.loadingStartingRecord(message.author)
		});
		await message.react("✅");

		/* Joins voice channel */
		voiceChannel.join()
			.then(async(connection) => {
				/* Prepares to record, so plays Silence for the entire duration of the recording */
				await Recorder.prepareToRecord(connection);

				/* Deletes user's message which contains the command */
				await message.delete();

				/* Deletes loading message */
				await loadingMessage.delete();

				/* Informs the user that the bot is recording his voice */
				await message.author.send({
					embed: embeds.startedRecordingWithVRecord(message.author, prefix)
				});

				const receiver = connection.receiver;

				/* Creates a new VoiceRecorder */
				let recorder = new Recorder(message.guild, receiver);

				/* Starts recording */
				await recorder.startRecording(message.author, async(mp3FilePath, timeLimitReached) => { // mp3FilePath is the full file path to the recorded .mp3 file, timeLimitReached is a boolean that is true if the time limit(15min) was reached, else is false
					/*
					* ALL OF THIS JUST HAPPENS AFTER THE MP3 FILE IS CREATED AND JUST BEFORE THE MP3 FILE IS DELETED.
					*/

					/* Disconnects from voice channel */
					connection.disconnect();

					let embed = await embeds.sendRecording(message.author, voiceChannel);

					/* If time limit is reached, use the correct embed */
					if (timeLimitReached) embed = embeds.sendRecordingTimeLimitReached(message.author, voiceChannel);

					/* Sends voice message in the channel */
					await message.channel.send({embed});
					await message.channel.send({
						files: [{
							attachment: mp3FilePath,
							name: `Voice Message by ${message.author.username} | ${Date.now().toString()}.mp3`
						}],
					});
				});

				/* Adds recorder to audioStreamPerGuild for the current guild */
				audioStreamPerGuild[message.guild.id]['recorder'] = recorder;
			})
			.catch(async(error) => {
				console.error(error);
				await message.channel.send({
					embed: embeds.unknownErrorNoPermissionMaybe(message.author)
				});
			});
	}
});
