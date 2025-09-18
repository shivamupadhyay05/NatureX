const mongoose = require("mongoose");

const quizAnswerSchema = new mongoose.Schema(
  {
    questionIndex: Number,
    selectedIndex: Number,
    isCorrect: Boolean,
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "approved", "rejected"],
      default: "submitted",
    },
    scorePercent: { type: Number, default: 0 },
    quizAnswers: [quizAnswerSchema],
    evidenceUrl: { type: String },
    feedback: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
