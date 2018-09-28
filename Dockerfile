FROM node:8.9

RUN mkdir -p /usr/src/alarmo && \
    git clone https://github.com/antirek/alarmo.git /usr/src/alarmo

WORKDIR /usr/src/alarmo

RUN npm install

CMD [ "npm", "start" ]