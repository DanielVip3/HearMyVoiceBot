const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let guilds = new Schema({
	guild_id: String,
	guild_prefix: String,
	voiceRecord: {
		author_id: String,
		stream: Mixed,
	}
});

module.exports = {
	guilds
};
