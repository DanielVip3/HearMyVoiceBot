const mongoose = require('mongoose');

const schemas = require('./schemas.js');

const guildsSchema = schemas.guilds;
let Guild = mongoose.model('Guild', guildsSchema);

module.exports = {
	Guild,
};