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
				
				return true;
			}
			
			return false;
		}
		
		return false;
	}
	
	async saveRecording(callback) {
		this.isRecording = false;
		
		const encoder = new Lame({
			output: this.mp3FileName,
			raw: true,
			bitrate: 192
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