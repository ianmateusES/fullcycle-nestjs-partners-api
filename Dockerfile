FROM node:20-slim

WORKDIR /app

COPY *.json ./

RUN npm install

ENTRYPOINT ["npm", "run", "start:dev"]
