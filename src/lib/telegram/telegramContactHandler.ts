const helper = require("./../helper");
// const Extra = require('telegraf/extra')
const Markup = require("telegraf/markup");
const tracer = require("tracer").colorConsole();
const format = require("util").format;

const telegramContactHandler = (store: any, Messages: any) => {
  const route = (ctx: any) => {
    if (ctx.message.contact.user_id !== ctx.from.id) {
      tracer.log("contact number is not number of session user");
      const message = format(Messages.notyournumber, helper.getUserFullName(ctx.from));
      ctx.reply(message);
      return;
    }

    const phoneNumber = helper.modifyPhoneNumber(ctx.message.contact.phone_number);

    store.getUserByTelegramChatIdOrNumber(ctx.from.id, phoneNumber)
      .then((currentUser: any) => {
        if (!currentUser.telegramChatId) {
          return store.updateByNumber(phoneNumber, {telegramChatId: ctx.from.id})
            .then(() => {
              tracer.log("update user");
              const message = format(Messages.registered, helper.getUserFullName(ctx.from));
              ctx.reply(message, Markup.removeKeyboard().extra());
            });
        } else {
          tracer.log("already registered");
          ctx.reply("already registered");
        }
      })
      .catch((err: any) => {
        if (err.message === "no user") {
          store.save({
            number: helper.modifyPhoneNumber(ctx.message.contact.phone_number),
            telegramChatId: ctx.from.id,
            title: helper.getUserFullName(ctx.message.contact),
          });
          tracer.log("save new user from telegram");
          const message = format(Messages.registered, helper.getUserFullName(ctx.from));
          ctx.reply(message, Markup.removeKeyboard().extra());
        } else {
          tracer.log("unknown error", err);
        }
      });
  };
  return {route};
};

export { telegramContactHandler };
