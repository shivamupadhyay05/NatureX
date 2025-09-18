const mongoose = require("mongoose");

const gameScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameKey: {
      type: String,
      enum: [
        "waste-sort",
        "energy-flow",
        "crossword",
        "plant-tree",
        "recycle-dash",
        "eco-flappy",
        "trash-flight",
      ],
      required: true,
    },
    score: { type: Number, required: true },
    best: { type: Boolean, default: false },
  },
  { timestamps: true }
);

gameScoreSchema.index({ userId: 1, gameKey: 1, createdAt: -1 });

gameScoreSchema.statics.recordScore = async function (userId, gameKey, score) {
  const GameScore = this;
  const bestPrev = await GameScore.findOne({ userId, gameKey, best: true });
  let isBest = false;
  if (!bestPrev || score > bestPrev.score) {
    isBest = true;
    if (bestPrev) {
      bestPrev.best = false;
      await bestPrev.save();
    }
  }
  const rec = await GameScore.create({ userId, gameKey, score, best: isBest });
  return rec;
};

module.exports = mongoose.model("GameScore", gameScoreSchema);
