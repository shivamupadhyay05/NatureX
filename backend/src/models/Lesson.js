const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
	title: { type: String, required: true },
	category: { type: String, enum: ['pollution', 'biodiversity', 'climate', 'waste'], required: true },
	content: { type: String, required: true },
	xp: { type: Number, default: 100 },
}, { timestamps: true })

module.exports = mongoose.model('Lesson', lessonSchema)

