const ViberBot = require("viber-bot").Bot;
const BotEvents = require("viber-bot").Events;
const TextMessage = require("viber-bot").Message.Text;
const ContactMessage = require("viber-bot").Message.Contact;

const tracer = require("tracer").colorConsole();
const http = require("http");

const winston = require("winston");
const toYAML = require("winston-console-formatter");

const helper = require("./../helper");

class ViberServer {
  private store: any;
  private config: any;
  private bot: any;

  constructor(config: any, store: any) {
    this.store = store;
    this.config = config;

    function createLogger() {
      const logger2 = new winston.Logger({level: "debug"});
      logger2.add(winston.transports.Console, toYAML.config());
      return logger2;
    }

    const logger = createLogger();

    this.bot = new ViberBot({
      authToken: config.token,
      avatar: config.avatar || "http://viber.com/avatar.jpg",
      logger,
      name: config.name,
    });

    const keyboard = {
      BgColor: "#FFFFFF",
      Buttons: [{
        ActionBody: "none",
        ActionType: "share-phone",
        BgColor: "#2db9b9",
        BgLoop: true,
        Columns: 6,
        Rows: 1,
        Text: "Получать уведомдения по номеру телефона",
        TextHAlign: "center",
        TextOpacity: 60,
        TextSize: "regular",
        TextVAlign: "middle",
      }],
      DefaultHeight: true,
      Type: "keyboard",
    };

    this.bot.onTextMessage(/^start|старт|начало|hi|hello$/i, (message: any, response: any) => {
      response.send(new TextMessage("привет", keyboard, null, null, null, 3));
    });

    this.bot.on(BotEvents.MESSAGE_RECEIVED, (message: any, response: any) => {
      tracer.log(message);
      tracer.log(response.userProfile.id);

      if (message instanceof ContactMessage) {
        tracer.log("ContactMessage?:", message instanceof ContactMessage);
        tracer.log("response.userProfile.id:", response.userProfile.id);

        if (message.contactName) {
          tracer.log("subscribed");
          response.send(new TextMessage("Ошибка: это ваш номер телефона?"));
          return;
        }

        const phoneNumber = helper.modifyPhoneNumber(message.contactPhoneNumber);
        store.getUserByViberUserIdOrNumber(response.userProfile.id, phoneNumber)
          .then((currentUser: any) => {
            tracer.log("currentUser:", currentUser);
            if (!currentUser.viberUserId) {
              return store.updateByNumber(phoneNumber, {viberUserId: response.userProfile.id})
                .then(() => {
                  tracer.log("update user");
                  response.send(new TextMessage("Вы подписаны"));
                });
            } else {
              tracer.log("already registered");
              response.send(new TextMessage("Вы уже подписаны на уведомления"));
            }
          })
          .catch((err: any) => {
            tracer.log("catch error", err);
            if (err.message === "no user") {
              tracer.log("if no user in db, add");
              store.save({
                number: phoneNumber,
                viberUserId: response.userProfile.id,
              });
              response.send(new TextMessage("Вы подписаны"));
            } else {
              tracer.log(err);
            }
          });
      } else {
        tracer.log("unknown type message", message);
      }
    });

    this.bot.onConversationStarted((userProfile: any, isSubscribed: any, context: any, onFinish: any) => {
      tracer.log("userProfile", userProfile);
      tracer.log("context", context);
      tracer.log("isSubscribed?", isSubscribed);

      let message;
      if (isSubscribed) {
        tracer.log("send that already subscribed");
        message = new TextMessage("Already subscribed");
      } else {
        tracer.log("send invite to subscribe");
        message = new TextMessage("Subscribe", keyboard, null, null, null, 3);
      }
      onFinish(message);
    });

    this.bot.getBotProfile().then((response: any) => {
      tracer.log(`Public Account Named: ${response.name}`);
      tracer.log("all work good");
    });
  }

  public start() {
    const server = http.createServer(this.bot.middleware());
    server.listen(this.config.port, () => {
      tracer.log("start webhook server with config", this.config);
      this.bot.setWebhook(this.config.webhookUrl);
    });
  }
}

export { ViberServer };
