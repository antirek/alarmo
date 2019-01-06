class Store {
  public User: any;

  constructor(User: any) {
    this.User = User;
  }

  public getUsers() {
    return this.User.find();
  }

  public getUserByViberUserId(viberUserId: string) {
    return this.User.findOne({viberUserId});
  }

  public getUserByNumber(numberIn: string) {
    return this.User.findOne({number: numberIn});
  }

  public getUserByTelegramChatId(telegramChatId: any) {
    return this.User.findOne({telegramChatId});
  }

  public getUserByViberUserIdOrNumber(viberUserId: string, numberIn: string) {
    return this.getUserByViberUserId(viberUserId)
      .then((user: any) => {
        if (!user) {
          return this.getUserByNumber(numberIn);
        }
        return Promise.resolve(user);
      })
      .then((user: any) => {
        if (!user) {
          return Promise.reject(new Error("no user"));
        }
        return Promise.resolve(user);
      });
  }

  public getUserByTelegramChatIdOrNumber(telegramChatId: string, numberIn: string) {
    return this.getUserByTelegramChatId(telegramChatId)
      .then((user: any) => {
        if (!user) {
          return this.getUserByNumber(numberIn);
        }
        return Promise.resolve(user);
      })
      .then((user: any) => {
        if (!user) {
          return Promise.reject(new Error("no user"));
        }
        return Promise.resolve(user);
      });
  }

  public updateByNumber(numberIn: string, object: any) {
    return this.getUserByNumber(numberIn)
      .then((user: any) => {
        Object.keys(object).map((key) => {
          // console.log('k->v', key, object[key]);
          user[key] = object[key];
        });
        // console.log('user', user);
        return user.save();
      });
  }

  public save(object: object) {
    return (new this.User(object)).save();
  }
}

export { Store };
