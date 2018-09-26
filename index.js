
const console = require('tracer').colorConsole()
const config = require('config')
const Telegraf = require('telegraf')

const User = require('./lib/user')

let Messages = {
  hello: 'Добрый день, %s!\nНажмите кнопку "Отправить номер" внизу, чтобы начать.',
  exist: 'Вы уже зарегистрированы.',
  registered: 'Все хорошо. Вы зарегистрированы.',
  notyournumber: 'Вероятно, это не ваш номер :('
}

let telegram, viber;

if (config.telegram) {
    let telegrafApp = new Telegraf(config.telegram.token)
    let TelegramServer = require('./lib/telegram/telegram')

    telegram = new TelegramServer(telegrafApp, User, Messages)
    telegram.telegrafApp.startPolling()
}

if (config.viber) {
    let ViberBot = require('./lib/viber/viber');
    viber = new ViberBot(User);
}

let HttpServer = require('./lib/http');

let sender = {
    telegramApp: config.telegram ? telegram.telegrafApp : null,
    viber: config.viber ? viber.bot : null
};

let http = new HttpServer(sender, User, config.auth)

http.expressApp.listen(config.port, () => {
  console.log('http started on port', config.port)
})
