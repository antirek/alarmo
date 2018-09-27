/* global it, expect, describe */

// const request = require('request')
// const console = require('tracer').colorConsole()
const telegramStartHandler = require('./../lib/telegram/telegramStartHandler')
const telegramContactHandler = require('./../lib/telegram/telegramContactHandler')
const Store = require('../lib/store')

class UserModelFindByTelegramChatId {
  findOne ({telegramChatId}) {
    if (telegramChatId === '11111111') {
      return Promise.resolve({
        telegramChatId: 11111111,
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

/*
let UserModelFindByNumber = {
  findOne ({number}) {
    return Promise.resolve({
      number: '791234'
    })
  },

  save () {
    return Promise.resolve()
  }
} */

let from1 = {
  id: '1212121212',
  last_name: '12',
  first_name: '12'
}

let from2 = {
  id: '11111111',
  last_name: '12',
  first_name: '12'
}
/*
let from3 = {
  id: '11111111',
  last_name: '12',
  first_name: '12'
} */

let cb = (q) => {

}

let getCtx = (from) => {
  return {
    from: from,
    update: {
      message: {
        from: from
      }
    },
    reply: (text) => {
      cb(text)
    },
    message: {
      contact: {
        user_id: '11111111',
        phone_number: '791234'
      }
    }
  }
}

let Messages = {
  hello: 'hello %s',
  exist: 'exist %s',
  registered: 'registered %s',
  notyournumber: 'notyournumber %s'
}

describe('telegram', () => {
  it('should request number', (done) => {
    cb = (q) => {
      expect(q).toEqual('hello 12 12')
      done()
    }
    telegramStartHandler(new Store(new UserModelFindByTelegramChatId()), Messages).route(getCtx(from1))
  })

  it('should detect exist user', (done) => {
    cb = (q) => {
      expect(q).toEqual('exist 12 12')
      done()
    }
    telegramStartHandler(new Store(new UserModelFindByTelegramChatId()), Messages).route(getCtx(from2))
  })

  it('should not save when number is not owner', (done) => {
    cb = (q) => {
      expect(q).toEqual('notyournumber 12 12')
      done()
    }
    telegramContactHandler(UserModelFindByTelegramChatId, Messages).route(getCtx(from1))
  })

  /*
  it('should save new user', (done) => {
    cb = (q) => {
      expect(q).toEqual('registered 12 12')
      done()
    }
    telegramContactHandler(new Store(UserModelFindByNumber), Messages).route(getCtx(from3))
  })
  */
})
