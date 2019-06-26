/* Function to generate full path of files to be recorded, in .pmc */

const path = require('path');

/* Requires a user's id as string parameter, specifically the user who started recording */
function generateRecordingFilePath(userId) {

	/* Gets recording folder path */
	let pathvar = path.join(__dirname, '..', `/recordings`);

	/* Creates full path, by fusing recording folder path + file name.pmc */
	const filePath = pathvar+`/${userId}-${Date.now()}.pcm`;

	return filePath;
}

module.exports = generateRecordingFilePath;
