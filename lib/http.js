const express = require('express');
const bodyParser = require('body-parser');
const console = require('tracer').colorConsole();

class httpServer {
    constructor(User, telegramApp) {
        this.expressApp = express();

        this.expressApp.set('views', __dirname + "/views");
        this.expressApp.set('view engine', 'pug');
        this.expressApp.use(bodyParser.json());

        this.expressApp.get('/', (req, res) => {
            User.find({})
                .then((users) => {
                    res.render('index', {users})
                })
                .catch((err) => {
                    console.log(err)
                    res.sendStatus(500)
                })

        });

        this.expressApp.post('/send/:number', (req, res) => {
            let number = req.params.number
            User.findOne({number: number})
                .then((currentUser) => {
                    console.log('req from', number, req.body.text);
                    if (currentUser) {
                        telegramApp.telegram.sendMessage(currentUser.chatId, req.body.text)
                        res.sendStatus('200')
                    } else {
                        console.log('not found')
                        res.sendStatus('404')
                    }
                })
                .catch((err) => {
                    console.log(err)
                    res.sendStatus(500)
                }) 
            
        });
    }
}

module.exports = httpServer;