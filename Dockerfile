FROM node:8.9

RUN mkdir -p /usr/src/telegram-alert && \
    git clone https://github.com/antirek/telegram-alert.git /usr/src/telegram-alert

WORKDIR /usr/src/telegram-alert

RUN npm install

CMD [ "npm", "start" ]