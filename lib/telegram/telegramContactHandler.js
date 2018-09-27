const helper = require('./../helper')
// const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const console = require('tracer').colorConsole()
const format = require('util').format

let telegramContactHandler = (store, Messages) => {
  let route = (ctx) => {
    if (ctx.message.contact.user_id !== ctx.from.id) {
      console.log('contact number is not number of session user')
      let message = format(Messages.notyournumber, helper.getUserFullName(ctx.from))
      ctx.reply(message)
      return
    }

    let phoneNumber = helper.modifyPhoneNumber(ctx.message.contact.phone_number)

    store.getUserByTelegramChatIdOrNumber(ctx.from.id, phoneNumber)
      .then(currentUser => {
        if (!currentUser.telegramChatId) {
          return store.updateByNumber(phoneNumber, {telegramChatId: ctx.from.id})
            .then(() => {
              console.log('update user')
              let message = format(Messages.registered, helper.getUserFullName(ctx.from))
              ctx.reply(message, Markup.removeKeyboard().extra())
            })
        } else {
          console.log('already registered')
          ctx.reply('already registered')
        }
      })
      .catch(err => {
        if (err.message === 'no user') {
          store.save({
            telegramChatId: ctx.from.id,
            number: helper.modifyPhoneNumber(ctx.message.contact.phone_number),
            title: helper.getUserFullName(ctx.message.contact)
          })
          console.log('save new user from telegram')
          let message = format(Messages.registered, helper.getUserFullName(ctx.from))
          ctx.reply(message, Markup.removeKeyboard().extra())
        } else {
          console.log('unknown error', err)
        }
      })
  }
  return {route}
}

module.exports = telegramContactHandler
