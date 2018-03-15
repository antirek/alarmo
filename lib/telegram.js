// const Telegraf = require('telegraf')
// const Extra = require('telegraf/extra')
// const Markup = require('telegraf/markup')
const session = require('telegraf/session')
// const format = require('util').format

// const console = require('tracer').colorConsole()

const telegramStartHandler = require('./telegramStartHandler')
const telegramContactHandler = require('./telegramContactHandler')

class telegramServer {
  constructor (TelegrafApp, User, Messages) {
    let telegramStartHandler1 = telegramStartHandler(User, Messages)
    let telegramContactHandler1 = telegramContactHandler(User, Messages)

    this.telegrafApp = TelegrafApp
    this.telegrafApp.use(session())

    this.telegrafApp.command('start', telegramStartHandler1.route)
    this.telegrafApp.on('contact', telegramContactHandler1.route)
  }
}

module.exports = telegramServer
