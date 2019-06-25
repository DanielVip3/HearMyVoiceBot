const path = require('path');

function generateFileName(userId) {
	let pathvar = path.join(__dirname, '..', `/recordings`);
	const fileName = pathvar+`/${userId}-${Date.now()}.pcm`;
	return fileName;
}

module.exports = generateFileName;