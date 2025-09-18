const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
	q: String,
	options: [String],
	answerIndex: Number,
}, { _id: false })

const quizSchema = new mongoose.Schema({
	title: { type: String, required: true },
	category: { type: String, enum: ['pollution', 'biodiversity', 'climate', 'waste'], required: true },
	questions: [questionSchema],
	xp: { type: Number, default: 100 },
}, { timestamps: true })

module.exports = mongoose.model('Quiz', quizSchema)

