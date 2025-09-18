const mongoose = require('mongoose')

const institutionSchema = new mongoose.Schema({
	name: { type: String, required: true },
	city: String,
	region: String,
}, { timestamps: true })

module.exports = mongoose.model('Institution', institutionSchema)

