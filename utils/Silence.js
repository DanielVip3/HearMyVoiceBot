/* Class to generate audio silence to play while listening */

const { Readable } = require('stream');

/* Creates a Silence Frame, that will be pushed on-read of the stream */
const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);

class Silence extends Readable {
    /* On stream read, pushes silence, forever */
	_read() {
		this.push(SILENCE_FRAME);
	}
}

module.exports = Silence;
