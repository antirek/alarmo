
const console = require('tracer').colorConsole()
const config = require('config')
const Telegraf = require('telegraf')
const HttpsProxyAgent = require('https-proxy-agent')

const User = require('./lib/user')

const Store = require('./lib/store')

let store = new Store(User)

let Messages = {
  hello: 'Добрый день, %s!\nНажмите кнопку "Отправить номер" внизу, чтобы начать.',
  exist: 'Вы уже зарегистрированы.',
  registered: 'Все хорошо. Вы зарегистрированы.',
  notyournumber: 'Вероятно, это не ваш номер :('
}

let telegram, viber

if (config.telegram) {
  let options = config.telegram.proxyUrl ? {
    telegram: {
      agent: new HttpsProxyAgent(config.telegram.proxyUrl)
    }
  } : null

  let telegrafApp = new Telegraf(config.telegram.token, options)
  let TelegramServer = require('./lib/telegram/telegram')

  telegram = new TelegramServer(telegrafApp, User, Messages)
  telegram.telegrafApp.startPolling()
}

if (config.viber) {
  let ViberBot = require('./lib/viber/viber')
  viber = new ViberBot(config.viber, store)
  viber.start()
}

let HttpServer = require('./lib/http')

let sender = {
  telegram: config.telegram ? telegram.telegrafApp.telegram : null,
  viber: config.viber ? viber.bot : null
}

let http = new HttpServer(sender, store, config.auth)

http.expressApp.listen(config.port, () => {
  console.log('http started on port', config.port)
})
