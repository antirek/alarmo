module.exports = {
  port: 3030,                   // порт API и веб-интерфейса
  db: 'mongodb://mongodb:27017/alarmo',
  /*
  viber: {
    token: '45637c36b7b1885b-9f679b1536fded62-ertirtiurytireyiuey',
    webhookUrl: 'https://viber.yourdomain.ru/',
    name: 'My Viber Bot',
    avatar: 'http://viber.com/avatar.jpg',
    port: 8090,                 // порт viber бота, на него должен быть смаршрутизирован webhookUrl
  },
  telegram: {
    token: '38873534543:AAHwx57S-SecS0cewrewrewrjeiojerijtiertierit',
    proxyUrl: 'http://proxyUrl',
  },
  */
  auth: {
    users: {
      'test1': 'password1',
      'test2': 'password2',
    }
  }
}
