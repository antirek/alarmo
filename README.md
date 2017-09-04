# telegram-alert

Отправка уведомлений на telegram по номеру телефона (через бота).


## Как работает?

Чат-бот Телеграм принимает пользователя и спрашивает у него номер телефона. Затем полученный номер и соответсвующий chat id сохраняет на сервер. Теперь мы можем отправлять уведомление на номер, сделав простой http запрос, а бот будет направлять это уведомление соответствующему пользователю в его приложение Телеграм.


## Пример запроса

`````sh

curl -X POST \
  http://localhost:3030/send/<number> \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{"text": "Ahtung!! Текст сообщения"}'

`````  

## Установка 


> git clone https://github.com/antirek/telegram-alert.git

> cd telegram-alert

> npm install

> npm start


## Конфиг

port - порт веб-интерфейса

mongodb - параметры подключения к mongodb

token - токен чат-бота телеграм, получите у @botfather


## Fast start

Используйте docker-compose.yml

