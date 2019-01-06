#!/usr/bin/env node

const tracer = require("tracer").colorConsole();
const config = require("config");
const Telegraf = require("telegraf");
const HttpsProxyAgent = require("https-proxy-agent");

const User = require("./lib/user").User;
const Store = require("./lib/store").Store;

const HttpServer = require("./lib/http").HttpServer;
const TelegramServer = require("./lib/telegram/telegram").TelegramServer;
const ViberServer = require("./lib/viber/viber").ViberServer;

let store = new Store(User);

let Messages = {
  exist: "Вы уже зарегистрированы.",
  hello: 'Добрый день, %s!\nНажмите кнопку "Отправить номер" внизу, чтобы начать.',
  notyournumber: "Вероятно, это не ваш номер :(",
  registered: "Все хорошо. Вы зарегистрированы.",
};

let telegram;
let viber;

if (config.telegram) {
  const options = config.telegram.proxyUrl ? {
    telegram: {
      agent: new HttpsProxyAgent(config.telegram.proxyUrl),
    },
  } : null;

  const telegrafApp = new Telegraf(config.telegram.token, options);

  telegram = new TelegramServer(telegrafApp, store, Messages);
  telegram.telegrafApp.startPolling();
}

if (config.viber) {
  viber = new ViberServer(config.viber, store);
  viber.start();
}

let sender = {
  telegram: config.telegram ? telegram.telegrafApp.telegram : null,
  viber: config.viber ? viber.bot : null,
};

let http = new HttpServer(sender, store, config.auth);

http.expressApp.listen(config.port, () => {
  tracer.log("http started on port", config.port);
});
