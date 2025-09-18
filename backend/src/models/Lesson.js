const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
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
    content: { type: String, required: true },
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

module.exports = mongoose.model("Lesson", lessonSchema);
