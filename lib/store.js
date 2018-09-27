class Store {
  constructor (User) {
    this.User = User
  }

  getUsers () {
    return this.User.find()
  }

  getUserByViberUserId (viberUserId) {
    return this.User.findOne({viberUserId})
  }

  getUserByNumber (number) {
    return this.User.findOne({number})
  }

  getUserByTelegramChatId (telegramChatId) {
    return this.User.findOne({telegramChatId})
  }

  getUserByViberUserIdOrNumber (viberUserId, number) {
    return this.getUserByViberUserId(viberUserId)
      .then(user => {
        if (!user) {
          return this.getUserByNumber(number)
        }
        return Promise.resolve(user)
      })
      .then(user => {
        if (!user) {
          return Promise.reject(new Error('no user'))
        }
        return Promise.resolve(user)
      })
  }

  getUserByTelegramChatIdOrNumber (telegramChatId, number) {
    return this.getUserByTelegramChatId(telegramChatId)
      .then(user => {
        if (!user) {
          return this.getUserByNumber(number)
        }
        return Promise.resolve(user)
      })
      .then(user => {
        if (!user) {
          return Promise.reject(new Error('no user'))
        }
        return Promise.resolve(user)
      })
  }

  updateByNumber (number, object) {
    return this.getUserByNumber(number)
      .then(user => {
        Object.keys(object).map((key) => {
          // console.log('k->v', key, object[key]);
          user[key] = object[key]
        })
        // console.log('user', user);
        return user.save()
      })
  }

  save (object) {
    return (new this.User(object)).save()
  }
}

module.exports = Store
