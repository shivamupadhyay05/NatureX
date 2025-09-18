const router = require("express").Router();
const { authenticate, authorize } = require("../middleware/auth");
const GameScore = require("../models/GameScore");
const User = require("../models/User");

router.use(authenticate, authorize(["student", "teacher", "admin"]));

router.post("/:gameKey/score", async (req, res) => {
  const { gameKey } = req.params;
  const { score } = req.body;
  if (typeof score !== "number" || score < 0)
    return res.status(400).json({ error: "Invalid score" });
  const rec = await GameScore.recordScore(req.user.id, gameKey, score);
  res.status(201).json(rec);
});

router.get("/:gameKey/leaderboard", async (req, res) => {
  const { gameKey } = req.params;
  const top = await GameScore.find({ gameKey, best: true })
    .sort({ score: -1 })
    .limit(50)
    .lean();
  const userIds = [...new Set(top.map((t) => String(t.userId)))];
  const users = await User.find({ _id: { $in: userIds } }, { name: 1 }).lean();
  const userMap = Object.fromEntries(users.map((u) => [String(u._id), u.name]));
  const withNames = top.map((t) => ({
    score: t.score,
    userId: t.userId,
    name: userMap[String(t.userId)] || "Anonymous",
  }));
  res.json(withNames);
});

router.get("/:gameKey/me", async (req, res) => {
  const { gameKey } = req.params;
  const recent = await GameScore.find({ gameKey, userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(10);
  const best = await GameScore.findOne({
    gameKey,
    userId: req.user.id,
    best: true,
  });
  res.json({ recent, best });
});

module.exports = router;
