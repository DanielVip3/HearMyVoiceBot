const defaultPrefix = require('../constants.js').prefix;
const { Guild } = require('./models.js');

class Database {
	constructor() {
	}
	
	static async addNewGuildIfNotExists(guild, prefix=null) {
		if (await Guild.exists({guild_id: guild.id})) {
			return false;
		}
		
		if (!prefix || typeof prefix !== "string") {
			prefix = defaultPrefix;
		}
		
		let documentGuild = new Guild({
			guild_id: guild.id,
			guild_prefix: prefix,
			voiceRecord: {
				author_id: null,
				stream: null,
			}
		});
		
		documentGuild.save(function (err) {
			if (err) {
				console.error("addNewGuild | Impossible to add a new guild document to the database!");
				return;
			}
		});
		
		return true;
	}
	
	static async setGuildPrefix(guild, prefix) {
		if (!await Guild.exists({guild_id: guild.id})) {
			console.error("setGuildPrefix | The guild requested doesn't exist.");
			return false;
		}
		
		if (!prefix || typeof prefix !== "string") {
			prefix = defaultPrefix;
		}
		
		Guild.updateOne({guild_id: guild.id}, {
			guild_prefix: prefix,
		}, function(err, res) {
			if (err) {
				console.error("setGuildPrefix | Impossible to edit guild prefix in the database!");
				return;
			}
		});
		
		return true;
	}
	
	static getGuild(guild, callback) {
		return Guild.findOne({guild_id: guild.id}, callback); // err and guild are passed
	}
	
	static getGuildById(guild_id, callback) {
		return Guild.findOne({guild_id: guild_id}, callback); // err and guild are passed
	}
}

module.exports = Database;