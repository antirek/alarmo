const config = require("config");
const mongoose = require("mongoose");
mongoose.Promise = Promise;

const db = mongoose.createConnection(config.db, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
  name: String,
  number: String,
  telegramChatId: String,
  viberUserId: String,
});

const User = db.model("user", userSchema);

export { User };
