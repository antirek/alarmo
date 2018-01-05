
const console = require('tracer').colorConsole();
const config = require('config');
const Telegraf = require('telegraf');

const User = require('./lib/user');
let telegramApp = new Telegraf(config.token);

let telegramServer = require('./lib/telegram');
let telegram = new telegramServer(telegramApp, User);

telegram.telegramApp.startPolling();

let httpServer = require('./lib/http');
let http = new httpServer(User, telegram.telegramApp);

http.expressApp.listen(config.port, () => {
    console.log('http started on port', config.port);
});