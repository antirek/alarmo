const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')
const format = require('sprintf-js').vsprintf;

const console = require('tracer').colorConsole();

class telegramServer {

    constructor(TelegrafApp, User, Messages) {
        const getUserFullName = (user) => {
            return user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name;
        }

        const modifyPhoneNumber = (number) => {
            return number.replace(/^\+/, '');
        }

        this.telegrafApp = TelegrafApp; 
        this.telegrafApp.use(session())

        this.telegrafApp.command('start', (ctx) => {
            let chatId = ctx.update.message.from.id;

            User.findOne({chatId})
                .then((currentUser) => {
                    if (!currentUser) {                        
                        console.log('current user not found in db, request to send number')
                        let message = format(Messages.hello, getUserFullName(ctx.from));
                        ctx.reply(message, Markup
                            .keyboard([
                                Markup.contactRequestButton("Отправить номер")
                            ])
                            .oneTime(true)
                            .resize(false)
                            .extra()
                        );
                    } else {
                        console.log('user already registered', currentUser);
                        let message = format(Messages.exist, getUserFullName(ctx.from));
                        ctx.reply(message, Markup.removeKeyboard().extra());
                    }
                })
                .catch(console.log);
        });

        this.telegrafApp.on('contact', (ctx) => {
            if (ctx.message.contact.user_id != ctx.from.id) {
                console.log('contact number is not number of session user');
                let message = format(Messages.notyournumber, getUserFullName(ctx.from))
                ctx.reply(message);
                return;
            }
                
            let newUser = new User({
                chatId: ctx.from.id,
                number: modifyPhoneNumber(ctx.message.contact.phone_number),
                title: getUserFullName(ctx.message.contact)
            });

            return newUser.save()
                .then(() => {
                    console.log('user registered');
                    let message = format(Messages.registered, getUserFullName(ctx.from));
                    ctx.reply(message, Markup.removeKeyboard().extra());
                })
                .catch(console.log);
        });        
    }
}

module.exports = telegramServer;