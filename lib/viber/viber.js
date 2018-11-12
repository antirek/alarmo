const ViberBot = require('viber-bot').Bot
const BotEvents = require('viber-bot').Events
const TextMessage = require('viber-bot').Message.Text
const ContactMessage = require('viber-bot').Message.Contact

const http = require('http')

const winston = require('winston')
const toYAML = require('winston-console-formatter')

const helper = require('./../helper')

class Viber {
  constructor (config, store) {
    this.store = store
    this.config = config

    function createLogger () {
      const logger = new winston.Logger({level: 'debug'})
      logger.add(winston.transports.Console, toYAML.config())
      return logger
    }

    const logger = createLogger()

    this.bot = new ViberBot({
      logger: logger,
      authToken: config.token,
      name: config.name,
      avatar: config.avatar || 'http://viber.com/avatar.jpg'
    })

    const keyboard = {
      'Type': 'keyboard',
      'DefaultHeight': true,
      'BgColor': '#FFFFFF',
      'Buttons': [{
        'Columns': 6,
        'Rows': 1,
        'BgColor': '#2db9b9',
        'BgLoop': true,
        'ActionType': 'share-phone',
        'ActionBody': 'none',
        'Text': 'Получать уведомдения по номеру телефона',
        'TextVAlign': 'middle',
        'TextHAlign': 'center',
        'TextOpacity': 60,
        'TextSize': 'regular'
      }]
    }

    this.bot.onTextMessage(/^start|старт|начало|hi|hello$/i, (message, response) => {
      response.send(new TextMessage('привет', keyboard, null, null, null, 3))
    })

    this.bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
      console.log(message)
      console.log(response.userProfile.id)

      if (message instanceof ContactMessage) {
        console.log('ContactMessage?:', message instanceof ContactMessage)
        console.log('response.userProfile.id:', response.userProfile.id)

        if (message.contactName) {
          console.log('subscribed')
          response.send(new TextMessage('Ошибка: это ваш номер телефона?'))
          return
        }

        let phoneNumber = helper.modifyPhoneNumber(message.contactPhoneNumber)
        store.getUserByViberUserIdOrNumber(response.userProfile.id, phoneNumber)
          .then((currentUser) => {
            console.log('currentUser:', currentUser)
            if (!currentUser.viberUserId) {
              return store.updateByNumber(phoneNumber, {viberUserId: response.userProfile.id})
                .then(() => {
                  console.log('update user')
                  response.send(new TextMessage('Вы подписаны'))
                })
            } else {
              console.log('already registered')
              response.send(new TextMessage('Вы уже подписаны на уведомления'))
            }
          })
          .catch((err) => {
            console.log('catch error', err)
            if (err.message === 'no user') {
              console.log('if no user in db, add')
              store.save({
                viberUserId: response.userProfile.id,
                number: phoneNumber
              })
              response.send(new TextMessage('Вы подписаны'))
            } else {
              console.log(err)
            }
          })
      } else {
        console.log('unknown type message', message)
      }
    })

    this.bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) => {
      console.log('userProfile', userProfile)
      console.log('context', context)
      console.log('isSubscribed?', isSubscribed)

      let message
      if (isSubscribed) {
        console.log('send that already subscribed')
        message = new TextMessage('Already subscribed')
      } else {
        console.log('send invite to subscribe')
        message = new TextMessage('Subscribe', keyboard, null, null, null, 3)
      }
      onFinish(message)
    })

    this.bot.getBotProfile().then(response => {
      console.log(`Public Account Named: ${response.name}`)
      console.log('all work good')
    })
  }

  start () {
    let server = http.createServer(this.bot.middleware())
    server.listen(this.config.port, () => {
      console.log('start webhook server with config', this.config)
      this.bot.setWebhook(this.config.webhookUrl)
    })
  }
}

module.exports = Viber
