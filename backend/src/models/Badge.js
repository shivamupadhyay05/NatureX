const mongoose = require('mongoose')

const badgeSchema = new mongoose.Schema({
	code: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	description: String,
}, { timestamps: true })

module.exports = mongoose.model('Badge', badgeSchema)

