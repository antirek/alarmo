const express = require('express')
const bodyParser = require('body-parser')
const console = require('./httpConsole')
const counter = require('request-counter')
const basicAuth = require('express-basic-auth')
const path = require('path')

const TextMessage = require('viber-bot').Message.Text

class httpServer {
  constructor (sender, User, auth) {
    this.expressApp = express()

    this.expressApp.set('views', path.join(__dirname, '/views'))
    this.expressApp.set('view engine', 'pug')
    this.expressApp.use(bodyParser.json())

    if (auth && auth.users) {
      console.log('use basic auth for access')
      this.expressApp.use(basicAuth({
        users: auth.users // {'admin': 'supersecret'}
      }))
    }

    this.expressApp.get('/', (req, res) => {
      console.log('counter', counter.next())
      User.find({})
        .then((users) => {
          console.log('list users', users)
          res.render('index', {users})
        })
        .catch((err) => {
          console.log(err)
          res.sendStatus(500)
        })
    })

    this.expressApp.post('/send/telegram/:number', (req, res) => {
      console.log('counter', counter.next())
      let number = req.params.number
      User.findOne({number})
        .then((currentUser) => {
          console.log('send to telegram:', number, 'text:', req.body.text)
          if (currentUser) {
            let options = {
              parse_mode: 'HTML'
            }

            sender.telegram.sendMessage(currentUser.telegramChatId, req.body.text, options)
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
    })

    this.expressApp.post('/send/viber/:number', (req, res) => {
      console.log('counter', counter.next())
      let number = req.params.number
      User.findOne({number})
        .then((currentUser) => {
          console.log('send to viber:', number, 'text:', req.body.text)
          if (currentUser) {
            sender.viber.sendMessage({id: currentUser.viberUserId}, new TextMessage(req.body.text))
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
    })
  }
}

module.exports = httpServer
