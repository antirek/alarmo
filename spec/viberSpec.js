/* global it, expect, describe */

// const request = require('request')
// const console = require('tracer').colorConsole()
const Handler = require('./../dist/lib/viber/viber').Handler;
const Store = require('../dist/lib/store').Store;

class UserModelFindByViberChatId {
  findOne ({viberUserId}) {
    if (viberUserId === '121212') {
      return Promise.resolve({
        viberUserId: 11111111,
        number: '791234'
      })
    } else {
      return Promise.resolve(null)
    }
  };

  save () {
    return Promise.resolve()
  };
};


let cb = (q) => {

}


const ContactMessage = require("viber-bot").Message.Contact;

let message = new ContactMessage(null, '121212');

let response = {
  send: (text) => {
    console.log('viber response:', text)
    cb(text)
  },
  userProfile: {
    id: '121212'
  }
}

let Messages = {
  hello: 'hello %s',
  exist: 'exist %s',
  registered: 'registered %s',
  notyournumber: 'notyournumber %s'
}

describe('viber', () => {
  it('should request number', (done) => {
    cb = (q) => {
      expect(q.text).toEqual('Вы уже подписаны на уведомления')
      done()
    }
    new Handler(new Store(new UserModelFindByViberChatId())).OnMessageReceivedHandler(message, response);
  })

})
