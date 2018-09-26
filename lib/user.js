const config = require('config')
const mongoose = require('mongoose')
mongoose.Promise = Promise

let db = mongoose.createConnection(config.db)
let userSchema = new mongoose.Schema({
  telegramChatId: String,
  viberUserId: String,
  number: String,
  name: String
})

let User = db.model('user', userSchema)
module.exports = User
