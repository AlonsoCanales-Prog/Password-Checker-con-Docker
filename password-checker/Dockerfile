FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY src/ ./src
COPY public/ ./public
COPY blacklist.txt ./

WORKDIR /app/src

CMD ["node", "server.js"]
