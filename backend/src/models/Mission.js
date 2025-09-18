const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["digital", "real-world", "habit"],
      required: true,
    },
    description: String,
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    ecoTheme: {
      type: String,
      enum: ["waste", "energy", "water", "biodiversity", "climate"],
    },
    xp: { type: Number, default: 150 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mission", missionSchema);
