const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const { connect } = require("./src/config/db");

// dev fallback for JWT secret
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "dev-secret-change-in-prod";
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/content", require("./src/routes/content"));
app.use("/api/leaderboard", require("./src/routes/leaderboard"));
app.use("/api/teacher", require("./src/routes/teacher"));
app.use("/api/games", require("./src/routes/games"));

const PORT = process.env.PORT || 4000;
connect()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
