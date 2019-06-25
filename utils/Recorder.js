const fs = require('fs');
const Lame = require("node-lame").Lame;
const generateRecordingFileName = require('./generateRecordingFileName.js');
const Silence = require("../utils/Silence.js");

const constants = require('../constants.js');
const audioStreamPerGuild = constants.audioStreamPerGuild;

class Recorder {
	/* Receiver is only required if you want to start recording, not if you want to stop it */
	constructor(guild, receiver=null) {
		this.guild = guild;
		this.receiver = receiver;
		this.isRecording = false;
	}
	
	static async prepareToRecord(connection) {
		await connection.play(new Silence(), { type: 'opus' });
	}
	
	async startRecording(user, callbackOnRecorded) {
		this.userId = user.id;
		
		this.fileName = await generateRecordingFileName(this.userId);
		this.mp3FileName = this.fileName.replace('.pcm', '.mp3');
		
		/* Starts recording */
		let audioStream = await this.receiver.createStream(user, {mode: 'pcm', end: 'manual'});
		this.audioStream = audioStream;
		
		audioStreamPerGuild[this.guild.id] = {
			stream: audioStream,
			author_id: user.id,
			recorder: this
		};
		
		const mp3FileStream = await fs.createWriteStream(this.fileName, {flags: "w"});
		audioStream.pipe(mp3FileStream);
		audioStream.on('close', () => {
			this.saveRecording(callbackOnRecorded);
		});
		
		this.isRecording = true;

		/* If after 15 minutes, voice recording didn't finish */
		this.timeout = setTimeout(async() => {
			await user.send("It looks that your voice message is too long. I'm sorry, I had to stop it because I can't handle messages longer than 15 minutes.");
			this.saveRecording(callbackOnRecorded);

			if (this.guild && this.guild.me.voice && this.guild.me.voice.channel) {
				await this.guild.me.voice.channel.leave();
			}
		}, 1000*60*15);

		return audioStream;
	}
	
	async stopRecording(byUser) {
		if (!this.audioStream || !this.user) {
			this.audioStream = audioStreamPerGuild[this.guild.id].stream;
			this.userId = audioStreamPerGuild[this.guild.id].author_id;
		}
		
		if (this.audioStream && this.userId) {
			if (byUser.id === this.userId) {
				await this.audioStream.destroy();
				
				audioStreamPerGuild[this.guild.id] = null;
				
				this.isRecording = false;

				if (this.timeout) clearTimeout(this.timeout);
				
				return true;
			}
			
			return false;
		}
		
		return false;
	}
	
	async saveRecording(callback) {
		this.isRecording = false;

		/*
		* I don't have any experience with encoding, but I noticed that if I set sfreq to low values(8, 11.025, 12) it looks like a demonic voice.
		* From 16, 22.05, 24, 32 to 44.1 it looks like a very deep voice.
		* 48 is a normal voice.
		*/
		
		const encoder = new Lame({
			output: this.mp3FileName,
			raw: true,
			bitrate: 192,
			scale: 3,
			sfreq: 48
		}).setFile(this.fileName);
		
		encoder
			.encode()
			.then(async() => {
				await fs.unlinkSync(this.fileName);
				
				/* file path .mp3 is passed */
				await callback(this.mp3FileName);
				
				await fs.unlinkSync(this.mp3FileName);
			})
			.catch(error => {
				console.error(error);
			});
	}
	
	getIsRecording() {
		return this.isRecording;
	}
	
	getUserId() {
		return this.userId;
	}
}

module.exports = Recorder;
