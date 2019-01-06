FROM node:8.9

RUN npm install -g alarmo@19.1.1

CMD ["/bin/sh", "-c", "alarmo"]