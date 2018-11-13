FROM node:8.9

RUN npm install -g alarmo@0.0.2 

CMD ["/bin/sh", "-c", "alarmo"]