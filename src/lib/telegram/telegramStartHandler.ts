const helper = require("./../helper");
// const Extra = require('telegraf/extra')
const Markup = require("telegraf/markup");
const tracer = require("tracer").colorConsole();
const format = require("util").format;

const telegramStartHandler = (store: any, Messages: any) => {
  const route = (ctx: any) => {
    const telegramChatId = ctx.update.message.from.id;

    tracer.log("telegramChatId:", telegramChatId);
    return store.getUserByTelegramChatId(telegramChatId)
      .then((currentUser: any) => {
        tracer.log("currentUser:", currentUser);
        if (!currentUser) {
          tracer.log("current user not found in db, request to send number");
          const message = format(Messages.hello, helper.getUserFullName(ctx.from));
          ctx.reply(message, Markup
            .keyboard([
              Markup.contactRequestButton("Отправить номер"),
            ])
            .oneTime(true)
            .resize(false)
            .extra(),
          );
        } else {
          tracer.log("user already registered", currentUser);
          const message = format(Messages.exist, helper.getUserFullName(ctx.from));
          ctx.reply(message, Markup.removeKeyboard().extra());
        }
      })
      .catch(tracer.log);
  };

  return {route};
};

export { telegramStartHandler };
