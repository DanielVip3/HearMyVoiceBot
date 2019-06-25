const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let guilds = new Schema({
	guild_id: { type: String, index: true, unique: true },
	guild_prefix: String,
});

module.exports = {
	guilds
};
