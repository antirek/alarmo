const express = require('express');
const bodyParser = require('body-parser');
const console = require('./httpConsole');
const counter = require('request-counter');

class httpServer {
    constructor(telegrafApp, User) {
        this.expressApp = express();

        this.expressApp.set('views', __dirname + "/views");
        this.expressApp.set('view engine', 'pug');
        this.expressApp.use(bodyParser.json());

        this.expressApp.get('/', (req, res) => {
            console.log('counter', counter.next());
            User.find({})
                .then((users) => {
                    console.log('list users', users);
                    res.render('index', {users})
                })
                .catch((err) => {
                    console.log(err)
                    res.sendStatus(500)
                })
        });

        this.expressApp.post('/send/:number', (req, res) => {
            console.log('counter', counter.next());
            let number = req.params.number
            User.findOne({number})
                .then((currentUser) => {
                    console.log('send to:', number, 'text:', req.body.text);
                    if (currentUser) {
                        telegrafApp.telegram.sendMessage(currentUser.chatId, req.body.text)
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