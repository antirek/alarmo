const helper = require('./../helper')
// const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const console = require('tracer').colorConsole()
const format = require('util').format

let telegramStartHandler = (User, Messages) => {
  let route = (ctx) => {
    let chatId = ctx.update.message.from.id

    console.log('chatId:', chatId)
    return User.findOne({chatId})
      .then((currentUser) => {
        console.log('currentUser:', currentUser)
        if (!currentUser) {
          console.log('current user not found in db, request to send number')
          let message = format(Messages.hello, helper.getUserFullName(ctx.from))
          ctx.reply(message, Markup
            .keyboard([
              Markup.contactRequestButton('Отправить номер')
            ])
            .oneTime(true)
            .resize(false)
            .extra()
          )
        } else {
          console.log('user already registered', currentUser)
          let message = format(Messages.exist, helper.getUserFullName(ctx.from))
          ctx.reply(message, Markup.removeKeyboard().extra())
        }
      })
      .catch(console.log)
  }

  return {route}
}

module.exports = telegramStartHandler
