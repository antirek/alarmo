const config = require("config");
const mongoose = require("mongoose");
mongoose.Promise = Promise;

const db = mongoose.createConnection(config.db);
const userSchema = new mongoose.Schema({
  name: String,
  number: String,
  telegramChatId: String,
  viberUserId: String,
});

const User = db.model("user", userSchema);

export { User };
