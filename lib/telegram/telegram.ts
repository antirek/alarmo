const session = require("telegraf/session");
const telegramStartHandler = require("./telegramStartHandler").telegramStartHandler;
const telegramContactHandler = require("./telegramContactHandler").telegramContactHandler;

class TelegramServer {
  private telegrafApp: any;

  constructor(TelegrafApp: any, store: any, Messages: any) {
    const telegramStartHandler1 = telegramStartHandler(store, Messages);
    const telegramContactHandler1 = telegramContactHandler(store, Messages);

    this.telegrafApp = TelegrafApp;
    this.telegrafApp.use(session());

    this.telegrafApp.command("start", telegramStartHandler1.route);
    this.telegrafApp.on("contact", telegramContactHandler1.route);
  }
}

export { TelegramServer };
