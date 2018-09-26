const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const ContactMessage = require('viber-bot').Message.Contact;

const config = require('config');
const http = require('http');

const winston = require('winston');
const toYAML = require('winston-console-formatter'); // makes the output more friendly

class Viber {
    constructor (User) {
        function createLogger() {
            
            const logger = new winston.Logger({level: "debug"}); // We recommend DEBUG for development
            logger.add(winston.transports.Console, toYAML.config());
            return logger;
            
            //return console;
        }

        const logger = createLogger();

        this.bot = new ViberBot({
            logger: logger,
            authToken: config.viber.token,
            name: "Mobilon Bot",
            avatar: "http://viber.com/avatar.jpg"
        });

        const keyboard = {
                "Type": "keyboard",
                "DefaultHeight": true,
                "BgColor": "#FFFFFF",
                "Buttons": [{
                    "Columns": 6,
                    "Rows": 1,
                    "BgColor": "#2db9b9",
                    "BgLoop": true,
                    "ActionType": "share-phone",
                    "ActionBody": "none",            
                    "Text": "Получать уведомдения по номеру телефона",
                    "TextVAlign": "middle",
                    "TextHAlign": "center",
                    "TextOpacity": 60,
                    "TextSize": "regular"
                }]
            };

        this.bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
            console.log(message);
            console.log(response.userProfile.id);

            if (message instanceof TextMessage) {
                console.log('TextMessage?:', message instanceof TextMessage);
                const echoMessage = new TextMessage(message.text, keyboard, null, null, null, 3);
                
                response.send(echoMessage);
            } else if (message instanceof ContactMessage) {
                console.log('ContactMessage?:', message instanceof ContactMessage);
                console.log('response.userProfile.id:', response.userProfile.id);

                User.findOne({viberUserId: response.userProfile.id})
                    .then((currentUser) => {
                        console.log('currentUser:', currentUser);
                        if (!currentUser) {
                            let newUser = new User({
                                viberUserId: response.userProfile.id,
                                number: message.contactPhoneNumber,
                            });

                            newUser.save()
                            .then(() => {
                                console.log('user registered');
                                response.send(new TextMessage('You are subscribed'));
                            })
                        } else {
                            if (!message.contactName) {
                                console.log('subscribed');
                                response.send(new TextMessage('You are subscribed'));
                            }
                        }
                        
                    });


            } else {
                console.log('unknown type message', message);
            }
        });

        this.bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) => {
            console.log('userProfile', userProfile);
            console.log('context', context);
            console.log('isSubscribed?', isSubscribed);

            let message;
            if (isSubscribed) {
                console.log('send that already subscribed');
                message = new TextMessage('Already subscribed');
            } else {
                console.log('send invite to subscribe');
                message = new TextMessage('Subscribe', keyboard, null, null, null, 3);
            }
            onFinish(message);
        });

        /*
        this.bot.on(BotEvents.SUBSCRIBED, response => {
            response.send(new TextMessage(`Привет, ${response.userProfile.name}`));
        });
        */

        this.bot.getBotProfile().then(response => {
            console.log(`Public Account Named: ${response.name}`);
            console.log('all work good');
        });

        let server = http.createServer(this.bot.middleware());

        server.listen(config.viber.port, () => {
            this.bot.setWebhook(config.viber.webhookUrl);
        });
    }   
}

module.exports = Viber;