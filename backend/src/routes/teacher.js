const router = require("express").Router();
const { authenticate, authorize } = require("../middleware/auth");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const User = require("../models/User");
const Quiz = require("../models/Quiz");

// Guard all routes for teachers
router.use(authenticate, authorize(["teacher", "admin"]));

// Dashboard overview
router.get("/dashboard", async (req, res) => {
  const teacherId = req.user.id;
  const classes = await Class.find({ teacherId });
  const classIds = classes.map((c) => c._id);
  const studentCount = classes.reduce(
    (sum, c) => sum + (c.studentIds?.length || 0),
    0
  );
  const assignments = await Assignment.find({ teacherId })
    .sort("-createdAt")
    .limit(50);
  const submissions = await Submission.find({
    assignmentId: { $in: assignments.map((a) => a._id) },
  })
    .sort("-createdAt")
    .limit(10);

  const avgXpAgg = await User.aggregate([
    { $match: { _id: { $in: classes.flatMap((c) => c.studentIds) } } },
    { $group: { _id: null, avgXp: { $avg: "$xp" } } },
  ]);
  const avgXp = Math.round(avgXpAgg?.[0]?.avgXp || 0);

  res.json({
    classes: classes.length,
    students: studentCount,
    assignments: assignments.length,
    avgXp,
    recentSubmissions: submissions.map((s) => ({
      id: s._id,
      status: s.status,
      createdAt: s.createdAt,
    })),
  });
});

// Quick alerts: inactive, missed, low performers
router.get("/alerts", async (req, res) => {
  const classes = await Class.find({ teacherId: req.user.id });
  const studentIds = classes.flatMap((c) => c.studentIds);
  const students = await User.find(
    { _id: { $in: studentIds } },
    { name: 1, xp: 1, updatedAt: 1 }
  ).lean();
  const now = Date.now();
  const inactive = students
    .filter(
      (s) => now - new Date(s.updatedAt).getTime() > 7 * 24 * 60 * 60 * 1000
    )
    .map((s) => ({ id: s._id, name: s.name }));
  const lowPerformers = students
    .filter((s) => s.xp < 100)
    .map((s) => ({ id: s._id, name: s.name, xp: s.xp }));
  // missed missions: submissions missing for recent assignments
  const recentAssignments = await Assignment.find({ teacherId: req.user.id })
    .sort("-createdAt")
    .limit(10);
  const subs = await Submission.find(
    { assignmentId: { $in: recentAssignments.map((a) => a._id) } },
    { assignmentId: 1, studentId: 1 }
  );
  const submittedSet = new Set(
    subs.map((s) => `${s.assignmentId}:${s.studentId}`)
  );
  const missed = [];
  recentAssignments.forEach((a) => {
    students.forEach((s) => {
      if (!submittedSet.has(`${a._id}:${s._id}`))
        missed.push({
          assignmentId: a._id,
          studentId: s._id,
          studentName: s.name,
          assignmentTitle: a.title,
        });
    });
  });
  res.json({ inactive, lowPerformers, missed });
});

// Award bonus XP
router.post("/bonus-xp", async (req, res) => {
  const { studentId, amount, reason } = req.body;
  if (!studentId || typeof amount !== "number")
    return res.status(400).json({ error: "studentId and amount required" });
  const updated = await User.findOneAndUpdate(
    { _id: studentId },
    { $inc: { xp: amount } },
    { new: true }
  );
  res.json({
    ok: true,
    student: { id: updated._id, name: updated.name, xp: updated.xp },
    reason,
  });
});

// Classes CRUD
router.get("/classes", async (req, res) => {
  const list = await Class.find({ teacherId: req.user.id });
  res.json(list);
});
router.post("/classes", async (req, res) => {
  const created = await Class.create({ ...req.body, teacherId: req.user.id });
  res.status(201).json(created);
});
router.patch("/classes/:id", async (req, res) => {
  const updated = await Class.findOneAndUpdate(
    { _id: req.params.id, teacherId: req.user.id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Class not found" });
  res.json(updated);
});
router.delete("/classes/:id", async (req, res) => {
  await Class.deleteOne({ _id: req.params.id, teacherId: req.user.id });
  res.json({ ok: true });
});

// Assignments CRUD
router.get("/assignments", async (req, res) => {
  const list = await Assignment.find({ teacherId: req.user.id }).sort(
    "-createdAt"
  );
  res.json(list);
});
router.post("/assignments", async (req, res) => {
  const created = await Assignment.create({
    ...req.body,
    teacherId: req.user.id,
  });
  res.status(201).json(created);
});
router.patch("/assignments/:id", async (req, res) => {
  const updated = await Assignment.findOneAndUpdate(
    { _id: req.params.id, teacherId: req.user.id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Assignment not found" });
  res.json(updated);
});
router.delete("/assignments/:id", async (req, res) => {
  await Assignment.deleteOne({ _id: req.params.id, teacherId: req.user.id });
  res.json({ ok: true });
});

// Submissions listing and moderate
router.get("/assignments/:id/submissions", async (req, res) => {
  const list = await Submission.find({ assignmentId: req.params.id }).sort(
    "-createdAt"
  );
  res.json(list);
});
router.post("/submissions/:id/approve", async (req, res) => {
  const updated = await Submission.findByIdAndUpdate(
    req.params.id,
    { status: "approved", feedback: req.body?.feedback },
    { new: true }
  );
  res.json(updated);
});
router.post("/submissions/:id/reject", async (req, res) => {
  const updated = await Submission.findByIdAndUpdate(
    req.params.id,
    { status: "rejected", feedback: req.body?.feedback },
    { new: true }
  );
  res.json(updated);
});

// Auto-grade quiz submission helper
router.post("/assignments/:id/grade-quiz", async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment || assignment.contentType !== "quiz")
    return res.status(400).json({ error: "Invalid quiz assignment" });
  const quiz = await Quiz.findById(assignment.contentId);
  const answers = req.body.answers || []; // [{questionIndex, selectedIndex}]
  let correct = 0;
  const quizAnswers = quiz.questions.map((q, idx) => {
    const sel = answers.find((a) => a.questionIndex === idx)?.selectedIndex;
    const isCorrect = sel === q.answerIndex;
    if (isCorrect) correct += 1;
    return { questionIndex: idx, selectedIndex: sel ?? -1, isCorrect };
  });
  const scorePercent = quiz.questions.length
    ? Math.round((correct / quiz.questions.length) * 100)
    : 0;
  const created = await Submission.create({
    assignmentId: assignment._id,
    studentId: req.user.id,
    status: "submitted",
    scorePercent,
    quizAnswers,
  });
  res.status(201).json(created);
});

module.exports = router;
