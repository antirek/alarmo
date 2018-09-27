const ViberBot = require('viber-bot').Bot
const BotEvents = require('viber-bot').Events
const TextMessage = require('viber-bot').Message.Text
const ContactMessage = require('viber-bot').Message.Contact

// const config = require('config')
const http = require('http')

const winston = require('winston')
const toYAML = require('winston-console-formatter') // makes the output more friendly

class Viber {
  constructor (config, store) {
    this.store = store
    this.config = config

    function createLogger () {
      const logger = new winston.Logger({level: 'debug'}) // We recommend DEBUG for development
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

    this.bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
      console.log(message)
      console.log(response.userProfile.id)

      if (message instanceof TextMessage) {
        console.log('TextMessage?:', message instanceof TextMessage)
        const echoMessage = new TextMessage(message.text, keyboard, null, null, null, 3)

        response.send(echoMessage)
      } else if (message instanceof ContactMessage) {
        console.log('ContactMessage?:', message instanceof ContactMessage)
        console.log('response.userProfile.id:', response.userProfile.id)

        if (message.contactName) {
          console.log('subscribed')
          response.send(new TextMessage('Error: is this phone your?'))
          return
        }

        store.getUserByViberUserIdOrNumber(response.userProfile.id, message.contactPhoneNumber)
          .then((currentUser) => {
            console.log('currentUser:', currentUser)
            if (!currentUser.viberUserId) {
              return store.updateByNumber(message.contactPhoneNumber,
                {viberUserId: response.userProfile.id})
                .then(() => {
                  console.log('update user')
                  response.send(new TextMessage('You are subscribed'))
                })
            } else {
              console.log('already registered')
              response.send(new TextMessage('You are already subscribed'))
            }
          })
          .catch((err) => {
            console.log('catch error', err)
            if (err.message === 'no user') {
              console.log('if no user in db, add')
              store.save({
                viberUserId: response.userProfile.id,
                number: message.contactPhoneNumber
              })
              response.send(new TextMessage('You are subscribed'))
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
      this.bot.setWebhook(this.config.webhookUrl)
    })
  }
}

module.exports = Viber
