
const mongoose = require("mongoose");

async function connect() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB || "naturex";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName });
  console.log("MongoDB connected");
}

module.exports = { connect };
