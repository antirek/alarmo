
const console = require('tracer').colorConsole()
const config = require('config')
const Telegraf = require('telegraf')

const User = require('./lib/user')
let telegrafApp = new Telegraf(config.token)

let TelegramServer = require('./lib/telegram')

let Messages = {
  hello: 'Добрый день, %s!\nНажмите кнопку "Отправить номер" внизу, чтобы начать.',
  exist: 'Вы уже зарегистрированы.',
  registered: 'Все хорошо. Вы зарегистрированы.',
  notyournumber: 'Вероятно, это не ваш номер :('
}

let telegram = new TelegramServer(telegrafApp, User, Messages)

telegram.telegrafApp.startPolling()

let HttpServer = require('./lib/http')
let http = new HttpServer(telegram.telegrafApp, User, config.auth)

http.expressApp.listen(config.port, () => {
  console.log('http started on port', config.port)
})
