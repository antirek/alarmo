const session = require('telegraf/session')
const telegramStartHandler = require('./telegramStartHandler')
const telegramContactHandler = require('./telegramContactHandler')

class telegramServer {
  constructor (TelegrafApp, store, Messages) {
    let telegramStartHandler1 = telegramStartHandler(store, Messages)
    let telegramContactHandler1 = telegramContactHandler(store, Messages)

    this.telegrafApp = TelegrafApp
    this.telegrafApp.use(session())

    this.telegrafApp.command('start', telegramStartHandler1.route)
    this.telegrafApp.on('contact', telegramContactHandler1.route)
  }
}

module.exports = telegramServer
