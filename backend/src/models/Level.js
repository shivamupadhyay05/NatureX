const mongoose = require('mongoose')

const levelSchema = new mongoose.Schema({
	number: { type: Number, required: true, unique: true },
	requiredXp: { type: Number, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Level', levelSchema)

