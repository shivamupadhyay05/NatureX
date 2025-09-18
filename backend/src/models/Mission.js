const mongoose = require('mongoose')

const missionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	type: { type: String, enum: ['digital', 'real-world', 'habit'], required: true },
	description: String,
	xp: { type: Number, default: 150 },
}, { timestamps: true })

module.exports = mongoose.model('Mission', missionSchema)

