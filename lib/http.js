const express = require('express')
const bodyParser = require('body-parser')
const console = require('./httpConsole')
const counter = require('request-counter')
const basicAuth = require('express-basic-auth')
const path = require('path')

class httpServer {
  constructor (telegrafApp, User, auth) {
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

    this.expressApp.post('/send/:number', (req, res) => {
      console.log('counter', counter.next())
      let number = req.params.number
      User.findOne({number})
        .then((currentUser) => {
          console.log('send to:', number, 'text:', req.body.text)
          if (currentUser) {
            let options = {
              parse_mode: 'HTML'
            }

            telegrafApp.telegram.sendMessage(currentUser.chatId, req.body.text, options)
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
