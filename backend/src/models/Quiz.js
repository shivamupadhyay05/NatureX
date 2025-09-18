const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    q: String,
    options: [String],
    answerIndex: Number,
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "pollution",
        "biodiversity",
        "climate",
        "waste",
        "energy",
        "water",
      ],
      required: true,
    },
    questions: [questionSchema],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    ecoTheme: {
      type: String,
      enum: ["waste", "energy", "water", "biodiversity", "climate"],
    },
    xp: { type: Number, default: 100 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
