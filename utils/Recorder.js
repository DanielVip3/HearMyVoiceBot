const fs = require('fs');
const Lame = require("node-lame").Lame;
const generateRecordingFilePath = require('./generateRecordingFilePath.js');

const embeds = require("../utils/embeds.js");

const Silence = require("../utils/Silence.js");

const constants = require('../constants.js');

const audioStreamPerGuild = constants.audioStreamPerGuild;
const voiceChannelPerGuild = constants.voiceChannelPerGuild;

class Recorder {
	/*
	* guild should be an instance of Guild
	* receiver should be an instance of VoiceReceiver
	*/
	constructor(guild, receiver) {
		this.guild = guild;
		this.receiver = receiver;
		this.isRecording = false;
	}

	/*
	* Static function that plays silence forever in the passed VoiceConnection. Should be manually called.
	* This function is fundamental because bot can't hear anything if isn't playing anything.
	*/
	static async prepareToRecord(connection) {
		await connection.play(new Silence(), { type: 'opus' });
	}

	/*
	* Fuction that starts recording. Should be manually called.
	* user should be an instance of User object
	* callbackOnRecorded should be a callback function, and a parameter is passed, containing recorded mp3 file path.
	*/
	async startRecording(user, callbackOnRecorded) {
		this.userId = user.id;
		
		this.filePath = await generateRecordingFilePath(this.userId);
		this.mp3FilePath = this.filePath.replace('.pcm', '.mp3');
		
		/* Starts recording a user's voice stream */
		let audioStream = await this.receiver.createStream(user, {mode: 'pcm', end: 'manual'});
		this.audioStream = audioStream;
		
		audioStreamPerGuild[this.guild.id] = {
			stream: audioStream,
			author_id: user.id,
			recorder: this
		};

		/* Pipes recorded audio stream into an mp3 file, converted to writable stream */
		const mp3FileStream = await fs.createWriteStream(this.filePath, {flags: "w"});
		audioStream.pipe(mp3FileStream);

		/* When the audio stream closes(finishes), because it's closed by the function audioStream.destroy() used in stopRecording */
		audioStream.on('close', () => {
			/* Saves recording */
			this.saveRecording(callbackOnRecorded, false);
		});
		
		this.isRecording = true;

		/* If after 15 minutes, voice recording didn't finish */
		this.timeout = setTimeout(async() => {
			/* Tells to the user that it took more than 15 minutes, and that's the voice message's max length */
			await user.send({
				embed: embeds.stoppedRecordingTimeLimitReached(user)
			});

			/* Saves recording anyway */
			this.saveRecording(callbackOnRecorded, true);

			/* Leaves the voice channel */
			if (this.guild && this.guild.me.voice && this.guild.me.voice.channel) {
				await this.guild.me.voice.channel.leave();
			}

			audioStreamPerGuild[this.guild.id] = null;
			voiceChannelPerGuild[this.guild.id] = null;
		}, 1000*60*15); // 15 minutes in milliseconds

		return audioStream;
	}

	/*
	* Fuction that starts recording. Should be manually called, necessarily AFTER the one that starts recording.
	* byUser should be an instance of User object, who started the recording and now wants to stop it.
	*/
	async stopRecording(byUser) {
		if (!this.audioStream || !this.user) {
			this.audioStream = audioStreamPerGuild[this.guild.id].stream;
			this.userId = audioStreamPerGuild[this.guild.id].author_id;
		}
		
		if (this.audioStream && this.userId) {
			if (byUser.id === this.userId) {
				/* Destroys the audioStream, to end recording. When destroy is called, also it's called the callback in startRecording, audioStream.on('close') */
				await this.audioStream.destroy();
				
				audioStreamPerGuild[this.guild.id] = null;
				
				this.isRecording = false;

				if (this.timeout) clearTimeout(this.timeout);
				
				return true;
			}
		}
		
		return false;
	}

	/*
	* Fuction that saves and encodes recording. Shouldn't be manually called, because it's called right after stopRecording, automatically.
	* callback is the same parameter callbackOnRecorded passed to startRecording, and it's passed automatically, and executed.
	*/
	async saveRecording(callback, timeLimitReached) {
		this.isRecording = false;

		/*
		* I don't have any experience with encoding, but I noticed that if I set sfreq to low values(8, 11.025, 12) it looks like a demonic voice.
		* From 16, 22.05, 24, 32 to 44.1 it looks like a very deep voice.
		* 48 is a normal voice.
		*/
		const encoder = new Lame({
			output: this.mp3FilePath,
			raw: true,
			bitrate: 192,
			scale: 3,
			sfreq: 48
		}).setFile(this.filePath);
		
		encoder
			.encode()
			.then(async() => {
				/* Removes .pmc recorded file */
				await fs.unlinkSync(this.filePath);
				
				/* Calls callback function, file path .mp3 is passed and a boolean, timeLimitReached, that means if the time limit is reached or not */
				await callback(this.mp3FilePath, timeLimitReached);

				/* Removes .mp3 encoded file */
				await fs.unlinkSync(this.mp3FilePath);
			})
			.catch(error => {
				console.error(error);
			});
	}

	/* Function that returns true if this Recorder is recording, else returns false */
	getIsRecording() {
		return this.isRecording;
	}
}

module.exports = Recorder;
