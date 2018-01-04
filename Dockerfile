FROM node:8.9

COPY . /usr/src/telegram-alert

WORKDIR /usr/src/telegram-alert

RUN npm install

CMD [ "npm", "start" ]