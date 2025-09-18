const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	passwordHash: { type: String, required: true },
	role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
	institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
	xp: { type: Number, default: 0 },
	level: { type: Number, default: 1 },
	badges: [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)

