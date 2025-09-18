const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["lesson", "quiz", "mission"],
      required: true,
    },
    contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    dueAt: { type: Date },
    rewards: {
      xp: { type: Number, default: 0 },
      badges: [{ type: String }],
    },
    verification: {
      type: String,
      enum: ["none", "photo", "approval"],
      default: "none",
    },
    leaderboardScope: {
      type: String,
      enum: ["class", "global"],
      default: "class",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
