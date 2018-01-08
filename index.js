
const console = require('tracer').colorConsole();
const config = require('config');
const Telegraf = require('telegraf');

const User = require('./lib/user');
let telegrafApp = new Telegraf(config.token);

let telegramServer = require('./lib/telegram');

let Messages = {
    hello: 'Добрый день, %s!\nНажмите кнопку "Отправить номер" внизу, чтобы начать.',
    exist: 'Вы уже зарегистрированы.',
    registered: 'Все хорошо. Вы зарегистрированы.',
    notyournumber: 'Вероятно, это не ваш номер :('
}

let telegram = new telegramServer(telegrafApp, User, Messages);

telegram.telegrafApp.startPolling();

let httpServer = require('./lib/http');
let http = new httpServer(User, telegram.telegrafApp);

http.expressApp.listen(config.port, () => {
    console.log('http started on port', config.port);
});